export const getWebSocketUrl = (path: string) => {
  const prefix = import.meta.env.MODE === 'development' ? `ws://${import.meta.env.VITE_BASE_API}/ws` : `ws://${location.host}/ws`
  return prefix + path
}

const CACHED_SOCKETS: Record<string, WebSocket> = {}

export const useWebSocket = <D, R = ResponseData<D>>(path: string, receiveJson?: (rd: R) => void) => {
  let socket: WebSocket | null = null
  const isReady = ref(false)
  const receivedData = ref<R>()
  if (has(CACHED_SOCKETS, path)) socket = CACHED_SOCKETS[path]
  else {
    socket = new WebSocket(getWebSocketUrl(path))
    socket.onopen = () => {
      isReady.value = true
    }
    socket.onmessage = event => {
      const rd = JSON.parse(event.data)
      if (receiveJson) receiveJson(rd)
      receivedData.value = rd
    }
    socket.onclose = () => {
      isReady.value = false
      delete CACHED_SOCKETS[path]
    }
    CACHED_SOCKETS[path] = socket
  }

  const sendJson = (event: string, data?: any) => {
    if (socket && socket.readyState === socket.OPEN) {
      const sended = { event, data }
      socket.send(JSON.stringify(sended))
    } else {
      setTimeout(() => sendJson(event, data), 100)
    }
  }

  return { socket: socket!, receivedData, sendJson }
}
