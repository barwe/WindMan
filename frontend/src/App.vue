<script setup lang="ts">
import { dataApi } from '@/api';
import { useWebSocket } from '@vueuse/core';
import { getWebSocketUrl } from './composables/ws';

const site = useSiteStore()
const store = useDataStore()
const appOptions = ref<LVRecord<string>[]>([])

dataApi.listMonitors().then(rd => {
  if (rd.ok) {
    store.monitors = rd.data
    if (!store.selectedMonitorName && store.monitors.length > 0) {
      store.selectedMonitorName = store.monitors.find(d => d.is_primary)?.name
    }
  }
})
// dataApi.listWindows().then(rd => { if (rd.ok) { store.windows = rd.data } })
dataApi.listApps().then(rd => { if (rd.ok) { appOptions.value = rd.data } })

const containerStyle = computed(() => ({
  width: px(store.canvas.w),
  margin: px(site.BODY_MARGIN)
}))

const activateWindow = async (win: AppWindow) => {
  const moName = store.selectedMonitorName!
  const rd = await dataApi.activateWindow(win.id, moName, { fixHeight: store.fixedHeights[moName] })
  if (rd.ok) { assign(win, rd.data) }
}

const getBetterRightText = (win: AppWindow) => {
  const suf = win.is_maximized ? " (已最大化)" : win.is_minimized ? " (已最小化)" : ""
  return `${win.data.right_text ?? ''}${suf}`
}

useWebSocket(getWebSocketUrl("/"), {
  onMessage: (_, event) => {
    store.windows = JSON.parse(event.data)
  }
})

const show = ref(false)
</script>

<template>
  <n-config-provider :theme="site._theme" :theme-overrides="site._themeOverrides">
    <div class="absolute top-0" :style="containerStyle">
      <!-- monitors -->
      <div :style="store.canvasStyle">
        <div v-for="monitor, index in store.viewedMonitors" :key="index" :style="monitor.style">
          <n-tag :type="monitor.name === store.selectedMonitorName ? 'success' : 'default'"
            class="w-full h-full fx-c cursor-pointer select-none"
            @click="() => store.selectedMonitorName = monitor.name">
            {{ monitor.name }}
          </n-tag>
        </div>
      </div>
      <!-- app tags -->
      <div class="mt-2 fx-b sx-1">
        <n-button type="info" @click="show = true">设置</n-button>
        <template v-for="d in appOptions">
          <n-tag :type="d.value === store.selectedApp ? 'info' : 'default'"
            class="h-34px flex-1 fx-c cursor-pointer select-none" @click="() => store.selectedApp = d.value">
            {{ d.label }}
          </n-tag>
        </template>
      </div>
      <!-- windows -->
      <div class="w-full mt-2 sy-2">
        <template v-for="win in store.shownWindows">
          <n-button class="w-full h-12 fx-b cursor-pointer select-none" @click="() => activateWindow(win)">
            <n-text>{{ win.data.left_text }}</n-text>
            <n-text>{{ getBetterRightText(win) }}</n-text>
          </n-button>
        </template>
      </div>
    </div>
    <n-modal v-model:show="show">
      <n-card class="mx-5">
        <div class="mb-2">窗口高度校正（窗口高度 = 屏幕高度 - 校正值）</div>
        <div v-for="mo in store.monitors">
          <div class="fx-l mb-2">
            <div class="w-20">{{ mo.name }}</div>
            <n-input-number v-model:value="store.fixedHeights[mo.name]" placeholder="" />
          </div>
        </div>
      </n-card>
    </n-modal>
  </n-config-provider>
</template>

<style>
.n-button__content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>