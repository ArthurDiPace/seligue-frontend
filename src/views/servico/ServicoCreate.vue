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
            md="6"
            sm="4"
          >
            <v-menu
              v-model="menuOpen"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="formattedDate"
                  label="Data de Entrada"
                  append-icon="mdi-calendar"
                  readonly
                  class="custom-date-field required"
                  :error-messages="errors.data"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="servico.data"
                no-title
                scrollable
                class="custom-date-picker"
                :error-messages="errors.data"
                @change="menuOpen = false"
              />
            </v-menu>
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="4"
          >
            <v-menu
              v-model="menuOpenSaida"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ on }">
                <v-text-field
                  v-model="formattedDateSaida"
                  label="Data de Saida"
                  append-icon="mdi-calendar"
                  readonly
                  class="custom-date-field required"
                  :error-messages="errors.data_saida"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="servico.data_saida"
                no-title
                scrollable
                class="custom-date-picker"
                :error-messages="errors.data_saida"
                @change="menuOpenSaida = false"
              />
            </v-menu>
          </v-col>
          <v-col
            cols="12"
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
            md="6"
            sm="12"
          >
            <v-textarea
              v-model="servico.observacao"
              label="Observação do serviço"
              :error-messages="errors.observacao"        
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
import moment from "moment";

export default {
  name: 'ServicoCreate',
  components: { SPagebar, ConfirmDialog },
  data() {
    return {
      breadcrumbs: [
        { 'text': 'Servico', 'to': '/servico', 'exact': true },
        { 'text': 'Cadastrar Serviço', 'disabled': true },
      ],
      servico: {
        data: null,
        data_saida: null,
        observacao: null,
        itens: null,
        preco: null,
        equipamento: null,
      },
      status: [
        { text: 'Aprovado', value: 'aprovado' },
        { text: 'Aprovado com ressalva', value: 'aprovado_com_ressalva' },
        { text: 'Reprovado', value: 'reprovado' }
      ],
      itensServico: {},
      veiculos: {},
      equipamentos: {},
      errors: {},
      clientes: {},
      funcionarios: {},
      menuOpen: false,
      menuOpenSaida: false,
    };
  },
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
    formattedDate() {
      return this.formatDate(this.servico.data);
    },
    formattedDateSaida() {
      return this.formatDate(this.servico.data_saida);
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    formatarTexto(item) {
      return `${item.id} - ${item.marca_modelo}`;
    },
    formatDate(date) {
      return date ? moment(date).format("DD/MM/YYYY") : "";
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
      this.sanitizeData();

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
    sanitizeData() {
      this.servico.preco = (this.servico.preco || "").replace(/[^\d,]/g, "").replace(",", ".").replace(/(\.\d{0,2})\d*$/, "$1");
      this.servico.data = this.formatDate(this.servico.data);
      this.servico.data_saida = this.formatDate(this.servico.data_saida);
    },
  }
}
</script>