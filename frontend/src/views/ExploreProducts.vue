<template>
  <div class="explore-products">
    <h1>Esplora Prodotti</h1>

    <!-- Search filters section -->
    <div class="search-container">
      <div class="search-row">
        <!-- Product name search -->
        <div class="search-field">
          <label for="nameSearch">Nome prodotto</label>
          <input
            type="text"
            id="nameSearch"
            v-model="filters.name"
            placeholder="Cerca per nome..."
            @input="debounceSearch"
          />
        </div>

        <!-- Category dropdown -->
        <!-- <div class="search-field">
          <label for="categoryFilter">Categoria</label>
          <select id="categoryFilter" v-model="filters.category" @change="applyFilters">
            <option value="">Tutte le categorie</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div> -->

        <!-- Producer dropdown -->
        <div class="search-field">
          <label for="producerFilter">Produttore</label>
          <select id="producerFilter" v-model="filters.producer" @change="applyFilters">
            <option value="">Tutti i produttori</option>
            <option v-for="producer in producers" :key="producer._id" :value="producer._id">
              {{ producer.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="search-row">
        <!-- Price range -->
        <div class="price-filter">
          <label>Fascia di prezzo</label>
          <div class="price-inputs">
            <input
              type="number"
              v-model.number="filters.minPrice"
              placeholder="Min €"
              min="0"
              @change="applyFilters"
            />
            <span>-</span>
            <input
              type="number"
              v-model.number="filters.maxPrice"
              placeholder="Max €"
              min="0"
              @change="applyFilters"
            />
          </div>
        </div>

        <!-- Sort options -->
        <div class="search-field">
          <label for="sortOptions">Ordina per</label>
          <select id="sortOptions" v-model="filters.sort" @change="applyFilters">
            <option value="name:asc">Nome (A-Z)</option>
            <option value="name:desc">Nome (Z-A)</option>
            <option value="price:asc">Prezzo (crescente)</option>
            <option value="price:desc">Prezzo (decrescente)</option>
            <option value="available:desc">Disponibilità (decrescente)</option>
          </select>
        </div>

        <!-- Items per page -->
        <!-- <div class="search-field">
          <label for="limitOptions">Elementi per pagina</label>
          <select id="limitOptions" v-model="filters.limit" @change="applyFilters">
            <option value="9">9</option>
            <option value="18">18</option>
            <option value="27">27</option>
          </select>
        </div> -->
      </div>

      <div class="search-actions">
        <button class="filter-btn" @click="applyFilters">Applica filtri</button>
        <button class="reset-btn" @click="resetFilters">Azzera filtri</button>
      </div>
    </div>

    <!-- Pagination info and navigation -->
    <!-- <div class="pagination-info" v-if="totalProducts > 0">
      <span>Mostra {{ startItem }}-{{ endItem }} di {{ totalProducts }} prodotti</span>
      <div class="pagination-controls">
        <button
          @click="changePage(filters.page - 1)"
          :disabled="filters.page <= 1"
          class="page-btn"
        >
          &lt; Precedente
        </button>
        <span class="page-indicator">{{ filters.page }} / {{ totalPages }}</span>
        <button
          @click="changePage(filters.page + 1)"
          :disabled="filters.page >= totalPages"
          class="page-btn"
        >
          Successivo &gt;
        </button>
      </div>
    </div> -->

      <div class="product-grid" v-if="products.length > 0">
        <div class="product-card" :class="{ 'product-unavailable': !isAvailable(product) }" v-for="product in products" :key="product._id">
          <div class="product-image">
            <img 
              v-if="productImage = getImageForProduct(product)"
              :src="productImage"
              :alt="product.name"
            > 
            <!-- DA CAMBIARE QUA IMMAGINE -->
            <div v-else class="placeholder-image">
              <span>Immagine non disponibile</span>
            </div>
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="producer" v-if="product.producer" >{{ product.producer.name }}</p>
            <p v-else >{{ "azienda anonima" }}</p> 
            <p class="description" v-if="product.description">{{ product.description }}</p>
            <p class="availability" :class="{ 'available': isAvailable(product), 'unavailable': !isAvailable(product) }">
              {{ isAvailable(product) ? 'Prodotto disponibile' : 'Prodotto esaurito' }}:
              {{ Math.floor(product.available * 10) / 10 }} kg
            </p>
            <p class="price">{{ product.price }} €/kg</p>
            
            <div class="quantity-container" v-if="isAvailable(product)">
              <p class="quantity-label">Quantità (kg):</p>
              <div class="quantity-selector">
                <button @click="decreaseQuantity(product._id)" class="quantity-btn" 
                  :disabled="getQuantity(product._id) <= 0.1">-</button>
                <input 
                  type="number" 
                  step="0.1"
                  min="0.1"
                  :max="product.available" 
                  v-model.number="quantities[product._id]" 
                  class="quantity-input">
                <button @click="increaseQuantity(product._id, product.available)" class="quantity-btn">+</button>
              </div>
            </div>
            
            <button class="add-to-cart" 
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
import { API_URL } from "@/constants/API_URL";
import { useCartStore } from "@/stores/cartStore";
import axios from "axios";
import debounce from "lodash/debounce";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { ref, onMounted, reactive } from 'vue';

import { useCartStore } from '@/stores/cartStore';
import { getProductImage } from '@/utils/imageMapper';

const products = ref([]);
const quantities = reactive({});
const toast = useToast();
const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const API_BASE_URL = `${API_URL}/api/v1`;

// Filter state
const filters = reactive({
  name: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  producer: "",
  sort: "name:asc",
  // page: 1,
  // limit: "",
});

// For filter dropdowns

const producers = ref([]);
// const totalProducts = ref(0);
const isLoading = ref(false);

// Pagination calculations
// const totalPages = computed(() => Math.ceil(totalProducts.value / filters.limit));
// console.log("Total pages:", totalPages.value);

// const startItem = computed(() => (filters.page - 1) * filters.limit + 1);

// const endItem = computed(() => Math.min(filters.page * filters.limit, totalProducts.value));

// Initialize from URL parameters
onMounted(async () => {
  // Extract query params from URL
  const queryParams = route.query;

  // Apply query params to filters if they exist
  if (Object.keys(queryParams).length > 0) {
    Object.keys(filters).forEach((key) => {
      if (queryParams[key]) {
        // Convert numeric strings to numbers
        if (key === "page" || key === "minPrice" || key === "maxPrice") {
          filters[key] = Number(queryParams[key]);
        } else {
          filters[key] = queryParams[key];
        }
      }
    });
  }

  // Fetch available categories and producers for dropdown filters
  // await fetchCategories();
  await fetchProducers();

  // Fetch products with current filters
  await fetchProducts();

  cartStore.loadFromLocalStorage();
});


const getImageForProduct = (product) => {
  const imagePath = getProductImage(product.name);
  console.log(`Product: ${product.name}, Image path: ${imagePath}`);
  return getProductImage(product.name);
};

// Debounce search input to avoid too many API calls
const debounceSearch = debounce(() => {
  // filters.page = 1; // Reset to first page on new search
  applyFilters();
}, 500);

// Apply filters and update URL
const applyFilters = () => {
  // filters.page = 1; // Reset to first page when filters change
  updateUrlParams();
  fetchProducts();
};

// Reset all filters to default values
const resetFilters = () => {
  Object.assign(filters, {
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    producer: "",
    sort: "name:asc",
    // page: 1,
    // limit: 9,
  });

  updateUrlParams();
  fetchProducts();
};

// Handle pagination
// const changePage = (newPage) => {
//   console.log("Changing page to:", newPage, totalPages.value);
//   if (newPage >= 1 && newPage <= totalPages.value) {
//     filters.page = newPage;
//     updateUrlParams();
//     fetchProducts();

//     // Safer scroll - check if element exists first
//     const productGrid = document.querySelector('.product-grid');
//     if (productGrid) {
//       window.scrollTo({
//         top: productGrid.offsetTop - 20,
//         behavior: 'smooth',
//       });
//     } else {
//       // Fallback to top of container
//       const container = document.querySelector('.explore-products');
//       if (container) {
//         window.scrollTo({
//           top: container.offsetTop,
//           behavior: 'smooth',
//         });
//       }
//     }
//   }
// };

// Update URL with current filter parameters
const updateUrlParams = () => {
  const queryParams = {};

  // Only add non-empty/default parameters
  Object.keys(filters).forEach((key) => {
    const value = filters[key];

    // Skip empty strings or default values
    if (
      value !== "" &&
      !(key === "sort" && value === "name:asc") &&
      !(key === "page" && value === 1) &&
      !(key === "limit" && value === 9)
    ) {
      queryParams[key] = value;
    }
  });

  router.replace({ query: queryParams });
};

// Fetch product categories
// const fetchCategories = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/products/categories`);
//     if (response.data.success) {
//       categories.value = response.data.data;
//     }
//   } catch (err) {
//     console.error("Error fetching categories:", err);
//   }
// };

// Fetch producers
const fetchProducers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/producers`);
    if (response.data.success) {
      producers.value = response.data.data;
    }
  } catch (err) {
    console.error("Error fetching producers:", err);
  }
};

// Fetch products with filters
const fetchProducts = async () => {
  isLoading.value = true;
  try {
    // Build query parameters
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") {
        params[key] = filters[key];
      }
    });

    const result = await axios.get(`${API_BASE_URL}/products`, { params });
    console.log("Fetched products:", result.data);

    if (result.data.success) {
      products.value = result.data.data;

      // Fix: Add fallback and proper type conversion
      // totalProducts.value = typeof result.data.total === 'number' ?
      //   result.data.total :
      //   result.data.data.length;

      // console.log("Total products:", totalProducts.value);
      // console.log("Total pages calculated:", Math.round(totalProducts.value / filters.limit));

      // Initialize quantities for each product
      products.value.forEach((product) => {
        quantities[product._id] = 0.1;
      });
    } else {
      products.value = [];
      // totalProducts.value = 0;
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    products.value = [];
    // totalProducts.value = 0;
    toast.error("Errore nel caricamento dei prodotti. Riprova più tardi.");
  } finally {
    isLoading.value = false;
  }
};

const isAvailable = (product) => {
  return product.available >= 0.1;
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

const addToCart = async (productId, quantity) => {
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
      image: getImageForProduct(product),
      producer: product.producer,
    };
    console.log("Aggiunta al carrello:", cartItem);

    try {
      await axios.patch(`${API_BASE_URL}/products/${productId}`, {
        available: newQuant,
      });

      fetchProducts(); // Refresh products after updating availability

      cartStore.addToCart(cartItem);
      quantities[productId] = 0.1;
      // toast.success("Prodotto aggiunto al carrello");
    } catch (error) {
      toast.error("Errore nell'aggiornamento della disponibilità");
      console.error(error);
    }
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

.search-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.search-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.search-field {
  flex: 1;
  min-width: 200px;
}

.search-field label,
.price-filter label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.search-field input,
.search-field select {
  width: 100%;
  height: 42px;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.price-filter {
  flex: 1;
  min-width: 250px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-inputs input {
  flex: 1;
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.filter-btn,
.reset-btn {
  padding: 0.7rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.filter-btn {
  background-color: #4caf50;
  color: white;
}

.filter-btn:hover {
  background-color: #45a049;
}

.reset-btn {
  background-color: #f5f5f5;
  color: #333;
}

.reset-btn:hover {
  background-color: #e0e0e0;
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-btn {
  background-color: #f5f5f5;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.page-btn:disabled {
  color: #aaa;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.page-indicator {
  font-weight: 500;
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

  .search-row {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
