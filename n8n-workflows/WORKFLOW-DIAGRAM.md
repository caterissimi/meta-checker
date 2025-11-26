# Diagramma di Flusso del Workflow n8n

## Visualizzazione Testuale del Workflow

```
┌─────────────────────┐
│  Manual Trigger     │  ← Avvio manuale del workflow
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Google Sheets       │  ← Legge tutte le righe con URL
│ Read URLs           │     dal foglio Google Sheets
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Loop Over URLs      │  ← Itera su ogni URL
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Fetch Page Content  │  ← Scarica HTML della pagina
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
┌─────────────────────┐  ┌──────────────────┐
│ Extract Page        │  │ Rate Limit       │
│ Content             │  │ Delay (1 sec)    │
└──────────┬──────────┘  └──────────────────┘
           │
           ▼
┌─────────────────────┐
│ Generate Meta Tags  │  ← Chiama Gemini AI per
│ with Gemini         │     generare meta tag ottimizzati
└──────────┬──────────┘
           │
           ├─────────────────┐
           │                 │
           ▼                 ▼
┌─────────────────────┐  ┌──────────────────┐
│ Parse AI Response   │  │ Check for Errors │
└──────────┬──────────┘  └─────────┬────────┘
           │                       │
           │◄──────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Update Google       │  ← Scrive Meta Title e
│ Sheets              │     Meta Description
└──────────┬──────────┘     nel foglio
           │
           │
           └──────────┐
                      │
                      ▼
           ┌─────────────────────┐
           │ Loop Over URLs      │  ← Torna al loop per
           └─────────────────────┘     processare il prossimo URL
```

## Dettaglio dei Dati in Ogni Fase

### 1. Google Sheets - Read URLs
**Output:**
```json
{
  "URL": "https://example.com/page",
  "__rowIndex": 1,
  "spreadsheetId": "abc123...",
  "sheetName": "Sheet1"
}
```

### 2. Fetch Page Content
**Output:**
```json
{
  "data": "<html>..contenuto HTML completo...</html>",
  "statusCode": 200,
  "headers": {...}
}
```

### 3. Extract Page Content
**Output:**
```json
{
  "url": "https://example.com/page",
  "rowIndex": 1,
  "pageContent": "Testo pulito estratto dalla pagina...",
  "currentTitle": "Titolo attuale della pagina",
  "currentDescription": "Meta description attuale"
}
```

### 4. Generate Meta Tags with Gemini
**Input al Gemini API:**
```
Analyze the following web page content and generate SEO-optimized meta title and meta description.

Page URL: https://example.com/page
Current Title: Titolo attuale
Current Meta Description: Description attuale

Page Content:
[Primi 3000 caratteri del contenuto]

Please provide:
1. An optimized meta title (max 60 characters)
2. An optimized meta description (max 160 characters)
```

**Output:**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "{\"optimizedTitle\":\"...\",\"optimizedDescription\":\"...\"}"
      }]
    }
  }]
}
```

### 5. Parse AI Response
**Output:**
```json
{
  "url": "https://example.com/page",
  "rowIndex": 1,
  "optimizedTitle": "Meta Title Ottimizzato SEO | Brand",
  "optimizedDescription": "Meta description ottimizzata che descrive il contenuto della pagina in modo coinvolgente e include le parole chiave principali."
}
```

### 6. Update Google Sheets
**Azione:**
Scrive nelle colonne B e C della riga corrispondente:
- Colonna B (Meta Title): "Meta Title Ottimizzato SEO | Brand"
- Colonna C (Meta Description): "Meta description ottimizzata..."

## Gestione degli Errori

Il workflow include gestione degli errori su più livelli:

1. **Fetch Page Content**: Se la pagina non è raggiungibile, il workflow salta all'URL successivo
2. **Check for Errors**: Verifica che la risposta di Gemini sia valida prima di processarla
3. **Rate Limit Delay**: Previene il rate limiting aggiungendo pause tra le richieste

## Performance e Limiti

- **Velocità**: ~5-10 secondi per URL (dipende dalla dimensione della pagina)
- **Rate Limiting**: 1 richiesta al secondo a Gemini API
- **Timeout**: 30 secondi per il download di ogni pagina
- **Contenuto analizzato**: Primi 3000 caratteri del testo della pagina

## Miglioramenti Futuri

Possibili estensioni del workflow:

1. **Analisi parole chiave**: Estrarre le parole chiave più rilevanti
2. **Controllo duplicati**: Verificare se meta tag simili esistono già per altre pagine
3. **Score SEO**: Assegnare un punteggio SEO a ogni meta tag generato
4. **Multilingua**: Generare meta tag in più lingue
5. **Notifiche**: Inviare email/Slack quando il workflow è completato
6. **Retry logic**: Riprovare automaticamente in caso di errori temporanei
