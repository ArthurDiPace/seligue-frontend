<template>
  <v-container fluid>
    <s-pagebar
      page-title="Incluir Cliente"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-radio-group
              v-model="cliente.tipo"
              row
              class="required"
              :error-messages="errors.tipo"
            >
              <v-radio
                label="Pessoa Física"
                value="fisica"
              />
              <v-radio
                label="Pessoa Jurídica"
                value="juridica"
              />
            </v-radio-group>
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.numero_documento"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              :label="cliente.tipo=='fisica' ? 'CPF' : 'CNPJ'"
              class="required"
              :error-messages="errors.numero_documento"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="cliente.nome"
              label="Nome"
              class="required"
              :error-messages="errors.nome"
              @input="uppercaseFields('nome')"
            />
          </v-col>
          <v-col
            v-if="cliente.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.data_nascimento"
              v-mask="['##/##/####']"
              label="Data de Nascimento"
              class="required"
              :error-messages="errors.data_nascimento"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="cliente.cep"
              v-mask="['########']"
              label="CEP"
              class="required"
              :error-messages="errors.cep"
              @input="consultarCep"
            />
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
            >Clique se não localizar o CEP</a>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="cliente.endereco"
              label="Endereço"
              class="required"
              :error-messages="errors.endereco"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="cliente.numero"
              label="Número"
              class="required"
              :error-messages="errors.numero"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="cliente.complemento"
              label="Complemento"
              :error-messages="errors.complemento"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.bairro"
              label="Bairro"
              class="required"
              :error-messages="errors.bairro"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.municipio"
              label="Município"
              class="required"
              :error-messages="errors.municipio"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.uf"
              label="UF"
              class="required"
              :error-messages="errors.uf"
              :readonly="disabledEndereco"
              :loading="carregando"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.telefone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              label="Telefone"
              class="required"
              :error-messages="errors.telefone"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="cliente.email"
              label="E-mail"
              class="required"
              :error-messages="errors.email"
              @input="uppercaseFields('email')"
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
import * as ViaCepService from '@/services/cep.service'
import PromptDialog from '@/components/PromptDialog.vue'

export default {
  name: 'ClienteCreate',
  components: { SPagebar, PromptDialog },
  data: () => ({
    carregando: false,
    breadcrumbs: [
      {
        'text': 'Cliente',
        'to': '/cliente',
        'exact': true
      },
      {
        'text': 'Incluir cliente',
        'disabled': true
      }
    ],
    cliente: {
      tipo: '',
      nome: '',
      numero_documento: '',
      endereco: '',
      complemento: '',
      bairro: '',
      municipio: '',
      uf: '',
      email: '',
    },
    errors: {},
    disabledEndereco: true,
  }),
  methods: {
    uppercaseFields(field) {
      this.cliente[field] = this.cliente[field].toUpperCase();
    },
    async salvar() {
      const response = this.$api.create({
        resource: this.$endpoints.CLIENTE,
        data: this.cliente
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
    consultarCep(cep) {
      if(cep && cep.length == 8) {
        this.carregando = true
        this.disabledEndereco = true
        ViaCepService.buscarEndereco(cep).then(response => {
          Object.assign(this.cliente, {
            endereco: response.data.logradouro,
            complemento: response.data.complemento,
            bairro: response.data.bairro,
            municipio: response.data.localidade,
            uf: response.data.uf
          })
          this.carregando = false
        })
      }
      if(cep == '58000000') {
        this.disabledEndereco = false
      }
    }
  }
}
</script>

<style>
.required label::after {
    content: "*";
    color: red;
}
</style>