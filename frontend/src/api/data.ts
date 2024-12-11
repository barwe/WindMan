import axios from './axios'

export default {
  listMonitors: async () => {
    const r = await axios.get('/monitors/')
    return r.data as ResponseData<Monitor[]>
  },
  listWindows: async () => {
    const r = await axios.get('/windows/')
    return r.data as ResponseData<AppWindow[]>
  },
  listApps: async () => {
    const r = await axios.get('/apps/')
    return r.data as ResponseData<LVRecord<string>[]>
  },
  activateWindow: async (winId: string, monitorName: string, options?: { fixHeight?: number }) => {
    const data = { winId, monitorName, options }
    const r = await axios.post('/windows/activate/', data)
    return r.data as ResponseData<AppWindow>
  },
}
