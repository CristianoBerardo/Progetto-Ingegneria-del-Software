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
          <p><strong>Produttore:</strong> {{ product.producer }}</p>
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
export default {
  name: "DeleteProduct",
  data() {
    return {
      products: [],
      errorMessage: "",
      successMessage: "",
    }
  },
  async mounted() {
    await this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch("http://localhost:3000/api/v1/products")
        const result = await response.json()

        if (result.success) {
          this.products = result.data
        } else {
          this.errorMessage = result.message || "Errore nel recupero dei prodotti"
        }
      } catch (err) {
        console.error("Errore nel recupero dei prodotti:", err)
        this.errorMessage = "Errore di connessione al server"
      }
    },

    async deleteProduct(productId) {
      this.errorMessage = ""
      this.successMessage = ""

      try {
        const response = await fetch(`http://localhost:3000/api/v1/products/${productId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })

        const result = await response.json()

        if (result.success) {
          this.successMessage = "Prodotto eliminato con successo!"
          // Aggiorna la lista dei prodotti dopo l'eliminazione
          await this.fetchProducts()
        } else {
          this.errorMessage = result.message || "Errore nell'eliminazione del prodotto"
        }
      } catch (err) {
        console.error("Errore nell'eliminazione del prodotto:", err)
        this.errorMessage = "Errore di connessione al server"
      }
    },
  },
}
</script>

<style scoped>
.delete-product {
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

.delete-button {
  padding: 0.6rem 1.2rem;
  background: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button:hover {
  background: #c62828;
}

.no-products {
  text-align: center;
  padding: 20px;
  color: #666;
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
