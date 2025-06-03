<template>
  <div class="order-confirmation">
    <div v-if="loading" class="loading">
      <p>Elaborazione ordine in corso...</p>
    </div>
    
    <div v-else-if="orderSuccess" class="order-success">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <h2>Ordine completato con successo!</h2>
      <p>Il tuo ordine è stato ricevuto e sarà pronto per il ritiro in data: {{ formattedPickupDate }}</p>
      <div class="order-number">
        <span>Numero ordine:</span> {{ orderNumber }}
      </div>
      <div class="actions">
        <!-- <router-link to="/orders" class="view-orders">Visualizza i tuoi ordini</router-link> -->
        <router-link to="/explore-products" class="continue-shopping">Continua lo shopping</router-link>
      </div>
    </div>
    
    <div v-else class="confirmation-container">
      <h1>Conferma Ordine</h1>
      
      <div class="order-details">
        <h2>Riepilogo prodotti</h2>
        
        <div class="order-items">
          <div v-for="item in cartStore.items" :key="item.productId" class="order-item">
            <div class="item-name">{{ item.name }}</div>
            <div class="item-quantity">{{ item.quantity }} {{ item.unit }}</div>
            <div class="item-price">{{ (item.price * item.quantity)  }}€</div>
          </div>
        </div>
        
        <div class="order-summary">
          <div class="summary-row total">
            <span>Totale:</span>
            <span>{{ cartStore.totalAmount  }}€</span>
          </div>
          
          <div class="summary-row">
            <span>Data di ritiro:</span>
            <span>{{ formattedPickupDate }}</span>
          </div>
        </div>
        
        <div class="confirmation-message">
          <p>Confermando l'ordine, accetti le condizioni di acquisto del nostro negozio.</p>
        </div>
        
        <div class="action-buttons">
          <button class="cancel-btn" @click="cancelOrder">Annulla</button>
          <button class="confirm-btn" @click="confirmOrder" :disabled="isSubmitting">
            {{ isSubmitting ? 'Elaborazione...' : 'Conferma ordine' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';
import { useUserStore } from '@/stores/userStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();
const userStore = useUserStore();

const isSubmitting = ref(false);
const loading = ref(true);
const orderSuccess = ref(false);
const orderNumber = ref('');

// Formatta la data di ritiro
const formattedPickupDate = computed(() => {
  if (!cartStore.pickupDate) return '';
  
  const date = new Date(cartStore.pickupDate);
  return date.toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Al montaggio, controlla se ci sono prodotti nel carrello
onMounted(() => {
  cartStore.loadFromLocalStorage();
  
  if (cartStore.items.length === 0) {
    toast.error("Il tuo carrello è vuoto");
    router.push('/cart');
    return;
  }
  
  loading.value = false;
});

// Conferma l'ordine utilizzando il metodo checkout dello store
const confirmOrder = async () => {
  try {
    isSubmitting.value = true;
    console.log("userStore", userStore);
    // Verifica se l'utente è loggato
    if (!userStore.uid) {
      console.log("uid is null or undefined");
      console.log("userStore.uid", userStore.uid);
    }
    if (!userStore.fb_token) {
      console.log("fb token is null or undefined");
      console.log("userStore.fb_token", userStore.fb_token);
    }
    if (!userStore.uid || !userStore.fb_token) {
      toast.error("Devi effettuare l'accesso per completare l'ordine");
      router.push({
        path: '/login',
        query: { redirect: '/order-confirmation' }
      });
      return;
    }
    
    // Usa il metodo checkout dello store
    const result = await cartStore.checkout();
    
    if (!result.success) {
      if (result.requiresLogin) {
        // La redirezione la gestisce già il metodo checkout
        return;
      }
      throw new Error(result.error || 'Errore durante la creazione dell\'ordine');
    }
    
    // Ordine completato con successo
    orderSuccess.value = true;
    orderNumber.value = result.orderId;
    
  } catch (error) {
    toast.error(`Errore: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

// Annulla l'ordine e torna al carrello
const cancelOrder = () => {
  router.push('/cart');
};
</script>

<style scoped>
  .order-confirmation {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }
  
  .confirmation-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  h2 {
    color: #444;
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
  
  .order-items {
    margin-bottom: 1.5rem;
  }
  
  .order-item {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .order-item:last-child {
    border-bottom: none;
  }
  
  .item-name {
    font-weight: 500;
  }
  
  .item-quantity, .item-price {
    text-align: right;
  }
  
  .order-summary {
    background-color: #f9f9f9;
    border-radius: 6px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
  }
  
  .summary-row.total {
    font-weight: bold;
    font-size: 1.2rem;
    padding-top: 0.8rem;
    margin-top: 0.8rem;
    border-top: 1px solid #ddd;
  }
  
  .confirmation-message {
    text-align: center;
    color: #666;
    margin-bottom: 1.5rem;
  }
  
  .action-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  
  .cancel-btn, .confirm-btn {
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    flex: 1;
  }
  
  .cancel-btn {
    background-color: #f5f5f5;
    color: #333;
  }
  
  .cancel-btn:hover {
    background-color: #e8e8e8;
  }
  
  .confirm-btn {
    background-color: #4caf50;
    color: white;
  }
  
  .confirm-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .confirm-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  /* Ordine completato con successo */
  .order-success {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 3rem 2rem;
    text-align: center;
  }
  
  .success-icon {
    font-size: 4rem;
    color: #4caf50;
    margin-bottom: 1.5rem;
  }
  
  .order-success h2 {
    color: #4caf50;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
  
  .order-number {
    display: inline-block;
    background-color: #f5f5f5;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    margin: 1.5rem 0;
    font-weight: 500;
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
  }
  
  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .view-orders, .continue-shopping {
    display: inline-block;
    padding: 0.8rem 1.5rem;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .view-orders {
    background-color: #4caf50;
    color: white;
  }
  
  .continue-shopping {
    background-color: #f5f5f5;
    color: #333;
  }
  
  @media (max-width: 768px) {
    .confirmation-container {
      padding: 1.5rem;
    }
    
    .action-buttons {
      flex-direction: column;
    }
    
    .order-item {
      grid-template-columns: 1fr;
    }
    
    .item-quantity, .item-price {
      text-align: left;
    }
  }
  </style>