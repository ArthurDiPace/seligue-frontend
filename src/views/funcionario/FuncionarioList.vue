<template>
  <div>
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
      <template #[`item.pre_cadastro`]="{ item }">
        <v-chip
          v-if="item.pre_cadastro"
          color="red darken-2"
          dark
        >
          Pré-cadastro
        </v-chip>
        <v-chip
          v-else
          color="green darken-2"
          dark
        >
          Cadastro
        </v-chip>
      </template>
      <template #[`item.action`]="{ item }">
        <v-toolbar-items>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                :disabled="disabledButtons"
                v-on="on"
                @click="cancelarOficios(item.numero_documento)"            
              >
                <v-icon class="material-icons-outlined">
                  cancel_presentation
                </v-icon>
              </v-btn>
            </template>
            <span>Cancelar Oficio</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                icon
                :disabled="disabledButtons"
                v-on="on"
                @click="editarPessoa(item)"
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
                @click="deletarPessoa(item.id)"
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
    <PromptDialog ref="prompt" />
  </div>
</template>
  
  <script>
  import PromptDialog from '@/components/PromptDialog.vue'
  
  export default {
      name: "PessoaList",
      components: {
        PromptDialog
      },
      props: {
          permissao: Object,
          disabledButtons: Boolean
      },
      data: () => ({
          headers: [
              { text: "CPF/CNPJ", value: "numero_documento" },
              { text: "Nome", value: "nome" },
              { text: "Função", value: "funcao" },
              { text: "Pré-cadastro", value: "pre_cadastro" },
              { text: "Ações", value: "action" },
          ],
          totalItems: 0,
          items: [],
          options: {},
      }),
      watch: {
          options: {
              handler() {
                  this.getPessoas();
              },
              deep: true
          },
      },
      methods: {
          async getPessoas() {
            const { sortBy, sortDesc, page, itemsPerPage } = this.options;
            const query = {
                permissao: this.permissao.id,
                page: page,
                page_size: itemsPerPage,
                ordering: `${sortDesc && sortDesc[0] ? "-" : ""}${sortBy}`
            };
            const response = await this.$api.list({
                resource: this.$endpoints.PESSOA,
                query: query
            });
            this.items = response.data.results;
            this.totalItems = response.data.count;
          },
          editarPessoa(item) {
            if(item.pre_cadastro) {
              this.$router.push(`/pessoa/precadastro/${item.id}`)
            } else {
              this.$router.push(`/pessoa/${item.id}`)
            }
          },
          async deletarPessoa(pessoaId) {
              const res = await this.$refs.prompt.open(
                'Requerimento',
                'Informe o número do requerimento',
                'Número do requerimento'
              )
              if (res) {
              const response = this.$api.destroy({
                  resource: this.$endpoints.PESSOA,
                  id: pessoaId,
                  data: {
                    numero_requerimento: res
                  }
              });
              response
                  .then(() => this.getPessoas())
                  .catch(err => {
                  this.$toast.open({
                      message: err,
                      type: "error",
                  });
              });
            }
          },
          cancelarOficios(numeroDocumento) {
            const response = this.$api.create({
              resource: this.$endpoints.CANCELAR_OFICIOS,
              data: {
                numero_documento: numeroDocumento
              }
            })
            response
              .then(()=>{
                this.$toast.open({
                    message: 'Ofícios cancelados com sucesso',
                    type: 'success',
                })
              })
              .catch(error=>{
                this.errors = this.handleError(error)
              })
          },
        },
  }
  </script>