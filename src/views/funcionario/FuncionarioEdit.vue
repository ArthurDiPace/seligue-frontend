<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Funcionario"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.nome"
              label="Nome"
              :error-messages="errors.nome"
              @input="uppercaseFields('nome')"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.numero_documento"
              label="CPF"
              :error-messages="errors.numero_documento"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.cargo"
              label="Cargo/Função"
              :error-messages="errors.cargo"
              @input="uppercaseFields('cargo')"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.salario"
              v-mask="['R$ #.###,##']"
              label="Salario"
              class="required"
              :error-messages="errors.salario"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.data_nascimento"
              v-mask="['##/##/####']"
              label="Data de Nascimento"
              class="required"
              :error-messages="errors.data_nascimento"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.data_admissao"
              v-mask="['##/##/####']"
              label="Data de Admissão"
              class="required"
              :error-messages="errors.data_admissao"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.cep"
              v-mask="['########']"
              label="CEP"
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
              v-model="funcionario.endereco"
              label="Endereço"
              :error-messages="errors.endereco"
              :readonly="disabledEndereco"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.numero"
              label="Número"
              :error-messages="errors.numero"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.complemento"
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
              v-model="funcionario.bairro"
              label="Bairro"
              :error-messages="errors.bairro"
              :readonly="disabledEndereco"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.municipio"
              label="Município"
              :error-messages="errors.municipio"
              :readonly="disabledEndereco"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.uf"
              label="UF"
              :error-messages="errors.uf"
              :readonly="disabledEndereco"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="funcionario.telefone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              label="Telefone"
              :error-messages="errors.telefone"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-file-input
              v-model="funcionario.foto"
              label="Foto"
              :error-messages="errors.foto"
            />
            <img
              v-if="funcionario.foto"
              :src="fotoURL || funcionario.foto"
              alt="Foto do funcionário"
              style="max-width: 100%; margin-top: 10px;"
            >
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
  name: 'FuncionarioEdit',
  components: { SPagebar, PromptDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Funcionario',
        'to': '/funcionario',
        'exact': true
      },
      {
        'text': 'Editar funcionario',
        'disabled': true
      }
    ],
    funcionario: {},
    errors: {},
    categoria: '',
    disabledEndereco: true,
    menuOpen: false,
    menuOpenNas: false,
  }),
  computed: {
    fotoURL() {
      if (this.funcionario.foto instanceof File) {
        return URL.createObjectURL(this.funcionario.foto);
      } else {
        return '';
      }
    }
  },
  created() {
    this.getFuncionario(this.$route.params.id)
  },
  methods: {
    uppercaseFields(field) {
      this.funcionario[field] = this.funcionario[field].toUpperCase();
    },
    async getFuncionario(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.FUNCIONARIO,
        id: id
      })
      this.funcionario = response.data
    },
    async salvar() {
      const salarioNumerico = parseFloat(this.funcionario.salario.replace(/\D/g, ''));
      this.funcionario.salario = salarioNumerico / 100;
      
      const formData = new FormData();
      formData.append('nome', this.funcionario.nome);
      formData.append('numero_documento', this.funcionario.numero_documento);
      formData.append('cargo', this.funcionario.cargo);
      formData.append('salario', this.funcionario.salario);
      formData.append('data_admissao', this.funcionario.data_admissao);
      formData.append('data_nascimento', this.funcionario.data_nascimento);
      formData.append('endereco', this.funcionario.endereco);
      formData.append('cep', this.funcionario.cep);
      formData.append('numero', this.funcionario.numero);
      formData.append('complemento', this.funcionario.complemento);
      formData.append('bairro', this.funcionario.bairro);
      formData.append('municipio', this.funcionario.municipio);
      formData.append('uf', this.funcionario.uf);
      formData.append('telefone', this.funcionario.telefone);
      if (this.funcionario.foto) {
        formData.append('foto', this.funcionario.foto);
      }
      
      const response = this.$api.update({
        resource: this.$endpoints.FUNCIONARIO,
        id: this.funcionario.id,
        data: formData
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
        this.disabledEndereco = true
        ViaCepService.buscarEndereco(cep).then(response => {
          Object.assign(this.funcionario, {
            endereco: response.data.logradouro,
            complemento: response.data.complemento,
            bairro: response.data.bairro,
            municipio: response.data.localidade,
            uf: response.data.uf
          })
        })
      }
      if(cep == '58000000') {
        this.disabledEndereco = false
      }
    }
  }
}
</script>