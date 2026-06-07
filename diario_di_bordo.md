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
- Creato l'account GitHub (username mirco-parenti).
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

Note generali

Da aggiornare alla fine di ogni fase.

---

### Step 0.5 – Analisi di progetti simili

**Progetti analizzati (dettaglio completo in research_notes.md)**
1. Resume-Matcher (srbhr) — https://github.com/srbhr/Resume-Matcher
   Lente: vincolo anti-invenzione (master resume, fonte chiusa).
2. resume-job-matcher (sliday) — https://github.com/sliday/resume-job-matcher
   Lente: scoring (media pesata, voto dato dall'LLM).
3. Resume-Parser (Sajjad-Amjad) — https://github.com/Sajjad-Amjad/Resume-Parser
   Lente: output strutturato (JSON) ed estrazione dati.
4. ResumeLM (olyaiy) — https://github.com/olyaiy/resume-lm
   Lente: gestione dati utente e pattern "AI propone, utente conferma".

**Cosa ho fatto**
- Imparato a cercare progetti su GitHub e a valutarli con criteri rapidi
  (stelle, data ultimo aggiornamento, descrizione).
- Analizzato 4 progetti open source simili ad AI-CV-COACH, usando una
  griglia di analisi e usando ogni progetto come "lente" per un tema:
  1. Resume-Matcher -> vincolo anti-invenzione.
  2. resume-job-matcher -> come funziona lo scoring.
  3. Resume-Parser -> output strutturato (JSON).
  4. ResumeLM -> gestione dati utente e dialogo.
- Documentato ogni progetto in research_notes.md con commit separati.

**Cosa ho imparato**
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

**💡 Mie intuizioni / scelte ragionate**
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

**Dove ho faticato / cosa non era ovvio**
- All'inizio non era ovvio che "tirare le somme" e "scrivere il diario"
  fossero due attivita diverse: prima si ragiona, poi si mette per iscritto.
- Capire la differenza tra le due famiglie di scoring ha richiesto un
  ragionamento sui rispettivi pregi e limiti.
- Ho dovuto distinguere il ruolo del diario (appunti grezzi di pensiero) da
  quello di research_notes.md (archivio dettagliato dei dati sui progetti).

**Cosa ho deciso e perche**
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

**Nota su come procederemo (da ricordare per la Fase 1)**
Il dialogo guidato in Fase 1 sara una versione minima (MVP): poche domande,
anche senza tutto il meccanismo di conferma raffinato, giusto per ottenere un
profilo grezzo con cui far girare il resto della pipeline. Si raffina dopo.

**Nota di posizionamento (per la relazione finale)**
Quasi tutti i progetti analizzati partono da un CV gia esistente. Costruire
il profilo tramite dialogo guidato a domande successive e raro: e quindi un
elemento distintivo e originale di AI-CV-COACH.

---

### Riflessione di chiusura

**Cos'e stata la Fase 0**
Una fase di osservazione e preparazione, senza ancora costruire nulla di
visibile. Lo scopo era studiare e capire le funzioni gia esistenti in
progetti online simili al mio e capire come, combinandole, possano dare
forma alla mia web app. In parallelo ho configurato gli strumenti di lavoro
e ricevuto un'infarinatura su molti aspetti tecnici che affrontero piu
concretamente in seguito. Ho anche imparato a strutturare cronologicamente
il lavoro, per arrivare per gradi a una versione funzionante dell'app con
le caratteristiche desiderate.

**Con cosa arrivo alla Fase 1**
- Una pipeline ragionata da seguire (struttura -> confronta -> valuta ->
  genera), non piu solo un'idea generica di progetto.
- Idee concrete su come affrontare i problemi che la mia app deve risolvere,
  in particolare il vincolo anti-invenzione.
- Un repository ordinato con documentazione, analisi e diario, e l'abitudine
  al ciclo commit/push verificato.
- La chiarezza che la priorita della Fase 1 e il dialogo guidato (in versione
  minima/MVP), primo anello della pipeline ed elemento distintivo del progetto.

**Il metodo di lavoro**
Mi sono trovato molto bene con l'approccio step-by-step, i commit frequenti,
il diario di bordo e l'abitudine a ragionare prima di mettere per iscritto.
Decido di mantenere lo stesso metodo nella Fase 1.

**Stato: Fase 0 completata.**

---

## Fase 1 – Prototipo base v0

### Appunti di apertura della Fase 1

**Decisione di metodo: ruoli e divisione del lavoro**
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

**💡 Mia idea progettuale: lista delle "domande in sospeso"**
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

**Punto di partenza della Fase 1**
Dialogo guidato in versione MVP (minimo funzionante): poche domande, anche
senza tutto il meccanismo di conferma e senza ancora la lista delle domande
in sospeso. L'obiettivo del primo giro e ottenere un profilo grezzo con cui
far girare il resto della pipeline. Il raffinamento viene dopo.

---

### Step 1.1 – Struttura del profilo utente

**Cosa ho fatto**
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

**Cosa ho imparato**
- Distinzione fondamentale tra "nome tecnico" del campo (breve, in
  inglese o italiano pulito, senza spazi, lo vede solo il programma)
  e "testo visibile" all'utente (naturale, descrittivo, lungo a piacere).
  Sono due decisioni separate per la stessa cosa.
- Il concetto di "schema dati": prima di costruire un form o un dialogo,
  si decide quali caselle esistono. Poi si formulano le domande per
  riempirle. L'ordine inverso porta a chiedere cose a caso.

**💡 Mia intuizione / scelta ragionata: le esperienze informali**
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

**Dove ho faticato / cosa non era ovvio**
Ho inizialmente proposto come nome del campo una frase descrittiva
("competenze acquisite anche tramite esperienze pratiche non formali").
Ragionando, ho capito che era un "testo visibile all'utente", non un
"nome tecnico" da JSON. Distinzione utile per il futuro.

**Cosa ho deciso e perche**
- Partire da 5 campi essenziali, non di piu: in MVP, meno e meglio.
  Aggiungeremo (contatti, lingue, ecc.) solo dopo aver visto la pipeline
  girare.
- Tenere le esperienze informali separate da quelle formali: non sono
  esperienze "di serie B", sono di natura diversa e vanno gestite con
  regole diverse.
- Rimandare la formulazione precisa dei testi visibili al momento in cui
  servono davvero (prompt di generazione CV), invece di tararli a vuoto
  adesso.

### Step 1.2 — Struttura del dialogo guidato (MVP)

*Definito lo scheletro del dialogo, non ancora i testi delle domande.*

**Cosa ho fatto**
Ho definito la struttura del dialogo guidato dell'MVP con quattro decisioni:
1. Forma: ordine fisso + un argomento per turno + loop di conferma.
2. Ordine: i cinque campi nella sequenza dello schema (nome → esperienze formali → esperienze informali → competenze → formazione); le competenze restano un turno dedicato (Strada A), non derivate.
3. Tipi di turno: due soli — *singolo* (per `nome`) e *ripetibile* (per gli altri quattro campi-lista), con domanda-ponte "altro o procediamo?" a fine di ogni voce.
4. Risposta storta (confusa, vuota o saltata): comportamento unico — l'AI non insiste, dichiara in modo neutro che lascia vuoto, e procede.

Non ho ancora scritto il testo preciso delle domande: lo farò nel contesto giusto (principio "frasi visibili nel contesto").

**Cosa ho imparato**
Che "la forma più semplice" e "la forma più vicina all'MVP" sono la stessa cosa: meno parti mobili significa insieme meno codice e più fedeltà al concetto di MVP. E che qui il lavoro anti-invenzione spesso non lo fa il codice ma la formulazione della domanda (vedi competenze).

**Dove ho faticato / cosa non era ovvio**
Non avevo notato che "una domanda per turno" non bastava come categoria. Tre campi su cinque sono liste (posso avere più esperienze, più competenze, più titoli), quindi quel turno deve poter raccogliere più voci. Da qui la distinzione tra turno singolo e turno ripetibile, che all'inizio non avevo in mente.

**Cosa ho deciso e perché**
- Ordine fisso invece che adattivo: meno logica da costruire e, soprattutto, l'adattivo tende a guidare l'utente verso le risposte — contrario al vincolo anti-invenzione.
- Strada A per le competenze (turno dedicato ancorato via testo) invece di derivarle: tiene il campo riempito da risposta diretta dell'utente, senza logica nuova nell'MVP.
- Due tipi di turno: imposti dai campi-lista, servono la domanda-ponte "altro o procediamo?".
- Comportamento unico sui vuoti: è il "default sicuro" applicato al dialogo (vuoto è meglio di inventato) e lascia la porta aperta a pending_questions.

💡 *Mia intuizione / scelta ragionata* — Strada A con ancoraggio via testo: il lavoro anti-invenzione sulle competenze lo sposto sulla formulazione della domanda, non su una regola nel codice. Il punto più delicato (chiedere "che competenze hai?" a freddo invita al gonfiamento) si disinnesca scegliendo bene le parole, non aggiungendo logica.

💡 *Mia intuizione / scelta ragionata* — I "vuoti" dell'MVP non sono sprechi. Quando aggiungerò pending_questions, saranno proprio le voci da riprendere nel secondo giro. L'MVP fa la versione povera della stessa idea; il raffinamento la versione ricca. Niente da buttare.

### Step 1.3 — Testi del dialogo: nome + turni-esperienza (MVP)

*Scritto lo scheletro testuale dei primi tre turni. Mancano competenze e formazione, rimandati a sessione dedicata (le competenze sono il punto più delicato per l'anti-invenzione).*

**Cosa ho fatto**
Scritto i testi di tre turni: `nome` (singolo) e i due turni-esperienza `esperienze_formali` e `esperienze_informali` (ripetibili). Per i ripetibili ho definito i tre pezzi — apertura, conferma a scheda, reminder-ponte — e un "patto" esplicito che annuncia il meccanismo (una alla volta, ti mostro cosa ho capito, confermi o correggi, poi la prossima). I testi sono in prompt_design.md.

**Cosa ho imparato**
- La coerenza tra turni è di *funzione*, non di *lettera*: stesso patto, forma adattata al contesto (gli incipit "Partiamo…" e "Raccontami ora…" cambiano, il meccanismo no).
- La domanda d'apertura fa lavoro anti-invenzione *diverso* a seconda del campo: nelle formali frena il gonfiamento, nelle informali dà il permesso. Stesso scheletro, insidia opposta.
- Chiedere di raccontare una esperienza alla volta non serve solo all'ordine: serve a orientare l'utente a restare sui fatti e a ridurre il margine in cui l'LLM potrebbe inventare.

**Dove ho faticato / cosa non era ovvio**
Mi è venuto il dubbio se l'AI riuscisse a distinguere più esperienze raccontate insieme in un unico blocco. La risposta è che ci riuscirebbe, ma abbiamo capito che è meglio non chiederglielo: farglielo fare aprirebbe spazio a interpretazioni e quindi a invenzioni. Meglio orientare l'utente a procedere una alla volta e tenere il compito dell'AI ristretto.

**Cosa ho deciso e perché**
- Apertura stretta nelle formali (solo lavori, studi/corsi dopo): non caricare l'AI di cernita, restare fedeli all'ordine fisso deciso allo Step 1.2.
- Conferma a scheda strutturata a vista: serve il controllo dell'utente e rende visibile il campo vuoto (anti-invenzione).
- Campo vuoto = `(non specificata)`; normalizzazione leggera (riordina sì, traduci-in-CV no); tre esiti disponibili ma non recitati (invito aperto, meccanica nel prompt).
- Patto esplicito in tutti i turni ripetibili: il meccanismo va spiegato la prima volta che compare, non la seconda.
- "Una alla volta": invito gentile nel testo + regola di prompt (l'AI lavora la prima voce, le altre rientrano dal "altro o procediamo?").

💡 *Mia intuizione / scelta ragionata* — L'insidia anti-invenzione è opposta nei due turni-esperienza: gonfiamento nelle formali, "suggerire troppo" nelle informali. Per questo negli esempi delle informali uso categorie larghe (aiutare un familiare, dare una mano in associazioni) invece di attività specifiche: invitare senza imboccare.

💡 *Mia intuizione / scelta ragionata* — Far raccontare una esperienza alla volta non è un limite tecnico dell'AI (saprebbe separarle), ma una scelta di togliere margine di interpretazione, e quindi di invenzione. Stessa logica della cernita studi/lavori: orientare l'utente serve a tenere l'LLM sui fatti.

### Step 1.4 — Turni competenze e formazione (MVP)

Competenze e formazione meritano un passo dedicato, separato dagli altri turni del dialogo. La ragione è il vincolo anti-invenzione: il turno delle competenze è il punto più esposto al rischio di gonfiamento dell'intero dialogo. Chiedere "che competenze hai?" a freddo invita l'utente a vendersi e l'AI a incassare abilità generiche mai dimostrate. Per questo ho scelto di non trattarlo in fretta in coda agli altri turni, ma di dedicargli (insieme a formazione, l'ultimo turno rimasto) uno step a sé, da progettare con cura particolare.

**Cosa ho fatto**
Ho progettato gli ultimi due turni del dialogo, competenze e formazione. Con questo l'anello 1 (raccolta del profilo via dialogo guidato) è completo a livello di testi. Competenze: turno ad ancoraggio leggero (è l'utente a dichiararle, non l'AI a proporle), con raccolta in blocco e una conferma anti-dimenticanza a un giro. Formazione: ricalco del turno esperienze formali, più la chiusura del dialogo, che mostra un riepilogo del profilo e ribadisce un'ultima volta il vincolo anti-invenzione.

**Cosa ho imparato**
Che non tutti i turni "ripetibili" sono uguali: le competenze hanno una meccanica diversa (raccolta in blocco invece che una voce alla volta) perché il campo è una lista di stringhe, non di oggetti ricchi come le esperienze. La struttura del turno deve seguire la natura del dato, non un unico stampo. E che il vincolo "un profilo, molti CV" ha conseguenze pratiche fin dentro la frase di chiusura: mi ha costretto a rinunciare al "CV neutrale" e scegliere un riepilogo.

**Dove ho faticato / cosa non era ovvio**
Due punti. Primo: volevo far generare a fine dialogo un "CV neutrale" da usare come base per i CV personalizzati. Sembrava utile, ma sfondava il principio "un profilo, molti CV" — un CV è un output, non una sorgente. Ci ho ragionato e ho capito che quello che cercavo davvero era un modo di vedere il risultato concreto, e per quello basta un riepilogo del profilo. Secondo: avevo aperto le competenze con "ultima cosa", ma non era l'ultima — mancava la formazione. Una promessa sbagliata all'utente, corretta solo perché mi sono fermato a guardare la frase nella sua posizione reale.

**Cosa ho deciso e perché**
- Ancoraggio leggero per le competenze (non forte): l'AI non propone competenze a partire dalle esperienze, le dichiara l'utente. Più snello per l'MVP e più fedele all'anti-invenzione (l'AI che propone è l'AI che inventa).
- Raccolta in blocco per le competenze: imposta dalla natura del campo (stringhe brevi), evita un ping-pong assurdo di conferme una alla volta.
- Niente CV neutrale, ma riepilogo del profilo: rispetta "un profilo, molti CV" e non anticipa l'anello 4 (generazione).
- Formazione come ricalco delle esperienze formali: nessuna logica nuova, rischio invenzione basso perché un titolo di studio è un fatto verificabile.

💡 *Mia intuizione / scelta ragionata* — La forma di un turno deve seguire la natura del suo campo. Competenze (lista di stringhe) → raccolta in blocco; esperienze e formazione (liste di oggetti) → una voce alla volta. Non ho forzato tutti i turni nello stesso stampo solo per coerenza apparente: la coerenza vera è di funzione, non di forma.

💡 *Mia intuizione / scelta ragionata* — Il riepilogo del profilo al posto del CV neutrale non è solo una rinuncia per rispettare un principio: è una scelta migliore. Dà all'utente lo stesso senso di concretezza ("ecco cosa ho costruito"), ma fa anche intuire che il valore vero dell'app viene dopo — allineare il proprio profilo a un annuncio specifico. Un CV finito alla fine del dialogo avrebbe "chiuso"; il riepilogo apre.

### Step 1.5 — Primo gesto implementativo: rete di sicurezza per la chiave (.gitignore)

*Aperta la parte implementativa della Fase 1. Primo "codice" messo nel repo: non una funzione, ma la protezione che viene prima di tutto il resto.*

**Cosa ho fatto**
Posato il primo mattone operativo del progetto: creato e committato il file `.gitignore` con due righe (`.env` e `node_modules/`). Prima di farlo ho deciso l'architettura con cui l'app userà la chiave API di Anthropic (fornita da Riccardo). Ho verificato ogni passaggio con i miei occhi — contenuto del file con `cat`, presenza e posizione con `ls -a`, commit con `git log` — invece di fidarmi di quanto dichiarava lo strumento.

**Cosa ho imparato**
- Esistono due "superfici" di esposizione diverse, che all'inizio confondevo: il *repository* su GitHub (il codice pubblico, la cronologia) e l'*app in esecuzione* (quello che il browser di un visitatore carica). Il `.gitignore` protegge la prima; l'architettura con l'aiutante Node protegge la seconda. Sono difese diverse per problemi diversi.
- L'ordine dei gesti conta: la rete di sicurezza va tesa *prima* che esista qualcosa da proteggere. Creando il `.gitignore` adesso, quando aggiungerò il `.env` con la chiave dentro Git lo ignorerà già — non ci sarà mai un istante in cui la chiave rischia di finire in un commit.
- La differenza tra i terminali del sistema: aprendo una scheda nuova mi si è presentato Windows PowerShell invece di Ubuntu, e i comandi non funzionavano. Sono due ambienti diversi; i comandi che uso (`ls -a`, `cat`, `git` così come li scrivo) vivono in Ubuntu.

**Dove ho faticato / cosa non era ovvio**
Aprire una scheda col `+` non dà Ubuntu ma il terminale di default (PowerShell), e da lì niente andava. Ho dovuto scegliere Ubuntu dal menu a tendina e poi spostarmi a mano dentro il repo con `cd`, perché la scheda nuova partiva dalla home dell'utente e non dalla cartella del progetto.

**Cosa ho deciso e perché**
- Architettura con aiutante Node (la chiave dietro un piccolo server locale, non esposta nel browser) invece della via più semplice (chiamata diretta dal browser): l'app è destinata a essere mostrata al pubblico, meglio nascere puliti che rattoppare dopo. Il costo (un pezzo Node in più) è piccolo, perché Node è già installato sulla macchina.
- `.gitignore` come primissimo gesto, prima di qualunque codice o chiave: la protezione prima dell'oggetto da proteggere.
- Delegato commit e push a Claude Code, ma a nome mio e con titolo/descrizione decisi da me: prima ho verificato l'identità Git locale (`mirco-parenti`) per assicurarmi che il commit uscisse a mio nome e non sotto l'account di Riccardo.

💡 *Mia intuizione / scelta ragionata* — Le due superfici di esposizione (repo vs app in esecuzione) sono il modo giusto per ragionare sulla sicurezza della chiave. Documentare tutto su GitHub, da solo, non bastava a giustificare l'aiutante Node: il repo era già protetto dal `.gitignore`. Quello che l'aiutante Node previene è un'altra cosa — la chiave visibile nel browser dell'app pubblicata. Capire *quale* problema sto risolvendo evita di scegliere una soluzione giusta per il motivo sbagliato.

💡 *Mia intuizione / scelta ragionata* — Delegare a Claude Code la *scrittura* di un commit è comodo, ma il confine è il *controllo*: leggere cosa sta per fare prima di confermare resta compito mio. Stavolta è filata liscia perché la posta era bassa (un file da due righe); quando i commit toccheranno codice vero, quel "leggo prima di confermare" sarà la rete vera, non un passaggio formale.

### Step 1.6 — Decisione di architettura a due fasi (HTML+Node → VB.NET) e allineamento del README

*Chiarita la rotta tecnologica del progetto e aggiornata la documentazione di conseguenza. Nessun codice scritto: è uno step di decisione e di messa in ordine.*

**Cosa ho fatto**
Deciso l'impianto tecnologico del progetto su due fasi: il prototipo (Fasi 1–2) usa un frontend in HTML più un aiutante locale in Node (utility temporanea che custodisce la chiave API e fa da tramite verso l'API LLM); in Fase 3, a prototipo consolidato, il progetto migrerà su un'unica applicazione VB.NET sotto Windows 11. Ho ristrutturato la sezione "Tecnologie previste" del `README.md` distinguendo le due fasi, allineato la fase 3 della roadmap (non più "backend Python" ma migrazione a VB.NET) e aggiunto una riga di copyright. Stabilita inoltre una regola sulla paternità dei commit.

**Cosa ho imparato**
- Il frontend e il "motore" sono pezzi staccabili, collegati solo da un'interfaccia (la coppia richiesta/risposta verso l'AI): posso sostituire il primo senza toccare il secondo. È questo che rende la migrazione possibile senza buttare il lavoro di valore.
- Una pagina HTML nel browser non può custodire un segreto: tutto ciò che la pagina "sa" è visibile a chi la apre. Per questo il prototipo ha bisogno dell'aiutante Node come custode della chiave. Un programma vero come VB.NET potrà invece tenere la chiave e chiamare l'API da sé, rendendo l'aiutante superfluo.
- Il valore del progetto (il dialogo guidato, i prompt, il vincolo anti-invenzione) vive sopra la tecnologia: non è né HTML né VB.NET, e migra intatto.

**Dove ho faticato / cosa non era ovvio**
Allo Step 1.5 avevo motivato la scelta dell'aiutante Node dicendo che "l'app è destinata a essere mostrata al pubblico". Ragionando sulla migrazione ho dovuto precisare quel ragionamento: la versione pubblica sarà quella VB.NET, mentre l'attuale frontend HTML + aiutante Node è impalcatura temporanea, pensata per girare in locale sul mio PC. Quindi oggi l'aiutante Node non serve "perché l'app è pubblica" (non lo è ancora), ma per un motivo più ristretto e tecnico: anche solo per provare le chiamate in locale, il browser non può tenere la chiave. Non ho riscritto lo Step 1.5: resta com'era, perché il diario deve mostrare come il pensiero è evoluto, non far finta di aver capito tutto subito.

**Cosa ho deciso e perché**
- Architettura a due fasi: HTML + aiutante Node per il prototipo (Fasi 1–2), VB.NET in Fase 3. La migrazione è collocata a prototipo consolidato, non subito: prima valido l'idea e i prompt con l'MVP nell'ambiente che ho già montato (WSL/Node), poi reimplemento nella tecnologia finale.
- Aiutante Node trattato come utility temporanea e usa-e-getta, non come materia di studio: lo configuro tramite Claude Code, non lo approfondisco riga per riga; alla migrazione sparisce. Mi basta sapere accenderlo e spegnerlo.
- README aggiornato in forma programmatica ("prevede"), non al presente ("usa"): documenta la decisione senza dichiarare pezzi che ancora non esistono.
- Paternità dei commit: i commit riportano esclusivamente la mia paternità (© 2026 Mirco Parenti), senza co-autorship di Claude se non richiesta esplicitamente.

💡 *Mia intuizione / scelta ragionata* — Trattare l'aiutante Node come "impalcatura da cantiere" è economia, non pigrizia: studiarne il codice sarebbe tempo sprecato, visto che alla migrazione verrà smontato. Metto l'attenzione dove resta valore (il dialogo), non dove verrà buttato.

💡 *Mia intuizione / scelta ragionata* — La migrazione HTML→VB.NET non mi spaventa più da quando ho capito il confine tra "faccia" e "motore": butterò solo il frontend HTML e l'aiutante Node, mentre il cuore del progetto (dialogo, prompt, schema, anti-invenzione) resta. Non butto via tutto, butto via l'impalcatura.

### Step 1.7 — Prima esecuzione reale: impalcatura e strutturazione dei turni

*Primo pezzo di progetto vivo: l'impalcatura per far girare la strutturazione con chiamata reale all'AI, e il collaudo dei turni sul campo.*

**Cosa ho fatto**
Delegato a Claude Code il montaggio dell'impalcatura Node.js (il server locale e il collegamento alla chiave API). Creato io il file `.env` con la chiave. Poi ho fatto girare i turni di strutturazione e li ho testati io, dalla test-page HTML. Ho lavorato su un branch parallelo (`step-2-prompt-router`); a fine lavoro ho fatto il merge in `main`, ho eliminato il branch usato e ho aperto un nuovo branch (`step-3-orchestrazione-frontend`) per procedere. Ora `main` è aggiornato e sono pronto sul nuovo branch.

**Cosa ho imparato / verificato**
- L'anti-invenzione tiene sul campo. L'ho messa alla prova io, scrivendo input volutamente sporchi e imprecisi, più volte: l'AI ha sempre strutturato solo ciò che avevo davvero detto, senza inventare, gonfiare o riempire i vuoti. Vedere la regola reggere su input reali è diverso dall'averla decisa a tavolino.
- La rete del `.gitignore` ha retto anche delegando il lavoro a Claude Code. Il file `.env` vive sul disco con la chiave dentro, ma Git non lo traccia (verificato: non compare tra i file versionati) perché il `.gitignore` lo esclude. Quindi la chiave non è mai entrata in un commit né è finita su GitHub: che il file esista sul disco non significa che Git lo veda.

**Dove ho faticato / cosa non era ovvio**
Avevo deciso di costruire solo il turno `nome`. Claude Code, in autonomia, ha realizzato tutti e cinque i turni — ma uno alla volta: prima di procedere con il turno successivo me lo sottoponeva, e io lo modificavo o lo confermavo. Lo scope è quindi cresciuto oltre il `nome` previsto, ma è rimasto sotto il mio controllo, turno per turno.

**Cosa ho deciso e perché**
- I prompt di strutturazione dei quattro turni diversi da `nome` restano per ora dentro `server.js`, in forma provvisoria: andranno in `prompt_design.md` solo una volta definitivi. Il design deve contenere i prompt finali, non le bozze di prova.
- Due rifiniture tecniche segnate come lavoro in arrivo: togliere il fence markdown che il modello a volte aggiunge attorno al JSON (le marcature di blocco-codice), così il programma può leggere il JSON pulito; e riportare i turni-lista a "una voce per turno", coerentemente con la struttura decisa agli Step 1.2–1.3.

💡 *Mia intuizione / scelta ragionata* — Delego l'esecuzione, non il controllo né le decisioni di design. Claude Code può scrivere il codice e proporre, ma cosa si costruisce, in che ordine e con quali scelte di fondo resta una mia responsabilità: il mio compito è guidare e leggere ciò che produce, non firmare a scatola chiusa.

💡 *Mia intuizione / scelta ragionata* — Il valore del progetto (i prompt, il dialogo) deve finire nel design una volta che è definitivo, non nel codice usa-e-getta che sto usando ora solo per testare e collaudare il processo. La test-page e l'aiutante Node sono impalcatura temporanea verso VB.NET; `prompt_design.md` è ciò che resta.

### Step 1.8 — Orchestrazione del dialogo nel front-end (anello 1 completo end-to-end)

*I cinque turni, prima isolati, ora si concatenano in un'unica conversazione che riempie il profilo. Primo anello della pipeline funzionalmente completo.*

**Cosa ho fatto**
Trasformato la test-page in un dialogo guidato vero. Ho fatto costruire i cinque turni dell'orchestrazione uno alla volta, decidendo io per ciascuno lo stile di raccolta dati (più campi per esperienze e formazione, stringa singola in lista per le competenze, ecc.), lo stile di ripetizione della domanda e il comportamento sui campi che l'IA non capisce (restano vuoti). Il dialogo parte dal nome, percorre i cinque turni nell'ordine fisso, mostra le schede di conferma, gestisce Sì/Correggi, fa il loop "altro o procediamo?", raccoglie le competenze in blocco e chiude con un riepilogo leggibile del profilo. Lavorato sul branch `step-3-orchestrazione-frontend` (commit `36e3ed6`); il merge in `main` lo faccio a step chiuso.

**Cosa ho imparato**
- La distinzione tra come il profilo *vive* e come lo *mostro*: dentro il programma il profilo è un oggetto JSON (formato tecnico, con graffe e virgolette); all'utente lo presento come riepilogo leggibile (box con etichette). Stesso dato, due forme — la stessa distinzione "nome tecnico vs testo visibile" dello Step 1.1, applicata all'intero profilo invece che al singolo campo.
- Concatenare turni che funzionano da soli non è automatico: serve uno "stato" unico (il profilo) che cresce di turno in turno e un motore che sa quale turno viene dopo. I turni isolati erano i mattoni; l'orchestrazione è la malta.

**Dove ho faticato / cosa non era ovvio**
Rispetto allo Step 1.7 ho tenuto un ritmo più stretto: invece di validare un blocco già fatto, ho fatto costruire e impostare ogni turno uno alla volta, decidendo io le opzioni di ciascuno prima di passare al successivo. È costato più tempo, ma mi ha tenuto il controllo del design — ho capito che con Claude Code il "uno alla volta" non è lentezza inutile, è il modo in cui resto io a decidere la forma.

**Cosa ho deciso e perché**
- Conferma in blocco confermata sul campo: se in un turno-lista racconto più voci insieme, la scheda le mostra tutte (un box per voce) e le confermo in un colpo solo, non una per una. Coerente con la natura dei campi-lista (Step 1.4).
- Riepilogo finale leggibile, non JSON grezzo: la chiusura mostra il profilo in forma umana (box con etichette, vuoti come `(non specificata)`). Chiude il "sospeso" dello Step 1.4 sul formato del riepilogo: il JSON resta forma interna (visibile in console per il debug), l'utente vede il riepilogo leggibile.
- Tre rifiniture lasciate fuori per scelta MVP: rimozione di singole competenze (c'è solo l'aggiunta), routing a linguaggio naturale (si usano i bottoni), editing campo-per-campo. Il design le prevede; le rimando.
- I quattro prompt di strutturazione diversi da `nome` restano provvisori in `server.js`: andranno in `prompt_design.md` solo da definitivi.

💡 *Mia intuizione / scelta ragionata* — L'anello 1 (raccolta del profilo via dialogo) è il pezzo distintivo e raro del progetto, ed è il primo a diventare funzionante end-to-end. Tenere il ritmo "un turno alla volta, decido io" proprio su questo anello è stato giusto: è il cuore originale di AI-CV-COACH, il punto dove non valeva la pena delegare le scelte di forma.

💡 *Mia intuizione / scelta ragionata* — Il riepilogo leggibile non è "il JSON vestito bene": è il confine tra il sistema e la persona. Il programma lavora in JSON perché gli serve preciso e confrontabile; l'utente vede il riepilogo perché gli serve comprensibile. Tenere le due forme separate è la stessa disciplina anti-invenzione di sempre — ogni cosa nel formato giusto per chi la usa.

### Step 1.9 — Allineamento della documentazione e maturazione nell'uso di Claude Code

*Step di consolidamento, senza nuove funzioni: ho riportato i prompt definitivi nel design e riordinato la documentazione. Il valore vero di questo passo, più che nel codice, sta nel modo in cui ho gestito Claude Code — e nel fatto che ormai lavoro quasi solo lì.*

**Cosa ho fatto**
Allineato `prompt_design.md` al codice già validato: portati i quattro prompt che vivevano solo in `server.js` dentro il documento di design, aggiornata la regola sui "più voci insieme" alla scelta presa allo Step 1.8 (estrai-tutte + conferma in blocco), e aggiunta la sezione "Problemi e mitigazioni" come elenco sintetico che rimanda al diario. Tutto su un branch dedicato, verificato e poi fuso in `main`.

**Cosa ho imparato — il passaggio da Claude (chat) a Claude Code**
All'inizio della Fase 1 avevo separato i ruoli: ragionare il design con Claude chat, poi costruire con Claude Code. In pratica i due ruoli si sono fusi: ormai progetto e implemento nello stesso posto, dentro Claude Code, che propone le scelte, mi fa le domande giuste e poi scrive. È più fluido — un filo solo invece di due — ma sposta tutto il peso del controllo su di me: devo leggere e approvare passo per passo, perché è sparita la "tappa di ragionamento" separata che prima faceva da filtro.

**Dove ho faticato / cosa non era ovvio**
Che Claude Code, se non lo sorvegli, "deriva". In questa sessione l'ho colto su due cose concrete: i messaggi di commit erano finiti in italiano invece che in inglese (la convenzione del mio repo) e portavano un co-autore "Claude" che non volevo. Le ho fatte correggere e ho fissato la regola. Lezione: delegare l'esecuzione non è delegare il controllo — e il controllo è reale solo quando becchi un errore vero, non quando fila tutto liscio.

**Cosa ho deciso e perché**
- Documentazione: `prompt_design.md` tiene i prompt **definitivi e aggiornati**, il diario tiene la **narrazione**; niente duplicati (i problemi già raccontati nel diario li ho solo richiamati nella nuova sezione, non riscritti).
- Commit: d'ora in poi **titolo e descrizione in inglese, solo paternità mia**; quelli già pubblicati li lascio come sono (riscrivere storia già su GitHub non vale il disturbo).
- Branch dedicato anche per sole modifiche di documentazione: stesso metodo degli step di codice, `main` resta sempre pubblicabile.

💡 *Mia intuizione / scelta ragionata* — La fusione dei due "Claude" in uno solo non cambia il mio ruolo: resto il regista. Anzi, lo rende più impegnativo, perché senza la tappa intermedia di Claude chat sono io l'unico filtro tra la proposta e il codice. Lavorare bene con Claude Code è meno "fare domande" e più "saper verificare".

💡 *Mia intuizione / scelta ragionata* — Far auto-verificare Claude Code (controlli automatici sui file, confronto prompt-codice carattere per carattere) è diventato parte del metodo: non mi fido di "fatto", chiedo la prova. È la versione operativa del "verifico con i miei occhi" dello Step 0.3.

### Step 1.10 — Anello 2: progettazione dell'analisi annuncio (schema, prompt e studio dello stato dell'arte)

*Primo passo del secondo anello della pipeline: dato il testo di un annuncio di lavoro, ricavarne una versione strutturata. Ho progettato schema e prompt da zero, poi ho studiato i migliori estrattori open-source per validare e affinare le mie scelte — imparando, non copiando.*

**Cosa ho fatto**
Progettato lo schema dell'annuncio e il prompt di estrazione, su un branch dedicato, in più tappe con un commit a ogni decisione chiusa. Poi ho fatto fare a Claude Code una ricerca mirata sui migliori estrattori open-source su GitHub, restringendo super-selettivamente fino al progetto più calzante (`amazon-science/job-posting-structure`), e ho usato le sue lezioni per affinare il nostro prompt — riscrivendo tutto con parole mie, mai copiando.

**Cosa ho imparato**
- La differenza tra "estrarre da file" (PDF, OCR, NER addestrato) e "strutturare testo con un prompt LLM": sono problemi diversi, e il nostro è il secondo. Questo ha cambiato quali progetti erano davvero rilevanti — i classici "resume parser" risolvono un problema che noi non abbiamo.
- Il principio idea/espressione del diritto d'autore: si possono assimilare i *concetti* altrui, non la loro forma. "Imparo, non incollo" non è solo etica, è anche il percorso legalmente sicuro (il copyright tutela l'espressione, non le idee).
- Validare le proprie scelte contro lo stato dell'arte dà fiducia: i tool migliori, indipendentemente da noi, fanno ciò che avevamo già deciso (required/preferred, "non menzionato → vuoto", scarto degli input che non sono annunci).

**Dove ho faticato / cosa non era ovvio**
- I "due secchi" di Amazon (requisiti `required` vs `preferred`) sembravano un upgrade, ma per il nostro caso erano un downgrade: perdono il terzo stato "non specificata" che a noi serve per non inventare. Capirlo non era ovvio.
- Tenere il filo lungo dello studio senza disperdermi: il panorama era pieno di progetti simili ma non centrati, e ho dovuto più volte chiedere di restringere ("super-selettivo") per arrivare a ciò che ci serviva davvero.

**Cosa ho deciso e perché**
- **Schema a due zone**: un *nucleo confrontabile* col profilo (`competenze_richieste`, `esperienza_richiesta`, `formazione_richiesta`) e dei *campi di contesto* (`titolo`, `sede`, `contratto`, `mansioni`, `benefit`). Il nucleo deve "rispecchiare" il profilo, perché è ciò che renderà possibile il match dell'anello 3.
- **Priorità a tre valori** (`richiesto` / `preferenziale` / `non specificata`), assegnata **solo se l'annuncio lo dichiara esplicitamente**; altrimenti `non specificata` (default sicuro, niente invenzione).
- **`contratto` come sotto-oggetto** (tipo, durata, orario, retribuzione), riempito solo per ciò che l'annuncio dichiara; **`sede` come lista** (un annuncio può avere più sedi); **`mansioni` e `benefit`** come campi di contesto distinti (cosa si farà vs extra oltre la paga).
- **Prompt unico per l'MVP**, non decomposto, ma diviso in **5 sezioni numerate** pensate come futuri sotto-prompt: la via decomposta (più prompt separati) è più potente ma avanzata, la rimando preparando però il terreno.
- **Tenere il nostro "priorità per-voce" invece dei "due secchi"**: i due secchi costringono a una scelta binaria che diventa invenzione quando l'annuncio non qualifica un requisito; il nostro modo, con tre stati, resta fedele. Ho però assimilato il *pensiero* dei due secchi come guida nel prompt ("ragiona a secchi") — il bene della loro idea senza la loro rigidità.
- **Anni di esperienza come ibrido**: `anni` come numero quando l'annuncio lo indica, `testo` sempre con la frase; e quando non serve esperienza l'output è la voce "Nessuna esperienza richiesta".
- **Niente flag booleani** (remote, full_time, ecc.): ridondanti con `sede`/`contratto`, sarebbero "pomposi". **Niente salary/wage separati**: è una distinzione USA; teniamo la retribuzione come la descrive l'annuncio.
- **Taxonomy mapping**: tecnica nuova trovata nello studio (mappare le skill su una tassonomia ESCO/O*NET). Potentissima per il **match (anello 3)**, ma in tensione con l'anti-invenzione in fase di estrazione → l'ho messa in memoria per riprenderla all'anello 3, con tanto di fonti.
- **Vincolo legale chiarito**: assimiliamo i concetti, non copiamo codice/testo/tassonomia altrui (`amazon-science/job-posting-structure` è CC BY-NC-SA, uso non commerciale).

💡 *Mia intuizione / scelta ragionata* — Validare *prima* di costruire: ho voluto cercare lo stato dell'arte prima di sfoderare le energie sull'implementazione, per non innamorarmi di una soluzione senza aver guardato come fanno i migliori. È costato tempo, ma mi ha dato sia conferme sia idee.

💡 *Mia intuizione / scelta ragionata* — Il design giusto dipende dall'uso, non dall'autorevolezza della fonte. Ho tenuto la nostra scelta contro quella di un colosso come Amazon perché il nostro contesto è opposto al loro: loro misurano statistiche su milioni di annunci (forzare in due secchi va bene), noi rappresentiamo fedelmente un singolo annuncio per un singolo utente (la fedeltà conta più della pulizia aggregata).

💡 *Mia intuizione / scelta ragionata* — Preparare il futuro senza pagarlo ora: prompt unico per l'MVP, ma a sezioni nette, così quando lo spezzetterò in più prompt separati la strada sarà già tracciata.

### Step 1.11 — Studio sul campo del miglior estrattore di annunci: validazioni e upgrade dei delimitatori

*Ho aperto il cofano del miglior estrattore di annunci open-source (`amazon-science/job-posting-structure`, che usa Claude Haiku come noi): prompt ed esempio reale input→output, per confrontarlo col nostro. Ne escono due conferme forti e un piccolo upgrade.*

**Cosa ho fatto**
Studiato in profondità il caso che avevo eletto migliore: ho fatto leggere a Claude Code il prompt di estrazione e l'esempio reale (annuncio Amazon "SDE II" → JSON estratto), e li ho confrontati col nostro prompt dell'annuncio. Niente copiato — solo concetti.

**Cosa ho imparato / verificato (le testimonianze)**
- **Validazione 1 — gli "anni" ibridi.** Il loro output rappresenta l'esperienza come numero ("3+ years" → 3): proprio la scelta che avevamo preso. Conferma.
- **Validazione 2 (la più importante) — il "leakage" dei due secchi.** Nell'annuncio Amazon il titolo di studio sta SOLO tra i requisiti *preferenziali*, ma nel loro JSON compare ANCHE tra gli *obbligatori* (e l'esperienza "3 anni" viene duplicata nei due secchi). La struttura a due secchi, costringendo a riempire i campi di entrambi, ha indotto il modello a **inventare/duplicare**. È la prova sul campo che la nostra scelta — priorità per-voce con il terzo stato `non specificata` — **evita un errore che persino un tool di livello-ricerca commette**.
- **Validazione 3 — le skill da tassonomia sono invenzione rispetto al testo.** Le `skills` nel loro output ("Mobile Development", "Leadership"…) non sono nell'annuncio: sono mappate da una tassonomia O*NET. Conferma che il taxonomy mapping va tenuto per il match (anello 3), non per l'estrazione.

**Cosa ho deciso e perché**
- **Integrato l'unico upgrade utile: i delimitatori a tag.** Avvolgo il testo dell'annuncio tra `<annuncio>` e `</annuncio>` e dico all'AI di trattare ciò che sta lì dentro solo come dato, mai come istruzioni. Più robusto del placeholder tra virgolette, e una piccola difesa contro testi-annuncio che provano a "parlare" al modello.
- **Confermato tutto il resto senza modifiche:** numeri (anni sì, salary no), niente flag booleani, distinzione mansioni/requisiti già presente, decomposizione e taxonomy/embedding rimandati (post-MVP / anello 3).

💡 *Mia intuizione / scelta ragionata* — Vedere un colosso sbagliare *proprio dove noi abbiamo scelto bene* vale più di mille conferme teoriche: il nostro design "povero" (per-voce, tre stati) batte il loro "ricco" (due secchi) sul nostro terreno, la fedeltà. Non è fortuna: è che abbiamo progettato per il nostro uso, non per il loro.

💡 *Mia intuizione / scelta ragionata* — Studiare lo stato dell'arte non serve solo a copiare il meglio: serve anche a capirne i limiti, e a riconoscere quando una nostra scelta è già superiore. Il valore vero di questo studio è stato più nelle conferme che nelle novità.

### Step 1.12 — Anello 2 dal design al codice: cablaggio, collaudo su annunci reali e la priorità "secondo il senso"

*Primo gesto implementativo dell'anello 2: ho portato il prompt dell'annuncio dal design al codice e l'ho provato su annunci veri. Dal collaudo è nata una rifinitura importante della priorità.*

**Cosa ho fatto**
Cablato il prompt `analisi_annuncio` nel server (registro `PROMPTS`), alzato `MAX_TOKENS` (l'output dell'annuncio è più lungo dei frammenti del profilo) e creato una piccola pagina di test (`test-annuncio.html`), senza toccare il dialogo (`index.html`). Poi ho incollato annunci reali e guardato cosa estrae.

**Cosa ho imparato — la priorità "secondo il senso"**
Sul campo è emerso il punto più interessante. All'inizio la regola era "priorità solo se esplicita, altrimenti `non specificata`". Ma un annuncio vero ("Cercasi Montatore Falegname con esperienza", "Titolo di studio: Scuola dell'obbligo") non *scrive* "obbligatorio" — eppure è **palese** che quei requisiti servono. Ho capito che la regola giusta è **comprendere il senso, non solo le parole**:
- se è palese che un requisito è obbligatorio → `richiesto` (anche senza la parola esplicita);
- se c'è un attenuante esplicito ("esperienza di basso livello", "anche minima", "gradito") → `preferenziale`;
- `non specificata` solo quando davvero non si capisce.
La differenza tra "con esperienza" (palese → `richiesto`) e "con esperienza di basso livello" (attenuante → `preferenziale`) è la presenza di un attenuante.

**Dove ho faticato / cosa non era ovvio**
La regola "astratta" non bastava: avevo scritto "in dubbio non marcare richiesto", ma il modello — giustamente — leggeva i requisiti palesi come obbligatori. Invece di forzarlo verso `preferenziale` (che sarebbe stato sbagliato), ho cambiato la regola per allinearla al senso. Lezione: a volte è la regola a doversi adeguare al buon senso del modello, non il contrario.

**Cosa ho deciso e perché**
- **La priorità si valuta dal senso, non solo dalla lettera** (vedi sopra). Tolto il "con esperienza" generico dai preferenziali.
- **Il prompt vive in due file** — `prompt_design.md` (design) e `server.js` (codice) — tenuti **identici carattere per carattere**, con verifica a ogni modifica. La nota-campo `priorita` invece sta solo nel design.
- **Collaudo prima di chiudere:** validato su due annunci, uno con requisiti *palesi* e uno con sezioni *esplicite* "Requisiti/Preferenziali" — entrambi corretti.
- **Campi futuri** (livello, settore) segnati come "da valutare" nel design, non aggiunti ora.

💡 *Mia intuizione / scelta ragionata* — "Comprendere il senso oltre il testo" non contraddice l'anti-invenzione: non aggiungo requisiti che non ci sono (quello resta vietato), ma *interpreto correttamente la priorità* di quelli che ci sono. Estrarre solo il vero, sì; ma del vero capirne il peso.

💡 *Mia intuizione / scelta ragionata* — Il collaudo su input reali vale più di mille regole a tavolino: la rifinitura della priorità non l'avrei trovata leggendo il prompt, l'ho vista solo guardando cosa usciva da un annuncio vero.

### Step 1.13 — Casi limite dal campo: precedenza testo-su-sezione e il campo "altri_requisiti"

*Due annunci reali hanno fatto emergere due limiti dell'estrazione, entrambi corretti: la priorità che si fa ingannare dalle sezioni, e i requisiti che non rientrano in nessuna delle tre dimensioni.*

**Cosa ho fatto**
Testati altri annunci reali e analizzato l'output voce per voce. Da un annuncio per contabile sono usciti due problemi, che ho sistemato nel prompt (in `prompt_design.md` e `server.js`, tenuti identici) e ri-validato sul campo.

**Cosa ho imparato / deciso — i due casi**
- **Precedenza del testo sulla sezione (priorità).** L'annuncio scriveva "PROFIS - plus la conoscenza" *fuori* da una sezione "Requisiti preferenziali" presente altrove. Il modello, fidandosi della struttura, l'aveva messo `richiesto`. Ma "plus" dice che è facoltativo → `preferenziale`. Ho aggiunto una **regola di precedenza**: il segnale testuale della singola voce vince sul contesto della sezione. E ho precisato che "plus" è solo *uno dei tanti* segnali: il modello deve riconoscere il senso ("vantaggio gradito ma non obbligatorio"), non spuntare parole da una lista chiusa. Più un esempio concreto (PROFIS) nel prompt.
- **Il nuovo campo `altri_requisiti`.** Lo stesso annuncio aveva, tra i preferenziali, "Domicilio in zona limitrofa allo Studio" — sparito dall'output, perché non è una competenza, un'esperienza o un titolo, e lo schema non aveva un posto per i requisiti di altra natura. Ho aggiunto `altri_requisiti` (lista di `{ testo, priorita }`) per domicilio, disponibilità (turni/weekend/trasferte), patente, automunito, età, iscrizione a un albo, idoneità: cose che il candidato deve soddisfare ma che non si confrontano col profilo.

**Dove ho faticato / cosa non era ovvio**
Il secondo problema non l'avevo notato a occhio: l'ho trovato applicando il **riflesso anti-omissione** che avevamo deciso ("a ogni controllo chiediti: sto dimenticando qualcosa?"). Confrontando l'output con l'annuncio riga per riga, è saltato fuori che un requisito esplicito era stato silenziosamente scartato. Quel riflesso non è formalità: trova cose vere.

**Cosa ho deciso e perché**
- Priorità: il **senso e il testo della singola voce** vengono prima della sezione; "plus"/attenuanti riconosciuti per significato, non per parole esatte.
- Schema: quattro tipi di requisito (i tre confrontabili + `altri_requisiti` non confrontabile), con la regola anti-duplicazione aggiornata.
- Validato sul campo: PROFIS → `preferenziale`, domicilio → `altri_requisiti`, nessuna regressione sui casi già buoni.

💡 *Mia intuizione / scelta ragionata* — Gli annunci veri sono una miniera di casi limite che a tavolino non immagini (un "plus" fuori posto, un domicilio tra i requisiti). Ogni annuncio nuovo affina la regola: la qualità del prompt si costruisce sul campo, un caso alla volta.

💡 *Mia intuizione / scelta ragionata* — "Comprendere il senso oltre il testo" e "verificare anche testualmente" non si contraddicono: vanno insieme. Leggo il significato (PROFIS è un plus → facoltativo) e insieme controllo che nessuna parola dell'annuncio sia andata persa (il domicilio). Senso e letteralità, non l'uno o l'altro.

### Step 1.14 — `altri_requisiti` è confrontabile: relabel e profilo da estendere

*Ripensandoci: i requisiti di `altri_requisiti` (domicilio, patente, disponibilità…) sono eccome confrontabili col candidato. L'avevo etichettato "non confrontabile" troppo in fretta — il limite è il profilo, non l'annuncio.*

**Cosa ho deciso e perché**
Allo Step 1.13 avevo introdotto `altri_requisiti` chiamandolo "non confrontabile col profilo". Era una semplificazione sbagliata: domicilio, patente, automunito, disponibilità sono spesso paletti veri ed è esattamente ciò che vuoi confrontare col candidato ("automunito richiesto" → ce l'ha?). Il vero limite non è l'annuncio, ma il **profilo**, che oggi non cattura questi dati. Ho quindi rietichettato `altri_requisiti` come **confrontabile** (in `prompt_design.md` e `server.js`, tenuti in sync), con la nota che il profilo va esteso per supportarlo. L'estrazione non cambia: cambia il significato che gli diamo.

**Cosa rimando (e perché)**
L'estensione del profilo — una sezione per domicilio, patente, disponibilità, automunito, ecc., a specchio di `altri_requisiti` — la farò **nell'anello 3 (match)**, quando servirà davvero per il confronto. Da fare con la solita anti-invenzione e con un occhio alla sensibilità dei dati personali (domicilio, età).

💡 *Mia intuizione / scelta ragionata* — "Non confrontabile" non era una proprietà dell'annuncio, era una mancanza del mio profilo. Distinguere "il dato non è matchabile" da "non ho ancora dove confrontarlo" evita di chiudere porte che sono solo da aprire più avanti.

### Step 1.15 — Avvio anello 3: il match semantico lo fa l'LLM, non una tassonomia

*Aperto il terzo anello (confronto profilo↔annuncio + punteggio). La prima decisione di fondo: come gestire il "stessa competenza, parole diverse".*

**Cosa ho deciso e perché**
Il match deve risolvere il problema "stessa competenza, parole diverse" ("me la cavo alla cassa" deve combaciare con "uso del registratore di cassa"). Avevo in tasca il **taxonomy mapping** (mappare le skill su una tassonomia standard ESCO/O*NET). Ma ho deciso di **delegare il matching semantico all'LLM** invece di integrare una tassonomia esterna, per tre motivi:
- l'LLM **capisce il contesto e qualunque fraseggio**, incluso il linguaggio informale dei nostri utenti, dove una tassonomia "professionale" arranca;
- una tassonomia/embedding è **rigida** (limitata dalla sua copertura);
- integrarla davvero sarebbe un **detour fuori dal nostro stack** (Node + Claude; ESCO/O*NET è roba Python/ML/dati), per giunta in parte usa-e-getta verso VB.NET.
La tassonomia formale resta un **raffinamento futuro** (categorie standardizzate, utili per statistiche su grandi volumi, non per il singolo match).

**Cosa ho imparato**
Che a volte la soluzione "più semplice" è anche **più affidabile** per il nostro caso: delegare la comprensione all'LLM batte una lista di embedding preimpostata, perché si adatta. Con un'accortezza: l'LLM può **sovra-matchare** (giudicare equivalenti cose che non lo sono). Per questo l'anti-invenzione vale anche nel match — l'LLM deve **giustificare** ogni giudizio, con granularità *soddisfatto / in parte / non soddisfatto*, ancorato al testo reale del profilo; e il punteggio resta **orientativo** (famiglia A, scelta dello Step 0.5).

**Cosa ho fatto**
Registrata la decisione nella sezione "Confronto profilo-annuncio" di `prompt_design.md` e aggiornata la nota di memoria sul taxonomy mapping. Scopo MVP: confronto sulle tre dimensioni confrontabili (competenze, esperienza, formazione); `altri_requisiti` (richiede l'estensione del profilo) e la tassonomia formale rimandati. Il prompt di confronto e il calcolo del punteggio sono il prossimo passo.

💡 *Mia intuizione / scelta ragionata* — Non confondere lo strumento con l'obiettivo. L'obiettivo era "match robusto sui sinonimi", non "usare ESCO/O*NET". Visto che l'LLM raggiunge l'obiettivo da solo, la tassonomia esterna diventa un costo senza un beneficio che oggi mi serve.

💡 *Mia intuizione / scelta ragionata* — L'anti-invenzione non riguarda solo l'estrazione: vale anche nel match. Un LLM che "decide" che due cose combaciano può inventare un'equivalenza che non c'è. Per questo gli chiederò di giustificare ogni giudizio e lo ancorerò al testo del profilo: anche *giudicare*, non solo estrarre, deve restare fedele ai fatti.

### Step 1.16 — Il motore del confronto: due giri (LLM → codice) e la formula del punteggio

*Progettato per intero il cuore dell'anello 3: come LLM e codice si dividono il lavoro nel match, e come nasce il punteggio. Niente codice ancora — prima il ragionamento, come sempre.*

**Cosa ho fatto**
Disegnato l'architettura del confronto e la formula del punteggio, fissandole nella sezione "Confronto profilo-annuncio" di `prompt_design.md`. Allineato `altri_requisiti` come pienamente confrontabile in tutti i file (intro schema, prompt, nota campo, `server.js` — sync verificato) e aggiornata la nota di memoria.

**Cosa ho deciso e perché**
- **Due giri in sequenza stretta.** *Giro 1 — LLM (controllo generale)*: da solo e prima, sui **due JSON già estratti** (profilo dell'anello 1 + annuncio dell'anello 2 — **non** i testi grezzi); ragiona con senso e logica su tutto e consegna il lavoro finito: giudizi per-requisito (`soddisfatto / in parte / non soddisfatto` + spiegazione, confrontati contro il **profilo intero**), una lettura d'insieme e un **suo numero complessivo**. *Giro 2 — Codice*: solo dopo, prende quell'output e produce il punteggio. Mai il contrario, mai in parallelo.
- **Ibrido: l'LLM comprende, il codice rende consistente.** L'LLM fa ciò che sa fare (cogliere equivalenze, contesto, senso); il codice fa ciò che sa fare (sommare in modo deterministico e trasparente). Così il punteggio eredita solo la variabilità dei giudizi a stati discreti, non quella di un numero "a sensazione".
- **`altri_requisiti` dentro al nucleo confrontabile, pari importanza.** Corretto rispetto allo Step 1.15 (dove l'avevo rimandato dall'MVP): domicilio, patente, automunito sono spesso **paletti decisivi**, quindi pesano come gli altri tre. L'estensione del profilo a specchio diventa un raffinamento futuro, **non** un prerequisito al match.
- **La formula.** Punti per esito `1 / 0.5 / 0`; peso per priorità `richiesto 5 / preferenziale 1`; le voci `non specificata` le pesa l'**LLM caso per caso** (importanza `alta 5 / media 3 / bassa 1`, col 3 come fallback dell'incertezza vera). La categoria non pesa, le quattro del nucleo sono pari. `score_base` deterministico dai giudizi; poi si **fonde** il numero dell'LLM come correzione **limitata**: `clamp(−20, +10)`. Il **contesto** entra anch'esso nel voto, ma pesa **1/5** del nucleo (Mirco ha voluto considerarlo). E un **quarto esito**, `non determinabile` — per ciò che non si può dire o che non si "soddisfa" (un benefit offerto, le condizioni di contratto, un dato assente dal profilo) — viene **escluso dal conteggio**, per non inventare un verdetto.

**Dove ho faticato / cosa non era ovvio**
Sul peso di `altri_requisiti` ho sbagliato direzione: l'avevo messo a "pesa meno" del nucleo, e Mirco mi ha corretto — è di **prioritaria importanza** (un "automunito richiesto" può escluderti). Bonificato ovunque. Lì ho anche capito che la differenza di peso la deve fare la **priorità** (richiesto vs preferenziale), non la categoria.

**Cosa rimando (e perché)**
Il **prompt del Giro 1** e lo **schema di output** sono ora scritti in `prompt_design.md` (5 sezioni, 4 esiti). Resta il **cablaggio in `server.js`** con un **nuovo endpoint** (qui gli input sono due, non il singolo `{turno, risposta}`) e una pagina di test, più il codice del Giro 2 (la formula). L'estensione del profilo a specchio di `altri_requisiti`. E un **limite noto**: un requisito *davvero* squalificante non azzera il punteggio (tetto −20) — trattarlo come paletto rigido è un raffinamento futuro, segnalato per non nasconderlo.

💡 *Mia intuizione / scelta ragionata* — Dividere "chi giudica" da "chi conta" risolve il vecchio limite della famiglia A (il voto incoerente): l'LLM porta la comprensione, il codice porta la riproducibilità. Stessi giudizi → stesso punteggio.

💡 *Mia intuizione / scelta ragionata* — L'asimmetria `−20 / +10` è l'anti-invenzione messa in numeri: l'AI è libera di **abbassare** il match quando fiuta un paletto (sicuro), ma può **alzarlo** solo di poco (gonfiare è il rischio). E quando il clamp taglia, lo **mostriamo**: il dissenso forte diventa una nota, non sparisce nella matematica.

💡 *Mia intuizione / scelta ragionata* — Il confronto lavora su **strutturato ↔ strutturato**, mai su testo grezzo. L'estrazione (con i suoi anticorpi) ha già fatto il suo lavoro: il match si fida dei dati puliti, costa meno token e non rischia di re-inventare rileggendo l'annuncio.

💡 *Mia intuizione / scelta ragionata* — Il quarto esito `non determinabile` (escluso dal conteggio) è anti-invenzione allo stato puro: di fronte a ciò che il profilo non dice, o a ciò che non è "soddisfacibile" (un benefit, una clausola di contratto), la risposta onesta è "non si sa" — e una cosa che non si sa non deve né premiare né punire il punteggio. Forzare un sì/no lì sarebbe inventare. Così il contesto può entrare nel voto senza sporcarlo di verdetti finti.

💡 *Mia intuizione / scelta ragionata* — Un peso fisso per i requisiti `non specificata` (il "3 piatto") buttava via ciò che l'LLM sa già fare: capire che, per un cuoco, un "HACCP" buttato lì conta e un "Photoshop" buttato lì no. Mirco ha posto la condizione giusta: il 3 non è una scorciatoia — l'LLM deve prima *ragionare sull'intenzione* della frase (non fermarsi al testo), e solo se davvero non la coglie ripiega su "media". È di nuovo la nostra bussola: in estrazione si resta fedeli al testo, ma nel match si comprende il senso — e qui pesare un requisito ambiguo È comprendere il senso.

### Step 1.17 — Anello 3 in funzione: cablaggio, validazione sul campo e voto in stelle

*L'anello 3 smette di essere progetto su carta: lo cablo in `server.js`, lo provo su 9 combinazioni reali, e i test mi costringono a sistemare il punteggio. Alla fine il match diventa un voto in stelle.*

**Cosa ho fatto**
- Cablato il confronto in `server.js`: nuovo endpoint `POST /confronta` (due input: profilo + annuncio), il prompt del Giro 1 in sync col `prompt_design`, il Giro 2 (`calcolaMatch`) col calcolo deterministico, e la pagina `test-confronto.html`.
- Validato sul campo: 9 combinazioni (3 profili × 3 annunci) estratti dalle pipeline 1 e 2.
- Aggiunto il **passo finale**: il `finale` (0–100) diventa un voto in **stelle 0–5** (un decimale) — il match definitivo.

**Dove ho faticato / cosa il test ha rotto**
Il primo giro di validazione ha mostrato un punteggio **bimodale**: `score_base` o ~96 o 0, mai in mezzo, e tutti i match positivi appiattiti a ~76. Un profilo debole (Anna su un entry-level) prendeva **76 come** un magazziniere perfetto. Causa, trovata ispezionando i giudizi: l'LLM marcava le **lacune** del profilo come `non determinabile` (escluse dal conteggio) invece che `non soddisfatto` → le mancanze sparivano e la base si gonfiava.

**Cosa ho deciso e perché**
- **Confine `non soddisfatto` / `non determinabile` per-dimensione.** `non determinabile` = «non avevo modo di saperlo» (altri_requisiti non ancora raccolti, contesto lato-offerta, requisito dichiarato assente), NON «non l'ha detto». Una competenza/esperienza/formazione non dichiarata — dimensioni che raccogliamo apposta nel dialogo — è `non soddisfatto`. Ri-test: discriminazione tornata (Anna×entry 76 → 51).
- **Sentinel "Nessuna esperienza richiesta" escluso nel codice** (deterministico): l'LLM lo neutralizzava a intermittenza (una volta sì, una no). Spostato in `calcolaMatch` — non è un requisito da soddisfare. Anna×entry 51 → 15.
- **Clamp tenuto a −20/+10.** L'avevo messo in dubbio, ma sui dati post-fix fa il suo lavoro: àncora la base (ora onesta) e lascia all'AI un nudge bilanciato. I due casi in cui scatta tirano in direzioni opposte e vengono frenati bene (Giulia tenuta su a 72, Anna tenuta giù a 15); allargarlo peggiorerebbe uno dei due.
- **`altri_requisiti richiesto` → `non determinabile` è corretto, non un difetto.** La patente B di Marco non era ricavabile dai dati raccolti: tenerla `non determinabile` è l'anti-invenzione che volevamo (l'AI resta cauta sui match forti, e va bene). Estendere il profilo è un miglioramento futuro, non la toppa a un bug.

**Esito**
Colonna entry da `[76, 78, 76]` (piatta) a **`[3.6, 3.1, 0.8]`** stelle: buon fit > sovraqualificato-fuori-ruolo > debole. Mismatch a 0.3. Il sistema ora distingue la **qualità** del match, non solo match/non-match.

💡 *Mia intuizione / scelta ragionata* — "Prima il test, poi la valutazione." Far girare il sistema su casi veri ha trovato in cinque minuti un difetto che a tavolino non avevo visto: la base che satura. Nessuna quantità di ragionamento sostituisce un dato reale che ti contraddice.

💡 *Mia intuizione / scelta ragionata* — `non determinabile` faceva due lavori opposti ("non ho modo di saperlo" e "non l'ha detto") travestiti da uno. Separarli ha sbloccato tutto. Certi bug non sono nel codice ma in un concetto che porta due significati sotto la stessa etichetta.

💡 *Mia intuizione / scelta ragionata* — Avevo puntato il dito sul clamp; il colpevole era la base. I dati hanno detto "il clamp va bene", e gli ho creduto invece di toccarlo per forza. Rivedere non vuol dire per forza cambiare.

### Step 1.18 — Due modelli per due livelli di compito: Haiku per estrarre, Sonnet per ragionare

*Fin qui un solo modello (Haiku 4.5) faceva tutto. Lo sdoppio: i compiti meccanici restano su Haiku, il confronto semantico dell'anello 3 sale a Sonnet 4.6.*

**Cosa ho fatto**
- In `server.js` ho sostituito l'unica costante `MODEL` con due: `MODEL_SEMPLICE = "claude-haiku-4-5"` e `MODEL_RAGIONAMENTO = "claude-sonnet-4-6"`. La funzione `chiamaAnthropic` ora accetta il modello come terzo parametro (default Haiku).
- L'estrazione (anello 1 — turni del profilo; anello 2 — analisi annuncio) continua su Haiku. Il confronto (anello 3, `/confronta`) passa esplicitamente `MODEL_RAGIONAMENTO`.
- Allineata la documentazione: nota "Modelli usati" e richiamo inline nel Giro dell'LLM in `prompt_design.md`, riga "Tecnologie previste" nel `README.md`.

**Cosa ho deciso e perché**
- **Il modello segue la profondità del compito, non il contrario.** Estrarre nome/requisiti è un compito ristretto a output strutturato: Haiku è veloce ed economico e basta. Il match semantico — cogliere equivalenze ("me la cavo alla cassa" ↔ "uso del registratore di cassa"), pesare requisiti ambigui, leggere l'insieme — è ragionamento vero: lì Sonnet ripaga il costo maggiore.
- **Default = Haiku, ragionamento = scelta esplicita.** Il default del parametro è Haiku, così ogni nuovo turno di estrazione eredita il modello giusto senza interventi; Sonnet si attiva solo dove serve, passandolo a mano. Una sola leva da ricordare.

**Dove ho faticato / cosa non era ovvio**
Niente di tecnicamente difficile — un parametro e due costanti. Il punto vero era *dove* tracciare il confine: non "Sonnet ovunque per sicurezza" (costo e lentezza inutili sui compiti meccanici), ma neanche "Haiku ovunque per risparmio" (il match ne soffre). Il confine giusto coincide con quello che il progetto già traccia da sempre: estrazione vs comprensione.

💡 *Mia intuizione / scelta ragionata* — La stessa linea che separa "estrarre fedele al testo" da "comprendere il senso" (la bussola dell'anello 3) separa anche i due modelli. Non è una coincidenza: dove il compito cambia natura, cambia anche lo strumento giusto. Pagare Sonnet sull'estrazione sarebbe sprecare ragionamento dove serve solo precisione.
