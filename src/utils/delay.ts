export const delay = (ms: number | undefined) =>
    new Promise(resolve => setTimeout(resolve, ms));