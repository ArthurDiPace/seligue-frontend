<template>
  <v-container fluid>
    <s-pagebar
      page-title="Serviços"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="cadastrarServico"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 200px">
            <v-autocomplete
              v-model="filtro.categoria"
              label="Categoria"
              :items="categorias"
              class="mr-3"
            />
          </div>
          <div style="max-width: 500px">
            <v-autocomplete
              v-model="filtro.parecer"
              label="Parecer"
              :items="itensParecer"
              class="mr-3"
            />
          </div>
          <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getServico"
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
          <template #[`item.parecer`]="{ item }">
            <v-chip
              :color="corParecer(item.parecer)"
              dark
            >
              {{ labelParecer(item.parecer) }}
            </v-chip>
          </template>
          <template #[`item.equipamento`]="{ item }">
            <span v-if="!!item.veiculo">{{ item.veiculo.toString().padStart(4, '0') }}</span>
            <span v-if="!!item.equipamento">{{ item.equipamento.toString().padStart(4, '0') }}</span>
          </template>
          <template #[`item.categoria`]="{ item }">
            <span v-if="item.categoria=='gerador'">GERADOR</span>
            <span v-if="item.categoria=='veiculo'">VEICULO</span>
            <span v-if="item.categoria=='iluminacao'">ILUMINAÇÃO</span>
            <span v-if="item.categoria=='geral'">GERAL</span>
          </template>
          <template #[`item.servico`]="{ item }">
            <span v-if="item.itens_servico && item.itens_servico.length > 0">
              <li v-for="(itemServico, index) in item.itens_servico" :key="index">
                {{ itemServico.descricao }}
              </li>
            </span>
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarServico(item.id)"       
                  >
                    <v-icon class="material-icons-outlined">
                      visibility
                    </v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="imprimirParecer(item.id)"       
                  >
                    <v-icon class="material-icons-outlined">
                      print
                    </v-icon>
                  </v-btn>
                </template>
                <span>Imprimir</span>
              </v-tooltip>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
  
  <script>
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import SPagebar from '@/layout/SPagebar.vue'
  import * as documentoService from '@/services/documento.service'
  
  export default {
    name: 'ServicoList',
    components: { SPagebar, ConfirmDialog },
    data: () => ({
      breadcrumbs: [
        {
          'text': 'Servico',
          'to': '/servico',
          'exact': true
        }
      ],
      headers: [
        {text: 'Equipamento', value: 'equipamento'},
        {text: 'Categoria', value: 'categoria'},
        {text: 'Marca/Modelo', value: 'marca_modelo'},
        {text: 'Data do Serviço', value: 'data'},
        {text: 'Data da Entrega', value: 'data_saida'},
        {text: 'Serviço', value: 'itens_servico'},
        {text: 'Parecer', value: 'parecer'},
        {text: 'Observação', value: 'observacao'},
        {text: 'Cliente', value: 'cliente_nome'},
        {text: 'Funcionário', value: 'funcionario_nome'},
        {text: 'Ações', value: 'action'},
      ],
      categorias: [
      {text: 'VEICULO', value: 'veiculo'},
      {text: 'GERADOR', value: 'gerador'},
      {text: 'ILUMINAÇÃO', value: 'iluminacao'},
      {text: 'GERAL', value: 'geral'},
      ],
      totalItems: 0,
      items: [],
      options: {},
      categoria:{},
      filtro: {
        categoria: '',
        parecer: '',
      },
      filtroAnterior: {
        categoria: null,
        parecer: null,
      },
      itensParecer: [
        {text: 'Pendente', value: 'pendente'},
        {text: 'Aprovado', value: 'aprovado'},
        {text: 'Aprovado com Ressalva', value: 'aprovado_com_ressalva'},
        {text: 'Reprovado', value: 'reprovada'},
      ],
    }),
    watch: {
      options: {
        handler() {
          this.getServico()
        },
        deep: true
      },
    },
    methods: {
      async getServico() {
        const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
        let resetPage = false;
        let ordering = sortBy[0];
        if (sortDesc[0]) {
          ordering = `-${ordering}`;
        }

        if (
          this.filtro.categoria !== this.filtroAnterior.categoria ||
          this.filtro.parecer !== this.filtroAnterior.parecer
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
          parecer: this.filtro.parecer,
        }
        const response = await this.$api.list({
          resource: this.$endpoints.SERVICO,
          query: query
        })
        this.items = response.data.results
        this.totalItems = response.data.count
      },
      cadastrarServico() {
        this.$router.push('/servico/cadastrar')
      },
      editarServico(id) {
        this.$router.push(`/servico/${id}`)
      },
      limparFiltros() {
        this.filtro = {
          categoria: null,
          parecer: null
        }
        this.getServico()
      },
      async imprimirParecer(servicoId) {
        let request = documentoService.carregarArquivo({
            resource: this.$endpoints.SERVICO_LAUDO,
            data: {
              servico: servicoId,
              tipo_documento: 'laudo_servico'
            }
          })
          request
            .then(response => {
              const downloadUrl = window.URL.createObjectURL(response.data)
              window.open(downloadUrl, '__blank')
            })
            .catch((error) => {
              this.handleBlobError(error)
            });
      },
      corParecer(parecer) {
        const colors = {
          'aprovado': 'green darken-1',
          'reprovado': 'red darken-1',
          'aprovado_com_ressalva': 'orange darken-1'
        };
  
        return colors[parecer] || 'grey darken-1';
      },
      labelParecer(parecer) {
        const labels = {
          'aprovado': 'Aprovado',
          'reprovado': 'Reprovado',
          'aprovado_com_ressalva': 'Aprovado com ressalva'
        };
  
        return labels[parecer] || 'Pendente';
      }
    }
  }
  </script>