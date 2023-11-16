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
      <v-card-text v-show="!!message">
        {{ message }}
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
          @click.native="agree"
        >
          {{ labelConfirm }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDlg',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      labelConfirm: "Confirmar",
      options: {
        color: 'grey lighten-3',
        width: 400,
        zIndex: 200,
        noconfirm: false
      }
    }
  },

  methods: {
    open(title, message, labelConfirm, options) {
      this.dialog = true
      this.title = title
      this.message = message
      if (labelConfirm) this.labelConfirm = labelConfirm
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree() {
      this.resolve(true)
      this.dialog = false
    },
    cancel() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
