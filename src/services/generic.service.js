import http from '@/services/config'

class APIProvider {

  list ({ resource, query, responseType }) {
    return http.get(`${resource}/`, {
      responseType: responseType,
      params: query
    })
  }

  get ({ resource, id, query, responseType }) {
    return http.get(`${resource}/${id}/`, {
      responseType: responseType,
      params: query
    })
  }

  create ({ resource, data, query }) {
    return http.post(`${resource}/`, data, {
      params: query
    })
  }

  update ({ resource, id, data, query }) {
    return http.patch(`${resource}/${id}/`, data, {
      params: query
    })
  }

  destroy ({ resource, id, data }) {
    return http.delete(`${resource}/${id}/`, {data: data})
  }
}

export default new APIProvider()