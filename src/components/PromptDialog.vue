<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        <div v-show="!!message">
          {{ message }}
        </div>
        <v-text-field
          v-model="motivo"
          :label="label"
        />
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer />
        <v-btn
          v-if="!options.noconfirm"
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="cancel"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          class="body-2 font-weight-bold"
          text
          :disabled="!motivo.length"
          @click.native="agree"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
  <script>
  export default {
    name: 'PromptDlg',
    data() {
      return {
        dialog: false,
        resolve: null,
        reject: null,
        message: null,
        motivo: '',
        title: null,
        label: null,
        options: {
          color: 'grey lighten-3',
          width: 400,
          zIndex: 200,
          noconfirm: false
        }
      }
    },
  
    methods: {
      open(title, message, label, options) {
        this.dialog = true
        this.title = title
        this.message = message
        this.label = label
        this.options = Object.assign(this.options, options)
        return new Promise((resolve, reject) => {
          this.resolve = resolve
          this.reject = reject
        })
      },
      agree() {
        this.resolve(this.motivo)
        this.motivo = ''
        this.dialog = false
      },
      cancel() {
        this.resolve(false)
        this.motivo = ''
        this.dialog = false
      }
    }
  }
  </script>
  