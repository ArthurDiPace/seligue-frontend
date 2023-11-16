<template>
  <div class="d-flex align-center justify-space-between my-3">
    <div>
      <span class="text-h5">{{ pageTitle }}</span>
      <v-breadcrumbs
        class="px-0 py-1"
        :items="items"
      />
    </div>
    <slot />
  </div>
</template>
  
  <script>
  export default {
    name: 'SPagebar',
    props: {
      pageTitle: String,
      breadcrumbs: Array,
    },
    data: () => ({
      list: [
        {
          'text': 'Início',
          'to': '/',
          'exact': true
        }
      ]
    }),
    computed: {
      items() {
        return this.list.concat(this.breadcrumbs)
      }
    }
  }
  </script>