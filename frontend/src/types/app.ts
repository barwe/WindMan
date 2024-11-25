declare global {
  interface ReceivedData<D = any> {
    event: string
    data: D
  }
  interface Monitor {
    x: number
    y: number
    width: number
    height: number
    width_mm: number
    height_mm: number
    name: string
    is_primary: false
    // web
    style: StyleData
  }
  interface AppWindow {
    id: string
    pid: number
    x: number
    y: number
    w: number
    h: number
    wm_class: string
    wm_name: string
    is_minimized: boolean
    is_maximized: boolean
    data: {
      left_text: string
      right_text: string
    }
  }
}
