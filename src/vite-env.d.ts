/// <reference types="vite/client" />

// CSS Module type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Environment variable types
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
