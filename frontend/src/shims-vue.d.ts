// This file is used to declare types for Vue components in TypeScript.
// otherwise, TypeScript will not recognize `.vue` files.
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
  }