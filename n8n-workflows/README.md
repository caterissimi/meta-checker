# Automazione n8n per SEO Meta Tag Generator

**Versione 2.0** - Workflow corretto e funzionante ✅

Questa directory contiene un workflow n8n completo per automatizzare la generazione di meta title e meta description ottimizzati SEO a partire da un elenco di URL in Google Sheets.

## 🆕 Novità Versione 2.0

- ✅ **RISOLTO**: Il workflow ora aggiorna correttamente Google Sheets
- ✅ Nodo Read configurato correttamente con operation "read"
- ✅ Nodo Update usa column matching per identificare le righe
- ✅ Parsing JSON di Gemini migliorato (gestisce markdown code blocks)
- ✅ Workflow semplificato senza loop complessi
- ✅ Meta tag generati in **italiano**
- ✅ Gestione errori migliorata

📘 **Problemi?** Consulta la [Guida al Troubleshooting](./TROUBLESHOOTING.md)

## 📋 Panoramica

Il workflow esegue i seguenti passaggi:
1. Legge un elenco di URL da un foglio Google Sheets
2. Per ogni URL, scarica il contenuto della pagina web
3. Estrae il testo principale e i meta tag esistenti
4. Utilizza Google Gemini AI per generare meta title e description ottimizzati SEO **in italiano**
5. Scrive i risultati ottimizzati nelle colonne corrispondenti del Google Sheets tramite **match sulla colonna URL**

## 🚀 Prerequisiti

- **n8n installato**: Puoi usare n8n cloud (https://n8n.io) o self-hosted
- **Google Sheets API**: Credenziali OAuth2 configurate in n8n
- **Google Gemini API Key**: Ottienila da https://aistudio.google.com/app/apikey
- **Un foglio Google Sheets** con la struttura corretta (vedi sotto)

## 📊 Struttura del Google Sheets

⚠️ **IMPORTANTE**: La struttura deve essere ESATTAMENTE come indicato (case-sensitive!)

Il tuo foglio Google Sheets deve avere le seguenti colonne (la prima riga deve contenere le intestazioni):

| URL | Meta Title | Meta Description |
|-----|------------|------------------|
| https://example.com/page1 | | |
| https://example.com/page2 | | |
| https://example.com/page3 | | |

### ✅ Regole Critiche:

1. **Colonna A**: DEVE chiamarsi **"URL"** (tutto maiuscolo, case-sensitive)
2. **Colonna B**: DEVE chiamarsi **"Meta Title"** (con spazio, case-sensitive)
3. **Colonna C**: DEVE chiamarsi **"Meta Description"** (con spazio, case-sensitive)
4. **Prima riga**: Deve contenere gli header nella riga 1
5. **Dati**: Devono iniziare dalla riga 2

### ❌ Errori Comuni da Evitare:

- ❌ NON usare "url" (minuscolo) → Usa "URL"
- ❌ NON usare "MetaTitle" (senza spazio) → Usa "Meta Title"
- ❌ NON usare "meta_title" (underscore) → Usa "Meta Title"
- ❌ NON lasciare righe vuote tra header e dati

### 📥 Template Pronto

Usa il file `google-sheets-template.csv` per creare rapidamente il foglio con la struttura corretta:
1. Apri Google Sheets
2. File → Importa → Carica → Seleziona `google-sheets-template.csv`
3. Aggiungi i tuoi URL nella colonna A

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

⚠️ **IMPORTANTE**: Usa il tipo di credenziale corretto!

1. Clicca sul nodo **Generate Meta Tags with Gemini**
2. Clicca su **Create New Credential**
3. Seleziona **"Google PaLM API"** (NON "Google API" generica)
4. Inserisci la tua API Key di Gemini nel campo **API Key**
   - Ottieni la key da: https://aistudio.google.com/app/apikey
5. Salva le credenziali

**Nota**: Anche se si chiama "PaLM API", funziona con Gemini perché usano lo stesso endpoint.

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

## ⚙️ Come Funziona il Workflow (Versione 2.0)

### Nodi del Workflow

1. **When clicking 'Test workflow'**: Trigger manuale per avviare il workflow

2. **Read Google Sheets**: Legge TUTTE le righe dal foglio usando `operation: "read"`
   - Output: Array di oggetti con tutte le righe

3. **Fetch Page Content**: Scarica il contenuto HTML di ogni pagina
   - n8n processa automaticamente tutti gli items dall'output precedente
   - Timeout: 30 secondi per pagina
   - Continua anche se una pagina fallisce

4. **Extract Page Content**: Usa il nodo **Set** per estrarre:
   - URL della pagina
   - Numero di riga (per riferimento)
   - Testo pulito (primi 3000 caratteri)
   - Meta title corrente (se esiste)
   - Meta description corrente (se esiste)

5. **Generate Meta Tags with Gemini**: Chiama l'API Gemini
   - Usa il modello `gemini-2.0-flash-exp`
   - Genera meta tag **in italiano**
   - Formato richiesta: JSON corretto con `contents` array

6. **Parse AI Response**: Usa il nodo **Set** per estrarre:
   - Rimuove eventuali markdown code blocks (```json)
   - Estrae `optimizedTitle` e `optimizedDescription`
   - Gestisce errori di parsing

7. **Update Google Sheets**: Aggiorna il foglio usando **column matching**
   - `columnToMatchOn: "URL"` - identifica la riga tramite URL
   - Aggiorna solo le colonne "Meta Title" e "Meta Description"
   - Non modifica altre colonne

8. **Wait to avoid rate limiting**: Pausa di 2 secondi tra ogni URL
   - Previene errori "429 Too Many Requests"
   - Configurabile (aumenta se necessario)

### Logica di Elaborazione

Il workflow processa **automaticamente tutti gli URL** in sequenza:
- n8n passa automaticamente ogni item da un nodo all'altro
- Nessun loop manuale necessario
- Ogni URL viene processato completamente prima di passare al successivo
- Rate limiting gestito con Wait node

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

### ⚠️ Il workflow non aggiorna Google Sheets?

**Versione 2.0 ha risolto questo problema!** Se hai ancora problemi:

1. **Reimporta il workflow** - Usa il file `seo-meta-generator.json` aggiornato
2. **Verifica la struttura del Google Sheets** - Deve avere esattamente "URL", "Meta Title", "Meta Description"
3. **Controlla le credenziali** - Usa "Google PaLM API" per Gemini, non "Google API"

### 📘 Guida Completa al Troubleshooting

Per una guida dettagliata alla risoluzione di tutti i problemi, consulta:

👉 **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

Include:
- ✅ Tutte le correzioni implementate nella v2.0
- ✅ Come verificare che il workflow funzioni
- ✅ Errori comuni e soluzioni
- ✅ Debug avanzato
- ✅ Test manuali per isolare problemi

### Errori Rapidi

**"Column 'Meta Title' not found"**
- Verifica che la colonna si chiami ESATTAMENTE "Meta Title" (con spazio)

**"No matching row found for URL"**
- Controlla che gli URL siano identici (incluso http/https)

**"Failed to parse Gemini response"**
- Il nuovo parsing dovrebbe risolvere questo automaticamente
- Verifica che la tua API Key sia valida

**Celle rimangono vuote**
- Controlla l'output del nodo "Parse AI Response"
- Deve contenere `optimizedTitle` e `optimizedDescription`
- Verifica permessi di scrittura sul foglio

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
