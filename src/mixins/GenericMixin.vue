<script>
import moment from 'moment'

export default {
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('seligue@user'))
    }
  },
  methods: {
    handleError(error) {
      if (error.response.status == 400) {
        const mensagensErro = error.response.data
        let listErrors = {}
        for (let itemErro in mensagensErro) {
          if (itemErro == 'non_field_errors') {
            this.$toast.open({
                message: mensagensErro[itemErro].join(','),
                type: 'error',
            })
          } else {
            listErrors[itemErro] = mensagensErro[itemErro]
          }
        }
        return listErrors
      } else if (error.response.status == 403) {
        this.$toast.open({
          message: 'Você não tem permissão para executar esta ação',
          type: 'error',
        })
        return {}
      } else {
        this.$toast.open({
          message: 'Ocorreu um erro no servidor',
          type: 'error',
        })
        return {}
      }
    },
    handleBlobError(error) {
      if (
        error.request.responseType === 'blob' &&
        error.response.data instanceof Blob &&
        error.response.data.type &&
        error.response.data.type.toLowerCase().includes('json')
      ) {
        const reader = new FileReader();

        const promise = new Promise((resolve, reject) => {
          reader.onload = () => {
            try {
              const parsedData = JSON.parse(reader.result);
              error.response.data = parsedData;
              reject(error);
            } catch (parseError) {
              reject(parseError);
            }
          };

          reader.onerror = () => {
            reject(error);
          };

          reader.readAsText(error.response.data);
        });

        promise.catch((err) => {
          this.$toast.open({
            message: err.response.data,
            type: 'error',
          });
        });
      }
    },
    formatDateTime(date) {
      if (!date) return null
      return moment(date).format('DD/MM/YYYY HH:mm:ss')
    },
    formatDateTimeWithoutSeconds(date) {
      if (!date) return null
      return moment(date).format('DD/MM/YYYY HH:mm')
    },
    formatDateTimeToDate(date) {
      if (!date) return null
      return moment(date).format('DD/MM/YYYY')
    },
  },
}
</script>

<style>
.v-toast__text {
  font-family: Roboto, sans-serif;
}
</style>