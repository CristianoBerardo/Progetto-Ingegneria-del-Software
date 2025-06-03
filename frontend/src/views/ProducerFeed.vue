<template>
  <div class="producer-feed">
    <h1>🛒 I Tuoi Prodotti</h1>
    <div v-if="message" :class="messageClass">{{ message }}</div>
    <div class="products-grid">
      <div class="card add-card" @click="showAddForm = !showAddForm">
        <div class="add-icon">➕</div>
        <p>Aggiungi Prodotto</p>
      </div>
      <div v-if="showAddForm" class="card form-card">
        <h3>➕ Nuovo Prodotto</h3>
        <form @submit.prevent="addProduct">
          <div class="form-group">
            <label>🏷️ Nome*</label>
            <input v-model="form.name" required placeholder="Nome del prodotto">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>💰 Prezzo (€)*</label>
              <input v-model.number="form.price" type="number" step="0.01" required placeholder="0.00">
            </div>
            <div class="form-group">
              <label>📦 Quantità*</label>
              <input v-model.number="form.available" type="number" required placeholder="0">
            </div>
          </div>
          <div class="form-group">
            <label>📝 Descrizione</label>
            <textarea v-model="form.description" placeholder="Descrizione del prodotto (opzionale)"></textarea>
          </div>
          <div class="actions">
            <button type="submit" class="save" :disabled="!isFormValid">✅ Salva</button>
            <button type="button" @click="cancelForm" class="cancel">❌ Annulla</button>
          </div>
        </form>
      </div>
      <div v-for="product in products" :key="product._id" class="card product-card">
        <div v-if="editingId !== product._id" class="product-view">
          <div class="product-header">
            <h3>{{ product.name }}</h3>
            <span class="product-status" :class="{ 'low-stock': product.available < 5 }">
              {{ product.available > 0 ? 'Disponibile' : 'Esaurito' }}
            </span>
          </div>
          <div class="product-details">
            <p class="price-quantity">
              <span class="price">€{{ product.price  }}</span>
              <span class="quantity">{{ product.available }} pz</span>
            </p>
            <p v-if="product.description" class="description">{{ product.description }}</p>
          </div>
          <div class="actions">
            <button @click="startEdit(product)" class="edit" title="Modifica">✏️</button>
            <button @click="deleteProduct(product._id)" class="delete" title="Elimina">🗑️</button>
          </div>
        </div>
        <div v-else class="product-edit">
          <h3>✏️ Modifica Prodotto</h3>
          <form @submit.prevent="updateProduct(product._id)">
            <div class="form-group">
              <label>Nome*</label>
              <input v-model="editForm.name" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Prezzo (€)*</label>
                <input v-model.number="editForm.price" type="number" step="0.01" required>
              </div>
              <div class="form-group">
                <label>Quantità*</label>
                <input v-model.number="editForm.available" type="number" required>
              </div>
            </div>
            <div class="form-group">
              <label>Descrizione</label>
              <textarea v-model="editForm.description"></textarea>
            </div>
            <div class="actions">
              <button type="submit" class="save">✅ Salva</button>
              <button type="button" @click="cancelEdit" class="cancel">❌ Annulla</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

// Updated base URL to use v2 endpoints
const API_BASE_URL_V1 = 'http://localhost:3000/api/v1';
const API_BASE_URL_V2 = 'http://localhost:3000/api/v2';

export default {
  name: 'ProducerFeed',
  data: () => ({
    products: [],
    showAddForm: false,
    editingId: null,
    message: "",
    form: { name: "", price: null, available: null, description: "" },
    editForm: {},
    producerId: null,
    loading: false
  }),
  computed: {
    messageClass() {
      return this.message.includes('successo') ? 'success' : 'error';
    },
    isFormValid() {
      return this.form.name.trim() && this.form.price > 0 && this.form.available >= 0;
    }
  },
  async mounted() {
    await this.initializeComponent();
  },
  methods: {
    headers() {
      const userStore = useUserStore();
      const token = userStore.token || localStorage.getItem('token');
      return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
    },
    handleApiError(error, defaultMessage) {
      console.error("API Error:", error);
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message;
        switch (status) {
          case 401:
            this.showMessage("Sessione scaduta. Effettua di nuovo il login.", 'error');
            break;
          case 403:
            this.showMessage("Non hai i permessi per questa operazione.", 'error');
            break;
          case 404:
            this.showMessage("Risorsa non trovata.", 'error');
            break;
          default:
            this.showMessage(message || defaultMessage, 'error');
        }
      } else {
        this.showMessage(defaultMessage, 'error');
      }
    },
    async initializeComponent() {
      this.loading = true;
      try {
        await this.fetchProducerId();
        await this.fetchProducts();
      } catch (error) {
        this.showMessage("Errore durante l'inizializzazione", 'error');
      } finally {
        this.loading = false;
      }
    },
    async fetchProducerId() {
      try {
        const userStore = useUserStore();
        // Updated to use v1 endpoint
        const response = await axios.get(`${API_BASE_URL_V1}/producers`, { headers: this.headers() });
        if (response.data.success) {
          const producer = response.data.data.find(p => p.uid === userStore.uid);
          this.producerId = producer?._id;
          if (!this.producerId) throw new Error("Produttore non trovato");
        }
      } catch (error) {
        console.error("Error fetching producer ID:", error);
        throw error;
      }
    },
    async fetchProducts() {
      if (!this.producerId) return;
      try {
        // Updated to use v1 endpoint
        const response = await axios.get(`${API_BASE_URL_V1}/producers/${this.producerId}/products`, { headers: this.headers() });
        if (response.data.success) {
          this.products = response.data.data || [];
        } else {
          throw new Error(response.data.message || "Errore nel recupero prodotti");
        }
      } catch (error) {
        this.handleApiError(error, "Errore nel caricamento dei prodotti");
      }
    },
    async addProduct() {
      if (!this.isFormValid) {
        this.showMessage("Compila tutti i campi obbligatori", 'error');
        return;
      }
      try {
        const productData = { ...this.form };
        // Updated to use v2 endpoint - this will use createProductV2 with authentication
        const response = await axios.post(`${API_BASE_URL_V2}/products`, productData, { headers: this.headers() });
        if (response.data.success) {
          this.showMessage("Prodotto aggiunto con successo!", 'success');
          this.cancelForm();
          await this.fetchProducts();
        } else {
          throw new Error(response.data.message || "Errore nell'aggiunta");
        }
      } catch (error) {
        this.handleApiError(error, "Errore nell'aggiunta del prodotto");
      }
    },
    startEdit(product) {
      this.editingId = product._id;
      this.editForm = { ...product };
    },
    async updateProduct(productId) {
      try {
        // Updated to use v2 endpoint - this will use completeUpdateProductV2 with authentication
        const response = await axios.put(`${API_BASE_URL_V2}/products/${productId}`, this.editForm, { headers: this.headers() });
        if (response.data.success) {
          this.showMessage("Prodotto aggiornato con successo!", 'success');
          this.cancelEdit();
          await this.fetchProducts();
        } else {
          throw new Error(response.data.message || "Errore nell'aggiornamento");
        }
      } catch (error) {
        this.handleApiError(error, "Errore nell'aggiornamento del prodotto");
      }
    },
    async deleteProduct(productId) {
      if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
      try {
        // Updated to use v2 endpoint - this will use deleteProductV2 with authentication
        const response = await axios.delete(`${API_BASE_URL_V2}/products/${productId}`, { headers: this.headers() });
        if (response.data.success) {
          this.showMessage("Prodotto eliminato con successo!", 'success');
          await this.fetchProducts();
        } else {
          throw new Error(response.data.message || "Errore nell'eliminazione");
        }
      } catch (error) {
        this.handleApiError(error, "Errore nell'eliminazione del prodotto");
      }
    },
    cancelForm() {
      this.showAddForm = false;
      this.form = { name: "", price: null, available: null, description: "" };
    },
    cancelEdit() {
      this.editingId = null;
      this.editForm = {};
    },
    showMessage(text, type = 'info') {
      this.message = text;
      setTimeout(() => {
        this.message = "";
      }, 3000);
    }
  }
};
</script>

<style scoped>
.producer-feed {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #333;
  margin-bottom: 20px;
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.card {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.add-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #007bff;
  color: #007bff;
  min-height: 180px;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
}
.add-card .add-icon {
  font-size: 3em;
  margin-bottom: 10px;
}
.add-card p {
  font-weight: 600;
  margin: 0;
}
.form-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}
.form-group {
  margin-bottom: 16px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 14px;
  color: #495057;
}
input, textarea {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}
input:focus, textarea:focus {
  outline: none;
  border-color: #007bff;
}
textarea {
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
}
.product-card {
  position: relative;
}
.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}
.product-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}
.product-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: #d4edda;
  color: #155724;
}
.product-status.low-stock {
  background: #fff3cd;
  color: #856404;
}
.product-details {
  margin-bottom: 16px;
}
.price-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.price {
  font-size: 20px;
  font-weight: 700;
  color: #28a745;
}
.quantity {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  color: #6c757d;
}
.description {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
button {
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.save {
  background: #28a745;
  color: white;
  flex: 1;
}
.cancel {
  background: #6c757d;
  color: white;
}
.edit {
  background: #ffc107;
  color: #212529;
  padding: 8px 12px;
}
.delete {
  background: #dc3545;
  color: white;
  padding: 8px 12px;
}
.add-first {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  margin-top: 16px;
}
.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #28a745;
}
.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f1aeb5 100%);
  color: #721c24;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #dc3545;
}
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
  .price-quantity {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .actions {
    flex-direction: column;
  }
}
</style>