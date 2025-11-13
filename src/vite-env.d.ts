/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

// CSS Module type declarations
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// JSON module declarations
declare module '*/package.json' {
  interface PackageJson {
    name: string;
    version: string;
    description?: string;
    [key: string]: unknown;
  }
  const packageJson: PackageJson;
  export default packageJson;
}

// Environment variable types
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
