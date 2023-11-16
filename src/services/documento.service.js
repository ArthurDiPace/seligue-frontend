import http from '@/services/config'

export const carregarArquivo = ({ resource, data }) => {
  return http.post(resource, data, {
    responseType: 'blob'
  })
}