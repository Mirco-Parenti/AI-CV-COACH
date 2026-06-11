# regole_di_progetto — AI-CV-COACH

Queste sono le **`regole_di_progetto`** di AI-CV-COACH: valgono **solo** in questo progetto.
Le mie regole valide in ogni progetto (`regole_globali`) stanno in `~/.claude/CLAUDE.md`.
Convenzione di scrittura: **"io" = Mirco, "tu" = tu, l'assistente.**

## Regole

1. **Sync prompt ↔ codice**: ogni prompt vive **identico** in `prompt_design.md` e
   `server.js`. Confronta **char-by-char** normalizzando CRLF/LF, e **verifica a ogni
   modifica** di un prompt.
2. **Stile del diario** (`diario_di_bordo.md`): `### Step X.Y — titolo`, intro in
   corsivo, sezioni *Cosa ho fatto / Cosa ho imparato / Dove ho faticato / Cosa ho
   deciso e perché*, callout 💡, **prima persona** (io = Mirco), in italiano.
   **Non riscrivere gli step passati** (sono storia): lavoro nuovo = step nuovo.
3. **Asset durevoli vs usa-e-getta**: investi qualità sui **durevoli = PROMPT + SCHEMA**
   (`prompt_design.md`), che migrano verso VB.NET. L'infrastruttura — `index.html`,
   l'aiutante Node, i `test-*.html` — è **impalcatura usa-e-getta**, non da studiare
   riga per riga.
4. **Documentazione senza duplicati**: i prompt **definitivi** stanno in
   `prompt_design.md`, la **narrazione e le decisioni** nel `diario_di_bordo.md`.
   Non duplicare lo stesso contenuto nei due.
5. **Comando "aggiorna-tutto"**: quando dico **"aggiorna-tutto"**, aggiorna **tutti i
   file di progetto nel working tree (tracciati o no)** — incluso questo `CLAUDE.md` —
   al livello a cui siamo arrivati. Procedi **un file alla volta**, seguendo
   **scrupolosamente la modalità di compilazione specifica di ciascun file** (vedi la
   tabella **«Modalità di aggiornamento per file»** in fondo). È
   **severamente vietato confondere i contenuti di un file con quelli di un altro —
   idem per la forma e il mood** di compilazione. **Sempre doppio controllo.**
   **Esclusi sempre**: `.env`, `.claude/`, `node_modules/` e tutto ciò che è gitignored;
   i file di config (`.gitignore`, `.gitattributes`, `package.json`) si toccano solo se
   serve. È **repo-scoped**: non tocca `~/.claude/CLAUDE.md` (regole_globali) né l'auto-memoria.
6. **Marker regole nuove**: quando emerge una possibile nuova `regola_di_progetto`,
   **proponimela in chat marcata con `🔖 REGOLA NUOVA/regole_di_progetto` e chiedimi conferma**; aggiungila
   a questo file **solo dopo il mio ok** (niente aggiunte autonome). Il marker resta
   accanto alla regola finché non è **ratificata** (con "aggiorna-tutto" o quando lo dico).
7. **Idee future**: tieni `idee_future.md` come **unica
   raccolta** dei raffinamenti/idee per le fasi successive. Quando emerge un'idea da
   segnare, **annotala lì** (con data e motivo) e **consultalo a inizio di ogni nuova
   fase**. È aggiornato da "aggiorna-tutto"; in questo file ne resta solo il puntatore.
8. **Compilazione di un file**: prima
   di compilare qualunque file, rileggilo per intero, capiscine contenuto, stile e
   struttura; poi aggiornalo solo se serve. Se lo aggiorni devi farlo con lo stesso stile
   e la stessa struttura. Poi passa al successivo. Se non serve aggiornarlo, passa
   direttamente al successivo.
9. **Nomenclatura dei due CV (anello 4)**: in chat distingui **sempre** i due output
   della generazione con marker chiari e distinti — **📄 CV-1** (base, generato dopo
   l'anello 1) e **🎯 CV-2** (mirato, generato dopo l'anello 3). Usali ogni volta che
   parli dei due CV.

## Contesto del progetto (fatti stabili + puntatori, niente stato copiato)

- **Come far girare il progetto**: Node ≥ 20.12, **niente dipendenze npm**, chiave in
  `.env` (`ANTHROPIC_API_KEY`, gitignored). Avvio: `npm start` → `http://localhost:3000`.
  Endpoint: `POST /struttura`, `POST /confronta` e `POST /genera-cv`. Stop del server: `fuser -k 3000/tcp`.
- **Stato e pipeline (fonte viva)**: per pipeline e stato aggiornati vedi
  `README.md` (sezione *Stato*) e l'ultimo `### Step` del `diario_di_bordo.md`.
  **Non duplicare qui lo stato** (così questo file non va mai stantio).
- **Modelli (puntatore)**: quali modelli si usano e con che criterio (estrazione vs
  ragionamento) è in `prompt_design.md` ("Modelli usati") e nelle costanti
  `MODEL_SEMPLICE` / `MODEL_RAGIONAMENTO` di `server.js`.
- **Bussola etica del prodotto (puntatore)**: il vincolo **anti-invenzione** è descritto
  in `README.md` ("Vincolo etico principale") ed è codificato nei prompt di
  `prompt_design.md` — **rispettalo quando progetti/modifichi i prompt**. È una regola
  **del prodotto**, non una mia regola di lavoro.
- **Idee/raffinamenti futuri (puntatore)**: il backlog ragionato per le fasi successive
  è in `idee_future.md`.

## Modalità di aggiornamento per file (per «aggiorna-tutto»)

Riferimento operativo per la regola #5: **come** va trattato ciascun file. Quando nasce
un file nuovo, aggiungi qui la sua riga.

| File | Come aggiornarlo con "aggiorna-tutto" |
|---|---|
| `README.md` | Aggiorna la sezione **Stato** (riga in cima + "## Stato del progetto") e "Tecnologie previste" se cambiano; non riscrivere il resto della presentazione. |
| `prompt_design.md` | Prompt **definitivi** + schema; prompt **identici** a `server.js` (sync char-by-char). |
| `server.js` | Codice del motore; prompt **identici** a `prompt_design.md`. |
| `diario_di_bordo.md` | **Aggiungi un nuovo `### Step X.Y`** (intro corsivo, sezioni, 💡, prima persona). **Mai** riscrivere gli step passati. |
| `idee_future.md` | Aggiungi le idee nuove / spunta quelle realizzate con ✅ + puntatore; quando si accumulano, raccoglile in una sezione «Realizzate» in fondo (così il backlog attivo resta solo-futuro e non induce in errore); non copiare lo stato. |
| `CLAUDE.md` | Ratifica i marker confermati (togli 🔖); riflette regole e contesti aggiornati. |
| `research_notes.md` | **Statico**: solo se c'è nuova ricerca su progetti simili. |
| `index.html`, `test-annuncio.html`, `test-confronto.html`, `test-cv.html`, `test-cv-mirato.html` (e ogni `test-*.html`) | Impalcatura usa-e-getta: solo se è cambiato il front-end/test (qualità minore). |
| `.gitignore`, `.gitattributes`, `package.json` | Config: solo se serve un cambiamento concreto. |
| `.env`, `.claude/`, `node_modules/`, gitignored | **MAI** toccati. |
