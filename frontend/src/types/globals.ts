declare global {
  interface Window {
    $message: import('naive-ui').MessageApi
    reload: () => void
  }
  interface Navigator {
    /** IE 下载 Blob 文件 */
    msSaveBlob: (blob: Blob, filename: string) => void
  }
  interface ImportMetaEnv {
    readonly VITE_HOST: string
    readonly VITE_PORT: number
    readonly VITE_BASE_API: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  type VueRef = import('vue').Ref
  type VueComponent = import('vue').Component
  type StyleData = import('vue').CSSProperties
  type StyleDataSet = Record<string, StyleData>

  type NFile = import('naive-ui').UploadFileInfo
  type FormInst = import('naive-ui').FormInst
  type FormRules = import('naive-ui').FormRules
  type FormValidationError = import('naive-ui').FormValidationError
  type ThemeType = import('naive-ui').MessageType | 'primary' | undefined

  type SRecord<T> = Record<string, T>
  type SARecord = SRecord<any>
  type SBRecord = SRecord<boolean>
  type SNRecord = SRecord<number>
  type SSRecord = SRecord<string>
  type NRecord<T> = Record<number, T>
  type NBRecord = Record<number, boolean>
  type NSRecord = Record<number, string>
  type Nillable<T> = T | null | undefined
  type LVRecord<V = string | number> = { label: string; value: V }

  interface ResponseData<T = any> {
    ok: boolean
    code: number
    data: T
    message?: string
  }

  type WebSocketEvent<T = string> = {
    data: T
  }
}
