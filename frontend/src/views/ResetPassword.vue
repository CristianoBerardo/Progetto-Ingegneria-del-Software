<template>
    <div class="page-center">
      <div class="reset-container">
        <div v-if="!emailSent">
          <h3>Reimposta la tua password</h3>
          <p class="instruction-text">Inserisci l'email associata al tuo account per ricevere il link di recupero.</p>
          
          <form @submit.prevent="resetPassword">
            <div class="input-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                placeholder="La tua email" 
                v-model="email" 
                required 
                :disabled="isLoading"
                autocomplete="email"
              />
            </div>
            
            <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
            
            <div class="button-group">
              <button type="submit" :disabled="isLoading || !isValidEmail">
                <span v-if="isLoading">
                  <span class="loader"></span>
                </span>
                <span v-else>Invia email di recupero</span>
              </button>
            </div>
          </form>
          
          <div class="back-link">
            <button class="secondary-button" @click="backToSignIn">← Torna al Login</button>
          </div>
        </div>
        
        <div v-else class="success-container">
          <div class="success-icon">✓</div>
          <h3>Email inviata!</h3>
          <p>Abbiamo inviato un'email con le istruzioni per reimpostare la password a {{ email }}</p>
          <p class="note-text">Se non ricevi l'email entro qualche minuto, controlla la cartella spam.</p>
          
          <div class="back-link">
            <button class="primary-button" @click="backToSignIn">Torna al Login</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  import { resetPasswordFirebase } from "@/services/authService";
  
  const email = ref("");
  const errMsg = ref("");
  const isLoading = ref(false);
  const emailSent = ref(false);
  const router = useRouter();
  
  const isValidEmail = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email.value);
  });
  
  const resetPassword = async () => {
    if (!isValidEmail.value) {
      errMsg.value = "Inserisci un indirizzo email valido";
      return;
    }
    
    errMsg.value = "";
    isLoading.value = true;
    
    try {
      await resetPasswordFirebase(email.value);
      emailSent.value = true;
    } catch (error) {
      console.error("Errore durante il reset della password:", error);
      switch (error.code) {
        case "auth/invalid-email":
          errMsg.value = "Indirizzo email non valido";
          break;
        case "auth/user-not-found":
          errMsg.value = "Nessun account associato a questa email";
          break;
        case "auth/too-many-requests":
          errMsg.value = "Troppe richieste. Riprova più tardi";
          break;
        default:
          errMsg.value = "Si è verificato un errore. Riprova più tardi";
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  const backToSignIn = () => {
    router.push("/sign-in");
  };
  </script>
  
  <style scoped>
  .page-center {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background, #f7f7f7);
    padding: 20px;
  }
  
  .reset-container {
    max-width: 400px;
    width: 100%;
    padding: 32px 24px;
    background: var(--color-background-soft, #fff);
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  }
  
  h3 {
    text-align: center;
    color: var(--color-heading, #333);
    margin-bottom: 16px;
  }
  
  .instruction-text {
    text-align: center;
    margin-bottom: 24px;
    color: var(--color-text, #666);
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .input-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9em;
    color: var(--color-text, #555);
  }
  
  input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--color-border, #ccc);
    border-radius: 6px;
    font-size: 1em;
    transition: border 0.3s ease;
  }
  
  input:focus {
    outline: none;
    border-color: var(--color-primary, #4C9E49);
  }
  
  .error-message {
    color: #d32f2f;
    text-align: center;
    font-size: 0.9em;
    margin: 12px 0;
  }
  
  .button-group {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
  
  button {
    width: 100%;
    padding: 12px;
    background-color: var(--color-primary, #4C9E49);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  button:hover:not(:disabled) {
    background-color: var(--color-primary-hover, #3b7e3c);
  }
  
  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .nav-links {
    margin-top: 24px;
    text-align: center;
  }
  
  .nav-links a {
    color: var(--color-primary, #4C9E49);
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.3s ease;
  }
  
  .nav-links a:hover {
    color: var(--color-primary-hover, #3b7e3c);
    text-decoration: underline;
  }
  
  .success-container {
    text-align: center;
    padding: 20px 0;
  }
  
  .success-icon {
    background-color: var(--color-primary, #4C9E49);
    color: white;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    margin: 0 auto 24px;
  }
  
  .note-text {
    font-size: 0.8em;
    color: #888;
    margin: 16px 0 24px;
  }
  
  .loader {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    display: inline-block;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Add this to your existing <style> section */
.back-link {
  margin-top: 20px;
  text-align: center;
}

.secondary-button {
  background-color: transparent;
  border: 1px solid var(--color-primary, #4C9E49);
  color: var(--color-primary, #4C9E49);
}

.secondary-button:hover {
  background-color: rgba(76, 158, 73, 0.1);
}

.primary-button {
  width: auto;
  min-width: 180px;
  margin: 0 auto;
}
  </style>