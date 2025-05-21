<div align="center">
  <img src="./Deliverables/Logo/AgriTrentoSlogan.svg" alt="Alt text">
  <p> 
   <div align="center">
      <strong>AgriTrento</strong> una piattaforma web che facilita la prenotazione e la vendita di frutta e verdura del mercato contadino di Trento, incentivando il consumo di prodotti stagionali locali, favorendo pratiche sostenibili e nel rispetto del nostro territorio.
   </div>
</div>

## Prerequisiti

- [Node.js](https://nodejs.org/en/) v20.17.0
- [npm](https://www.npmjs.com/) v10.8.2

### Come eseguire sulla tua macchina locale

1. Assicurati di aver installato Node e npm. Puoi verificarlo eseguendo il seguente comando nel tuo terminale:

   ```bash
   node -v
   npm -v
   ```

1. Clona la repository
1. Entra nella cartella del progetto e da terminale installa i moduli necessari:

   ```bash
   npm run install:all
   ```

1. Crea un database su MongoDB

1. Crea un database Authentication su firebase

1. Aggiungi un file `.env` in "/backend/":

   ```bash
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=JWT_SECRET
   ```

1. Aggiungi un file `serviceAccountKey.json` in "/backend/config/". Per trovarlo collegarsi a [console.firebase.google.com](https://console.firebase.google.com/) > Progetto > Impostazioni ⚙️ > Account di servizio > Genera nuova chiave privata. 
   
   Questo scaricherà un file JSON. Copia il contenuto del file e incollalo nel file `serviceAccountKey.json`. Il file dovrebbe apparire simile a questo:

   ```json
       {
         "type": "...",

         "project_id": "...",

         "private_key_id": "...",,

         "private_key": "...",

         "client_email":  "...",

         "client_id":  "...",

         "auth_uri":  "...",

         "token_uri":  "...",

         "auth_provider_x509_cert_url":  "...",

         "client_x509_cert_url":  "...",

         "universe_domain":  "..."
     }

   ```

2. Esegui il progetto eseguendo il seguente comando nel tuo terminale:

   ```bash
   npm run dev
   ```

3. Controlla la console, apri il tuo browser e vai su [http://localhost:5173/](http://localhost:5173/) per vedere il progetto in esecuzione.
