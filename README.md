# AI-CV-COACH

**Stato:** 🚧 In sviluppo attivo — MVP completo end-to-end: i 4 anelli sono integrati in un unico flusso utente nel browser (`index.html`). ✅ profilo guidato · ✅ analisi annuncio · ✅ confronto + punteggio (match in stelle 0–5) · ✅ generazione (📄 CV-1 base + 🎯 CV-2 mirato + ✉️ lettera di presentazione) — flusso testato end-to-end nel browser

AI-CV-COACH è una web app sperimentale sviluppata come progetto di stage presso Aviolab AI.

L'obiettivo del progetto è aiutare un utente a costruire un profilo professionale strutturato, analizzare un annuncio di lavoro e generare un CV mirato basato esclusivamente su esperienze, competenze e informazioni realmente fornite dall'utente.

## Stato del progetto

Questo è un progetto di apprendimento sviluppato in modo trasparente nell'ambito del mio tirocinio presso Aviolab AI. Il repository documenta sia il codice sia il metodo di lavoro, incluso un diario di bordo (`diario_di_bordo.md`) che traccia decisioni e ragionamenti a ogni passo.

Ogni fase del progetto viene chiusa con documentazione, riflessioni e cronologia di commit verificabile, prima di passare alla successiva.

## Obiettivi principali

- Raccogliere e organizzare il profilo professionale dell'utente.
- Analizzare un annuncio di lavoro.
- Confrontare profilo e annuncio.
- Calcolare un punteggio di match orientativo.
- Generare un CV mirato senza inventare informazioni.
- Documentare il processo di progettazione, sviluppo e uso dell'AI.

## Fasi previste

1. Fase 0 – Setup e analisi preliminare.
2. Fase 1 – Prototipo base v0.
3. Fase 2 – Profile Manager guidato v1.
4. Fase 3 – Migrazione a un'applicazione VB.NET sotto Windows 11.

## Vincolo etico principale

L'applicazione non deve inventare esperienze, competenze, titoli di studio o risultati non presenti nel profilo reale dell'utente.

## Tecnologie previste

Il progetto attraversa due fasi tecnologiche distinte.

**Fase MVP (attuale):**

- Frontend in HTML, CSS e JavaScript, eseguito nel browser.
- Un aiutante locale in Node.js: utility di servizio che custodisce la chiave API e fa da tramite verso l'API LLM, in modo che la chiave non sia mai esposta nel browser.
- API di un LLM per la strutturazione del profilo e le elaborazioni, con due modelli scelti per livello di compito: **Claude Haiku 4.5** per l'estrazione (profilo e annuncio) e **Claude Sonnet 4.6** per il confronto semantico profilo-annuncio, che richiede ragionamento più profondo.

**Fase target (dopo la validazione di prompt e schema):**

- Migrazione a un'unica applicazione VB.NET sotto Windows 11, che assolverà sia il frontend sia la chiamata diretta all'API LLM, rendendo superfluo l'aiutante Node.

In entrambe le fasi: Git e GitHub per il versionamento.

---

© 2026 Mirco Parenti
