# Diario di bordo – AI-CV-COACH

Questo file raccoglie appunti a caldo durante lo sviluppo del progetto.
Serve a tenere traccia di cosa è stato fatto, cosa ho imparato, quali
difficoltà ho incontrato e come le ho risolte. È il materiale grezzo da
cui verrà costruita la relazione finale.

Lingua: italiano. Stile: sincero e sintetico.

---

## Fase 0 – Setup e analisi preliminare

### Step 0.1 – Preparazione strumenti

Cosa ho fatto:
- Verificato e installato gli strumenti di base: Python 3.14.5, Git 2.54.0, VS Code 1.121.0.
- Configurato Git durante l'installazione (branch di default "main", editor, PATH, gestione credenziali).

Cosa ho imparato:
- Cos'è un PATH e perché serve per usare i comandi da terminale.
- La differenza tra avere un programma installato e averlo "riconosciuto" dal sistema.

Difficoltà:
- All'inizio i comandi git e code non erano riconosciuti dal terminale; risolto installando i programmi e aggiungendoli al PATH.

### Step 0.2 – GitHub e configurazione Git

Cosa ho fatto:
- Creato l'account GitHub (username Mirco-Parenti).
- Configurato nome ed email globali di Git.
- Creato il repository pubblico AI-CV-COACH.
- Iniziato a usare GitHub Desktop come interfaccia grafica.

Cosa ho imparato:
- Differenza tra Git (locale) e GitHub (online e pubblico).
- Cos'è un repository: una cartella di progetto con cronologia versionata.

### Step 0.3 – Struttura iniziale e primo commit

Cosa ho fatto:
- Aperto il repository in VS Code.
- Creato i file di documentazione: README.md, research_notes.md, prompt_design.md.
- Eseguito il primo commit ("Add initial project documentation") e fatto push su GitHub.
- Verificato online che i file fossero presenti e il README formattato correttamente.

Cosa ho imparato:
- Differenza tra "salvare un file" e fare un "commit" (salvataggio ragionato nella cronologia).
- Cosa fa il "push" (carica i commit locali su GitHub).
- L'importanza di verificare sempre il risultato invece di darlo per scontato.

Difficoltà:
- Avviso sui line endings (LF/CRLF) in GitHub Desktop: capito che è normale su Windows e non è un problema.

---

## Note generali

Da aggiornare alla fine di ogni fase.

---

## Fase 0 – Step 0.5 – Analisi di progetti simili

### Progetti analizzati (dettaglio completo in research_notes.md)
1. Resume-Matcher (srbhr) — https://github.com/srbhr/Resume-Matcher
   Lente: vincolo anti-invenzione (master resume, fonte chiusa).
2. resume-job-matcher (sliday) — https://github.com/sliday/resume-job-matcher
   Lente: scoring (media pesata, voto dato dall'LLM).
3. Resume-Parser (Sajjad-Amjad) — https://github.com/Sajjad-Amjad/Resume-Parser
   Lente: output strutturato (JSON) ed estrazione dati.
4. ResumeLM (olyaiy) — https://github.com/olyaiy/resume-lm
   Lente: gestione dati utente e pattern "AI propone, utente conferma".

### Cosa ho fatto
- Imparato a cercare progetti su GitHub e a valutarli con criteri rapidi
  (stelle, data ultimo aggiornamento, descrizione).
- Analizzato 4 progetti open source simili ad AI-CV-COACH, usando una
  griglia di analisi e usando ogni progetto come "lente" per un tema:
  1. Resume-Matcher -> vincolo anti-invenzione.
  2. resume-job-matcher -> come funziona lo scoring.
  3. Resume-Parser -> output strutturato (JSON).
  4. ResumeLM -> gestione dati utente e dialogo.
- Documentato ogni progetto in research_notes.md con commit separati.

### Cosa ho imparato
- La pipeline del progetto ha 4 anelli: struttura i dati (estrazione) ->
  confronta profilo e annuncio -> assegna punteggio -> genera output.
- Esistono due famiglie di scoring: una affidata all'LLM (coglie le
  sfumature ma e meno trasparente e potenzialmente incoerente) e una
  matematica/NLP (trasparente e verificabile ma rigida).
- Nella famiglia LLM il punteggio puo essere una media pesata di piu
  componenti (es. match 75% + qualita 25%), normalizzata 0-100.
- L'output strutturato (JSON) serve a due scopi: non far inventare l'AI
  (compito chiuso) e rendere i dati confrontabili da un programma.
- Il pattern "human-in-the-loop": l'AI propone, l'utente conferma.
- Distinzione "AI-enabled" vs "AI-first": l'AI e uno strumento di supporto
  discreto al servizio dell'utente, non il padrone del processo.

### 💡 Mie intuizioni / scelte ragionate
- Ho capito che i principi anti-invenzione (fonte chiusa, compiti ristretti,
  output strutturato, conferma dell'utente) non sono separati: sono facce
  della stessa idea, cioe togliere liberta all'AI per ancorarla alla realta.
- Ho collegato i 4 progetti in un'unica catena: l'output strutturato non e
  solo difesa anti-invenzione, e anche la precondizione che rende possibile
  il confronto e quindi lo scoring. Senza dati strutturati non c'e match.
- Ho scelto per lo scoring la "famiglia A" (LLM che da il voto), perche
  coglie le sfumature ed e piu semplice da implementare al nostro livello,
  accettando che il punteggio sia presentato come orientativo.
- Ho ragionato sui limiti della famiglia A: i punteggi possono essere
  incoerenti (stesso input, voti un po' diversi) e un "voto aperto" lascia
  spazio all'invenzione. Mitigazione: chiedere all'AI di giustificare il
  punteggio elencando i requisiti soddisfatti e non soddisfatti, per
  ancorarlo a fatti verificabili.
- Ho progettato il meccanismo di conferma nel dialogo: dopo ogni risposta,
  l'AI mostra l'output parziale strutturato; l'utente conferma, corregge il
  singolo campo, o ripete. Solo dopo la conferma il dato entra nel profilo.
- Ho affinato quel meccanismo: meglio permettere la correzione del singolo
  campo invece di ripetere tutta la domanda; e l'AI deve strutturare solo
  cio che l'utente ha detto, senza arricchire o gonfiare le risposte.
- Ho individuato come priorita della Fase 1 il dialogo guidato, per due
  motivi: e il primo anello della pipeline (gli altri dipendono da lui, e
  il profilo e la fonte chiusa da cui tutto pesca) ed e l'elemento
  distintivo e raro del progetto, quindi e un requisito fondante.

### Dove ho faticato / cosa non era ovvio
- All'inizio non era ovvio che "tirare le somme" e "scrivere il diario"
  fossero due attivita diverse: prima si ragiona, poi si mette per iscritto.
- Capire la differenza tra le due famiglie di scoring ha richiesto un
  ragionamento sui rispettivi pregi e limiti.
- Ho dovuto distinguere il ruolo del diario (appunti grezzi di pensiero) da
  quello di research_notes.md (archivio dettagliato dei dati sui progetti).

### Cosa ho deciso e perche
- Scelto Resume-Matcher come primo progetto da analizzare, applicando criteri
  di qualita: molte stelle (maturita) e aggiornamento recente (progetto vivo).
- Approfondito lo scoring come secondo tema, perche e un deliverable del
  progetto e uno dei punti piu delicati da progettare.
- Aggiunto un terzo progetto sull'output strutturato e un quarto sul dialogo,
  poi chiusa la rosa a 4 (range richiesto 3-5): meglio pochi progetti
  analizzati a fondo che molti in modo superficiale.
- Stabilito un metodo di lavoro: prima si ragiona ("tirare le somme"), poi si
  mette per iscritto nel diario; il diario si aggiorna a fine step/fase, non
  a ogni micro-passo.
- Deciso di evidenziare nel diario le intuizioni e scelte ragionate con
  un'etichetta dedicata, perche sono la parte piu utile per la relazione.

### Nota su come procederemo (da ricordare per la Fase 1)
Il dialogo guidato in Fase 1 sara una versione minima (MVP): poche domande,
anche senza tutto il meccanismo di conferma raffinato, giusto per ottenere un
profilo grezzo con cui far girare il resto della pipeline. Si raffina dopo.

### Nota di posizionamento (per la relazione finale)
Quasi tutti i progetti analizzati partono da un CV gia esistente. Costruire
il profilo tramite dialogo guidato a domande successive e raro: e quindi un
elemento distintivo e originale di AI-CV-COACH.