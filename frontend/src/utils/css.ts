export const px = (n: number | string | undefined) => {
  if (n === undefined || n === null) return undefined
  return typeof n === 'number' ? `${n}px` : n
}

export const mcalc = (base: string, n: number) => `calc(${base} - ${px(n)})`
