// 日期工具

import { isEmpty, keys, pick } from 'lodash'

/** 脏数据标记 */
export function dirtMark(sets?: string[]) {
  const set2 = sets ?? ['default']
  // eslint-disable-next-line no-unused-vars
  const dirtySets: SRecord<(attr: string) => void> = {}
  const dirties: SRecord<SBRecord> = {}
  set2.forEach(k => {
    dirties[k] = {}
    dirtySets[k] = (s: string) => (dirties[k][s] = true)
  })

  const dirtyFn = (s: string, k?: string) => dirtySets[k ?? 'default'](s)
  const isEmptyFn = (k?: string) => isEmpty(dirties[k ?? 'default'])
  const keysFn = (k?: string) => keys(dirties[k ?? 'default'])
  const clearFn = (k?: string) => (dirties[k ?? 'default'] = {})
  const pickFn = <T>(raw: T, k?: string) => pick(raw, keysFn(k))

  return {
    dirty: dirtyFn,
    isEmpty: isEmptyFn,
    keys: keysFn,
    clear: clearFn,
    pick: pickFn,
  }
}
