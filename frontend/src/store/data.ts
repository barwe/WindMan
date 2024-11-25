import { useWindowSize } from '@vueuse/core'
import { max, min } from 'lodash'
import { defineStore } from 'pinia'
import { BODY_MARGIN } from './site'

const useMonitors = () => {
  const canvas = ref({ w: 0, h: 0 })
  const { width } = useWindowSize()
  watch(
    width,
    w => {
      const n = w - 2 * BODY_MARGIN
      canvas.value = { w: n, h: 160 }
    },
    { immediate: true }
  )

  const monitors = ref<Monitor[]>([])
  const viewedMonitors = computed<Monitor[]>(() => {
    if (monitors.value.length > 0) {
      const minX = min(monitors.value.map(d => d.x))!
      const maxX = max(monitors.value.map(d => d.x + d.width))!
      const minY = min(monitors.value.map(d => d.y))!
      const maxY = max(monitors.value.map(d => d.y + d.height))!
      const wScale = (n: number) => (canvas.value.w * (n - minX)) / (maxX - minX)
      const hScale = (n: number) => (canvas.value.h * (n - minY)) / (maxY - minY)
      monitors.value.forEach(d => {
        d.style = {
          left: px(wScale(d.x)),
          top: px(hScale(d.y)),
          width: px(wScale(d.width)),
          height: px(hScale(d.height)),
          display: 'block',
          position: 'absolute',
          // backgroundColor: getRandomRgb(),
          // display: 'flex',
          // justifyContent: 'center',
          // alignItems: 'center',
          // fontSize: '20px',
        }
      })
      return [...monitors.value]
    } else return []
  })
  const canvasStyle = computed<StyleData>(() => ({
    width: px(canvas.value.w),
    height: px(canvas.value.h),
  }))
  const selectedMonitorName = ref<string>()
  return { canvas, canvasStyle, monitors, viewedMonitors, selectedMonitorName }
}

const useApps = () => {
  const selectedApp = ref('code.Code')
  return { selectedApp }
}

const useWindows = (selectedApp: Ref<string>) => {
  const windows = ref<AppWindow[]>([])
  const shownWindows = computed(() => {
    if (selectedApp.value === '__all__') return [...windows.value]
    return windows.value.filter(d => d.wm_class === selectedApp.value)
  })
  return { windows, shownWindows }
}

export default defineStore(
  'data',
  () => {
    const monitors = useMonitors()
    const apps = useApps()
    const windows = useWindows(apps.selectedApp)
    return { ...monitors, ...apps, ...windows }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'data-store',
          storage: localStorage,
          paths: ['selectedMonitorName', 'selectedApp'],
        },
      ],
    },
  }
)
