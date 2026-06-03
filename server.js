// Server locale che fa da tramite tra una pagina web e l'API di Anthropic.
// Unico compito: strutturare in JSON il nome e cognome dell'utente.
//
// La chiave API viene letta da ANTHROPIC_API_KEY nel file .env (mai nel codice).

const http = require("node:http");

// Carica le variabili dal file .env alla radice del progetto (built-in Node >= 20.12).
process.loadEnvFile();

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) {
  console.error(
    "Errore: ANTHROPIC_API_KEY non trovata. Aggiungila al file .env alla radice del progetto."
  );
  process.exit(1);
}

const PORT = 3000;
const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 100;

// Prompt fisso per questo turno. <RISPOSTA_UTENTE> viene sostituito col testo ricevuto.
function buildPrompt(rispostaUtente) {
  return `Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare SOLO il nome e cognome dell'utente dalla sua risposta.

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare nulla.
- Se nella risposta non è presente un nome (l'utente rifiuta, divaga, o scrive qualcosa di confuso), lascia il campo vuoto.
- Non interpretare come nome parole che chiaramente non lo sono (es. un saluto, un verbo, una frase generica).
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"nome": "<nome e cognome dell'utente, oppure stringa vuota>"}

Risposta dell'utente:
"${rispostaUtente}"`;
}

// Chiama l'API di Anthropic e restituisce il testo prodotto dal modello.
async function chiamaAnthropic(rispostaUtente) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: "user", content: buildPrompt(rispostaUtente) }],
    }),
  });

  if (!res.ok) {
    const dettaglio = await res.text();
    throw new Error(`API Anthropic ${res.status}: ${dettaglio}`);
  }

  const data = await res.json();
  // Il testo del modello è il JSON {"nome": "..."} che vogliamo restituire alla pagina.
  return data?.content?.[0]?.text ?? "";
}

// Header CORS minimali per consentire la chiamata dal browser.
function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function inviaJson(res, status, oggetto) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(oggetto));
}

const server = http.createServer((req, res) => {
  setCors(res);

  // Preflight CORS.
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url !== "/struttura-nome") {
    inviaJson(res, 404, { errore: "Endpoint non trovato." });
    return;
  }

  if (req.method !== "POST") {
    inviaJson(res, 405, { errore: "Metodo non consentito. Usa POST." });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", async () => {
    let risposta;
    try {
      risposta = JSON.parse(body).risposta;
    } catch {
      inviaJson(res, 400, { errore: 'Body non valido: atteso JSON { "risposta": "..." }.' });
      return;
    }

    if (typeof risposta !== "string") {
      inviaJson(res, 400, { errore: 'Campo "risposta" mancante o non testuale.' });
      return;
    }

    try {
      const jsonModello = await chiamaAnthropic(risposta);
      // Restituiamo ESCLUSIVAMENTE il JSON ricevuto dal modello, verbatim.
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(jsonModello);
    } catch (err) {
      console.error(err);
      inviaJson(res, 502, { errore: "Errore nella chiamata all'API di Anthropic." });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
  console.log(`Endpoint: POST http://localhost:${PORT}/struttura-nome`);
});
