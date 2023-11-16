import axios from 'axios'

const viacep = axios.create({
  baseURL: 'https://viacep.com.br/ws/'
})

export const buscarEndereco = async cep => {
  cep = cep.replace('.', '')
  cep = cep.replace('-', '')

  return viacep.get(`${cep}/json`)
}