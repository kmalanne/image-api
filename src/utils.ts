export const atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
