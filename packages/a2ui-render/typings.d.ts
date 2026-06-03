declare module '*.less';
declare module '*.svg';
declare module '*.png';
declare module '*.gif' {
  const value: string;
  export default value;
}

interface Window {}
