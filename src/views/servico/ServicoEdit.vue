<template>
  <v-container fluid>
    <s-pagebar
      page-title="Editar Serviço"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-title>Identificação</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="numero"
              label="Registro"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="categoria"
              label="Categoria"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="cliente.nome"
              label="Cliente"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.desc_marca_modelo"
              label="Marca/Modelo"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.placa"
              label="Placa"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.chassi"
              label="Chassi"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.ano_fabricacao"
              label="Ano de Fabricação"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.desc_cor"
              label="Cor"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-text-field
              v-model="veiculo.taximetro"
              label="Taxímetro"
              disabled
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
            sm="12"
          >
            <v-autocomplete
              v-model="permissao.permissionario.ponto"
              :items="pontos"
              label="Ponto"
              item-value="id"
              disabled
            >
              <template #item="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
              <template #selection="{ item }">
                {{ item.numero }} - {{ item.endereco }}
              </template>
            </v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="permissao.observacao"
              label="Observação"
              filled
              disabled
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      flat
      class="my-3"
    >
      <v-card-title>Defeitos</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="defeito.item_vistoria"
              label="Defeito"
              :items="itensServico"
              item-text="descricao"
              item-value="id"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="defeito.observacao"
              label="Detalhes do Defeito"
              filled
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
            class="d-flex justify-end"
          >
            <v-btn
              color="primary"
              @click="incluirDefeito"
            >
              Incluir defeito na lista
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-data-table
              :headers="headersItensDefeito"
              :items="itensDefeito"
              disable-pagination
              hide-default-footer
            >
              <template #[`item.action`]="{ item }">
                <v-toolbar-items>
                  <v-btn
                    icon
                    @click="excluirDefeito(item)"
                  >
                    <v-icon class="material-icons-outlined">
                      delete
                    </v-icon>
                  </v-btn>
                </v-toolbar-items>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card
      flat
      class="my-3"
    >
      <v-card-title>Vistoria</v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="vistoria.parecer"
              :items="status"
              item-text="text"
              item-value="value"
              label="Parecer"
            />
          </v-col>
          <v-col
            v-if="vistoria.parecer=='aprovado_com_ressalva'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="vistoria.data_retorno"
              v-mask="['##/##/####']"
              label="Data de Retorno"
            />
          </v-col>
          <v-col
            cols="12"
            sm="12"
          >
            <v-textarea
              v-model="vistoria.observacao"
              label="Observação"
              filled
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
      itensDefeito: [],
      servico: {},
      veiculo: {},
      permissao: {
        permissionario: {}
      },
      status: [
        {text: 'Aprovado', value: 'aprovado'},
        {text: 'Aprovado com ressalva', value: 'aprovado_com_ressalva'},
        {text: 'Reprovado', value: 'reprovado'}
      ],
      headersItensDefeito: [
        {text: 'Defeito', value: 'item_vistoria.descricao', sortable: false},
        {text: 'Detalhes do Defeito', value: 'observacao', sortable: false},
        {text: 'Ações', value: 'action', sortable: false},
      ],
      itensServico: [],
      errors: {},
      pontos: [],
      defeito: {}
    }),
    created() {
      this.getItensServico()
      this.getServico(this.$route.params.id)
    },
    methods: {
      async getitensServico() {
        const response = await this.$api.list({
          resource: this.$endpoints.SERVICO_ITEM
        })
        this.itensServico = response.data.results
      },
      async getServico(id) {
        const response = await this.$api.get({
          resource: this.$endpoints.SERVICO,
          id: id
        })
        this.servico = response.data
        this.getVeiculo(this.servico.veiculo)
        this.getEquipamento(this.servico.equipamento)
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
      salvar() {
        this.servico.itens_defeito = this.itensDefeito.map(item=>item.id)
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
      limparDefeito() {
        this.defeito = {}
      },
      incluirDefeito() {
        const response = this.$api.create({
          resource: this.$endpoints.SERVICO_DEFEITO,
          data: this.defeito
        })
        response
          .then((res)=>{
            this.$toast.open({
                message: 'Defeito incluído com sucesso',
                type: 'success',
            })
            this.inserirDefeitoLista(res.data.id)
            this.limparDefeito()
          })
          .catch(error=>{
            this.errors = this.handleError(error)
          })
      },
      async inserirDefeitoLista(id){
        const response = await this.$api.get({
          resource: this.$endpoints.SERVICO_DEFEITO,
          id: id,
          query: {
            expand: 'item_servico'
          }
        })
        this.itensDefeito.push(response.data)
      },
      async excluirDefeito(item) {
          const res = await this.$refs.confirm.open(
            'Confirmar exclusão',
            'Tem certeza que deseja excluir este registro ?'
          )
          if (res) {
            const response = this.$api.destroy({
              resource: this.$endpoints.SERVICO_DEFEITO,
              id: item.id
            })
            response.then(()=>{
              const index = this.itensDefeito.indexOf(item)
              this.itensDefeito.splice(index, 1)
            })
          }
      },
    }
  }
  </script>