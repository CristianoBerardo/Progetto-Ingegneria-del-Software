<template>
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

// Updated base URL to use v2 endpoints
const API_BASE_URL = 'http://localhost:3000/api/v2';

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

onMounted(() => {
  fetchProducers();
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
</script>