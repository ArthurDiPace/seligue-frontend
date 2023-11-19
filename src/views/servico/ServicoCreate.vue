<template>
  <v-container fluid>
    <s-pagebar
      page-title="Cadastrar Serviço"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-title>Identificação do Serviço</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
            sm="12"
          >
            <v-autocomplete
              v-model="servico.itens"
              label="Serviço"
              :items="itensServico"
              :error-messages="errors.observacao"
              multiple 
              item-text="descricao"
              item-value="id"
            />
          </v-col>
          <v-col
            cols="12"
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
            md="4"
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
            sm="12"
          >
            <v-radio-group
              v-model="servico.categoria"
              row
              :error-messages="errors.categoria"
            >
              <v-radio
                label="Veiculo"
                value="veiculo"
              />
              <v-radio
                label="Equipamento"
                value="equipamento"
              />
            </v-radio-group>
            <v-col
              v-if="servico.categoria=='equipamento'"
              cols="12"
              md="4"
              sm="12"
            >
              <v-autocomplete
                v-model="servico.equipamento"
                label="Equipamento"
                :error-messages="errors.equipamento"
                :items="equipamentos"
                :item-text="formatarTexto"
                item-value="id"
              />
            </v-col>
            <v-col
              v-if="servico.categoria=='veiculo'"
              cols="12"
              md="4"
              sm="12"
            >
              <v-autocomplete
                v-model="servico.veiculo"
                label="Veiculo"
                :error-messages="errors.veiculo"
                :items="veiculos"
                :item-text="formatarTexto"
                item-value="id"
              />
            </v-col>
          </v-col>
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
            md="4"
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
            md="4"
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
  name: 'ServicoCreate',
  components: { SPagebar, ConfirmDialog },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Serviço',
        'to': '/servico',
        'exact': true
      },
      {
        'text': 'Cadastrar serviço',
        'disabled': true
      }
    ],
    status: [
      { text: 'Aprovado', value: 'aprovado' },
      { text: 'Aprovado com ressalva', value: 'aprovado_com_ressalva' },
      { text: 'Reprovado', value: 'reprovado' }
    ],
    servico:{},
    itensServico: [],
    funcionarios:[],
    veiculos: [],
    equipamentos: [],
    clientes: [],
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
    this.loadData();
  },
  methods: {
    toUpperCase(field) {
      if (this.servico[field] && typeof this.servico[field] === 'string') {
        this.servico[field] = this.servico[field].toUpperCase();
      }
    },
    formatarTexto(item) {
      return `${item.id} - ${item.marca_modelo}`;
    },
    async loadData() {
      await Promise.all([
        this.fetchServicoItem(),
        this.fetchFuncionario(),
        this.fetchCliente(),
        this.fetchEquipamento(),
        this.fetchVeiculo(),
      ]);
    },
    async fetchServicoItem() {
      const response = await this.$api.list({ resource: this.$endpoints.SERVICO_ITEM });
      this.itensServico = response.data.results;
    },
    async fetchFuncionario() {
      const response = await this.$api.list({ resource: this.$endpoints.FUNCIONARIO });
      this.funcionarios = response.data.results;
    },
    async fetchCliente() {
      const response = await this.$api.list({ resource: this.$endpoints.CLIENTE });
      this.clientes = response.data.results;
    },
    async fetchVeiculo() {
      const response = await this.$api.list({ resource: this.$endpoints.VEICULO });
      this.veiculos = response.data.results;
    },
    async fetchEquipamento() {
      const response = await this.$api.list({ resource: this.$endpoints.EQUIPAMENTO });
      this.equipamentos = response.data.results;
    },
    async salvar() {
      this.servico.preco = (this.servico.preco || "").replace(/[^\d,]/g, "").replace(",", ".").replace(/(\.\d{0,2})\d*$/, "$1");

      const response = this.$api.create({
        resource: this.$endpoints.SERVICO,
        id: this.servico.id,
        data: this.servico,
      });
      response
        .then(() => {
          this.$toast.open({ message: 'Serviço salvo com sucesso', type: 'success' });
          this.$router.push('/servico');
        })
        .catch(error => {
          this.errors = this.handleError(error);
        });
    },
  }
}
</script>