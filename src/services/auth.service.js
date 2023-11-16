import decode from 'jwt-decode'
import router from '@/router'
import axios from 'axios'
import request from '@/services/config'

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL
})

export const handleLogin = data => {
  return http.post('api/token/', data)
}

export const setToken = async (response) => {
  try {
    localStorage.setItem('seligue@accessToken', response.data.access)
    localStorage.setItem('seligue@refreshToken', response.data.refresh)
    const userInfoResponse = await request.get('/api/user-info/')
    const userInfo = userInfoResponse.data
    localStorage.setItem('seligue@user', JSON.stringify(userInfo))
    router.push('/')
  } catch (error) {
    console.error('Error setting token:', error)
  }
}

export const renewUser = async () => {
  try {
    const userInfoResponse = await request.get('/api/user-info/')
    const userInfo = userInfoResponse.data
    localStorage.setItem('seligue@user', JSON.stringify(userInfo))
    window.location.reload()
  } catch (error) {
    console.error('Error setting user:', error)
  }
}

export const isValidToken = token => {
  if (!token) {
    return false
  }

  const decoded = decode(token)
  const currentTime = Date.now() / 1000
  return decoded.exp > currentTime
}

export const refreshToken = async () => {
  http
    .post('api/token/refresh/', {refresh: localStorage.getItem('seligue@refreshToken')})
    .then(res => {
      localStorage.setItem('seligue@accessToken', res.data.access)
      localStorage.setItem('seligue@user', JSON.stringify(decode(res.data.access)))
    })
    .catch(() => {
      clearToken()
    })
}

export const clearToken = () => {
  localStorage.removeItem('seligue@accessToken')
  localStorage.removeItem('seligue@refreshToken')
  localStorage.removeItem('seligue@user')
}