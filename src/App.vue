<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Mengambil data sesi saat komponen dibuat
      sessionData: localStorage.getItem('authToken') || 'Tidak ada data'
    };
  },
  mounted() {
    // redirect to task page if session exists
    if (this.sessionData && this.sessionData !== 'Tidak ada data') {
      this.$router.push({ name: 'TaskList' });
    } else {
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
nav {
  margin-bottom: 2em;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
