import axios from 'axios'

const instance = axios.create({ baseURL: '/api' })

const showError = (message?: string) => {
  window.$message.error(message ?? '请求出错了~', {
    duration: 5000,
    closable: true,
  })
}

instance.interceptors.response.use(
  response => {
    const rd = response.data as ResponseData
    if (!response.status.toString().startsWith('2')) {
      return Promise.reject(response)
    }
    if (rd.ok === false || (rd.code && rd.code != 0)) {
      if (isNil(rd.ok)) rd.ok = false
      if (isNil(rd.code)) rd.code = 1
      showError(rd.message)
    } else {
      if (isNil(rd.ok)) rd.ok = true
      if (isNil(rd.code)) rd.code = 0
    }
    return Promise.resolve(response)
  },
  () => {}
)

export default instance
