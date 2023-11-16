<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Item Serviço"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="itemServico.descricao"
              label="Descrição"
              :error-messages="errors.descricao"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          outlined
          color="blue-grey darken-4"
          @click="$router.back()"
        >
          Voltar
        </v-btn>
        <v-btn
          color="blue-grey darken-4"
          dark
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
  
  <script>
  import SPagebar from '@/layout/SPagebar.vue'
  export default {
    name: 'ItemServicoEdit',
    components: { SPagebar },
    data: () => ({
      breadcrumbs: [
        {
          'text': 'Item Servico',
          'to': '/item-servico',
          'exact': true
        },
        {
          'text': 'Editar',
          'disabled': true
        }
      ],
      itemServico: {},
      errors: {}
    }),
    created(){
      this.getItemServico(this.$route.params.id)
    },
    methods: {
      async getItemServico(id) {
        const response = await this.$api.get({
          resource: this.$endpoints.SERVICO_ITEM,
          id: id
        })
        this.itemServico = response.data
      },
      salvar() {
        const response = this.$api.create({
          resource: this.$endpoints.SERVICO_ITEM,
          data: this.itemServico
        })
        response
          .then(()=>{
            this.$toast.open({
                message: 'Serviço salvo com sucesso',
                type: 'success',
            })
            this.$router.back()
          })
          .catch(error=>this.errors = this.handleError(error))
      },
    }
  }
  </script>