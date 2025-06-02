import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  producer?: any;
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    toast: useToast(),
  }),
  
  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
  },
  
  actions: {
    loadFromStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.items = JSON.parse(savedCart);
      }
    },
    
    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    addToCart(product: any, quantity: number, unit: string) {
      if (!product) return;
    
      const existingItemIndex = this.items.findIndex(item => item.productId === product._id);
      
      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantity += quantity;
      } else {
        this.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          unit: unit,
          image: product.image,
          producer: product.producer
        });
      }
      
      this.saveToStorage();
      this.toast.success(`${product.name} aggiunto al carrello`);
    },
    
    removeItem(productId: string) {
      this.items = this.items.filter(item => item.productId !== productId);
      this.saveToStorage();
      this.toast.success('Prodotto rimosso dal carrello');
    },
    
    increaseQuantity(productId: string) {
      const item = this.items.find(item => item.productId === productId);
      if (item) {
        if (item.unit === 'kg') {
          item.quantity = Math.round((item.quantity + 0.1) * 10) / 10;
        } else {
          item.quantity += 1;
        }
        this.saveToStorage();
      }
    },
    
    decreaseQuantity(productId: string) {
      const item = this.items.find(item => item.productId === productId);
      if (item) {
        const minValue = item.unit === 'kg' ? 0.1 : 1;
        const decrement = item.unit === 'kg' ? 0.1 : 1;
        
        if (item.quantity > minValue) {
          if (item.unit === 'kg') {
            item.quantity = Math.round((item.quantity - decrement) * 10) / 10;
          } else {
            item.quantity -= decrement;
          }
          this.saveToStorage();
        }
      }
    },
    
    clearCart() {
      this.items = [];
      localStorage.removeItem('cart');
    }
  }
});