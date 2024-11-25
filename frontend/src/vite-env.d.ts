/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '*.vue' {
  // import { defineComponent } from "vue";
  // const Component: ReturnType<typeof defineComponent>;
  // export default Component;
  import { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

declare module 'pinia-plugin-persist' {
  import type PiniaPersist from 'node_modules/pinia-plugin-persist'
  const piniaPersist: PiniaPersist
  export default piniaPersist
}
