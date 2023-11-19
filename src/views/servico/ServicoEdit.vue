<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Serviço"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-title>Identificação do Serviço</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="servico.data"
              v-mask="['##/##/####']"
              label="Data de Entrada"
              class="required"
              :error-messages="errors.data"
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="servico.data_saida"
              v-mask="['##/##/####']"
              label="Data de Saida"
              class="required"
              :error-messages="errors.data_saida"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="servico.itens"
              label="Serviço"
              :items="itensServico"
              multiple
              item-text="descricao"
              item-value="id"
              :error-messages="errors.observacao"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-textarea
              v-model="servico.observacao"
              label="Observação do serviço"
              :error-messages="errors.observacao" 
              @input="toUpperCase('observacao')"       
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-autocomplete
              v-model="servico.cliente"
              label="Cliente"
              :items="clientes"
              item-text="nome"
              item-value="id"
              :error-messages="errors.cliente"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="servico.preco"
              v-mask="dynamicMask"
              label="Valor do serviço"
              :error-messages="errors.preco"        
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="servico.marca_modelo"
              label="Equipamento"
              class="required"
              readonly
              :error-messages="errors.categoria"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="servico.parecer"
              :items="status"
              item-text="text"
              item-value="value"
              label="Parecer"
              :error-messages="errors.parecer"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="servico.funcionario"
              label="Funcionário (Serviço)"
              :items="funcionarios"
              item-text="nome"
              item-value="id"
              :error-messages="errors.funcionario"
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
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
  
<script>
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import SPagebar from '@/layout/SPagebar.vue'

export default {
  name: 'ServicoEdit',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Servico',
        'to': '/servico',
        'exact': true
      },
      {
        'text': 'Editar Serviço',
        'disabled': true
      },
    ],
    status: [
      {text: 'Aprovado', value: 'aprovado'},
      {text: 'Aprovado com ressalva', value: 'aprovado_com_ressalva'},
      {text: 'Reprovado', value: 'reprovado'}
    ],
    servico: {},
    veiculo: [],
    equipamentos: [],
    clientes: [],
    funcionarios: [],
    itensServico: [],
    errors: {},
  }),
  computed: {
    dynamicMask() {
      const digitCount = (this.servico.preco || "").replace(/\D/g, '').length;

      if (digitCount <= 3) {
        return 'R$ #,##';
      } else if (digitCount <= 4) {
        return 'R$ ##,##';
      } else if (digitCount <= 5) {
        return 'R$ ###,##';
      } else if (digitCount <= 6) {
        return 'R$ #.###,##';
      } else if (digitCount <= 7) {
        return 'R$ ##.###,##';
      } else if (digitCount <= 8) {
        return 'R$ ###.###,##';
      } else {
        return 'R$ ###.###.###,##';
      }
    },
  },
  created() {
    this.getServico(this.$route.params.id)
  },
  methods: {
    toUpperCase(field) {
      if (this.servico[field] && typeof this.servico[field] === 'string') {
        this.servico[field] = this.servico[field].toUpperCase();
      }
    },
    async getServico(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.SERVICO,
        id: id
      })
      const funcionarioResponse = await this.$api.list({ 
        resource: this.$endpoints.FUNCIONARIO,
        id: id
       });
      const itensResponse = await this.$api.list({ 
        resource: this.$endpoints.SERVICO_ITEM,
        id:  id
      });
      const clienteResponse = await this.$api.list({ 
        resource: this.$endpoints.CLIENTE,
        id: id
      });

      this.clientes = clienteResponse.data.results;
      this.itensServico = itensResponse.data.results;
      this.funcionarios = funcionarioResponse.data.results;

      this.servico = response.data

      if (this.servico.veiculo) {
        this.getVeiculo(this.servico.veiculo);
      } else if (this.servico.equipamento) {
        this.getEquipamento(this.servico.equipamento);
      } 
    },
    async getVeiculo(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.VEICULO,
        id: id
      })
      this.veiculo = response.data
    },
    async getEquipamento(id) {
      const response = await this.$api.get({
        resource: this.$endpoints.EQUIPAMENTO,
        id: id
      })
      this.equipamento = response.data
    },
    async salvar() {
      this.servico.preco = (this.servico.preco || "").replace(/[^\d,]/g, "").replace(",", ".").replace(/(\.\d{0,2})\d*$/, "$1");
      const response = this.$api.update({
        resource: this.$endpoints.SERVICO,
        id: this.servico.id,
        data: this.servico
      })
      response
        .then(()=>{
          this.$toast.open({
              message: 'Serviço salvo com sucesso',
              type: 'success',
          })
          this.$router.push('/servico')
        })
        .catch(error=>{
          this.errors = this.handleError(error)
        })
    },
  }
}
</script>