import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    uid: "",
    role: "",
    token: ""
  }),
  actions: {
    setUser(user: { name: string; uid: string; role: string; token?: string }) {
      this.name = user.name;
      this.uid = user.uid;
      this.role = user.role;
      if (user.token) {
        this.token = user.token;
        localStorage.setItem('token', user.token);
      }
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    clearUser() {
      this.name = "";
      this.uid = "";
      this.role = "";
      this.token = "";
      localStorage.removeItem('token');
    },
    loadFromStorage() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
      }
    }
  }
});