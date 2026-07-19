import type { ExtensionModule } from "./hostContracts";
import { AnimatedPreviewPlayerAction, AnimatedPreviewPlayerOverlay } from "./editor";
import { AnimatedTagMedia } from "./media";
import { AnimatedPreviewSettings } from "./settings";
import { AnimatedTagCoverEditor } from "./coverEditor";
import { __resetPreviewCacheForTests } from "./indexCache";
import { unloadEditorStore } from "./editorStore";
import "./styles.css";

export { AnimatedPreviewPlayerAction, AnimatedPreviewPlayerOverlay, AnimatedTagMedia, AnimatedPreviewSettings, AnimatedTagCoverEditor };

const extensionModule: ExtensionModule = {
  components: {
    AnimatedPreviewPlayerAction,
    AnimatedPreviewPlayerOverlay,
    AnimatedTagMedia,
    AnimatedPreviewSettings,
    AnimatedTagCoverEditor,
  },
  onUnload() {
    unloadEditorStore();
    __resetPreviewCacheForTests();
  },
};

export default extensionModule;
