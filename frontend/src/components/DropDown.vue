<template>
  <select v-model="selectedValue" @change="handleChange" class="dropdown-select">
    <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";

interface IDropDownOption {
  value: string; // Value to bind
  text: string; // Text to display
}

const props = defineProps({
  options: {
    type: Array as () => IDropDownOption[],
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    // <-- Add modelValue to props
    type: [String, Number], // Allow string or number, adjust as needed
    default: "",
  },
});

const emits = defineEmits(["update:modelValue", "change"]); // <-- Add 'change' event
const selectedValue = ref(props.modelValue || ""); // Initialize with modelValue

watch(
  () => props.modelValue,
  (newValue) => {
    selectedValue.value = newValue || "";
  },
);

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const value = target.value;
  console.log("Selected value:", target);
  selectedValue.value = value;
  emits("update:modelValue", value); // Use 'emits'
  emits("change", value); // Use 'emits'
};
</script>

<style scoped>
.dropdown-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 150px; /* Adjust as needed */
}

.dropdown-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
