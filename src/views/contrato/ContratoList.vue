<template>
  <v-container fluid>
    <s-pagebar
      page-title="Emitir Documento"
      :breadcrumbs="breadcrumbs"
    />
    <v-card flat>
      <v-card-text>
        <v-row dense>
          <v-col
            cols="12"
            sm="12"
          >
            <v-autocomplete
              v-model="documento.tipo_documento"
              :items="tiposDocumento"
              label="Tipo de Documento"
              :error-messages="errors.tipo_documento"
            />
          </v-col>
          <v-col
            v-if="documento.tipo_documento === 'contrato'"
            cols="12"
            sm="12"
          >
            <v-text-field
              v-model="documento.numero"
              label="Número do Contrato"
              :error-messages="errors.numero"
            />
            <v-text-field
              v-model="documento.numero_documento"
              label="CPF/CNPJ"
              :error-messages="errors.numero_documento"
            />
            <v-text-field
              v-model="documento.nome"
              label="Nome"
              :error-messages="errors.nome"
            />
            <v-date-picker
              v-model="documento.data_inicio"
              label="Data de Início"
              :error-messages="errors.data_inicio"
            />
            <v-date-picker
              v-model="documento.data_termino"
              label="Data de Término"
              :error-messages="errors.data_termino"
            />
            <v-text-field
              v-model="documento.equipamento"
              label="Equipamento"
              :error-messages="errors.equipamento"
            />
            <v-text-field
              v-model="documento.potencia_kw"
              label="Potência (kW)"
              :error-messages="errors.potencia_kw"
            />
            <v-text-field
              v-model="documento.marca_modelo"
              label="Marca/Modelo"
              :error-messages="errors.marca_modelo"
            />
            <v-text-field
              v-model="documento.local_entrega"
              label="Local de Entrega"
              :error-messages="errors.local_entrega"
            />
            <v-text-field
              v-model="documento.servicos_inclusos"
              label="Serviços Inclusos"
              :error-messages="errors.servicos_inclusos"
            />
            <v-text-field
              v-model="documento.valor_aluguel"
              label="Valor"
              :error-messages="errors.valor_aluguel"
            />
            <v-text-field
              v-model="documento.deposito_seguranca"
              label="Depósito de Segurança"
              :error-messages="errors.deposito_seguranca"
            />
            <v-text-field
              v-model="documento.taxas_adicionais"
              label="Taxas Adicionais"
              :error-messages="errors.taxas_adicionais"
            />
            <v-text-field
              v-model="documento.condicoes_especificas"
              label="Condições Específicas"
              :error-messages="errors.condicoes_especificas"
            />
            <v-text-field
              v-model="documento.estado_inicial_gerador"
              label="Estado Inicial do Gerador"
              :error-messages="errors.estado_inicial_gerador"
            />
            <v-switch
              v-model="documento.pago"
              label="Pago"
              :error-messages="errors.pago"
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
          :loading="loading"
          @click="salvar"
        >
          Gerar
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog
      v-model="dialogConfirmacao"
      persistent
      width="1024"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Confirme os dados para emissão do arquivo</span>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              sm="12"
              md="2"
            >
              <v-text-field
                v-model="documento.numero"
                label="Número do Contrato"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                v-model="documento.equipamento"
                label="Equipamento"
              />
            </v-col>
            <v-col
              cols="12"
              sm="12"
              md="6"
            >
              <v-text-field
                v-model="documento.valor_aluguel"
                label="Valor"
                :error-messages="errors.valor_aluguel"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            text
            class="body-2 font-weight-bold"
            @click="closeDialogConfirmacao"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            class="body-2 font-weight-bold"
            text
            @click="saveDialogConfirmacao"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
    
  <script>
  import SPagebar from '@/layout/SPagebar.vue'
  import * as documentoService from '@/services/documento.service'
  
  export default {
    name: 'DocumentoList',
    components: { SPagebar },
    data: () => ({
      breadcrumbs: [
        {
          'text': 'Documentos',
          'to': '/documento',
          'exact': true
        },
      ],
      dialogConfirmacao: false,
      carregandoCondutor: false,
      documento: {},
      errors: {},
      tiposDocumento: [
        {text: "Contrato", value: "contrato"},
      ],
      loading: false,
    }),
    methods: {
      salvar() {
        this.enviarRequisicao()
      },
      enviarRequisicao() { 
        this.loading = true 
        let request = documentoService.carregarArquivo({
          resource: this.$endpoints.DOCUMENTO,
          data: this.documento
        })
        request
          .then(response => {
            this.loading = false
            const downloadUrl = window.URL.createObjectURL(response.data)
            window.open(downloadUrl, '__blank')
          })
          .catch((error) => {
            this.handleBlobError(error)
            this.loading = false
          });
      },
      closeDialogConfirmacao() {
        this.loading = false
        this.dialogConfirmacao = false
      },
      saveDialogConfirmacao() {
        this.enviarRequisicao()
        this.dialogConfirmacao = false
      }
    }    
  }
  </script>