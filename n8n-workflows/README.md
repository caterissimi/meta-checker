# Automazione n8n per SEO Meta Tag Generator

Questa directory contiene un workflow n8n completo per automatizzare la generazione di meta title e meta description ottimizzati SEO a partire da un elenco di URL in Google Sheets.

## 📋 Panoramica

Il workflow esegue i seguenti passaggi:
1. Legge un elenco di URL da un foglio Google Sheets
2. Per ogni URL, scarica il contenuto della pagina web
3. Estrae il testo principale e i meta tag esistenti
4. Utilizza Google Gemini AI per generare meta title e description ottimizzati SEO
5. Scrive i risultati ottimizzati nelle colonne corrispondenti del Google Sheets

## 🚀 Prerequisiti

- **n8n installato**: Puoi usare n8n cloud (https://n8n.io) o self-hosted
- **Google Sheets API**: Credenziali OAuth2 configurate in n8n
- **Google Gemini API Key**: Ottienila da https://aistudio.google.com/app/apikey
- **Un foglio Google Sheets** con la struttura corretta (vedi sotto)

## 📊 Struttura del Google Sheets

Il tuo foglio Google Sheets deve avere le seguenti colonne (la prima riga deve contenere le intestazioni):

| URL | Meta Title | Meta Description |
|-----|------------|------------------|
| https://example.com/page1 | | |
| https://example.com/page2 | | |
| https://example.com/page3 | | |

- **Colonna A (URL)**: Gli URL delle pagine da analizzare
- **Colonna B (Meta Title)**: Verrà popolata automaticamente con il meta title ottimizzato
- **Colonna C (Meta Description)**: Verrà popolata automaticamente con la meta description ottimizzata

## 🔧 Installazione e Configurazione

### 1. Importa il Workflow in n8n

1. Apri n8n
2. Vai su **Workflows** > **Import from File**
3. Seleziona il file `seo-meta-generator.json`
4. Il workflow verrà importato con tutti i nodi configurati

### 2. Configura le Credenziali Google Sheets

1. Clicca sul nodo **Google Sheets - Read URLs**
2. Clicca su **Create New Credential**
3. Seleziona **Google Sheets OAuth2 API**
4. Segui la procedura guidata per autenticare il tuo account Google
5. Assicurati di dare i permessi necessari per leggere e scrivere su Google Sheets

### 3. Configura le Credenziali Google Gemini API

1. Clicca sul nodo **Generate Meta Tags with Gemini**
2. Clicca su **Create New Credential**
3. Seleziona **Google API**
4. Inserisci la tua API Key di Gemini nel campo **API Key**
5. Salva le credenziali

### 4. Configura il Google Sheets

1. Nel nodo **Google Sheets - Read URLs**:
   - Seleziona il tuo foglio Google Sheets dal menu a tendina
   - Inserisci il nome del foglio (tab) da cui leggere i dati
   - Assicurati che la colonna URL sia nella colonna A

2. Il workflow leggerà automaticamente tutte le righe con URL

### 5. Test del Workflow

1. Assicurati di avere almeno un URL nel tuo Google Sheets
2. Clicca su **Execute Workflow** in n8n
3. Il workflow inizierà a processare gli URL uno per uno
4. Verifica che i risultati vengano scritti correttamente nel Google Sheets

## ⚙️ Come Funziona il Workflow

### Nodi del Workflow

1. **Manual Trigger**: Avvia il workflow manualmente

2. **Google Sheets - Read URLs**: Legge tutte le righe dal foglio Google Sheets

3. **Loop Over URLs**: Itera su ogni URL trovato nel foglio

4. **Fetch Page Content**: Scarica il contenuto HTML della pagina

5. **Extract Page Content**: Estrae il testo pulito dalla pagina HTML e i meta tag esistenti

6. **Generate Meta Tags with Gemini**: Chiama l'API Google Gemini per generare meta tag ottimizzati basati sul contenuto

7. **Parse AI Response**: Elabora la risposta di Gemini ed estrae i meta tag generati

8. **Update Google Sheets**: Aggiorna la riga corrispondente nel foglio con i nuovi meta tag

9. **Rate Limit Delay**: Introduce un ritardo di 1 secondo tra le richieste per evitare rate limiting

10. **Check for Errors**: Verifica eventuali errori nella generazione

### Logica di Elaborazione

Il workflow processa **un URL alla volta** in modo sequenziale. Questo approccio:
- Evita problemi di rate limiting con le API
- Permette di monitorare il progresso in tempo reale
- Gestisce meglio gli errori per singolo URL

## 🎯 Ottimizzazione SEO

Il workflow utilizza Google Gemini per analizzare il contenuto della pagina e generare:

- **Meta Title ottimizzato**:
  - Lunghezza massima: 60 caratteri
  - Include parole chiave primarie
  - È coinvolgente e descrittivo

- **Meta Description ottimizzata**:
  - Lunghezza massima: 160 caratteri
  - È persuasiva e invita al clic
  - Riassume accuratamente il contenuto della pagina

## 📝 Personalizzazione

### Modificare il Prompt di Gemini

Puoi personalizzare il prompt inviato a Gemini modificando il nodo **Generate Meta Tags with Gemini**:

1. Clicca sul nodo
2. Modifica il parametro **Body Parameters** > **contents**
3. Personalizza le istruzioni per ottenere risultati diversi

Esempio di personalizzazione:
```
Analizza il seguente contenuto della pagina web e genera meta tag ottimizzati SEO in italiano.

[Includi qui le tue istruzioni personalizzate]

Per esempio:
- Usa un tono formale/informale
- Concentrati su specifiche parole chiave
- Includi call-to-action specifiche
```

### Modificare la Struttura del Google Sheets

Se il tuo foglio ha una struttura diversa, puoi modificare:

1. **Nodo Google Sheets - Read URLs**: Cambia la colonna da cui leggere gli URL
2. **Nodo Update Google Sheets**: Cambia le colonne in cui scrivere i risultati

### Aggiungere Trigger Schedulati

Per eseguire il workflow automaticamente:

1. Elimina il nodo **Manual Trigger**
2. Aggiungi un nodo **Schedule Trigger**
3. Configura la frequenza desiderata (es. ogni giorno alle 9:00)
4. Salva e attiva il workflow

## 🐛 Risoluzione Problemi

### Errore: "Failed to parse Gemini response"

- Verifica che la tua API Key di Gemini sia corretta
- Controlla di avere credito disponibile sul tuo account Google Cloud
- Verifica che il modello `gemini-2.0-flash-exp` sia disponibile

### Errore: "Cannot read property 'URL' of undefined"

- Assicurati che la prima colonna del tuo Google Sheets si chiami esattamente "URL" (case-sensitive)
- Verifica che ci siano URL effettivi nella colonna

### Il workflow si ferma dopo alcuni URL

- Potrebbe essere un problema di rate limiting
- Aumenta il delay nel nodo **Rate Limit Delay** (da 1000ms a 2000ms o più)

### Meta tag non vengono scritti nel Google Sheets

- Verifica i permessi del tuo account Google per scrivere sul foglio
- Controlla che il nome del foglio (tab) sia corretto
- Verifica che le colonne "Meta Title" e "Meta Description" esistano

## 💡 Suggerimenti

1. **Test con pochi URL**: Prima di processare centinaia di URL, testa con 3-5 URL per verificare che tutto funzioni
2. **Backup del foglio**: Fai una copia del tuo Google Sheets prima di eseguire il workflow
3. **Monitora i costi**: L'API Gemini ha limiti gratuiti, monitora l'utilizzo su https://aistudio.google.com
4. **Batch processing**: Per molti URL, considera di processarli in batch separati

## 📚 Risorse Aggiuntive

- [Documentazione n8n](https://docs.n8n.io/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Gemini API](https://ai.google.dev/)
- [Best Practices SEO per Meta Tag](https://developers.google.com/search/docs/appearance/snippet)

## 🤝 Contributi

Per miglioramenti o segnalazioni di bug, apri una issue sul repository.

## 📄 Licenza

Questo workflow è fornito as-is per uso personale e commerciale.
