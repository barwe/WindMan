import { defineStore } from 'pinia'
import { darkTheme, lightTheme, GlobalThemeOverrides } from 'naive-ui'

const lightThemeOverrides: GlobalThemeOverrides = {}
const darkThemeOverrides: GlobalThemeOverrides = {}

const _useGlobalTheme = () => {
  const isDarkTheme = ref(false)
  const _theme = computed(() => {
    return isDarkTheme.value ? darkTheme : lightTheme
  })
  const _themeOverrides = computed(() => {
    return isDarkTheme.value ? darkThemeOverrides : lightThemeOverrides
  })
  const switchTheme = () => {
    isDarkTheme.value = !isDarkTheme.value
  }
  watch(
    isDarkTheme,
    v => {
      document.body.style.backgroundColor = v ? '#1f1f1f' : '#fff'
      document.body.style.transition = 'background-color .3s ease'
    },
    { immediate: true }
  )
  return { _theme, _themeOverrides, isDarkTheme, switchTheme }
}
export const BODY_MARGIN = 15 // 添加在 html 元素上的 margin

export default defineStore(
  'site',
  () => {
    const { _theme, _themeOverrides, isDarkTheme, switchTheme } = _useGlobalTheme()
    const primaryTab = ref<'table' | 'download' | 'settings'>('table')
    const lightTextStyle = computed<StyleData>(() => ({ color: isDarkTheme.value ? '#545454' : '#e5e5e5' }))
    return {
      primaryTab,
      _theme,
      _themeOverrides,
      isDarkTheme,
      switchTheme,
      lightTextStyle,
      BODY_MARGIN,
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'site-store',
          storage: localStorage,
          paths: ['isDarkTheme', 'primaryTab'],
        },
      ],
    },
  }
)
