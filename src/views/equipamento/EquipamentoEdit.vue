<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Equipamento"
      :breadcrumbs="breadcrumbs"
    >
      <v-menu offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            color="blue-grey darken-4"
            dark
            fab
            small
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            link
            :to="`servico/${equipamento.id}`"
          >
            <v-list-item-title>Visualizar Serviços</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-autocomplete
              v-model="equipamento.categoria"
              label="Categoria"
              class="required"
              readonly
              :items="categorias"
              :error-messages="errors.categoria"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="equipamento.uf"
              label="UF"
              class="required"
              readonly
              :error-messages="errors.uf"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="equipamento.proprietario"
              label="Proprietario"
              class="required"
              readonly
              :error-messages="errors.proprietario"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-text-field
              v-model="equipamento.municipio"
              label="Municipio"
              class="required"
              readonly
              :error-messages="errors.municipio"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <v-text-field
              v-model="equipamento.numero_serie"
              label="N° Serie"
              class="required"
              :error-messages="errors.numero_serie"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="equipamento.marca_modelo"
              label="Marca/Modelo"
              class="required"
              :error-messages="errors.marca_modelo"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="equipamento.cor"
              label="Cor"
              class="required"
              :error-messages="errors.cor"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="equipamento.ano_fabricacao"
              label="Ano de Fabricação"
              class="required"
              :error-messages="errors.ano_fabricacao"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="equipamento.combustivel"
              label="Combustivel"
              class="required"
              :error-messages="errors.combustivel"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="equipamento.potencia"
              label="Potência"
              class="required"
              :error-messages="errors.potencia"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="equipamento.horimetro"
              label="horimetro"
              class="required"
              :error-messages="errors.horimetro"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="equipamento.status"
              label="Status"
              class="required"
              :error-messages="errors.status"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="equipamento.restricoes"
              label="Restrições"
              filled
              :error-messages="errors.restricoes"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="equipamento.observacao"
              label="Observações"
              filled
              class="required"
              :error-messages="errors.observacao"
              multi-line
              rows="5"
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
      <prompt-dialog ref="prompt" />
    </v-card>
  </v-container>
</template>
  
<script>
import SPagebar from '@/layout/SPagebar.vue'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'EquipamentoEdit',
  components: { SPagebar, PromptDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Equipamento',
        'to': '/equipamento',
        'exact': true
      },
      {
        'text': 'Editar equipamento',
        'disabled': true
      }
    ],
    categorias: [
      {text: 'Gerador', value: 'gerador'},
      {text: 'Iluminacao', value: 'iluminacao'},
      {text: 'Geral', value: 'geral'},
    ],
    status:[
      {text: 'Disponível', value: 'disponivel'},
      {text: 'Indisponível', value: 'indisponivel'},
    ],
    equipamento: {},
    errors: {}
  }),
  async created() {
    await this.getEquipamento(this.$route.params.id);
    this.equipamento.status = this.equipamento.status.toUpperCase();
  },
  methods: {
    async getEquipamento(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.EQUIPAMENTO,
        id: id
      })
      this.equipamento = response.data
    },
    async salvar() {
      this.equipamento.status = this.equipamento.status.toLowerCase();
      const response = this.$api.update({
        resource: this.$endpoints.EQUIPAMENTO,
        id: this.equipamento.id,
        data: this.equipamento
      })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Registro salvo com sucesso',
              type: 'success',
          })
          this.$router.back()
        })
        .catch(error=>{
          this.errors = this.handleError(error)
        })
      }
    }
  }
</script>