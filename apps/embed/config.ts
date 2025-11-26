import { DEFAULT_CIPHERS } from "tls";

export const EMBED_CONFIG = {
  WIDGET_URL: import.meta.env.VITE_WIDGET_URL || "http://localhost:3001",
  DEFAULT_ORG_ID: "org_35OueDMvTb3K58fO0z1NfFd0QCu",
  DEFAULT_POSITION: "bottom-right" as const
};
