<template>
  <div class="explore-products">
    <h1>Esplora Prodotti</h1>
    <div class="header-actions">
      <router-link to="/cart" class="view-cart-btn">
        <i class="pi pi-shopping-cart"></i>
        Carrello ({{ cartStore.items.length }})
      </router-link>
    </div>

    <div class="product-grid" v-if="products.length > 0">
      <div
        class="product-card"
        :class="{ 'product-unavailable': !isAvailable(product) }"
        v-for="product in products"
        :key="product._id"
      >
        <div class="product-image">
          <img v-if="product.image" :src="product.image" :alt="product.name" />
          <div v-else class="placeholder-image">
            <span>Immagine non disponibile</span>
          </div>
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="producer" v-if="product.producer">{{ product.producer.name }}</p>
          <p v-else>{{ "azienda anonima" }}</p>
          <p class="description" v-if="product.description">{{ product.description }}</p>
          <p
            class="availability"
            :class="{ available: isAvailable(product), unavailable: !isAvailable(product) }"
          >
            {{ isAvailable(product) ? "Prodotto disponibile" : "Prodotto esaurito" }}:
            {{ product.available }} kg
          </p>
          <p class="price">{{ product.price }} €/kg</p>

          <div class="quantity-container" v-if="isAvailable(product)">
            <p class="quantity-label">Quantità (kg):</p>
            <div class="quantity-selector">
              <button
                @click="decreaseQuantity(product._id)"
                class="quantity-btn"
                :disabled="getQuantity(product._id) <= 0.1"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                min="0.1"
                :max="product.available"
                v-model.number="quantities[product._id]"
                class="quantity-input"
              />
              <button
                @click="increaseQuantity(product._id, product.available)"
                class="quantity-btn"
              >
                +
              </button>
            </div>
          </div>

          <button
            class="add-to-cart"
            @click="addToCart(product._id, quantities[product._id], 'kg')"
            v-if="isAvailable(product)"
          >
            Aggiungi al carrello
          </button>
          <button class="add-to-cart unavailable-button" disabled v-else>Non disponibile</button>
        </div>
      </div>
    </div>
    <div v-else class="no-products">
      <p>Nessun prodotto disponibile</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { API_URL } from "@/constants/API_URL";
import axios from "axios";

import { useToast } from "vue-toastification";
import { useCartStore } from "@/stores/cartStore";

const products = ref([]);
const quantities = reactive({});
const toast = useToast();
const cartStore = useCartStore();

const API_BASE_URL = `${API_URL}/api/v1`;

onMounted(async () => {
  await fetchProducts();
  cartStore.loadFromLocalStorage();
});

const fetchProducts = async () => {
  try {
    const result = await axios.get(`${API_BASE_URL}/products`);
    // const result = await response.json();
    console.log(result);

    if (result.data.success) {
      products.value = result.data.data;

      // Initialize quantities for each product
      products.value.forEach((product) => {
        quantities[product._id] = 0.1; // Default 0.1 kg
      });
    } else {
      console.error(result.message || "Errore nel recupero dei prodotti");
    }
  } catch (err) {
    console.error("Errore nel recupero dei prodotti:", err);
  }
};
const isAvailable = (product) => {
  return product.available > 0;
};

const getQuantity = (productId) => {
  return quantities[productId] || 1;
};

const increaseQuantity = (productId, maxAvailable) => {
  if (quantities[productId] < maxAvailable) {
    // Round to 1 decimal place
    quantities[productId] = Math.round((quantities[productId] + 0.1) * 10) / 10;
  }
};

const decreaseQuantity = (productId) => {
  const minValue = 0.1;

  if (quantities[productId] > minValue) {
    // Round to 1 decimal place
    quantities[productId] = Math.round((quantities[productId] - 0.1) * 10) / 10;
  }
};

const addToCart = (productId, quantity) => {
  try {
    const product = products.value.find((p) => p._id === productId);
    if (!product) return;

    const newQuant = product.available - quantity;

    if (newQuant < 0) {
      toast.error("Quantità non disponibile");
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      unit: "kg",
      image: product.image,
      producer: product.producer,
    };
    console.log("Aggiunta al carrello:", cartItem);

    const result = axios.patch(`${API_BASE_URL}/products/${productId}`, {
      available: newQuant,
    });

    if (!result) {
      toast.error("Errore nell'aggiornamento della disponibilità del prodotto");
      return;
    }

    fetchProducts();

    cartStore.addToCart(cartItem);
    console.log("Carrello aggiornato:", cartStore.items);
    quantities[productId] = 0.1;
  } catch (error) {
    console.error("Errore nell'aggiunta al carrello:", error);
    toast.error("Errore nell'aggiunta al carrello. Riprova più tardi.");
  }
};
</script>

<style scoped>
.explore-products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #9f9f9f;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  width: 100%;
  overflow: hidden;
  background-color: #f8f8f8;
}

.product-image img {
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
  background-color: #f8f8f8;
  font-style: italic;
}

.product-info {
  padding: 1.2rem;
}

.product-info h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.2rem;
}

.producer {
  color: #5c5b5b;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.description {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.availability {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.quantity-input {
  -moz-appearance: textfield; /* Firefox */
  width: 50px;
  text-align: center;
  margin: 0 8px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.quantity-btn {
  background-color: #eaeaea;
  color: #333;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  font-size: 1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #d8d8d8;
}

.quantity-btn:disabled {
  color: #aaa;
  cursor: not-allowed;
}

.add-to-cart {
  background-color: #4caf50;
  color: white;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.add-to-cart:hover {
  background-color: #45a049;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: #888;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 2rem;
  font-size: 1.2rem;
}

.quantity-container {
  margin-bottom: 1rem;
}

.quantity-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}
.unit-selection {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}

.unit-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.unit-option.active {
  background-color: #f0f0f0;
}

.unit-option input {
  margin-right: 4px;
}

.unit-option label {
  cursor: pointer;
  font-size: 0.9rem;
  color: #555;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.quantity-input {
  width: 50px;
  text-align: center;
  margin: 0 8px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.availability {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.availability.available {
  background-color: #e8f5e9;
  color: #388e3c;
  border: 1px solid #c8e6c9;
}

.availability.unavailable {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid #ffe0b2;
}

.product-unavailable {
  position: relative;
  opacity: 0.8;
}

.product-unavailable::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
  border-radius: 8px;
}

.product-unavailable .product-info {
  position: relative;
  z-index: 2;
}

.unavailable-button {
  background-color: #e0e0e0 !important;
  color: #9e9e9e !important;
  cursor: not-allowed !important;
}

.unavailable-button:hover {
  background-color: #e0e0e0 !important;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.view-cart-btn {
  background-color: #4caf50;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-cart-btn:hover {
  background-color: #45a049;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
  }

  .quantity-input {
    width: 40px;
    padding: 4px;
  }

  .quantity-btn {
    width: 28px;
    height: 28px;
  }
}
</style>
