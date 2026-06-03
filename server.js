// Server locale che fa da tramite tra una pagina web e l'API di Anthropic.
// Compito: strutturare in JSON la risposta dell'utente per UN turno del dialogo.
//
// Il server è SENZA STATO: riceve { turno, risposta }, sceglie il prompt del
// turno richiesto, chiama l'LLM e restituisce il frammento JSON prodotto, così
// com'è. La memoria del profilo e il flusso del dialogo vivono nel front-end.
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
// 400 token: bastano per il nome e lasciano spazio ai frammenti più ricchi
// (esperienze, formazione, lista competenze) che aggiungeremo al registro.
const MAX_TOKENS = 400;

// Registro dei prompt di estrazione: un turno → una funzione che, data la
// risposta dell'utente, costruisce il prompt da inviare all'LLM.
// Aggiungere un turno = aggiungere una voce qui, senza toccare l'impianto.
const PROMPTS = {
  nome(rispostaUtente) {
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
  },

  esperienze_formali(rispostaUtente) {
    return `Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare le ESPERIENZE DI LAVORO FORMALI (lavori veri e propri, riconosciuti) descritte dall'utente.

Per ogni esperienza raccogli questi campi:
- "ruolo": il ruolo o la mansione (es. cameriere, magazziniere)
- "azienda": il posto o l'azienda dove l'ha svolta
- "durata": quanto è durata (es. "1 anno", "estate 2020")
- "cosa_facevo": cosa faceva concretamente

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare, non inventare nulla.
- Se un campo non è presente nella risposta, lascialo come stringa vuota "". Mai riempirlo a indovinare.
- Se l'utente racconta più esperienze nella stessa risposta, estraile tutte: una voce della lista per ogni esperienza.
- Normalizzazione leggera: riordina e ripulisci le parole dell'utente (togli riempitivi e false partenze, metti il dato nel campo giusto), ma resta aderente a ciò che ha detto. Niente sinonimi "professionali", niente dettagli aggiunti. Se l'utente è incerto ("circa un anno"), conserva l'incertezza.
- Considera SOLO esperienze di lavoro formali. Se l'utente racconta attività informali (aiuti a familiari o amici, volontariato, passioni), NON includerle: non sono esperienze formali.
- Se la risposta non contiene alcuna esperienza di lavoro formale, restituisci una lista vuota.
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"esperienze_formali": [{"ruolo": "", "azienda": "", "durata": "", "cosa_facevo": ""}]}

Risposta dell'utente:
"${rispostaUtente}"`;
  },

  esperienze_informali(rispostaUtente) {
    return `Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare le ESPERIENZE INFORMALI descritte dall'utente: attività che NON sono un lavoro vero e proprio — aiuti a familiari, amici o vicini, una mano in associazioni o eventi, volontariato, passioni che hanno insegnato qualcosa, esperienze brevi e occasionali.

Per ogni esperienza raccogli questi campi (tutti facoltativi per natura):
- "cosa_facevo": l'attività svolta
- "quando": il periodo o la frequenza (es. "le estati 2018-2020")
- "con_chi": persone, famiglia, gruppo o realtà con cui l'ha svolta

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare, non inventare nulla.
- Se un campo non è presente nella risposta, lascialo come stringa vuota "". Mai riempirlo a indovinare. Per queste esperienze è normale che "quando" e "con_chi" manchino.
- Se l'utente racconta più esperienze nella stessa risposta, estraile tutte: una voce della lista per ogni esperienza.
- Normalizzazione leggera: riordina e ripulisci le parole dell'utente (togli riempitivi e false partenze, metti il dato nel campo giusto), ma resta aderente a ciò che ha detto. Niente sinonimi "professionali", niente dettagli aggiunti. Se l'utente è incerto, conserva l'incertezza.
- Considera SOLO esperienze informali. Se l'utente racconta un lavoro formale vero e proprio (impiego retribuito con ruolo e azienda), NON includerlo qui: appartiene a un altro turno.
- Se la risposta non contiene alcuna esperienza informale, restituisci una lista vuota.
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"esperienze_informali": [{"cosa_facevo": "", "quando": "", "con_chi": ""}]}

Risposta dell'utente:
"${rispostaUtente}"`;
  },

  competenze(rispostaUtente) {
    return `Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare le COMPETENZE che l'utente dichiara di saper fare: abilità pratiche o trasversali.

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare, non inventare nulla.
- Estrai SOLO le competenze che l'utente dichiara esplicitamente in questa risposta. NON dedurre competenze dalle esperienze o da ciò che "sembra implicito": sarebbe un'invenzione.
- Se l'utente elenca più competenze, separale in voci distinte della lista: una stringa per competenza. Non imporre un formato all'utente; sei tu a separare.
- Normalizzazione leggera (qui particolarmente importante): ripulisci il modo di dire in un'etichetta semplice e aderente alle parole dell'utente, senza gonfiarla in gergo professionale. Esempio: "me la cavo alla cassa" → "Uso della cassa", MAI "gestione transazioni e contante".
- Se la risposta non contiene alcuna competenza, restituisci una lista vuota.
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"competenze": ["<competenza>", "<competenza>"]}

Risposta dell'utente:
"${rispostaUtente}"`;
  },

  formazione(rispostaUtente) {
    return `Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare i titoli di studio e i corsi di FORMAZIONE descritti dall'utente: diplomi, qualifiche, corsi di formazione, percorsi di studio strutturati.

Per ogni voce di formazione raccogli questi campi:
- "titolo": il titolo di studio o il corso (es. Diploma alberghiero, corso di saldatura)
- "istituto": la scuola, l'ente o l'istituto che l'ha rilasciato
- "anno": l'anno di conseguimento o del corso

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare, non inventare nulla.
- Se un campo non è presente nella risposta, lascialo come stringa vuota "". Mai riempirlo a indovinare.
- Se l'utente racconta più titoli o corsi nella stessa risposta, estraili tutti: una voce della lista per ognuno.
- Normalizzazione leggera: riordina e ripulisci le parole dell'utente (togli riempitivi e false partenze, metti il dato nel campo giusto), ma resta aderente a ciò che ha detto. Niente sinonimi "professionali", niente dettagli aggiunti. Se l'utente è incerto sull'anno, conserva l'incertezza.
- Se la risposta non contiene alcun titolo di studio o corso, restituisci una lista vuota.
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"formazione": [{"titolo": "", "istituto": "", "anno": ""}]}

Risposta dell'utente:
"${rispostaUtente}"`;
  },
};

// Chiama l'API di Anthropic con un prompt già costruito e restituisce il testo
// prodotto dal modello.
async function chiamaAnthropic(prompt) {
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
      messages: [{ role: "user", content: prompt }],
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

  if (req.url !== "/struttura") {
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
    let turno, risposta;
    try {
      ({ turno, risposta } = JSON.parse(body));
    } catch {
      inviaJson(res, 400, {
        errore: 'Body non valido: atteso JSON { "turno": "...", "risposta": "..." }.',
      });
      return;
    }

    if (typeof turno !== "string" || !Object.hasOwn(PROMPTS, turno)) {
      inviaJson(res, 400, {
        errore: 'Campo "turno" mancante o sconosciuto.',
        turni_validi: Object.keys(PROMPTS),
      });
      return;
    }

    if (typeof risposta !== "string") {
      inviaJson(res, 400, { errore: 'Campo "risposta" mancante o non testuale.' });
      return;
    }

    try {
      const prompt = PROMPTS[turno](risposta);
      const jsonModello = await chiamaAnthropic(prompt);
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
  console.log(`Endpoint: POST http://localhost:${PORT}/struttura`);
  console.log(`Turni disponibili: ${Object.keys(PROMPTS).join(", ")}`);
});
