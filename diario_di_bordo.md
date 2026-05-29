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

---

## Fase 0 – Riflessione di chiusura

### Cos'e stata la Fase 0
Una fase di osservazione e preparazione, senza ancora costruire nulla di
visibile. Lo scopo era studiare e capire le funzioni gia esistenti in
progetti online simili al mio e capire come, combinandole, possano dare
forma alla mia web app. In parallelo ho configurato gli strumenti di lavoro
e ricevuto un'infarinatura su molti aspetti tecnici che affrontero piu
concretamente in seguito. Ho anche imparato a strutturare cronologicamente
il lavoro, per arrivare per gradi a una versione funzionante dell'app con
le caratteristiche desiderate.

### Con cosa arrivo alla Fase 1
- Una pipeline ragionata da seguire (struttura -> confronta -> valuta ->
  genera), non piu solo un'idea generica di progetto.
- Idee concrete su come affrontare i problemi che la mia app deve risolvere,
  in particolare il vincolo anti-invenzione.
- Un repository ordinato con documentazione, analisi e diario, e l'abitudine
  al ciclo commit/push verificato.
- La chiarezza che la priorita della Fase 1 e il dialogo guidato (in versione
  minima/MVP), primo anello della pipeline ed elemento distintivo del progetto.

### Il metodo di lavoro
Mi sono trovato molto bene con l'approccio step-by-step, i commit frequenti,
il diario di bordo e l'abitudine a ragionare prima di mettere per iscritto.
Decido di mantenere lo stesso metodo nella Fase 1.

### Stato: Fase 0 completata.

---

# Fase 1 – Prototipo base v0

## Appunti di apertura della Fase 1

### Decisione di metodo: ruoli e divisione del lavoro
A partire dalla Fase 1 il lavoro si sviluppa con tre figure distinte:
- Io (Mirco) sono il regista: decido cosa fare, in che ordine, e do l'ok
  a ogni passo. Resto il responsabile della comprensione e delle scelte.
- Claude (chat) e il tutor: progettazione, concetti, ragionamento sulle
  scelte, prompt design, documentazione, somme di fine step/fase.
- Claude Code e l'assistente operativo: scrittura concreta di codice ed
  esecuzione di comandi, dopo che il pezzo e stato pensato a parole.

Regola d'oro: prima ragioniamo in chat, poi se serve costruiamo con
Claude Code. Mai il contrario. Da test fatto in autonomia
(claude-code-test-1) ho gia adottato l'accordo "ogni decisione di Claude
Code mi viene sottoposta prima dell'esecuzione: accetto, rifiuto, modifico,
studio". Mantengo questo accordo per tutta la Fase 1.

### 💡 Mia idea progettuale: lista delle "domande in sospeso"
Durante il dialogo guidato, se l'AI non riesce a strutturare bene una
risposta dell'utente, oppure se l'utente non sa o evita la domanda, la
domanda viene messa da parte in una lista interna delle "domande in
sospeso" invece di insistere sul momento. Il dialogo prosegue.
A fine dialogo si analizzano le domande accumulate e si pone un secondo
giro mirato, con domande riformulate in base ai concetti delle questioni
rimaste aperte, per provare a colmare i vuoti.

Perche e utile:
- E un'altra applicazione del principio "AI propone, utente conferma":
  l'AI dichiara apertamente quando non ha capito invece di riempire il
  profilo con dati approssimati. Difesa anti-invenzione.
- Rende il dialogo meno opprimente: ci si sposta dalla domanda difficile
  e si torna dopo, quando l'utente ha "scaldato i muscoli" parlando di se.
- Aggiunge una funzione che nessuno dei 4 progetti analizzati gestiva
  esplicitamente: e un altro elemento distintivo di AI-CV-COACH.

Sfumature da rispettare:
- La lista deve restare piccola: troppe domande in sospeso = segnale che
  il dialogo e troppo lungo o invasivo, da ripensare.
- Il secondo giro si fa una volta sola, non in loop infinito.
- Distinguere due casi: (A) l'AI non ha capito -> ha senso riformulare;
  (B) l'utente ha saltato o non sa -> va rispettato.

Nota tecnica: non e una "cartella" del filesystem, e una lista interna
del programma (concetto di "pending_questions" o "coda di fallback").
Il design preciso si vedra in prompt_design.md quando ci arriveremo.

### Punto di partenza della Fase 1
Dialogo guidato in versione MVP (minimo funzionante): poche domande, anche
senza tutto il meccanismo di conferma e senza ancora la lista delle domande
in sospeso. L'obiettivo del primo giro e ottenere un profilo grezzo con cui
far girare il resto della pipeline. Il raffinamento viene dopo.

---

## Fase 1 – Step 1.1 – Struttura del profilo utente

### Cosa ho fatto
Definita la struttura del profilo utente per l'MVP: il "modulo" che il
dialogo guidato dovra riempire. La struttura e volutamente minimale per
restare in scala MVP.

Campi (nomi tecnici JSON):
- nome
- esperienze_formali (lista; ogni voce: ruolo, azienda, durata,
  cosa_facevo)
- esperienze_informali (lista; ogni voce: cosa_facevo, quando, con_chi,
  tutti opzionali)
- competenze (lista di stringhe)
- formazione (lista; ogni voce: titolo, istituto, anno)

### Cosa ho imparato
- Distinzione fondamentale tra "nome tecnico" del campo (breve, in
  inglese o italiano pulito, senza spazi, lo vede solo il programma)
  e "testo visibile" all'utente (naturale, descrittivo, lungo a piacere).
  Sono due decisioni separate per la stessa cosa.
- Il concetto di "schema dati": prima di costruire un form o un dialogo,
  si decide quali caselle esistono. Poi si formulano le domande per
  riempirle. L'ordine inverso porta a chiedere cose a caso.

### 💡 Mia intuizione / scelta ragionata: le esperienze informali
Ho proposto di aggiungere un campo dedicato per esperienze non formali
(lavoretti, aiuti in famiglia, volontariato, esperienze brevi senza titoli
o certificati). Motivazioni:
- Il pubblico realistico di AI-CV-COACH include molte persone con
  percorsi non lineari, per cui un profilo con solo "esperienze formali"
  esclude buona parte della loro vita lavorativa reale.
- E un'ulteriore difesa anti-invenzione strutturale: senza un posto
  adatto per le esperienze vaghe, l'AI sarebbe tentata di "promuoverle"
  a esperienze formali per farle entrare nei campi disponibili, creando
  invenzioni (es. "aiutavo mio zio idraulico" -> "Idraulico, 3 mesi").
  Avere il campo dedicato evita questa pressione.

Sfumature decise:
- Nome tecnico scelto: esperienze_informali (parallelo a esperienze_formali).
- Struttura interna: leggera, tutti i sotto-campi opzionali, perche e la
  natura del campo. L'utente compila solo quello che ricorda.
- Per la generazione CV in fase successiva: queste esperienze andranno
  trattate con cautela, senza "promuoverle" automaticamente a esperienze
  formali. La formulazione precisa del prompt verra decisa quando saremo
  nel contesto della generazione CV.

### Dove ho faticato / cosa non era ovvio
Ho inizialmente proposto come nome del campo una frase descrittiva
("competenze acquisite anche tramite esperienze pratiche non formali").
Ragionando, ho capito che era un "testo visibile all'utente", non un
"nome tecnico" da JSON. Distinzione utile per il futuro.

### Cosa ho deciso e perche
- Partire da 5 campi essenziali, non di piu: in MVP, meno e meglio.
  Aggiungeremo (contatti, lingue, ecc.) solo dopo aver visto la pipeline
  girare.
- Tenere le esperienze informali separate da quelle formali: non sono
  esperienze "di serie B", sono di natura diversa e vanno gestite con
  regole diverse.
- Rimandare la formulazione precisa dei testi visibili al momento in cui
  servono davvero (prompt di generazione CV), invece di tararli a vuoto
  adesso.