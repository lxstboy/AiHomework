interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string;
  // add other VITE_... variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
