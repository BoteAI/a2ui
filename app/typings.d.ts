declare module '*.css';
declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
declare module '*.json';
declare module '*.png';
declare module '*.svg';
declare module '*.jpg';
