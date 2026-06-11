# Idee future — AI-CV-COACH

Raccolta **unica** dei raffinamenti e delle idee per le fasi successive del progetto.
Non è codice né stato corrente: è il **backlog ragionato**. Lo **stato attuale** della
pipeline sta nel `README.md` (sezione *Stato*) e nell'ultimo `### Step` del
`diario_di_bordo.md`.

*Come si compila questo file (modalità):* una voce per idea, raggruppata per area; ogni
voce dice **cos'è · perché è futura · dove se ne parla** (puntatore a diario/prompt_design).
Le idee nuove si annotano con **data e motivo**. Aggiornato con "aggiorna-tutto".

## Front-end & pipeline
- ✅ **Integrazione front-end**: **realizzata** — i quattro anelli sono ora un unico flusso
  in `index.html` (dialogo profilo → bivio 📄 CV-1 / annuncio → confronto in stelle →
  🎯 CV-2 → ✉️ lettera). Le `test-*.html` restano come banchi di prova per-anello.
  *(diario Step 1.24.)*
- **Estrazione JSON robusta al preambolo**: `estraiJson` (lato server, usato da tutti gli
  endpoint) toglie il **recinto** ```` ```json ```` ma non un eventuale **preambolo in
  prosa** prima del JSON; in quel caso `JSON.parse` fallisce e l'endpoint risponde 502.
  Sui prompt rigidi (`/struttura`, `/genera-cv`) non capita in pratica; può capitare quando
  il modello "si mette a spiegare" (visto su `/confronta` con un annuncio fuori-schema).
  Idea: estrarre il blocco JSON anche con prosa attorno (primo `{` … ultimo `}`). Non è un
  prerequisito (con input ben formati gli endpoint partono già con `{`).
  *(2026-06-11 — emerso testando il 📄 CV-1 e introducendo la validazione JSON lato server.)*

## Profilo, annuncio & schema
- **Estensione del profilo** a specchio di `altri_requisiti` (domicilio, disponibilità,
  patente, automunito, età, iscrizione albo, idoneità): rende ricavabili nel match dati
  che oggi escono `non determinabile`. **Non è un prerequisito** (`altri_requisiti` è già
  confrontabile). Attenzione alla **sensibilità** dei dati personali (domicilio, età);
  probabile nuovo turno nell'anello 1. *(Diario Step 1.14.)*
- **Turno contatti nell'anello 1**: aggiungere un turno che raccolga i contatti
  (e in prospettiva lingue, link) nel profilo. Diventa concreto con l'anello 4: oggi
  l'**intestazione del CV ha solo il nome**, perché i contatti non sono nello schema MVP.
  *(2026-06-09 — emerso nel design dell'anello 4; prompt_design.md, note schema profilo.)*
- **Campi annuncio aggiuntivi**: `livello` (impiegato/operaio/quadro), `settore` — fuori
  per ora (schema snello). *(prompt_design.md, "Da valutare in futuro".)*
- **Decomposizione dei prompt**: il prompt unico dell'annuncio è già diviso in 5 sezioni
  numerate, pensate per diventare sotto-prompt separati. *(Diario Step 1.10.)*

## Dialogo (anello 1)
- **pending_questions**: accantonare le domande saltate o non strutturabili e riprenderle
  in un secondo giro a fine dialogo. Pianificato, non costruito. *(Diario apertura Fase 1,
  Step 1.2.)*
- **Rifiniture MVP rimandate**: rimozione di singole competenze, routing a linguaggio
  naturale (oggi bottoni), editing campo-per-campo. *(Diario Step 1.8.)*
- **Formato del riepilogo leggibile** del profilo: da decidere insieme all'interfaccia.
  *(prompt_design.md, turno formazione, "Sospeso".)*

## Match & punteggio (anello 3)
- **Hard-gate**: un requisito *davvero* squalificante non azzera il punteggio (tetto del
  clamp −20). Trattarlo come tetto rigido che cratera il match è rimandato.
  *(Diario Step 1.16-1.17; prompt_design.md, "Limite noto".)*
- **Taxonomy mapping (ESCO/O*NET)**: mappare le skill su una tassonomia standard per il
  match. Scartato per l'MVP (il match semantico lo fa l'LLM); utile per analisi su grandi
  volumi, non per il singolo match. Fonti GitHub da riprendere:
  - `nestauk/ojd_daps_skills`
  - `KonstantinosPetrakis/esco-skill-extractor`
  - `amazon-science/job-posting-structure` (componente *SkillsTaxonomyAI*)
  *(Diario Step 1.10-1.11-1.15.)*

## Generazione (anello 4)
- ✅ **Testo visibile per le esperienze informali** nel CV (come presentarle senza
  "promuoverle" a formali): **realizzato** nell'anello 4 — sezione `altre_esperienze`
  (`descrizione` che fonde `cosa_facevo`+`con_chi`, più `quando`; mai `ruolo`/`azienda`)
  con la regola anti-promozione, validata in 📄 CV-1 e 🎯 CV-2.
  *(prompt_design.md, schema CV e regole d'uso; diario Step 1.20.)*
- **Riordino dinamico delle sezioni nel CV mirato**: nell'MVP l'ordine delle sezioni è
  **fisso** in entrambi i CV (base e mirato) e il "mirare" avviene nel **contenuto**
  (sommario, dettaglio delle voci); far variare ordine/enfasi delle sezioni in base al
  confronto (anello 3) è rimandato. *(2026-06-09 — deciso nel design dell'anello 4:
  ordine fisso per semplicità e verificabilità.)*
- **Omissione mirata di contenuti off-target nel 🎯 CV-2**: nell'MVP il CV-2 **tiene tutte
  le voci** del profilo e mira solo con l'**enfasi** (cosa il sommario mette in risalto,
  quanto dettaglio dà a una descrizione), a ordine fisso. Poter **omettere** le voci non
  pertinenti all'annuncio renderebbe il CV più incisivo (come i CV mirati veri), ma
  l'omissione è già una *scelta* che complica la verifica 1:1 e apre una porta
  all'anti-invenzione "per sottrazione". Rimandato. *(2026-06-11 — deciso nel design del
  CV-2, bivio 3: tenere tutto, ri-pesare l'enfasi.)*
- **Soglia di match prima di generare**: per un match molto basso (es. ~0 stelle) il
  🎯 CV-2 e la ✉️ lettera escono *onesti ma inutili come candidatura* — la lettera diventa
  una "non-candidatura" che dichiara solo ciò che manca. Idea: sotto una soglia, **avvisare
  l'utente** (o sconsigliare la generazione) invece di produrre comunque, lasciando comunque
  a lui la scelta finale. *(2026-06-11 — emerso nel primo collaudo con il CV reale di Mirco
  contro un annuncio lontanissimo, Operatore Subacqueo, match 0,1 stelle; diario Step 1.25.)*
