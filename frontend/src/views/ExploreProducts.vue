<template>
    <div class="explore-products">
      <h1>Esplora Prodotti</h1>
      <div class="product-grid" v-if="products.length > 0">
        <div class="product-card" :class="{ 'product-unavailable': !isAvailable(product) }" v-for="product in products" :key="product._id">
          <div class="product-image">
            <img v-if="product.image" :src="product.image" :alt="product.name">
            <div v-else class="placeholder-image">
              <span>Immagine non disponibile</span>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="producer">{{ product.producer.name }}</p>
            <p class="description" v-if="product.description">{{ product.description }}</p>
            <p class="availability" :class="{ 'available': isAvailable(product), 'unavailable': !isAvailable(product) }">
              {{ isAvailable(product) ? 'Prodotto disponibile' : 'Prodotto esaurito' }}
            </p>
            <p class="price">{{ product.price }} €/kg</p>
            
            <div class="quantity-container" v-if="isAvailable(product)">
              <div class="unit-selection">
                <div class="unit-option" :class="{ active: getUnit(product._id) === 'unity' }">
                  <input type="radio" :id="`unity-${product._id}`" :name="`unit-${product._id}`" value="unity"
                    v-model="units[product._id]">
                  <label :for="`unity-${product._id}`">Unità</label>
                </div>
                <div class="unit-option" :class="{ active: getUnit(product._id) === 'kg' }">
                  <input type="radio" :id="`kg-${product._id}`" :name="`unit-${product._id}`" value="kg"
                    v-model="units[product._id]">
                  <label :for="`kg-${product._id}`">Kg</label>
                </div>
              </div>
              
              <p class="quantity-label">Quantità ({{ getUnit(product._id) }}):</p>
              <div class="quantity-selector">
                <button @click="decreaseQuantity(product._id)" class="quantity-btn" 
                  :disabled="getQuantity(product._id) <= (getUnit(product._id) === 'kg' ? 0.1 : 1)">-</button>
                <input 
                  :type="getUnit(product._id) === 'kg' ? 'number' : 'number'" 
                  :step="getUnit(product._id) === 'kg' ? 0.1 : 1"
                  :min="getUnit(product._id) === 'kg' ? 0.1 : 1"
                  :max="product.available" 
                  v-model.number="quantities[product._id]" 
                  class="quantity-input">
                <button @click="increaseQuantity(product._id, product.available)" class="quantity-btn">+</button>
              </div>
            </div>
            
            <button class="add-to-cart" 
              @click="addToCart(product._id, quantities[product._id], getUnit(product._id))"
              v-if="isAvailable(product)">
              Aggiungi al carrello
            </button>
            <button class="add-to-cart unavailable-button" disabled v-else>
              Non disponibile
            </button>
          </div>
        </div>
      </div>
      <div v-else class="no-products">
        <p>Nessun prodotto disponibile</p>
      </div>
    </div>
  </template>
  
  <script setup>
// TODO: Implementare la logica per la gestione del carrello
// TODO: Aggiungere mappatura unità -> kg 
  import { ref, onMounted, reactive } from 'vue';
  const products = ref([]);
  const quantities = reactive({});
  const units = reactive({});
  
  onMounted(async () => {
    await fetchProducts();
  });
  
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/products");
      const result = await response.json();
      console.log(result);
  
      if (result.success) {
        products.value = result.data;
        
        // Initialize quantities and units for each product
        products.value.forEach(product => {
          quantities[product._id] = 1;
          units[product._id] = 'unity'; // Default to unity
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
  
  const getUnit = (productId) => {
    return units[productId] || 'unity';
  };
  
  const increaseQuantity = (productId, maxAvailable) => {
    const currentUnit = getUnit(productId);
    const increment = currentUnit === 'kg' ? 0.1 : 1;
    
    if (quantities[productId] < maxAvailable) {
      // Round to 1 decimal place for kg
      if (currentUnit === 'kg') {
        quantities[productId] = Math.round((quantities[productId] + increment) * 10) / 10;
      } else {
        quantities[productId] = quantities[productId] + increment;
      }
    }
  };
  
  const decreaseQuantity = (productId) => {
    const currentUnit = getUnit(productId);
    const minValue = currentUnit === 'kg' ? 0.1 : 1;
    const decrement = currentUnit === 'kg' ? 0.1 : 1;
    
    if (quantities[productId] > minValue) {
      // Round to 1 decimal place for kg
      if (currentUnit === 'kg') {
        quantities[productId] = Math.round((quantities[productId] - decrement) * 10) / 10;
      } else {
        quantities[productId] = quantities[productId] - decrement;
      }
    }
  };
  
  const addToCart = (productId, quantity, unit) => {
    console.log(`Aggiunto al carrello il prodotto con ID: ${productId}, quantità: ${quantity} ${unit}`);
    // Implementare logica per aggiungere al carrello
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
    color: #a4a3a3;
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