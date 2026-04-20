declare module '*.woff2' {
  export * from '@konghayao/_font_'
  /** 系统回退字体 font-family 字符串，由 vite-plugin-font 在构建时生成 */
  export const fontFamilyFallback: string
}

declare module '*.ttf' {
  export * from '@konghayao/_font_'
  /** 系统回退字体 font-family 字符串，由 vite-plugin-font 在构建时生成 */
  export const fontFamilyFallback: string
}
