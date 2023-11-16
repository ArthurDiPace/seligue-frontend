<template>
  <v-container fluid>
    <s-pagebar
      page-title="Clientes"
      :breadcrumbs="breadcrumbs"
    >
      <v-btn
        color="blue-grey darken-4"
        dark
        fab
        small
        @click="cadastrarCliente"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </s-pagebar>
    <v-card flat>
      <v-card-text>
        <div class="d-flex align-center">
          <div style="max-width: 200px">
            <v-text-field
              v-model="filtro.nome"
              label="Nome"
              class="mr-3"
            />
          </div>
          <div style="max-width: 500px">
            <v-text-field
              v-model="filtro.numero_documento"
              v-mask="['###.###.###-##', '##.###.###/####-##']"
              label="Numero Documento"
              class="mr-3"
            />
          </div>
          <!-- <v-btn
            color="blue-grey darken-4 mr-3"
            dark
            @click="getClientes"
          >
            <v-icon>search</v-icon>
            Pesquisar
          </v-btn> -->
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
          <template #[`item.nome`]="{ item }">
            <span v-if="!!item.nome">{{ item.nome.toUpperCase() }}</span>
          </template>
          <template #[`item.numero_documento`]="{ item }">
            <span v-if="!!item.numero_documento">{{ item.numero_documento }}</span>
          </template>
          <template #[`item.tipo`]="{ item }">
            <span v-if="!!item.tipo">{{ item.tipo.toUpperCase() }}</span>
          </template>
          <template #[`item.action`]="{ item }">
            <v-toolbar-items>
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    icon
                    v-on="on"
                    @click="editarCliente(item.id)"
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
                    :disabled="disabledButtons"
                    v-on="on"
                    @click="deletarCliente(item.id)"
                  >
                    <v-icon class="material-icons-outlined">
                      delete
                    </v-icon>
                  </v-btn>
                </template>
                <span>Deletar</span>
              </v-tooltip>
            </v-toolbar-items>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <PromptDialog ref="prompt" />
  </v-container>
</template>
  
  <script>
  import PromptDialog from '@/components/PromptDialog.vue'
  import SPagebar from '@/layout/SPagebar.vue'
  
  export default {
      name: "PessoaList",
      components: { PromptDialog, SPagebar },
      props: { disabledButtons: Boolean },
      data: () => ({
        breadcrumbs: [
          {
            'text': 'Cliente',
            'to': '/cliente',
            'exact': true
          }
        ],
        headers: [
            { text: "Nome", value: "nome" },
            { text: "CPF/CNPJ", value: "numero_documento" },
            { text: "Fisica/Juridica", value: "tipo" },
            { text: "Endereço", value: "endereco" },
            { text: "Contato", value: "telefone" },
            { text: "E-mail", value: "email" },
            { text: "Ações", value: "action" },
        ],
        totalItems: 0,
        items: [],
        options: {},
        filtro: {
          nome: '',
          numero_documento: '',
        },
        filtroAnterior: {
          nome: null,
          numero_documento: null,
        },
      }),
      watch: {
        'filtro.nome'(nome) {
          this.filtro.nome = nome.toUpperCase();
          this.getClientes();
        },
        'filtro.numero_documento'() {
          this.getClientes();
        },
        options: {
          handler() {
              this.getClientes();
          },
          deep: true
        },
      },
      methods: {
        async getClientes() {
          const { sortBy, sortDesc, page, itemsPerPage } = this.options
      
          let resetPage = false;
          let ordering = sortBy[0];
          if (sortDesc[0]) {
            ordering = `-${ordering}`;
          }

          if (
            this.filtro.nome !== this.filtroAnterior.nome ||
            this.filtro.numero_documento !== this.filtroAnterior.numero_documento
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
            nome: this.filtro.nome,
            numero_documento: this.filtro.numero_documento,
          }
          const response = await this.$api.list({
              resource: this.$endpoints.CLIENTE,
              query: query
          });
          this.items = response.data.results;
          this.totalItems = response.data.count;
        },
        cadastrarCliente() {
          this.$router.push('/cliente/cadastrar')
        },
        editarCliente(id) {
          this.$router.push(`/cliente/${id}`)
        },
        limparFiltros() {
          this.filtro = {
            nome: null,
            numero_documento: null
          }
          this.getClientes()
        },
        async deletarCliente(id) {
          const response = this.$api.destroy({
              resource: this.$endpoints.CLIENTE,
              id: id,
          });
          response
              .then(() => this.getClientes())
              .catch(err => {
              this.$toast.open({
                  message: err,
                  type: "error",
              });
          });
        },
      },
  }
  </script>