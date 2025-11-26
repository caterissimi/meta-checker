<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Meta Tag SEO Optimizer

Un progetto completo per l'ottimizzazione dei meta tag SEO, disponibile sia come **web app interattiva** che come **automazione n8n**.

View your app in AI Studio: https://ai.studio/apps/drive/1EkK3R6sPGzFK2WwQJlzd6Ja_HkjdBXhx

## 🌟 Funzionalità

- ✅ **Web App**: Interfaccia React per ottimizzare meta tag in tempo reale
- ✅ **Automazione n8n**: Workflow per processare automaticamente centinaia di URL da Google Sheets
- ✅ **AI-Powered**: Utilizza Google Gemini per generare meta tag ottimizzati SEO
- ✅ **Preview SERP**: Visualizza come appaiono i tuoi meta tag nei risultati di ricerca
- ✅ **Contatore caratteri**: Assicura che i meta tag rispettino i limiti ottimali

## 🚀 Opzioni di Utilizzo

### Opzione 1: Web App Interattiva

Perfetta per ottimizzare meta tag uno alla volta con feedback immediato.

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

4. Apri il browser su `http://localhost:5173`

### Opzione 2: Automazione n8n

Perfetta per processare automaticamente centinaia di URL da un foglio Google Sheets.

**Cosa fa:**
- Legge un elenco di URL da Google Sheets
- Scarica e analizza il contenuto di ogni pagina
- Genera meta title e description ottimizzati SEO con Google Gemini AI
- Scrive automaticamente i risultati nel foglio Google Sheets

**Quick Start:**

1. Vai alla directory `n8n-workflows/`
2. Segui le istruzioni nel [README dell'automazione](./n8n-workflows/README.md)
3. Importa il workflow `seo-meta-generator.json` in n8n
4. Configura le tue credenziali Google Sheets e Gemini API
5. Esegui il workflow!

📚 **Documentazione completa**: [n8n-workflows/README.md](./n8n-workflows/README.md)

## 📊 Confronto tra le Opzioni

| Caratteristica | Web App | Automazione n8n |
|----------------|---------|-----------------|
| **Interfaccia** | Grafica interattiva | Workflow automatizzato |
| **Volume** | Singoli URL | Batch di centinaia di URL |
| **Feedback** | Tempo reale | Asincrono |
| **Preview SERP** | ✅ Sì | ❌ No |
| **Integrazione Google Sheets** | ❌ No | ✅ Sì |
| **Programmazione automatica** | ❌ No | ✅ Sì |
| **Ideale per** | Ottimizzazioni manuali e testing | Progetti con molti URL |

## 🛠️ Tecnologie Utilizzate

- **Frontend**: React 19, TypeScript, Vite
- **AI**: Google Gemini 2.0 Flash
- **Automation**: n8n Workflow Automation
- **Integrations**: Google Sheets API

## 📁 Struttura del Progetto

```
meta-checker/
├── components/          # Componenti React della web app
├── services/           # Servizi per chiamate API (Gemini)
├── n8n-workflows/      # Automazione n8n
│   ├── seo-meta-generator.json       # Workflow n8n
│   ├── README.md                      # Documentazione dettagliata
│   ├── WORKFLOW-DIAGRAM.md           # Diagramma di flusso
│   └── google-sheets-template.csv    # Template Google Sheets
├── App.tsx             # Componente principale React
├── index.tsx           # Entry point
└── package.json        # Dipendenze npm
```

## 🎯 Ottimizzazione SEO

Entrambe le soluzioni generano:
- **Meta Title**: Max 60 caratteri, con parole chiave primarie
- **Meta Description**: Max 160 caratteri, persuasiva e informativa

## 📝 Esempi

### Web App
```typescript
Input:
- Titolo: "Home Page"
- Description: "Welcome"

Output:
- Titolo ottimizzato: "Professional Web Design Services | YourBrand"
- Description ottimizzata: "Expert web design and development services. Transform your business with stunning, SEO-optimized websites. Get a free quote today!"
```

### Automazione n8n
```
Input (Google Sheets):
| URL                        | Meta Title | Meta Description |
|----------------------------|------------|------------------|
| https://example.com/about  |            |                  |

Output (dopo l'esecuzione):
| URL                        | Meta Title                          | Meta Description                    |
|----------------------------|-------------------------------------|-------------------------------------|
| https://example.com/about  | About Us - Leading Tech Company     | Discover our mission to revolutionize... |
```

## 🤝 Contributi

Contributi, issues e feature requests sono benvenuti!

## 📄 Licenza

Questo progetto è open source e disponibile per uso personale e commerciale.
