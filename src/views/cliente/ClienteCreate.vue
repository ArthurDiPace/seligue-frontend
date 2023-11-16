<template>
  <v-container fluid>
    <s-pagebar
      page-title="Incluir pessoa"
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
              v-model="pessoa.tipo"
              row
              class="required"
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
            <v-autocomplete
              v-model="pessoa.funcao"
              :items="_funcoes"
              label="Função"
              class="required"
              :error-messages="errors.funcao"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.numero_documento"
              :label="pessoa.tipo=='fisica' ? 'CPF' : 'CNPJ'"
              class="required"
              :error-messages="errors.numero_documento"
              @input="consultarCondutor"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.nome"
              label="Nome"
              class="required"
              :error-messages="errors.nome"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.data_nascimento"
              label="Data de Nascimento"
              class="required"
              :error-messages="errors.data_nascimento"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh"
              label="CNH"
              :error-messages="errors.cnh"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh_categoria"
              label="Categoria CNH"
              :error-messages="errors.cnh_categoria"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            v-if="pessoa.tipo=='fisica'"
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cnh_validade"
              label="Validade CNH"
              :error-messages="errors.cnh_validade"
              :loading="carregandoCondutor"
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.cep"
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
              v-model="pessoa.endereco"
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
              v-model="pessoa.numero"
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
              v-model="pessoa.complemento"
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
              v-model="pessoa.bairro"
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
              v-model="pessoa.municipio"
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
              v-model="pessoa.uf"
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
              v-model="pessoa.telefone"
              v-mask="['(##) ####-####', '(##) #####-####']"
              label="Telefone"
              class="required"
              :error-messages="errors.telefone"
            />
          </v-col>
          <v-col
            v-if="categoria=='turismo'"
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.inscricao_municipal"
              label="Inscrição Municipal"
              class="required"
              :error-messages="errors.inscricao_municipal"
            />
          </v-col>
          <v-col
            v-if="categoria=='turismo'"
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="pessoa.registro_ministerio_turismo"
              label="Registro Ministério de Turismo"
              class="required"
              :error-messages="errors.registro_ministerio_turismo"
            />
          </v-col>
          <v-col
            v-if="pessoa.funcao=='permissionario' && categoria=='taxi'"
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="pessoa.ponto"
              :items="pontos"
              label="Ponto"
              class="required"
              item-value="id"
              :error-messages="errors.ponto"
            >
              <template #item="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
              <template #selection="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
            </v-autocomplete>
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
    name: 'PessoaCreate',
    components: { SPagebar, PromptDialog },
    data: () => ({
      carregando: false,
      carregandoCondutor: false,
      breadcrumbs: [
        {
          'text': 'Permissões',
          'to': '/permissao',
          'exact': true
        },
        {
          'text': 'Detalhes',
          'disabled': true
        },
        {
          'text': 'Incluir pessoa',
          'disabled': true
        }
      ],
      funcoes: [
        {text: 'Permissionário', value: 'permissionario'},
        {text: 'Auxiliar', value: 'auxiliar', categorias: ['turismo', 'escolar', 'taxi']},
        {text: 'Acompanhante', value: 'acompanhante', categorias: ['escolar'] },
        {text: 'Cooperado', value: 'cooperado', categorias: ['turismo']},
        {text: 'Condutor', value: 'condutor', categorias: ['fretamento']},
      ],
      pontos: [],
      pessoa: {
        tipo: 'fisica',
        nome: '',
        cnh: '',
        cnh_categoria: '',
        cnh_validade: null,
        endereco: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
      },
      errors: {},
      categoria: '',
      disabledEndereco: true,
    }),
    computed: {
      _funcoes() {
        return this.funcoes.filter(item=> !item.categorias || item.categorias.includes(this.categoria))
      }
    },
    created() {
      this.pessoa.permissao = this.$route.query.permissao
      this.categoria = this.$route.query.categoria
      this.getPontos()
    },
    methods: {
      async getPontos() {
        const response = await this.$api.list({
          resource: this.$endpoints.PONTO
        })
        this.pontos = response.data.results
      },
      async salvar() {
        const response = this.$api.create({
          resource: this.$endpoints.PESSOA,
          data: this.pessoa
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
            Object.assign(this.pessoa, {
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