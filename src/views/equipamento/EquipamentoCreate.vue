<template>
  <v-container fluid>
    <s-pagebar
      page-title="Incluir Equipamento"
      :breadcrumbs="breadcrumbs"
    />
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
              v-model="equipamento.proprietario"
              label="Proprietario"
              class="required"
              :error-messages="errors.proprietario"
              @input="toUpperCase('proprietario')"
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
              :error-messages="errors.municipio"
              @input="toUpperCase('municipio')"
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
              @input="toUpperCase('marca_modelo')"
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
              @input="toUpperCase('cor')"
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
              @input="toUpperCase('combustivel')"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="9"
          >
            <v-text-field
              v-model="equipamento.restricoes"
              label="Restrições"
              :error-messages="errors.restricoes"
              @input="toUpperCase('restricoes')"
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
              label="Horimetro"
              class="required"
              :error-messages="errors.horimetro"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="3"
          >
            <v-autocomplete
              v-model="equipamento.status"
              label="Status"
              class="required"
              :items="status"
              :error-messages="errors.status"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="9"
          >
            <v-text-field
              v-model="equipamento.observacao"
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
  name: 'EquipamentoCreate',
  components: { SPagebar, PromptDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Equipamento',
        'to': '/equipamento',
        'exact': true
      },
      {
        'text': 'Incluir equipamento',
        'disabled': true
      }
    ],
    categorias: [
      {text: 'GERADOR', value: 'gerador'},
      {text: 'ILUMINAÇÃO', value: 'iluminacao'},
      {text: 'GERAL', value: 'geral'},
    ],
    status:[
      {text: 'DISPONÍVEL', value: 'disponivel'},
      {text: 'INDISPONÍVEL', value: 'indisponivel'},
    ],
    categoria: {},
    equipamento: {
      uf: '',
      proprietario: '',
      municipio: '',
      numero_serie: '',
      marca_modelo: '',
      cor: '',
      ano_fabricacao: '',
      combustivel: '',
      restricoes: '',
      potencia: '',
      horimetro: '',
      status:'',
    },
    errors: {}
  }),
  methods: {
    toUpperCase(field) {
      if (this.equipamento[field] && typeof this.equipamento[field] === 'string') {
        this.equipamento[field] = this.equipamento[field].toUpperCase();
      }
    },
    async salvar() {
      const response = this.$api.create({
        resource: this.$endpoints.EQUIPAMENTO,
        data: this.equipamento
      })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Equipamento salvo com sucesso',
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