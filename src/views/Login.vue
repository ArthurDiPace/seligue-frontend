<template>
  <v-app>
    <v-main class="blue-grey lighten-5 align-center justify-center">
      <v-form
        ref="form"
        class="login-form"
        @submit.prevent="login"
      >
        <v-img
          src="@/assets/logo.png"
          class="mb-6"
        />
        <v-text-field
          v-model="data.username"
          label="Usuário"
          solo
          :error-messages="errors.username"
        />
        <v-text-field
          v-model="data.password"
          label="Senha"
          solo
          :append-icon="!showPassword ? 'visibility' : 'visibility_off'"
          :type="!showPassword ? 'password' : 'text'"
          :error-messages="errors.password"
          @keydown.enter="login"
          @click:append="() => (showPassword = !showPassword)"
        /> 
        <v-btn
          type="submit"
          color="blue-grey darken-4"
          block
          large
          :loading="loading"
          :disabled="loading"
        >
          <span class="white--text">Login</span>
        </v-btn>
      </v-form>
      <v-footer
        app
        class="justify-center"
      >
        Versão {{ version }}
      </v-footer>
    </v-main>
  </v-app>
</template>
  
  <script>
  import { handleLogin, setToken } from '@/services/auth.service'
  export default {
  name: 'LoginPage',
    data: () => ({
      data: {
        username: '',
        password: '',
      },
      errors: {},
      showPassword: false,
      loading: false,
    }),
    computed: {
      version() {
        return process.env.VUE_APP_VERSION
      },
    },
    methods: {
      login() {
        this.loading = true
        this.errors = {}
        handleLogin(this.data)
          .then(res => {
            setToken(res)
          })
          .catch(error=>{
            if (error.response.status === 401) {
              this.$toast.open({
                message: error.response.data.detail,
                type: 'error',
              })
            } else if (error.response.status === 400) {
              this.errors = this.handleError(error)
            } else {
              this.$toast.open({
                message: error.message,
                type: 'error',
              })
            }
            this.loading = false
          })
      }
    }
  }
  </script>
  
  <style scoped>
  .login-form {
    max-width: 20rem;
    margin: auto;
  }
  </style>