/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // Add other environment variables here as needed
  // readonly VITE_APP_NAME: string
  // readonly VITE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}