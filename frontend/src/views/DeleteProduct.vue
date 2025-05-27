<template>
  <div class="delete-product">
    <h1>Elimina Prodotto</h1>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <div class="product-list" v-if="products.length > 0">
      <div class="product-item" v-for="product in products" :key="product._id">
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p v-if="product.description"><strong>Descrizione: </strong>{{ product.description }}</p>
          <p><strong>Prezzo:</strong> {{ product.price }}€</p>
          <p><strong>Disponibilità:</strong> {{ product.available }}</p>
          <p><strong>Produttore:</strong> 
            <span v-if="product.producer && product.producer.name">{{ product.producer.name }}</span>
            <span v-else>Non specificato</span>
          </p>
        </div>
        <div class="product-actions">
          <button @click="deleteProduct(product._id)" class="delete-button">Elimina</button>
        </div>
      </div>
    </div>

    <div v-else class="no-products">
      <p>Nessun prodotto disponibile</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "DeleteProduct",
  data() {
    return {
      products: [],
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
        const response = await axios.get("http://localhost:3000/api/v1/products");
        console.log(response.data);

        if (response.data.success) {
          this.products = response.data.data;
        } else {
          this.errorMessage = response.data.message || "Errore nel recupero dei prodotti";
        }
      } catch (err) {
        console.error("Errore nel recupero dei prodotti:", err);
        this.errorMessage = "Errore di connessione al server";
      }
    },

    async deleteProduct(productId) {
      this.errorMessage = "";
      this.successMessage = "";

      try {
        const response = await axios.delete(
          `http://localhost:3000/api/v1/products/${productId}`,
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.data.success) {
          this.successMessage = "Prodotto eliminato con successo!";
          // Aggiorna la lista dei prodotti dopo l'eliminazione
          await this.fetchProducts();
        } else {
          this.errorMessage = response.data.message || "Errore nell'eliminazione del prodotto";
        }
      } catch (err) {
        console.error("Errore nell'eliminazione del prodotto:", err);
        this.errorMessage = "Errore di connessione al server";
      }
    },
  },
};
</script>