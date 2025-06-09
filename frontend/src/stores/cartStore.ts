import router from '@/router';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';
import { useUserStore } from './userStore';
import { API_URL } from '@/constants/API_URL';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: 'kg';
  image?: string;
  producer?: any;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    pickupDate: null as Date | null,
  }),
  
  getters: {
    totalAmount: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    itemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    },
    
    isEmpty: (state) => {
      return state.items.length === 0;
    }
  },
  
  actions: {
    addToCart(item: CartItem) {
      item.unit = 'kg'; // Ensure unit is set to 'kg'
      const existingItem = this.items.find(i => i.productId === item.productId);
      
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push(item);
      }
      
      // Persist to localStorage
      this.saveToLocalStorage();
      
      const toast = useToast();
      toast.success(`${item.name} aggiunto al carrello`);
    },
    
    removeItem(productId: string) {
      this.items = this.items.filter(item => item.productId !== productId);
      this.saveToLocalStorage();
    },
    
    updateQuantity(productId: string, quantity: number) {
      const item = this.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;
        this.saveToLocalStorage();
      }
    },
    
    clearCart() {
      this.items = [];
      this.pickupDate = null;
      this.saveToLocalStorage();
    },
    
    setPickupDate(date: Date) {
      this.pickupDate = date;
      this.saveToLocalStorage();
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify({
        items: this.items,
        pickupDate: this.pickupDate
      }));
    },
    
    loadFromLocalStorage() {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const parsedData = JSON.parse(cartData);
        this.items = parsedData.items || [];
        this.pickupDate = parsedData.pickupDate ? new Date(parsedData.pickupDate) : null;
        this.items.forEach(item => {
          item.unit = 'kg';
        });      
      }
    },
    
    async checkout() {
      const userStore = useUserStore();
      const toast = useToast();
      
      // Check if user is logged in
      if (!userStore.uid || !userStore.fb_token) {
        // User is not logged in, redirect to login page
        toast.info('Per completare l\'ordine è necessario effettuare il login');
        router.push('/sing-in');
        return { success: false, requiresLogin: true };
      }
      
      if (!this.pickupDate) {
        toast.error('Seleziona una data di ritiro');
        return { success: false, requiresLogin: false };
      }
      
      try {
        const response = await axios.post(`${API_URL}/api/v1/orders`, {
          products: this.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          totalPrice: this.totalAmount,
          pickupDate: this.pickupDate,
        }, {
          headers: {
            Authorization: `Bearer ${userStore.fb_token}`
          }
        });
        console.log('Order response:', response.status);
        
        // Clear cart after successful order
        this.clearCart();
        
        toast.success('Ordine completato con successo!');
        return { success: true , orderId: response.data.savedOrder._id };
      } catch (error: any) {    
        if (error.response && error.response.status === 414) {
          toast.error("Un produttore non può eseguire un ordine")
        }else if (error.response && error.response.status === 413) {
          toast.error('Cliente non trovato');
        }else {
          toast.error('Errore durante il completamento dell\'ordine');
        }
      }
    }
  }
});