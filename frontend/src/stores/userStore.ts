import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    name: localStorage.getItem('user_name') || "",
    uid: localStorage.getItem('user_uid') || "",
    role: localStorage.getItem('user_role') || "",
    fb_token: localStorage.getItem('user_token') || ""
  }),
  actions: {
    setUser(user: { name: string; uid: string; role: string; fb_token: string }) {
      this.name = user.name;
      this.uid = user.uid;
      this.role = user.role;
      if (user.fb_token) {
        this.fb_token = user.fb_token;
        // localStorage.setItem('token', user.token);
      }

      // Persist user data to localStorage after refreshing
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_uid', user.uid);
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_token', user.fb_token || '');
    },
    setToken(token: string) {
      this.fb_token = token;
      localStorage.setItem('token', token);
    },
    clearUser() {
      this.name = "";
      this.uid = "";
      this.role = "";
      this.fb_token = "";

      localStorage.removeItem('user_name');
      localStorage.removeItem('user_uid');
      localStorage.removeItem('user_role');
      localStorage.removeItem('user_token');
    }
  }
});