// src/stores/userStore.ts
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    uid: "",
    role: ""
  }),
  actions: {
    setUser(user: { name: string; uid: string; role: string }) {
      this.name = user.name;
      this.uid = user.uid;
      this.role = user.role;
    },
    clearUser() {
      this.name = "";
      this.uid = "";
      this.role = "";
    }
  }
});
