<template>
  <v-app>
    <s-appbar />
    <v-main class="grey lighten-4">
      <s-toolbar />
      <router-view />
    </v-main>
  </v-app>
</template>
  
  <script>
  import SToolbar from './SToolbar.vue'
  import SAppbar from './SAppbar.vue'
  export default {
    components: { SToolbar, SAppbar },
  }
  </script>