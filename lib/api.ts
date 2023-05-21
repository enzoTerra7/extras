import axios from 'axios'
import { redirect } from 'next/navigation';

const token = localStorage.getItem('token')
// process.env.REACT_BASE_URL

const api = axios.create({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    typetoken: 1
  }
})

api.interceptors.request.use(async (config: any) => {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
  return config
})

api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const err = error
    console.log('erro-interceptor', err)
    if (err.status === 401) {
      localStorage.removeItem('token')
      redirect('/')
    } else {
      return Promise.reject(error)
    }
  }
)

export default api
