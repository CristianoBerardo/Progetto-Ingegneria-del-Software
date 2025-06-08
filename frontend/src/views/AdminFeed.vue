<template>
    <div class="admin-feed">
      <h1>🛡️ Dashboard Amministratore</h1>
      
      <!-- Sezione Segnalazioni -->
      <section class="section">
        <h2>📋 Segnalazioni</h2>
        <div class="cards-grid">
          <div class="card report-card" v-for="report in mockReports" :key="report.id">
            <div class="report-header">
              <span class="report-type" :class="report.type">
                {{ report.type === 'client' ? '👤 Cliente' : '🏭 Produttore' }}
              </span>
              <span class="report-date">{{ report.date }}</span>
            </div>
            <h4>{{ report.title }}</h4>
            <p class="report-content">{{ report.content }}</p>
            <div class="report-footer">
              <span class="report-from">Da: {{ report.from }}</span>
              <span class="report-status" :class="report.status">
                {{ report.status === 'new' ? '🔴 Nuova' : '🟢 Gestita' }}
              </span>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Sezione Notifiche -->
      <section class="section">
        <h2>📢 Notifiche ai Cittadini</h2>
        <button class="create-btn">➕ Crea Nuova Notifica</button>
        <div class="cards-grid">
          <div class="card notification-card" v-for="notification in mockNotifications" :key="notification.id">
            <div class="notification-header">
              <h4>{{ notification.title }}</h4>
              <span class="notification-date">{{ notification.date }}</span>
            </div>
            <p class="notification-content">{{ notification.content }}</p>
            <div class="actions">
              <button class="edit-btn">✏️ Modifica</button>
              <button class="delete-btn">🗑️ Elimina</button>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Sezione Gestione Produttori -->
      <section class="section">
        <h2>👨‍🌾 Gestione Produttori</h2>
        <div class="producers-grid">
          <div class="card producer-card" v-for="producer in producers" :key="producer._id">
            <div class="producer-header">
              <h3>{{ producer.name }}</h3>
              <span class="producer-status active">🟢 Attivo</span>
            </div>
            <div class="producer-info">
              <p><strong>📧 Email:</strong> {{ producer.email }}</p>
              <p><strong>📞 Telefono:</strong> {{ producer.phone }}</p>
              <p><strong>📍 Indirizzo:</strong> {{ producer.address }}</p>
            </div>
            <div class="producer-stats">
              <h4>📊 Statistiche di Vendita</h4>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-label">Vendite totali</span>
                  <span class="stat-value">€{{ getRandomSales() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Ordini completati</span>
                  <span class="stat-value">{{ getRandomOrders() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Valutazione media</span>
                  <span class="stat-value">⭐ {{ getRandomRating() }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Prodotti attivi</span>
                  <span class="stat-value">{{ getRandomProducts() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_URL } from '@/constants/API_URL';
  import { useUserStore } from '@/stores/userStore';
  
  const API_BASE_URL = `${API_URL}/api/v1`;
  
  export default {
    name: 'AdminFeed',
    data() {
      return {
        producers: [],
        mockReports: [
          {
            id: 1,
            type: 'client',
            title: 'Prodotto non ricevuto',
            content: 'Ho ordinato 5kg di mele biologiche ma non mi sono mai arrivate. È passata una settimana dalla data di consegna prevista.',
            from: 'martina (marti@gmail.com)',
            date: '03/01/2025',
            status: 'new'
          },
          {
            id: 2,
            type: 'producer',
            title: 'Problema caricamento prodotti',
            content: 'Non riesco a caricare nuovi prodotti sulla piattaforma. Il sistema mi da errore 500 quando premo salva.',
            from: 'Azienda Trento (az1@gmail.com)',
            date: '02/01/2025',
            status: 'new'
          },
          {
            id: 3,
            type: 'client',
            title: 'Prodotto di scarsa qualità',
            content: 'Le verdure ricevute erano in pessimo stato, completamente diverse dalle foto mostrate online.',
            from: 'giacomo (giack@gmail.com)',
            date: '01/01/2025',
            status: 'handled'
          },
          {
            id: 4,
            type: 'producer',
            title: 'Richiesta assistenza pagamenti',
            content: 'Non ho ricevuto i pagamenti degli ultimi tre ordini. Il sistema mostra "elaborazione in corso" da una settimana.',
            from: 'Azienda Rovereto (az2@gmail.com)',
            date: '30/12/2024',
            status: 'handled'
          },
          {
            id: 5,
            type: 'client',
            title: 'Problema con ordine duplicato',
            content: 'Mi è stato addebitato due volte lo stesso ordine. Chiedo il rimborso di uno dei due pagamenti.',
            from: 'cristiano (cri@gmail.com)',
            date: '29/12/2024',
            status: 'new'
          },
          {
            id: 6,
            type: 'producer',
            title: 'Difficoltà aggiornamento inventario',
            content: 'Non riesco ad aggiornare le quantità disponibili dei miei prodotti. La funzione sembra non funzionare.',
            from: 'Azienda Ala (az3@gmail.com)',
            date: '28/12/2024',
            status: 'new'
          }
        ],
        mockNotifications: [
          {
            id: 1,
            title: 'Spostamento mercato settimanale',
            content: 'Si comunica che il mercato settimanale sarà spostato da Piazza Dante a Via Solteri per lavori di ristrutturazione. Lo spostamento sarà valido dal 09/01/2025.',
            date: '03/01/2025'
          },
          {
            id: 2,
            title: 'Rinvio mercato di San Valentino',
            content: 'Il mercato speciale di San Valentino previsto per il 14/02/2025 è rinviato al 21/02/2025 per permettere una migliore organizzazione degli stand tematici.',
            date: '02/01/2025'
          },
          {
            id: 3,
            title: 'Manutenzione programmata del sistema',
            content: 'Il sistema sarà in manutenzione dalle 02:00 alle 06:00 del 12/01/2025 per aggiornamenti di sicurezza e miglioramenti delle performance.',
            date: '01/01/2025'
          }
        ]
      };
    },
    async mounted() {
      await this.fetchProducers();
    },
    methods: {
      headers() {
        const userStore = useUserStore();
        const token = userStore.fb_token || localStorage.getItem('user_token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
      },
      async fetchProducers() {
        try {
          const response = await axios.get(`${API_BASE_URL}/producers`, { headers: this.headers() });
          if (response.data.success) {
            this.producers = response.data.data || [];
          }
        } catch (error) {
          console.error("Errore nel caricamento dei produttori:", error);
        }
      },
      // Metodi per generare statistiche fittizie
      getRandomSales() {
        return (Math.random() * 10000 + 500).toFixed(2);
      },
      getRandomOrders() {
        return Math.floor(Math.random() * 200 + 20);
      },
      getRandomRating() {
        return (Math.random() * 2 + 3).toFixed(1);
      },
      getRandomProducts() {
        return Math.floor(Math.random() * 30 + 5);
      }
    }
  };
  </script>
  
  <style scoped>
  .admin-feed {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;
    margin-bottom: 30px;
  }
  
  .section {
    margin-bottom: 40px;
  }
  
  .section h2 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .producers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }
  
  .card {
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  
  /* Report Card Styles */
  .report-card {
    background: linear-gradient(135deg, #fff 0%, #f9f9f9 100%);
  }
  
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .report-type {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .report-type.client {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .report-type.producer {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  
  .report-date {
    font-size: 12px;
    color: #999;
  }
  
  .report-content {
    color: #666;
    font-size: 14px;
    line-height: 1.4;
    margin: 10px 0;
  }
  
  .report-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .report-from {
    font-size: 13px;
    color: #777;
  }
  
  .report-status {
    font-size: 12px;
    font-weight: 600;
  }
  
  /* Notification Card Styles */
  .create-btn {
    background: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .create-btn:hover {
    background: #218838;
  }
  
  .notification-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .notification-header h4 {
    margin: 0;
    color: #333;
    font-size: 16px;
  }
  
  .notification-date {
    font-size: 12px;
    color: #999;
  }
  
  .notification-content {
    color: #555;
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 15px;
  }
  
  .actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }
  
  .edit-btn, .delete-btn {
    border: none;
    padding: 8px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;
  }
  
  .edit-btn {
    background: #ffc107;
    color: #212529;
  }
  
  .edit-btn:hover {
    background: #e0a800;
  }
  
  .delete-btn {
    background: #dc3545;
    color: white;
  }
  
  .delete-btn:hover {
    background: #c82333;
  }
  
  /* Producer Card Styles */
  .producer-card {
    background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
  }
  
  .producer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .producer-header h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
  }
  
  .producer-status {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .producer-status.active {
    background: #d4edda;
    color: #155724;
  }
  
  .producer-info p {
    margin: 8px 0;
    font-size: 14px;
    color: #555;
  }
  
  .producer-stats {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
  }
  
  .producer-stats h4 {
    margin: 0 0 12px 0;
    color: #333;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .stat-item {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
  }
  
  .stat-label {
    display: block;
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
  
  .stat-value {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }
  
  @media (max-width: 768px) {
    .cards-grid {
      grid-template-columns: 1fr;
    }
    
    .producers-grid {
      grid-template-columns: 1fr;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
  </style>