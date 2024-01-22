<template>
  <v-container fluid>
    <s-pagebar
      page-title="Equipamentos"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="cadastrarEquipamento"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.id"
              label="Número"
              class="mr-3"
            />
          </div>
          <div style="max-width: 500px">
            <v-autocomplete
              v-model="filtro.categoria"
              label="Categoria"
              :items="categorias"
              class="mr-3"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getEquipamentos"
          >
            <v-icon>search</v-icon>
            Pesquisar
          </v-btn>
          <v-btn
            outlined
            color="blue-grey darken-4"
            @click="limparFiltros"
          >
            Limpar filtros
          </v-btn>
        </div>
        <v-data-table
          :headers="headers"
          :items="items"
          :options.sync="options"
          :server-items-length="totalItems"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [10, 20, 30]
          }"
        >
          <template #[`item.id`]="{ item }">
            <span v-if="!!item.id">{{ item.id.toString().padStart(4, '0') }}</span>
          </template>
          <template #[`item.categoria`]="{ item }">
            <span v-if="item.categoria=='gerador'">GERADOR</span>
            <span v-if="item.categoria=='veiculo'">VEICULO</span>
            <span v-if="item.categoria=='iluminacao'">ILUMINAÇÃO</span>
            <span v-if="item.categoria=='geral'">GERAL</span>
          </template>
          <template #[`item.horimetro`]="{ item }">
            <span v-if="item.categoria === 'veiculo'">{{ item.odometro }} Km</span>
            <span v-else>{{ item.horimetro }} Horas</span>
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip
              v-if="item.status=='disponivel'"
              color="green"
              dark
            >
              {{ item.status }}
            </v-chip>
            <v-chip
              v-if="item.status=='indisponivel'"
              color="red"
              dark
            >
              {{ item.status }}
            </v-chip>
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarEquipamento(item.id)"
                  >
                    <v-icon class="material-icons-outlined">
                      visibility
                    </v-icon>
                  </v-btn>
                </template>
                <span>Visualizar</span>
              </v-tooltip>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SPagebar from '@/layout/SPagebar.vue'
export default {
  name: 'EquipamentoList',
  components: { SPagebar },
  data: () => ({
    breadcrumbs: [
      {
        'text': 'Equipamentos',
        'to': '/equipamento',
        'exact': true
      }
    ],
    categorias: [
      {text: 'GERADOR', value: 'gerador'},
      {text: 'ILUMINAÇÃO', value: 'iluminacao'},
      {text: 'GERAL', value: 'geral'},
    ],
    headers: [
      {text: 'Registro', value: 'id'},
      {text: 'Categoria', value: 'categoria'},
      {text: 'Marca/Modelo', value: 'marca_modelo'},
      {text: "Status", value: "status" },
      {text: "Potência", value: "potencia" },
      {text: "Horímetro", value: "horimetro"},
      {text: "Observações", value: "observacao" },
      {text: 'Ações', value: 'action'},
    ],
    categoria:{},
    id:{},
    filtro: {
      id: '',
      categoria: '',
    },
    totalItems: 0,
    items: [],
    options: {},
    dialog: false,   
    errors: [],
    filtroAnterior: {
      id: null,
      categoria: null,
    },
  }),
  watch: {
    options: {
      handler() {
        this.getEquipamentos()
      },
      deep: true
    },
  },
  methods: {
    toUpperCaseItems(items) {
      return items.map(item => {
        return {
          id: item.id,
          categoria: item.categoria,
          marca_modelo: item.marca_modelo.toUpperCase(),
          status: item.status,
          potencia: typeof item.potencia === 'string' ? item.potencia.toUpperCase() : item.potencia,
          horimetro: typeof item.horimetro === 'string' ? item.horimetro.toUpperCase() : item.horimetro,
          odometro: typeof item.odometro === 'string' ? item.odometro.toUpperCase() : item.odometro,
          observacao: typeof item.observacao === 'string' ? item.observacao.toUpperCase() : item.observacao,
        };
      });
    },
    async getEquipamentos() {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
      let resetPage = false;
      let ordering = sortBy[0];
      if (sortDesc[0]) {
        ordering = `-${ordering}`;
      }

      if (
        this.filtro.categoria !== this.filtroAnterior.categoria ||
        this.filtro.id !== this.filtroAnterior.id
      ) {
        resetPage = true;
        this.options.page = 1;
        this.filtroAnterior = { ...this.filtro };
      }
      
      ordering = `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`;
      
      const query = {
        page: resetPage ? 1 : page,
        page_size: itemsPerPage,
        ordering: ordering,
        categoria: this.filtro.categoria,
        id: this.filtro.id,
      }
      const response = await this.$api.list({
              resource: this.$endpoints.EQUIPAMENTO,
              query: query
          });
          this.items = response.data.results;
          this.totalItems = response.data.count;
    },
    cadastrarEquipamento() {
      this.$router.push('/equipamento/cadastrar')
    },
    editarEquipamento(id) {
      this.$router.push(`/equipamento/${id}`)
    },
    limparFiltros() {
      this.filtro = {
        id: null,
        categoria: null,
      }
      this.getEquipamentos()
    },
  }
}
</script>