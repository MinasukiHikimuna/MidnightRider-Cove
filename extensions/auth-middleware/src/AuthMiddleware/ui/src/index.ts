import type { FC } from "react";
import { AuthMiddlewareSettings } from "./settings";
import "./styles.css";

export { AuthMiddlewareSettings };

export interface ExtensionModule {
  components?: Record<string, FC<any>>;
}

const extensionModule: ExtensionModule = {
  components: { AuthMiddlewareSettings },
};

export default extensionModule;
