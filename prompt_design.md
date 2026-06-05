# Prompt design – AI-CV-COACH

Questo documento raccoglie i prompt progettati e usati nello sviluppo di AI-CV-COACH.

## Obiettivo

Documentare come l'AI viene usata nelle diverse parti del sistema, mantenendo separati i compiti di analisi, confronto e generazione.

## Principi guida

- Non inventare informazioni non presenti nel profilo utente.
- Separare estrazione dati, valutazione match e generazione CV.
- Richiedere output strutturati quando possibile.
- Rendere verificabile ogni affermazione generata.
- Presentare il punteggio di match come orientativo.

## Struttura dati del profilo utente (schema MVP)

Lo schema dati del profilo e la base condivisa su cui poggia tutta la
pipeline. Tutti i prompt devono rispettare questa struttura come unico
formato di scambio interno.

### Schema JSON (vuoto)

```json
{
  "nome": "",
  "esperienze_formali": [],
  "esperienze_informali": [],
  "competenze": [],
  "formazione": []
}
```

### Schema JSON (con voci di esempio)

```json
{
  "nome": "Mario Rossi",
  "esperienze_formali": [
    {
      "ruolo": "Cameriere",
      "azienda": "Bar Centrale",
      "durata": "1 anno",
      "cosa_facevo": "Servizio ai tavoli e gestione cassa"
    }
  ],
  "esperienze_informali": [
    {
      "cosa_facevo": "Aiutavo mio zio idraulico durante le estati",
      "quando": "2018-2020, periodi estivi",
      "con_chi": "ditta artigiana di famiglia"
    }
  ],
  "competenze": [
    "Lavoro in team",
    "Uso registratore di cassa"
  ],
  "formazione": [
    {
      "titolo": "Diploma alberghiero",
      "istituto": "Istituto Cellini",
      "anno": "2022"
    }
  ]
}
```

### Note sui campi

- `nome` — stringa. Nome e cognome dell'utente.
- `esperienze_formali` — lista. Esperienze lavorative riconosciute con
  ruolo, azienda, durata e descrizione. I sotto-campi sono attesi ma non
  obbligatori: se un dato manca (es. la durata non e ricordata con
  precisione), si lascia vuoto, non si inventa.
- `esperienze_informali` — lista. Attivita non formali (lavoretti, aiuti
  in famiglia, volontariato, esperienze brevi). **Tutti i sotto-campi
  sono opzionali per scelta progettuale.** Per natura, queste esperienze
  non hanno sempre date precise o riferimenti formali.
- `competenze` — lista di stringhe. Abilita pratiche o trasversali
  dichiarate dall'utente.
- `formazione` — lista. Titoli di studio o corsi. Sotto-campi attesi
  ma non obbligatori.

### Regole d'uso (validi per tutti i prompt che leggono o scrivono il profilo)

1. Nessun sotto-campo va riempito con informazioni non fornite
   esplicitamente dall'utente. Se manca, resta vuoto.
2. Le `esperienze_informali` non vanno mai "promosse" a
   `esperienze_formali`, neanche se sembrano arricchibili. Sono di
   natura diversa.
3. L'AI non aggiunge competenze, esperienze o titoli che l'utente non
   ha menzionato, neanche se appaiono "implicite" o "plausibili".
4. L'output strutturato e sempre JSON valido conforme a questo schema.

### Da definire piu avanti

- Eventuali campi aggiuntivi (contatti, lingue, link) dopo aver visto
  l'MVP girare.
- Formulazione del "testo visibile all'utente" per le esperienze
  informali nei prompt di generazione CV (decisione rimandata al
  contesto giusto).

## Prompt previsti

### Raccolta profilo utente

**Raccolta profilo utente — testi del dialogo (MVP)**

Scheletro: ordine fisso, un argomento per turno, loop di conferma. Due tipi di turno: singolo (`nome`) e ripetibile (gli altri). I testi qui sotto sono bozze di lavoro: il fraseggio fine va calibrato nel contesto ("frasi visibili nel contesto").

#### Turno `nome` (singolo)

**Testo visibile (turno singolo):**

Ciao!
Ti chiederò sia le esperienze formali (lavori, studi, corsi), sia quelle informali (cose fatte per amici, famiglia, passioni): contano entrambe, spesso è proprio l'insieme a fare la differenza in una candidatura.
Useremo le tue risposte — solo quelle — per preparare un CV e una lettera di presentazione su misura per un qualsiasi annuncio di lavoro che ti interessa.
Allora, per iniziare:

* Come ti chiami?

**Prompt di strutturazione (logica di prompt):**

Prompt inviato all'AI per ricavare il campo `nome` dalla risposta dell'utente. Il programma inserisce la risposta dell'utente al posto del segnaposto e invia il tutto all'AI, che risponde unicamente con il JSON.

```
Sei un assistente che struttura in formato JSON la risposta di un utente.
Il tuo compito in questo turno è ricavare SOLO il nome e cognome dell'utente dalla sua risposta.

Regole:
- Usa esclusivamente ciò che l'utente ha scritto. Non aggiungere, non correggere, non completare nulla.
- Se nella risposta non è presente un nome (l'utente rifiuta, divaga, o scrive qualcosa di confuso), lascia il campo vuoto.
- Non interpretare come nome parole che chiaramente non lo sono (es. un saluto, un verbo, una frase generica).
- Rispondi unicamente con il JSON richiesto, senza testo prima o dopo.

Formato della risposta:
{"nome": "<nome e cognome dell'utente, oppure stringa vuota>"}

Risposta dell'utente:
"<qui il programma inserirà ciò che ha scritto l'utente>"
```

**Note specifiche del turno nome (logica di prompt):**

- **Output solo-frammento**: l'AI restituisce solo il pezzo che riguarda questo turno (`{"nome": "..."}`), non l'intero profilo. È il programma a unire il frammento al profilo. Compito ristretto = meno spazio per inventare, e la "memoria" del profilo vive nel codice, non nel modello.
- **Uscita sempre in JSON**, anche per un singolo campo: il programma deve poter leggere la risposta in modo inequivocabile. È lo stampo riusato nei turni ricchi (esperienze, formazione), dove il frammento avrà più campi.
- **Vuoto, non indovinato**: se la risposta non contiene un nome, il campo resta vuoto (`{"nome": ""}`). Applicazione del "default sicuro" al primo campo; il vuoto verrà gestito dalla scheda di conferma e, in futuro, da pending_questions.

#### Turno `esperienze_formali` (ripetibile)

**Apertura + patto:**

Partiamo dalle esperienze di lavoro vere e proprie: raccontamele con parole tue, come vengono. Gli studi e i corsi li vediamo dopo, con calma.
Procediamo un lavoro alla volta: tu me ne racconti uno, io ti mostro cosa ho capito e tu confermi o correggi, poi passiamo al successivo.

* Qual è il primo che ti viene in mente?

**Conferma (scheda a vista), esempio:**

Ecco cosa ho capito:
– Ruolo: cameriere
– Azienda: Bar Centrale
– Durata: (non specificata)
– Cosa facevo: servizio ai tavoli e cassa

Ho capito bene? Se c'è qualcosa da sistemare dimmelo, altrimenti andiamo avanti.

**Reminder-ponte (dopo la conferma) + riapertura:**

Perfetto, segnata.

* Hai un'altra esperienza di lavoro da raccontarmi, o procediamo?

(se l'utente ne ha un'altra → "Raccontami la prossima.")

**Prompt di strutturazione (logica di prompt):**

Prompt inviato all'AI per ricavare le voci di `esperienze_formali` dalla risposta dell'utente. Il programma inserisce la risposta al posto del segnaposto; l'AI risponde unicamente con il JSON (una lista di voci, eventualmente vuota).

```
Sei un assistente che struttura in formato JSON la risposta di un utente.
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
"<qui il programma inserirà ciò che ha scritto l'utente>"
```

#### Turno `esperienze_informali` (ripetibile)

**Apertura + patto:**

Raccontami ora le esperienze informali: cose che hai fatto senza che fossero un lavoro vero e proprio. Conta più di quanto pensi — aiutare un familiare con la sua attività, dare una mano in associazioni o eventi, occuparti di qualcosa per amici o vicini, coltivare una passione che ti ha insegnato qualcosa. Non c'è bisogno che sia "importante": raccontamela come viene.
Procediamo una esperienza alla volta: tu me ne racconti una, io ti mostro cosa ho capito e tu confermi o correggi, poi passiamo alla successiva.

* Ti viene in mente qualcosa del genere?

**Conferma (scheda a vista), esempio:**

Ecco cosa ho capito:
– Cosa facevi: aiutavo mio zio idraulico durante le estati
– Quando: (non specificata)
– Con chi: ditta artigiana di famiglia

Ho capito bene? Se c'è qualcosa da sistemare dimmelo, altrimenti andiamo avanti.

**Reminder-ponte + riapertura:** come nel turno formali, adattato.

**Prompt di strutturazione (logica di prompt):**

Prompt inviato all'AI per ricavare le voci di `esperienze_informali` dalla risposta dell'utente. Il programma inserisce la risposta al posto del segnaposto; l'AI risponde unicamente con il JSON (una lista di voci, eventualmente vuota).

```
Sei un assistente che struttura in formato JSON la risposta di un utente.
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
"<qui il programma inserirà ciò che ha scritto l'utente>"
```

#### Turno `competenze` (ripetibile, raccolta in blocco)

**Apertura + patto (ancoraggio leggero):**

Passiamo alle competenze, cioè le cose che sai fare.
Pensa a quello che mi hai raccontato finora — i lavori, le esperienze, le cose di cui ti sei occupato. Da tutto questo, cosa ti senti di saper fare? Anche cose pratiche e concrete, non per forza titoli o certificati.

* Cosa ti riesce bene?

**Conferma (scheda a lista nuda) + anti-dimenticanza, esempio:**

Ecco cosa ho capito — le cose che sai fare:
– Uso della cassa
– Rapporto con i clienti
– Essere ordinato

* Vuoi aggiungerne o eliminarne qualcuna, o confermiamo queste e passiamo all'ultimo campo, la formazione?

**Se l'utente aggiunge (un solo giro, poi si chiude), esempio:**

Perfetto, aggiungo "Lavoro in squadra". Allora le tue competenze sono queste:
– Uso della cassa
– Rapporto con i clienti
– Essere ordinato
– Lavoro in squadra

* Le confermiamo e andiamo avanti?

**Prompt di strutturazione (logica di prompt):**

Prompt inviato all'AI per ricavare le voci di `competenze` dalla risposta dell'utente. Il programma inserisce la risposta al posto del segnaposto; l'AI risponde unicamente con il JSON (una lista di stringhe, eventualmente vuota).

```
Sei un assistente che struttura in formato JSON la risposta di un utente.
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
"<qui il programma inserirà ciò che ha scritto l'utente>"
```

**Note specifiche del turno competenze (logica di prompt):**

- **Ancoraggio leggero**: la domanda riporta l'utente alle esperienze già raccontate, ma è l'utente a dichiarare le competenze. L'AI non propone competenze a partire dalle esperienze (sarebbe invenzione). L'ancoraggio forte resta possibile evoluzione futura, non MVP.
- **Raccolta in blocco**, non una alla volta: a differenza dei turni-esperienza (oggetti ricchi, una voce per turno), le competenze sono stringhe semplici e si raccolgono tutte insieme. L'AI separa le competenze elencate in voci distinte della lista, restando aderente alle parole dell'utente (separa sì, gonfia no). Nessun separatore imposto all'utente.
- **Conferma anti-dimenticanza a un giro**: dopo la scheda, l'AI chiede esplicitamente se aggiungere o eliminare. Se l'utente aggiunge, l'AI ri-mostra la lista aggiornata e chiude (non riapre un secondo giro). Se conferma, si procede.
- **Chiusura senza loop "altro?"**: a differenza dei turni-esperienza, il turno competenze non ha il loop "altro o procediamo?", perché la molteplicità è già gestita dentro la conferma in blocco. (Asimmetria voluta, conseguenza della natura diversa del campo.)
- **Normalizzazione leggera** (come gli altri turni, qui ancora più importante): "me la cavo alla cassa" → "Uso della cassa", mai "gestione transazioni e contante". La tentazione di tradurre-in-CV è massima sulle competenze: si resta aderenti alle parole dell'utente.

#### Turno `formazione` (ripetibile)

*Ultimo turno del dialogo. Eredita l'impianto del turno `esperienze_formali` (lista di oggetti con sotto-campi): scheda con etichette, una voce alla volta, normalizzazione leggera, campo vuoto = (non specificata). Rischio anti-invenzione basso: un titolo di studio è un fatto verificabile, non un'autovalutazione.*

**Apertura + patto:**

Siamo all'ultimo campo: gli studi e i corsi. Diplomi, qualifiche, corsi di formazione — tutto quello che hai studiato o imparato in modo strutturato.
Procediamo come prima, uno alla volta: tu me ne racconti uno, io ti mostro cosa ho capito e tu confermi o correggi.

* Qual è il primo che ti viene in mente?

**Conferma (scheda a vista), esempio:**

Ecco cosa ho capito:
– Titolo: Diploma alberghiero
– Istituto: Istituto Cellini
– Anno: (non specificata)

Ho capito bene? Se c'è qualcosa da sistemare dimmelo, altrimenti andiamo avanti.

**Reminder-ponte (dopo la conferma) + riapertura:**

Perfetto, segnata.

* Hai un'altra esperienza di studio o formazione, o abbiamo finito?

(se l'utente ne ha un'altra → "Raccontami la prossima.")

**Chiusura del dialogo (quando l'utente ha finito):**

Perfetto, abbiamo finito di costruire il tuo profilo.
Ecco un riepilogo di quello che ho raccolto:
(riepilogo leggibile del profilo: nome, esperienze formali e informali, competenze, formazione)
Userò soltanto queste informazioni — niente di inventato — per aiutarti a preparare CV e lettere su misura quando avrai un annuncio che ti interessa.

**Prompt di strutturazione (logica di prompt):**

Prompt inviato all'AI per ricavare le voci di `formazione` dalla risposta dell'utente. Il programma inserisce la risposta al posto del segnaposto; l'AI risponde unicamente con il JSON (una lista di voci, eventualmente vuota).

```
Sei un assistente che struttura in formato JSON la risposta di un utente.
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
"<qui il programma inserirà ciò che ha scritto l'utente>"
```

**Note specifiche del turno formazione (logica di prompt):**

- **Ricalco del turno esperienze formali**: stessa struttura a sotto-campi (titolo / istituto / anno), stessa meccanica (una voce alla volta, scheda con etichette, reminder-ponte "altro o procediamo?").
- **Turno finale**: a differenza degli altri, la chiusura non rimanda a un campo successivo ma chiude il dialogo. La chiusura mostra un **riepilogo leggibile del profilo** (non un CV: il CV è un output dell'anello 4, non un dato sorgente — vale il principio "un profilo, molti CV") e ribadisce un'ultima volta il vincolo anti-invenzione, richiamando il "solo quelle" del turno nome.
- **Sospeso**: il formato preciso del riepilogo leggibile (come rendere il profilo JSON in forma umana) è da decidere insieme all'interfaccia. La frase di chiusura è bozza grezza: la taratura fine va fatta quando si progetta l'anello annuncio→CV, per descrivere le potenzialità senza sovra-promettere.

#### Regole trasversali ai turni ripetibili (logica di prompt, non testo visibile)

1. **Campo vuoto** → mostrato come `(non specificata)`, mai riempito d'ufficio.
2. **Normalizzazione leggera**: l'AI riordina e ripulisce (toglie riempitivi, false partenze; mette il dato nel campo giusto), resta aderente alle parole dell'utente. Niente sinonimi "professionali", niente dettagli aggiunti. Conserva il "circa" se l'utente è incerto: non irrigidire un forse in un sì.
3. **Tre esiti** dopo la scheda (conferma / correggi un campo / ripeti): disponibili tutti, ma non recitati in un menu. Il testo è un invito aperto; la meccanica vive nel prompt.
4. **Più voci insieme**: se l'utente racconta più esperienze in un blocco, l'AI le estrae **tutte** (una voce della lista per ciascuna) e le presenta insieme, in **conferma in blocco**. *(Decisione dello Step 1.8: il prompt validato estrae tutte le voci. Supera l'impostazione iniziale dell'MVP — "l'AI ne lavora una sola, le altre rientrano dal reminder 'altro o procediamo?'" — che mirava a ridurre il margine di interpretazione.)* I **testi visibili** continuano a invitare l'utente a procedere con calma, una alla volta: l'invito resta, cambia solo la logica del prompt, ora capace di gestire più voci nella stessa risposta.

### Analisi annuncio di lavoro

Da definire.

### Confronto profilo-annuncio

Da definire.

### Generazione CV mirato

Da definire.

### Generazione lettera di presentazione

Da definire.

## Problemi e mitigazioni

Da compilare durante lo sviluppo.