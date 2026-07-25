declare module 'locomotive-scroll' {
  export default class LocomotiveScroll {
    constructor(options: { el: HTMLElement; smooth?: boolean; multiplier?: number })
    destroy(): void
  }
}
