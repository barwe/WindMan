import { useWebSocket } from '@/composables/ws'

export const EVENT_DEFS = {
  LIST_MONITORS: 'LIST_MONITORS',
  CHANGE_SELECTED_WM_CLASSES: 'CHANGE_SELECTED_WM_CLASSES',
}

export const useWebSocketEventSet = (path: string) => {
  const ReceiverSet: SARecord = {}
  const { sendJson } = useWebSocket(path, (r: ReceivedData) => ReceiverSet[r.event](r.data))
  const send = <RD = any, SD = any>(event: keyof typeof EVENT_DEFS, sentData: SD, receive: (data: RD) => void) => {
    ReceiverSet[event] = receive
    sendJson(event, sentData)
  }

  return { send }
}
