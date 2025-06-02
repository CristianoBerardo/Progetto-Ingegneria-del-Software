<template>
  <div class="home">
    <ExploreProducts ref="exploreProductsRef" style="display: none;" />
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="logo-placeholder">
          <!-- Logo placeholder -->
          <div class="logo">
            <img src="../assets/logo_agri.svg" width="400" alt="AgriTrento">
          </div>
        </div>
        <div class="cta-buttons">
          <button class="cta-primary"><router-link to="/explore-products">Esplora Prodotti</router-link></button>
          <button class="cta-secondary"><router-link to="/client-feed">Trova Produttori</router-link></button>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories">
      <h2>Categorie Popolari</h2>
      <div class="category-cards">
        <div class="category-card" v-for="(category, index) in categories" :key="index">
          <img :src="category.image" :alt="category.name">
          <h3>{{ category.name }}</h3>
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="featured-products">
      <h2>Prodotti di Stagione</h2>
      <div class="product-grid">
        <div class="product-card" v-for="(product, index) in featuredProducts" :key="index">
          <div class="product-image">
            <img :src="product.image" :alt="product.name">
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="producer">{{ product.producer }}</p>
            <p class="price">{{ product.price }} €</p>
            <button class="add-to-cart" 
                @click="cartStore.addToCart(product, 1, 'unità')" >
                <!-- v-if="isAvailable(product)" -->
                Aggiungi 
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-choose-us">
      <h2>Perché Scegliere Noi</h2>
      <div class="benefits">
        <div class="benefit">
          <div class="icon">🌱</div>
          <h3>Prodotti Freschi</h3>
          <p>Raccolti e consegnati in giornata</p>
        </div>
        <div class="benefit">
          <div class="icon">👨‍🌾</div>
          <h3>Supporto ai Produttori Locali</h3>
          <p>Compra direttamente dagli agricoltori</p>
        </div>
        <div class="benefit">
          <div class="icon">🌍</div>
          <h3>Sostenibilità</h3>
          <p>Filiera corta e minor impatto ambientale</p>
        </div>
        <div class="benefit">
          <div class="icon">🚚</div>
          <h3>Consegna Rapida</h3>
          <p>A casa tua entro 24 ore</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="newsletter-content">
        <h2>Resta Aggiornato</h2>
        <p>Iscriviti alla nostra newsletter per ricevere offerte esclusive e notizie sui prodotti di stagione</p>
        <div class="newsletter-form">
          <input type="email" placeholder="La tua email">
          <button>Iscriviti</button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-content">
        <div class="footer-logo">
          <img src="../assets/logo_agri.svg" width="300" alt="AgriTrento Logo">
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h3>Mercato</h3>
            <ul>
              <li><a href="#">Chi Siamo</a></li>
              <li><a href="#">Come Funziona</a></li>
              <li><a href="#">I Nostri Produttori</a></li>
              <li><a href="#">Lavora Con Noi</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Prodotti</h3>
            <ul>
              <li><a href="#">Frutta e Verdura</a></li>
              <li><a href="#">Latticini</a></li>
              <li><a href="#">Carne</a></li>
              <li><a href="#">Prodotti da Forno</a></li>
            </ul>
          </div>
          <div class="link-group">
            <h3>Contatti</h3>
            <ul>
              <li><a href="#">Assistenza</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Resi e Rimborsi</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; 2025 AgriTrento. Tutti i diritti riservati.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/userStore';
import { useCartStore } from '@/stores/cartStore';

export default {
  name: "Home",
  setup() {
    const userStore = useUserStore();
    const cartStore = useCartStore();
    cartStore.loadFromStorage();

    return { userStore, cartStore };
  },
  data() {
    return {
      categories: [
        { name: "Frutta e Verdura", image: "https://bancofresco.it/wp-content/uploads/2021/12/img-banner-ortofrutta-mobile.png" },
        { name: "Formaggi e Latticini", image: "https://www.formaggideltrentino.it//Media/News/Formaggi-tipici-trentini/Trentingrana-formaggi-tipici-trentino.jpg" },
        { name: "Carni e Salumi", image: "https://www.italybite.it/img/ybc_blog/post/20210312-ITBI-art10-Viaggio-alla-scoperta-dei-salumi-del-Trentino-Alto-Adige-copertina.jpg" },
        { name: "Pane e Prodotti da Forno", image: "https://www.alpenfein.com/it/shop/media/bc/89/6a/1611926173/brot%20s%C3%BCdtirol%20-%20pane%20alto%20adige.jpg" }
      ],
      featuredProducts: [
        { name: "Pomodori Biologici", producer: "Azienda Agricola Rossi", price: "2.99", image: "https://www.laboutiquedelbiologico.it/8304-medium_default/pomodori-cherry-bio-250-gr.jpg" },
        { name: "TrentinGrana", producer: "Caseificio Del Contadino", price: "4.50", image: "https://www.montitrentini.com/wp-content/uploads/2023/06/monti-trentini-prodotti-grana-padano-riserva.jpg" },
        { name: "Miele Millefiori", producer: "Apicoltura Montana", price: "6.75", image: "https://www.paolomarket.com/wp-content/uploads/2023/06/Miele-di-Millefiori-del-Trentino-Api-di-Lina-500g-01.jpg" },
        { name: "SchüttelBrot", producer: "Forno Artigianale", price: "3.20", image: "https://gustos.bz.it/356-large_default/schuttelbrot-originale-fatto-a-mano-155-g.jpg" }
      ]
    };
  },
  methods: {
    isAvailable(product) {
      return product.available > 0;
    },
    addToCart(productId) {
      const product = this.featuredProducts.find(p => p._id === productId);
      if (product) {
        this.cartStore.addToCart(product, 1, 'unità');
      }
    }
  }
};
</script>

<style scoped>
.home {
  color: #8a8787;
  max-width: 100%;
  overflow-x: hidden;
}

/* Hero section styles */
.hero {
  /*background-image: linear-gradient(rgba(0, 0, 0, 0.677), rgba(0, 0, 0, 0.677)), url('../assets/mercato.jpg');*/
  background-image: linear-gradient(rgba(24, 36, 20, 0.677), rgba(4, 17, 2, 0.819)), url('../assets/agricoltura.jpg');
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 3rem;
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
}

.logo-placeholder {
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tagline {
  font-size: 1.3rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-primary {
  background-color: #64a64a;
  color: white;
}

.cta-primary router-link-active,
.cta-primary a {
  color: #fff !important;
  background-color: transparent !important;
}

.cta-primary:hover {
  background-color: #26682a;
}

.cta-secondary {
  background-color: transparent;
  border: 2px solid white;
  color: white;
}

.cta-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Sections styling */
section {
  padding: 3rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #9f9f9f;
}

/* Categories section */
.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.category-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.category-card h3 {
  padding: 1rem;
  text-align: center;
  background-color: #f8f8f8;
  margin: 0;
}

/* Featured Products section */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin-top: 0;
  font-size: 1.1rem;
}

.producer {
  color: #a4a3a3;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.add-to-cart {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.add-to-cart:hover {
  background-color: #45a049;
}

/* Why Choose Us section */
.benefits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  text-align: center;
}

.benefit {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.benefit:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

/* Newsletter section */
.newsletter {
  background-color: #f8f9fa;
  text-align: center;
}

.newsletter-content {
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-form {
  display: flex;
  margin-top: 1.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  outline: none;
}

.newsletter-form button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.newsletter-form button:hover {
  background-color: #45a049;
}

/* Footer */
footer {
  background-color: #333;
  color: #fff;
  padding: 3rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.footer-logo {
  margin-bottom: 2rem;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.link-group h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #fff;
}

.link-group ul {
  list-style: none;
  padding: 0;
}

.link-group li {
  margin-bottom: 0.5rem;
}

.link-group a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: #4caf50;
}

.copyright {
  margin-top: 2rem;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
  font-size: 0.9rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero {
    height: 400px;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .newsletter-form input {
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .newsletter-form button {
    border-radius: 4px;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-primary, .cta-secondary {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>