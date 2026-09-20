import axios from 'axios'

const api = axios.create({ withCredentials: true })

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401 && error.config?.url !== '/api/auth/me') {
			window.dispatchEvent(new Event('auth:expired'))
		}
		return Promise.reject(error)
	},
)

export default api
