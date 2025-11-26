# Troubleshooting Guide - n8n SEO Meta Tag Generator

## Problema: Il workflow viene eseguito ma non aggiorna Google Sheets

### ✅ Soluzioni Implementate (Versione 2.0)

Il workflow è stato completamente rifatto per risolvere i problemi di aggiornamento. Ecco le correzioni applicate:

#### 1. **Nodo "Read Google Sheets" Corretto**
**Problema originale**: Usava `operation: "appendOrUpdate"` che NON legge i dati
**Soluzione**: Ora usa `operation: "read"` che legge correttamente tutte le righe

```json
"operation": "read"  // ✅ CORRETTO (prima era "appendOrUpdate" ❌)
```

#### 2. **Nodo "Update Google Sheets" Completamente Rifatto**
**Problema originale**: Configurazione sbagliata che non identificava le righe da aggiornare
**Soluzione**: Ora usa il metodo corretto con match sulla colonna URL

```json
{
  "operation": "update",
  "dataMode": "define",
  "columnToMatchOn": "URL",  // 🔑 Identifica la riga tramite URL
  "valueOfColumnToMatchOn": "={{ $('Extract Page Content').item.json.url }}",
  "fieldsUi": {
    "fieldValues": [
      {
        "column": "Meta Title",
        "fieldValue": "={{ $json.optimizedTitle }}"
      },
      {
        "column": "Meta Description",
        "fieldValue": "={{ $json.optimizedDescription }}"
      }
    ]
  }
}
```

#### 3. **Parsing JSON di Gemini Migliorato**
**Problema originale**: Gemini a volte restituisce JSON dentro markdown code blocks
**Soluzione**: Parsing robusto che rimuove markdown e gestisce errori

```javascript
// Rimuove ```json e ``` se presenti
const cleanText = text.replace(/```json\n?/g, '').replace(/```/g, '').trim();
parsed = JSON.parse(cleanText);
```

#### 4. **Struttura del Workflow Semplificata**
**Problema originale**: Loop complesso con `splitInBatches` causava problemi
**Soluzione**: Workflow lineare che processa automaticamente tutti gli items

```
Trigger → Read Sheets → Fetch Page → Extract → Gemini → Parse → Update → Wait
```

#### 5. **Nodi "Set" invece di "Code"**
**Problema originale**: Nodi Code possono avere problemi di compatibilità
**Soluzione**: Uso di nodi Set (più stabili) con expressions

---

## Come Verificare che il Workflow Funzioni

### Step 1: Verifica la Struttura del Google Sheets

Il tuo foglio DEVE avere esattamente questa struttura (case-sensitive):

| URL | Meta Title | Meta Description |
|-----|------------|------------------|
| https://example.com | | |

**Importante**:
- ✅ La colonna A deve chiamarsi **"URL"** (tutto maiuscolo)
- ✅ La colonna B deve chiamarsi **"Meta Title"** (con lo spazio)
- ✅ La colonna C deve chiamarsi **"Meta Description"** (con lo spazio)
- ✅ La prima riga (header) deve essere nella riga 1
- ✅ I dati devono iniziare dalla riga 2

### Step 2: Configura Correttamente i Nodi

#### Nodo "Read Google Sheets":
1. Seleziona il tuo foglio dal dropdown
2. Seleziona il nome del tab (default: "Sheet1")
3. Lascia "Range" vuoto (leggerà tutto)

#### Nodo "Generate Meta Tags with Gemini":
1. Nelle credenziali, seleziona **"Google PaLM API"** (non Google API generica)
2. Inserisci la tua Gemini API Key
3. Verifica che l'URL sia: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

#### Nodo "Update Google Sheets":
1. Verifica che `columnToMatchOn` sia **"URL"**
2. Verifica che le colonne siano **"Meta Title"** e **"Meta Description"**
3. Usa le STESSE credenziali del nodo Read

### Step 3: Testa con UN Singolo URL

Prima di processare molti URL:
1. Crea un foglio con UN SOLO URL di test
2. Esegui il workflow
3. Verifica che l'aggiornamento funzioni

### Step 4: Controlla l'Output di Ogni Nodo

In n8n, clicca su ogni nodo dopo l'esecuzione per vedere l'output:

1. **Read Google Sheets**: Deve mostrare tutte le righe con la colonna URL
2. **Fetch Page Content**: Deve mostrare l'HTML della pagina
3. **Extract Page Content**: Deve mostrare `url`, `pageContent`, `currentTitle`, ecc.
4. **Generate Meta Tags with Gemini**: Deve mostrare la risposta JSON di Gemini
5. **Parse AI Response**: Deve mostrare `optimizedTitle` e `optimizedDescription`
6. **Update Google Sheets**: Deve mostrare conferma aggiornamento

---

## Errori Comuni e Soluzioni

### ❌ Errore: "Column 'Meta Title' not found"

**Causa**: Il nome della colonna nel Google Sheets non corrisponde esattamente
**Soluzione**:
- Verifica che la colonna si chiami ESATTAMENTE "Meta Title" (con spazio, case-sensitive)
- NON usare "meta_title", "MetaTitle", "Meta title", ecc.

### ❌ Errore: "No matching row found for URL"

**Causa**: L'URL nel foglio non corrisponde all'URL processato
**Soluzione**:
- Verifica che gli URL siano identici (incluso http/https, trailing slash)
- Controlla l'output del nodo "Extract Page Content" per vedere quale URL sta usando

### ❌ Errore: "Failed to parse Gemini response"

**Causa**: Gemini ha restituito un formato non valido
**Soluzione**:
- Controlla l'output del nodo "Generate Meta Tags with Gemini"
- Verifica che la tua API Key sia valida e abbia credito
- Il nuovo parsing dovrebbe gestire questo automaticamente

### ❌ Errore: "Rate limit exceeded"

**Causa**: Troppe richieste troppo velocemente
**Soluzione**:
- Il workflow ora include un Wait di 2 secondi tra ogni URL
- Se necessario, aumenta il delay nel nodo "Wait"

### ❌ Le celle rimangono vuote

**Causa Possibile 1**: Le colonne nel Google Sheets non esistono
**Soluzione**: Crea manualmente le colonne "Meta Title" e "Meta Description"

**Causa Possibile 2**: Permessi insufficienti
**Soluzione**: Verifica che l'account Google usato abbia permessi di SCRITTURA sul foglio

**Causa Possibile 3**: Il nodo Update non trova la riga
**Soluzione**: Controlla l'output del nodo "Parse AI Response" - deve contenere `optimizedTitle` e `optimizedDescription`

---

## Debug Avanzato

### Verifica il JSON Body inviato a Gemini

Nel nodo "Generate Meta Tags with Gemini", controlla il `jsonBody`:

```javascript
{
  "contents": [{
    "parts": [{
      "text": "Analyze the following web page content..."
    }]
  }]
}
```

Deve essere un JSON valido. Se vedi `{{ $json.url }}` nell'output, significa che l'expression non si sta risolvendo.

### Verifica l'Update Operation

Nel nodo "Update Google Sheets", l'operation deve essere configurata così:

```
operation: "update"
dataMode: "define"
columnToMatchOn: "URL"
valueOfColumnToMatchOn: {{ $('Extract Page Content').item.json.url }}
```

Questo dice a n8n:
1. Trova la riga dove la colonna "URL" corrisponde al valore
2. Aggiorna le colonne "Meta Title" e "Meta Description" in quella riga

### Testa l'Update Manualmente

Per testare solo l'update senza tutto il workflow:
1. Aggiungi un nodo "Set" manuale prima di "Update Google Sheets"
2. Imposta manualmente dei valori di test:
   ```
   url: "https://example.com"
   optimizedTitle: "Test Title"
   optimizedDescription: "Test Description"
   ```
3. Esegui solo questo nodo → Update
4. Verifica che aggiorni il foglio

---

## Versione del Workflow

**Versione corrente**: 2.0
**Data rilascio**: 2025-11-26
**Cambiamenti principali**:
- ✅ Fixed read operation
- ✅ Fixed update operation con column matching
- ✅ Improved JSON parsing
- ✅ Simplified workflow structure
- ✅ Added italian language support for meta tags
- ✅ Better error handling

---

## Hai ancora problemi?

Se il workflow continua a non funzionare:

1. **Esporta l'execution log**:
   - In n8n, clicca su "Executions"
   - Trova l'esecuzione fallita
   - Scarica il JSON dell'esecuzione

2. **Verifica i permessi**:
   - L'account Google ha accesso in SCRITTURA al foglio?
   - La Gemini API Key è valida?

3. **Testa le API manualmente**:
   - Usa Postman o curl per testare la Gemini API
   - Verifica che la risposta sia un JSON valido

4. **Ricrea le credenziali**:
   - Elimina e ricrea le credenziali Google Sheets
   - Elimina e ricrea le credenziali Gemini API

5. **Controlla la versione di n8n**:
   - Il workflow è testato su n8n v1.0+
   - Alcune features potrebbero non funzionare su versioni precedenti
