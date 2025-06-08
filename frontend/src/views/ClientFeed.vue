<template>
  <div class="client-feed">
    <!-- Producer selection section -->
    <!-- <div class="producer-selection">
      <h2>Select a Producer:</h2>
      <DropDown
        :options="producerList"
        v-model="selectedProducerId"
        placeholder="Select a producer"
        @change="onProducerSelected"
      />
      <p v-if="selectedProducerName">You selected: {{ selectedProducerName }}</p>
    </div> -->

    <!-- Orders section -->
    <div class="orders-section">
      <h2>I tuoi ordini</h2>

      <div v-if="orders.length === 0" class="no-orders">
        <i class="pi pi-shopping-bag" style="font-size: 3rem"></i>
        <p>Non hai ancora nessun ordine al momento.</p>
        <router-link to="/explore-products" class="start-shopping-btn">
          Inizia lo shopping
        </router-link>
      </div>

      <div v-else class="orders-container">
        <div v-for="order in orders" :key="order._id" class="order-card">
          <div class="order-header">
            <span class="order-id">Ordine #{{ order._id.substring(order._id.length - 6) }}</span>
            <span :class="['status-badge', `status-${order.status}`]">{{
              formatStatus(order.status)
            }}</span>
          </div>

          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">Prezzo totale:</span>
              <span class="detail-value">€{{ order.totalPrice.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Data di ritiro</span>
              <span class="detail-value">{{ formatDate(order.pickupDate) }}</span>
            </div>
          </div>

          <div class="order-actions">
            <!-- <button class="view-details-btn" @click="viewOrderDetails(order._id)">
              Visualizza dettaglio
            </button> -->
            <button
              v-if="order.status === 'pending'"
              class="cancel-btn"
              @click="cancelOrder(order._id)"
            >
              Cancella ordine
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import DropDown from "../components/DropDown.vue";
import axios from "axios";
import { API_URL } from "@/constants/API_URL";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "vue-toastification";

// API base URL
const API_BASE_URL = `${API_URL}/api/v1`;

interface ProducerOption {
  value: string;
  text: string;
}

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  pickupDate: string;
}

const producerList = ref<ProducerOption[]>([]);
const selectedProducerId = ref<string | undefined>(undefined);
const orders = ref<Order[]>([]);
const loading = ref(false);
const toast = useToast();

// Function to fetch producers
const fetchProducers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/producers/names`);
    if (response.data.success) {
      producerList.value = response.data.data.map((producer: { _id: string; name: string }) => ({
        value: producer._id,
        text: producer.name,
      }));
    }
  } catch (error) {
    console.error("Error fetching producers:", error);
  }
};

// Function to fetch orders
const fetchOrders = async () => {
  loading.value = true;
  try {
    const token = useUserStore().fb_token;

    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      orders.value = response.data.orders;
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    loading.value = false;
  }
};

// Format date for better display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format status for better display
const formatStatus = (status: string) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// View order details
const viewOrderDetails = (orderId: string) => {
  console.log(`Viewing details for order: ${orderId}`);
  // Implement navigation to order details page
  // router.push(`/orders/${orderId}`);
};

// Cancel order
const cancelOrder = async (orderId: string) => {
  try {
    const token = useUserStore().fb_token;

    const response = await axios.delete(`${API_BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      toast.info("Ordine cancellato con successo");

      // Re-fetch all orders to update the UI
      await fetchOrders();

      const orderIndex = orders.value.findIndex((o) => o._id === orderId);
      if (orderIndex !== -1) {
        orders.value[orderIndex].status = "cancelled";
      }
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
  }
};

onMounted(() => {
  fetchProducers();
  fetchOrders();
});

// Computed property to get the name of the selected producer
const selectedProducerName = computed(() => {
  if (selectedProducerId.value && producerList.value.length > 0) {
    const selectedOption = producerList.value.find(
      (option) => option.value === selectedProducerId.value,
    );
    return selectedOption ? selectedOption.text : null;
  }
  return null;
});

const onProducerSelected = (value: string) => {
  console.log("Producer selected via @change event (ID):", value);
};
</script>

<style scoped>
.client-feed {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.producer-selection {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.orders-section {
  margin-top: 30px;
}

.orders-section h2 {
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #333;
}

.no-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.no-orders p {
  margin: 15px 0;
  font-size: 1.2rem;
  color: #666;
}

.start-shopping-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.2s;
}

.start-shopping-btn:hover {
  background-color: #388e3c;
}

.orders-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.order-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.order-id {
  font-weight: bold;
  color: #555;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-details {
  padding: 15px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 500;
}

.order-actions {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid #eee;
}

.view-details-btn {
  flex: 1;
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.view-details-btn:hover {
  background-color: #2980b9;
}

.cancel-btn {
  flex: 1;
  padding: 8px 12px;
  background-color: white;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background-color: #e74c3c;
  color: white;
}

/* Responsive styling */
@media (max-width: 768px) {
  .orders-container {
    grid-template-columns: 1fr;
  }

  .order-actions {
    flex-direction: column;
  }
}
</style>

<!-- <template>
  <div>
    <h2>Select a Producer:</h2>
    <DropDown
      :options="producerList"
      v-model="selectedProducerId"
      placeholder="Select a producer"
      @change="onProducerSelected"
    />
    <p v-if="selectedProducerName">You selected: {{ selectedProducerName }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import DropDown from "../components/DropDown.vue";
import axios from "axios";
import { API_URL } from "@/constants/API_URL";
import { useUserStore } from "@/stores/userStore";

// Updated base URL to use v2 endpoints
const API_BASE_URL = `${API_URL}/api/v1`;

interface ProducerOption {
  value: string; // This will be producer._id
  text: string; // This will be producer.name
}

const producerList = ref<ProducerOption[]>([]);
const selectedProducerId = ref<string | undefined>(undefined);

// Function to fetch producers using v2 endpoint
const fetchProducers = async () => {
  try {
    // Updated to use v2 endpoint
    const response = await axios.get(`${API_BASE_URL}/producers/names`);
    if (response.data.success) {
      producerList.value = response.data.data.map((producer: { _id: string; name: string }) => ({
        value: producer._id,
        text: producer.name,
      }));
    } else {
      console.error("Error fetching producers:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching producers:", error);
  } finally {
    console.log("Producers fetch attempt finished.");
    console.log("Producer List:", producerList.value);
  }
};

const fetchOrders = async () => {
  try {
    const token = useUserStore().fb_token;

    const response = await axios.get(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.success) {
      console.log("Orders fetched successfully:", response.data.orders);
    } else {
      console.error("Error message:", response.data.message);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

onMounted(() => {
  fetchProducers();
  fetchOrders();
});

// Computed property to get the name of the selected producer
const selectedProducerName = computed(() => {
  if (selectedProducerId.value && producerList.value.length > 0) {
    const selectedOption = producerList.value.find(
      (option) => option.value === selectedProducerId.value,
    );
    return selectedOption ? selectedOption.text : null;
  }
  return null;
});

const onProducerSelected = (value: string) => {
  // value here is the producer._id
  console.log("Producer selected via @change event (ID):", value);
};
</script> -->
