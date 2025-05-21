<template>
    <div class="modify-product">
      <h1>Modifica Prodotto</h1>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
  
      
      <div class="product-list" v-if="!selectedProductId">
        <div class="product-item" v-for="product in products" :key="product._id">
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p v-if="product.description"><strong>Descrizione: </strong>{{ product.description }}</p>
            <p><strong>Prezzo:</strong> {{ product.price }}€</p>
            <p><strong>Disponibilità:</strong> {{ product.available }}</p>
            <p><strong>Produttore:</strong> {{ product.producer.name }}</p>
          </div>
          <div class="product-actions">
            <button @click="selectProduct(product)" class="modify-button">Modifica</button>
          </div>
        </div>
      </div>
  

      <form v-if="selectedProductId" @submit.prevent="updateProduct">
        <div>
          <label for="name">Nome Prodotto*</label>
          <input id="name" type="text" required v-model="name" />
        </div>
  
        <div>
          <label for="description">Descrizione</label>
          <textarea id="description" v-model="description"></textarea>
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
          <label for="category">Categoria</label>
          <input id="category" type="text" v-model="category" />
        </div>
  
        <div class="button-group">
          <button type="submit">Salva Modifiche</button>
          <button type="button" @click="cancelEdit" class="cancel-button">Annulla</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: "ModifyProduct",
    data() {
      return {
        products: [],
        selectedProductId: null,
        name: "",
        description: "",
        price: 0,
        available: 0,
        category: "",
        errorMessage: "",
        successMessage: "",
      };
    },
    async mounted() {
      await this.fetchProducts();
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await fetch("http://localhost:3000/api/v1/products");
          const result = await response.json();
          
          if (result.success) {
            this.products = result.data;
          } else {
            this.errorMessage = result.message || "Errore nel recupero dei prodotti";
          }
        } catch (err) {
          console.error("Errore nel recupero dei prodotti:", err);
          this.errorMessage = "Errore di connessione al server";
        }
      },
  
      selectProduct(product) {
        this.selectedProductId = product._id;
        this.name = product.name;
        this.description = product.description || "";
        this.price = product.price;
        this.available = product.available;
        this.category = product.category || "";
      },
  
      cancelEdit() {
        this.selectedProductId = null;
      },
  
      async updateProduct() {
        this.errorMessage = "";
        this.successMessage = "";
  
        if (!this.name || !this.price || this.available === undefined) {
          this.errorMessage = "Per favore compila tutti i campi obbligatori";
          return;
        }
  
        const updatedProduct = {
          name: this.name,
          description: this.description,
          price: this.price,
          available: this.available,
          category: this.category,
        };
  
        try {
          const response = await fetch(`http://localhost:3000/api/v1/products/${this.selectedProductId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
          });
  
          const result = await response.json();
  
          if (result.success) {
            this.successMessage = "Prodotto aggiornato con successo!";
            this.selectedProductId = null;
            await this.fetchProducts();
          } else {
            this.errorMessage = result.message || "Errore nell'aggiornamento del prodotto";
          }
        } catch (err) {
          console.error("Errore nell'aggiornamento del prodotto:", err);
          this.errorMessage = "Errore di connessione al server";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .modify-product {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  
  .product-list {
    margin-top: 20px;
  }
  
  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
  }
  
  .product-info {
    flex: 1;
  }
  
  .product-info h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #333;
  }
  
  .product-info p {
    margin: 5px 0;
    color: #666;
  }
  
  .product-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  .modify-button {
    padding: 0.6rem 1.2rem;
    background: hsl(160, 100%, 37%);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .modify-button:hover {
    background: hsl(160, 100%, 30%);
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
  
  .button-group {
    margin-top: 1.5rem;
    display: flex;
    gap: 10px;
  }
  
  button {
    padding: 0.6rem 1.2rem;
    background: hsl(160, 100%, 37%);
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .cancel-button {
    background: #757575;
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