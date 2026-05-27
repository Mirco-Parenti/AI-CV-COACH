# Research Notes

Questo documento raccoglie appunti sull'analisi di progetti simili ad AI-CV-COACH.

## Obiettivo dell'analisi

Studiare strumenti open source o applicazioni simili per capire:

- quali problemi risolvono;
- come strutturano l'interfaccia;
- come analizzano annunci di lavoro;
- come analizzano profili professionali o CV;
- come generano risultati personalizzati;
- se e come limitano il rischio di inventare informazioni;
- quali idee possono essere utili per il nostro progetto.

## Griglia di analisi

Per ogni progetto osservato, annotare:

### Nome progetto

### Link

### Problema risolto

### Funzionalità principali

### Tecnologie usate

### Flusso utente

### Uso dell'AI

### Gestione del rischio di informazioni inventate

### Idee utili per AI-CV-COACH

### Limiti osservati

---

## Progetto analizzato 1

### Nome progetto
Resume-Matcher (srbhr/Resume-Matcher)

### Link
https://github.com/srbhr/Resume-Matcher

### Problema risolto
Aiuta i candidati a non essere scartati automaticamente dai sistemi ATS,
analizzando la compatibilità del CV con l'annuncio e individuando le parole
chiave e le lacune di contenuto.

### Funzionalità principali
- Punteggio di match istantaneo tra CV e annuncio.
- Ottimizzazione delle parole chiave rispetto all'annuncio.
- Suggerimenti guidati per migliorare il CV.
- Analisi di compatibilità con i sistemi ATS.

### Tecnologie usate
- Backend: FastAPI (Python).
- Frontend: Next.js.
- LiteLLM per supportare più provider AI.
- Ollama per esecuzione locale dei modelli.
- SQLite per il database, Tailwind CSS per lo stile.

### Flusso utente
1. L'utente carica un "master resume" completo (tutte le esperienze reali).
2. Incolla un annuncio di lavoro.
3. Il sistema estrae competenze e requisiti da entrambi i documenti.
4. Esegue un confronto per identificare corrispondenze e lacune.
5. Genera suggerimenti mirati su cosa enfatizzare e cosa manca.

### Uso dell'AI
L'AI viene usata per estrarre informazioni dai documenti, confrontarli e
generare suggerimenti. I compiti sono ristretti e separati in fasi.

### Gestione del rischio di informazioni inventate
Il sistema parte da un profilo completo e reale (master resume) e si limita
a selezionare, evidenziare e riordinare ciò che è già presente. Non chiede
all'AI di "scrivere un CV", ma di lavorare solo sul materiale fornito.
Il rischio di invenzione è ridotto progettando il sistema: fonte chiusa di
dati, compiti ristretti e fasi separate.

### Idee utili per AI-CV-COACH
- Partire da un profilo master completo da cui pescare per ogni annuncio.
- Separare estrazione, confronto e generazione di suggerimenti.
- Far selezionare ed enfatizzare invece di riscrivere liberamente.

### Limiti osservati
- Tecnicamente molto più complesso del nostro progetto (Docker, modelli locali).
- Non prevede un dialogo guidato per costruire il profilo da zero,
  che è invece una caratteristica distintiva di AI-CV-COACH.

---

## Progetto analizzato 2

### Nome progetto
resume-job-matcher (sliday/resume-job-matcher)

### Link
https://github.com/sliday/resume-job-matcher

### Problema risolto
Automatizza il confronto tra uno o piu CV e un annuncio di lavoro,
assegnando un punteggio di match e generando risposte email ai candidati.
Pensato piu per chi seleziona (recruiter) che per il candidato.

### Funzionalita principali
- Calcolo di un punteggio di match tra CV e annuncio.
- Generazione di PDF dei CV.
- Generazione di risposte email personalizzate.

### Tecnologie usate
- Script Python.
- API di un LLM (Anthropic Claude o OpenAI GPT) per l'analisi.

### Flusso utente
1. Si forniscono i CV e la descrizione del lavoro.
2. Lo script usa l'LLM per analizzare e confrontare.
3. Restituisce un punteggio e contenuti generati (email, PDF).

### Uso dell'AI
L'AI legge CV e annuncio e assegna direttamente un punteggio di match,
oltre a generare testi (email).

### Come funziona lo scoring (punto di interesse)
Il punteggio finale combina due componenti con una media pesata:
- Match Score generato dall'AI (peso 75%): quanto il CV corrisponde
  all'annuncio per competenze, esperienza, formazione.
- Quality Score (peso 25%): qualita visiva e chiarezza del CV.
Formula: (AI_Score * 0.75 + Quality_Score * 0.25), normalizzata 0-100.
Appartiene quindi alla "famiglia A": e l'LLM a dare il voto.

### Gestione del rischio di informazioni inventate
Meno esplicita rispetto a Resume-Matcher. Lo scoring affidato all'LLM
e potente ma meno trasparente e potenzialmente incoerente: lo stesso input
puo dare punteggi leggermente diversi. Va trattato come orientativo.

### Idee utili per AI-CV-COACH
- Idea della media pesata tra piu componenti per costruire un punteggio.
- Conferma che affidare il voto all'LLM e semplice da implementare.
- Spunto: chiedere all'AI di motivare il punteggio elencando requisiti
  soddisfatti e non soddisfatti, per ancorarlo a fatti verificabili.

### Limiti osservati
- Orientato al recruiter, non al candidato che costruisce il proprio CV.
- Scoring poco trasparente e potenzialmente incoerente.
- Nessun dialogo guidato per costruire il profilo.

---

## Progetto analizzato 3

### Nome progetto
Resume-Parser (Sajjad-Amjad/Resume-Parser)

### Link
https://github.com/Sajjad-Amjad/Resume-Parser

### Problema risolto
Trasforma un CV in testo libero (PDF o Word) in dati strutturati e ordinati,
pronti per essere usati e confrontati da un programma.

### Funzionalita principali
- Estrazione strutturata delle informazioni del CV.
- Output in formato dati a campi precisi (tipo JSON).
- Interfaccia a riga di comando e app web (Streamlit).

### Tecnologie usate
- Python.
- API di OpenAI (LLM) per l'estrazione.
- Streamlit per l'interfaccia web.
- Pydantic per definire e validare la struttura dei dati.

### Flusso utente
1. L'utente carica un CV (PDF o Word).
2. L'AI legge il testo ed estrae le informazioni.
3. Il sistema restituisce i dati in una struttura predefinita a campi
   (nome, contatti, esperienze, competenze, formazione, ecc.).

### Uso dell'AI
L'AI viene usata per leggere testo libero e riempire una struttura di dati
predefinita. Ogni esperienza e scomposta in campi precisi (azienda, ruolo,
date, descrizione).

### Concetto chiave: output strutturato
Invece di far rispondere l'AI in testo libero, le si impone di rispondere in
un formato rigido a campi (JSON). Questo serve a due scopi:
1. Difesa anti-invenzione: e un compito chiuso (riempi questi campi con cio
   che trovi) invece di un compito aperto (racconta questa persona).
2. Confrontabilita: dati strutturati possono essere confrontati da un
   programma con i requisiti dell'annuncio, rendendo possibile lo scoring.

### Gestione del rischio di informazioni inventate
La struttura rigida limita lo spazio di invenzione dell'AI. Resta il limite
noto degli LLM: i risultati possono essere incoerenti o con informazioni
mancanti, quindi vanno verificati.

### Idee utili per AI-CV-COACH
- Adottare output strutturato (JSON) come formato di scambio interno.
- Strutturare il profilo utente in campi precisi fin dall'inizio.
- L'estrazione strutturata e il primo anello della pipeline:
  struttura -> confronta -> assegna punteggio.

### Limiti osservati
- Dipende da un'API a pagamento (OpenAI).
- Risultati potenzialmente incoerenti, da verificare.
- Si ferma all'estrazione: non costruisce il profilo in dialogo con l'utente.