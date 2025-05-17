<template>
  <div class="add-product">
    <h1>Aggiungi Prodotto</h1>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <form @submit.prevent="submitProduct">
      <div>
        <label for="name">Nome Prodotto*</label>
        <input
          id="name"
          type="text"
          required
          v-model="name"
        />
      </div>

      <div>
        <label for="description">Descrizione</label>
        <textarea
          id="description"
          v-model="description"
        ></textarea>
      </div>

      <div>
        <label for="price">Prezzo (€)*</label>
        <input
          id="price"
          type="number"
          required
          step="0.01"
          inputmode="decimal"
          v-model.number="price"
        />
      </div>

      <div>
        <label for="available">Quantità Disponibile*</label>
        <input
          id="available"
          type="number"
          required
          inputmode="numeric"
          v-model.number="available"
        />
      </div>

      <div>
        <label for="producer">Produttore*</label>
        <input
          id="producer"
          type="text"
          required
          v-model="producer"
        />
      </div>

      <button type="submit">Salva Prodotto</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddProduct',
  data() {
    return {
      name: '',
      description: '',
      price: 0,
      available: 0,
      producer: '',
      errorMessage: '',
      successMessage: ''
    }
  },
  methods: {
    async submitProduct() {
      this.errorMessage = '';
      this.successMessage = '';
      
      // Validazione base
      if (!this.name || !this.price || !this.available || !this.producer) {
        this.errorMessage = 'Per favore compila tutti i campi obbligatori';
        return;
      }

      const product = {
        name: this.name,
        description: this.description,
        price: this.price,
        available: this.available,
        producer: this.producer // Ora è un semplice testo
      };

      try {
        console.log('Invio prodotto:', product);
        const response = await fetch('http://localhost:3000/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        });
        
        const result = await response.json();
        
        if (result.success) {
          this.successMessage = 'Prodotto salvato con successo!';
          // Reset del form
          this.name = '';
          this.description = '';
          this.price = 0;
          this.available = 0;
          this.producer = '';
          
          // Attendi un secondo prima di reindirizzare
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        } else {
          this.errorMessage = result.message || 'Errore nel salvataggio del prodotto';
        }
      } catch (err) {
        console.error('Errore nel salvataggio del prodotto:', err);
        this.errorMessage = 'Errore di connessione al server';
      }
    }
  }
}
</script>

<style scoped>
.add-product {
  max-width: 500px;
  margin: auto;
  padding: 20px;
}
form > div {
  margin-bottom: 1rem;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.6rem 1.2rem;
  background: hsl(160, 100%, 37%);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border-left: 4px solid #c62828;
}
.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  border-left: 4px solid #2e7d32;
}
</style>