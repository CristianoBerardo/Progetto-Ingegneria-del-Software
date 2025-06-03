<template>
  <div class="cart-container">
    <h1>Il tuo carrello</h1>
    
    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <p>Il tuo carrello è vuoto</p>
      <router-link to="/explore-products" class="continue-shopping">Continua lo shopping</router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.productId" class="cart-item">
          <div class="item-image">
            <img v-if="item.image" :src="item.image" :alt="item.name">
            <div v-else class="placeholder-image">Immagine non disponibile</div>
          </div>
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="item-producer">{{ item.producer ? item.producer.name : 'Azienda anonima' }}</p>
            <div class="item-quantity">
              <p>Quantità: {{ item.quantity }} {{ item.unit }}</p>
              <div class="quantity-controls">
                <button @click="decreaseItemQuantity(item)" class="quantity-btn">-</button>
                <button @click="increaseItemQuantity(item)" class="quantity-btn">+</button>
                <button @click="cartStore.removeItem(item.productId)" class="remove-btn">Rimuovi</button>
              </div>
            </div>
          </div>
          
          <div class="item-price">
            <p class="price">{{ (item.price * item.quantity)  }} €</p>
            <p class="unit-price">{{ item.price  }} €/{{ item.unit === 'kg' ? 'kg' : 'unità' }}</p>
          </div>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Riepilogo ordine</h2>
        <div class="summary-row">
          <span>Totale prodotti:</span>
          <span>{{ cartStore.totalAmount  }} €</span>
        </div>
        
        <div class="pickup-date">
          <label for="pickup-date">Seleziona una data di ritiro:</label>
          <input 
            type="date" 
            id="pickup-date" 
            v-model="pickupDate"
            :min="minPickupDate"
            required
          >
        </div>
        
        <button 
          @click="proceedToCheckout" 
          class="checkout-btn"
          :disabled="!pickupDate"
        >
          Procedi all'ordine
        </button>
        
        <router-link to="/explore-products" class="continue-shopping">Continua lo shopping</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const cartStore = useCartStore();
const pickupDate = ref('');

// Al montaggio del componente, carica il carrello
onMounted(() => {
  cartStore.loadFromLocalStorage();
  
  // Se c'è una data di ritiro salvata, impostala
  if (cartStore.pickupDate) {
    pickupDate.value = new Date(cartStore.pickupDate).toISOString().split('T')[0];
  }
});

// Calcola la data minima per il ritiro (almeno domani)
const minPickupDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
});

// Osserva i cambiamenti della data di ritiro e aggiorna lo store
watch(pickupDate, (newDate) => {
  if (newDate) {
    cartStore.setPickupDate(new Date(newDate));
  }
});

// Aumenta la quantità di un prodotto nel carrello
const increaseItemQuantity = (item) => {
  if (item.unit === 'kg') {
    const newQuantity = Math.round((item.quantity + 0.1) * 10) / 10;
    cartStore.updateQuantity(item.productId, newQuantity);
  } else {
    cartStore.updateQuantity(item.productId, item.quantity + 1);
  }
};

// Diminuisci la quantità di un prodotto nel carrello
const decreaseItemQuantity = (item) => {
  const minValue = item.unit === 'kg' ? 0.1 : 1;
  const decrement = item.unit === 'kg' ? 0.1 : 1;
  
  if (item.quantity > minValue) {
    if (item.unit === 'kg') {
      const newQuantity = Math.round((item.quantity - decrement) * 10) / 10;
      cartStore.updateQuantity(item.productId, newQuantity);
    } else {
      cartStore.updateQuantity(item.productId, item.quantity - decrement);
    }
  }
};

// Procedi al checkout
const proceedToCheckout = () => {
  if (!pickupDate.value) {
    toast.error("Seleziona una data di ritiro");
    return;
  }
  
  router.push('/order-confirmation');
};
</script>
<style scoped>
.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.continue-shopping {
  display: inline-block;
  margin-top: 1rem;
  color: #4caf50;
  text-decoration: none;
  font-weight: 500;
}

.continue-shopping:hover {
  text-decoration: underline;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.cart-items {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.cart-item {
  display: flex;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  background-color: #f8f8f8;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aaa;
  font-style: italic;
  font-size: 0.8rem;
  text-align: center;
}

.item-details {
  flex: 1;
  padding: 0 1rem;
}

.item-details h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.item-producer {
  color: #666;
  font-size: 0.9rem;
}

.item-quantity {
  margin-top: 1rem;
  font-size: 0.95rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.quantity-btn {
  background-color: #eaeaea;
  color: #333;
  border: none;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 0.5rem;
}

.quantity-btn:hover {
  background-color: #d8d8d8;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.remove-btn:hover {
  background-color: #e53935;
}

.item-price {
  width: 100px;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0;
  color: #333;
}

.unit-price {
  font-size: 0.8rem;
  color: #666;
  margin: 0.3rem 0 0;
}

.cart-summary {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
}

.cart-summary h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.pickup-date {
  margin: 1.5rem 0;
}

.pickup-date label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.pickup-date input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.checkout-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  margin: 1rem 0;
  transition: background-color 0.2s ease;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #45a049;
}

.checkout-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    flex-direction: column;
  }
  
  .item-image {
    width: 100%;
    height: 150px;
  }
  
  .item-details {
    padding: 1rem 0;
  }
  
  .item-price {
    width: 100%;
    text-align: left;
    margin-top: 0.5rem;
  }
}
</style>