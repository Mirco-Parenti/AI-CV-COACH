
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

## Raccolta profilo utente — testi del dialogo (MVP)

Scheletro: ordine fisso, un argomento per turno, loop di conferma. Due tipi di turno: singolo (`nome`) e ripetibile (gli altri). I testi qui sotto sono bozze di lavoro: il fraseggio fine va calibrato nel contesto ("frasi visibili nel contesto").

### Turno `nome` (singolo)

Ciao!
Ti chiederò sia le esperienze formali (lavori, studi, corsi), sia quelle informali (cose fatte per amici, famiglia, passioni): contano entrambe, spesso è proprio l'insieme a fare la differenza in una candidatura.
Useremo le tue risposte — solo quelle — per preparare un CV e una lettera di presentazione su misura per un qualsiasi annuncio di lavoro che ti interessa.
Allora, per iniziare:

* Come ti chiami?

### Turno `esperienze_formali` (ripetibile)

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

### Turno `esperienze_informali` (ripetibile)

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

### Regole trasversali ai turni ripetibili (logica di prompt, non testo visibile)

1. **Campo vuoto** → mostrato come `(non specificata)`, mai riempito d'ufficio.
2. **Normalizzazione leggera**: l'AI riordina e ripulisce (toglie riempitivi, false partenze; mette il dato nel campo giusto), resta aderente alle parole dell'utente. Niente sinonimi "professionali", niente dettagli aggiunti. Conserva il "circa" se l'utente è incerto: non irrigidire un forse in un sì.
3. **Tre esiti** dopo la scheda (conferma / correggi un campo / ripeti): disponibili tutti, ma non recitati in un menu. Il testo è un invito aperto; la meccanica vive nel prompt.
4. **Più voci insieme**: se l'utente racconta più esperienze in un blocco, l'AI ne lavora una sola; le altre rientrano dal reminder "altro o procediamo?". Limite noto MVP: voci molto stringate elencate insieme possono perdersi (raffinamento futuro, parente di pending_questions).

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