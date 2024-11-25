/**
 * 对带"选择全部"的多选结果进行优化调整, 例如任务创建者的选择
 * - 当选择全部时, 自动取消对其他所有选项的选择
 * - 当选择其他选项时, 自动取消对"选择全部"选项的选择
 * - 当没有任何选中选项时, 自动选择"选择全部"选项
 *
 * 泛型:
 * - `T`: 除"选择全部"外的其余选项值的数据类型
 * - `A`: "选择全部"选项值的数据类型
 *
 * 参数:
 * - `current`: 当前选项值列表
 * - `previous`: 上一次选中的选项值列表
 * - `allValue`: "选择全部"选项值, 一般建议 `null`
 *
 * 返回: 修正后的当前选中值列表
 */
export const amendCheckboxGroupValues = <T = any, A = null>(current: (T | A)[], previous: (T | A)[], allValue: T | A) => {
  // 新增选项
  previous = previous ?? [allValue]
  const newItems = current.filter(i => !previous.includes(i))
  // 如果新增选项中包含"选择全部", 则最终选项只包含"选择全部", 否则从最终选项中移除"选择全部"
  if (newItems.includes(allValue)) current = [allValue]
  else current = current.filter(v => v !== allValue)
  // 如果最终选项为空, 则添加"选择全部"
  if (current.length === 0) current = [allValue]
  return current
}
