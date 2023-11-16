<template>
  <v-container fluid>
    <s-pagebar
      page-title="Incluir veículo"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <!-- <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-autocomplete
              v-model="veiculo.categoria"
              label="Categoria"
              class="required"
              :items="categorias"
              :error-messages="errors.categoria"
            />
          </v-col> -->
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.placa"
              label="Placa"
              class="required"
              :error-messages="errors.placa"
              @input="toUpperCase('placa')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.uf"
              label="UF"
              class="required"
              :error-messages="errors.uf"
              @input="toUpperCase('uf')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="4"
          >
            <v-text-field
              v-model="veiculo.municipio"
              label="Município"
              class="required"
              :error-messages="errors.municipio"
              @input="toUpperCase('municipio')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-text-field
              v-model="veiculo.proprietario"
              label="Proprietário"
              class="required"
              :error-messages="errors.proprietario"
              @input="toUpperCase('proprietario')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="2"
          >
            <v-text-field
              v-model="veiculo.chassi"
              label="Chassi"
              class="required"
              :error-messages="errors.chassi"
            />
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.odometro"
              label="Odometro"
              class="required"
              :error-messages="errors.odometro"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.cor"
              label="Cor"
              class="required"
              :error-messages="errors.cor"
              @input="toUpperCase('cor')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="9"
          >
            <v-text-field
              v-model="veiculo.marca_modelo"
              label="Marca/Modelo"
              class="required"
              :error-messages="errors.marca_modelo"
              @input="toUpperCase('marca_modelo')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.ano_fabricacao"
              label="Ano Fabricação"
              class="required"
              :error-messages="errors.ano_fabricacao"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.ano_modelo"
              label="Ano Modelo"
              class="required"
              :error-messages="errors.ano_modelo"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="1"
          >
            <v-text-field
              v-model="veiculo.licenciamento"
              label="Licenciamento"
              class="required"
              :error-messages="errors.licenciamento"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-text-field
              v-model="veiculo.combustivel"
              label="Combustível"
              class="required"
              :error-messages="errors.combustivel"
              @input="toUpperCase('combustivel')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-autocomplete
              v-model="veiculo.status"
              label="Status"
              class="required"
              :items="status"
              :error-messages="errors.status"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="veiculo.restricoes"
              filled
              label="Restrições"
              :error-messages="errors.restricoes"
              @input="toUpperCase('restricoes')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="veiculo.observacao"
              filled
              label="Observação"
              :error-messages="errors.observacao"
              @input="toUpperCase('observacao')"
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
  name: 'VeiculoCreate',
  components: { SPagebar, PromptDialog },
  data: () => ({
    carregando: false,
    breadcrumbs: [
      {
        'text': 'VeiculoCreate',
        'to': '/veiculo',
        'exact': true
      },
      {
        'text': 'Detalhes',
        'disabled': true
      },
      {
        'text': 'Incluir veículo',
        'disabled': true
      }
    ],
    categorias: [
      {text: 'Veiculo', value: 'veiculo'},
    ],
    status: [
      {text: 'DISPONÍVEL', value: 'disponivel'},
      {text: 'INDISPONÍVEL', value: 'indisponivel'},
    ],
    categoria:'veiculo',
    veiculo: {
      placa: '',
      uf: '',
      proprietario: '',
      municipio: '',
      chassi: '',
      odometro: '',
      marca_modelo: '',
      cor: '',
      ano_fabricacao: '',
      ano_modelo: '',
      combustivel: '',
      status: '',
      licenciamento: '',
      restricoes: '',
      observacao: '',
    },
    errors: {}
  }),
  methods: {
    toUpperCase(field) {
      if (this.veiculo[field] && typeof this.veiculo[field] === 'string') {
        this.veiculo[field] = this.veiculo[field].toUpperCase();
      }
    },
    async salvar() {
      const response = this.$api.create({
        resource: this.$endpoints.VEICULO,
        data: this.veiculo
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
    },
  }
}
</script>

<style>
.required label::after {
    content: "*";
    color: red;
}
</style>