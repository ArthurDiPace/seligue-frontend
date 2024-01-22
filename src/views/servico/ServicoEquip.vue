<template>
  <v-container fluid>
    <s-pagebar
      page-title="Serviços"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
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
            <li
              v-for="(itemServico, index) in item.itens_servico"
              :key="index"
            >
              {{ itemServico.descricao }}
            </li>
          </span>
        </template>
      </v-data-table>
    </v-card>
    <ConfirmDialog ref="confirm" />
  </v-container>
</template>
  
  <script>
  import ConfirmDialog from '@/components/ConfirmDialog.vue'
  import SPagebar from '@/layout/SPagebar.vue'
  
  export default {
    name: 'ServicoEquip',
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
        {text: 'Horímetro', value: 'horimetro'},
        {text: 'Data do Serviço', value: 'data'},
        {text: 'Serviço', value: 'itens_servico'},
        {text: 'Observação', value: 'observacao'},
        {text: 'Funcionário', value: 'funcionario_nome'},
      ],
      categoria: [
      {text: 'VEICULO', value: 'veiculo'},
      {text: 'GERADOR', value: 'gerador'},
      {text: 'ILUMINAÇÃO', value: 'iluminacao'},
      {text: 'GERAL', value: 'geral'},
      ],
      totalItems: 0,
      items: [],
      options: {},
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
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;
        const equipamento = this.$route.params.id;

        let resetPage = false;
        let ordering = sortBy[0];
        if (sortDesc[0]) {
          ordering = `-${ordering}`;
        }

        ordering = `${sortDesc && sortDesc[0] ? '-' : ''}${sortBy}`;

        const query = {
          page: resetPage ? 1 : page,
          page_size: itemsPerPage,
          ordering: ordering,
          equipamento: equipamento,
        };

        const response = await this.$api.list({
          resource: this.$endpoints.SERVICO,
          query: query,
        });

        this.items = response.data.results;
        this.totalItems = response.data.count;
      }
    },
  }
  </script>