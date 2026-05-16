export const debug = import.meta.env.DEV ? console.log.bind(console) : () => {}
// export const debug = console.log.bind(console)

// // NOTE: To prepend [debug] and preserver formatting you can't bind...
// export const debug = import.meta.env.DEV
//   ? (tag: string, ...data: any) => console.log('[debug] ' + tag, ...data)
//   : () => {}
