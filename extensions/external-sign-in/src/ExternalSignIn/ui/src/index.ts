import type { FC } from "react";
import { ExternalSignInSettings } from "./settings";
import "./styles.css";

export { ExternalSignInSettings };

export interface ExtensionModule {
  components?: Record<string, FC<any>>;
}

const extensionModule: ExtensionModule = {
  components: { ExternalSignInSettings },
};

export default extensionModule;
