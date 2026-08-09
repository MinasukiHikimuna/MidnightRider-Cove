const runtimeModules = {
  "@cove/runtime/react": "export default globalThis.__segmentStudioReact;",
  "@cove/runtime/react-dom": "export const createPortal = (child) => child;",
  "@cove/runtime/api": "export const extensionFetch = async () => { throw new Error('not used'); };",
  "@cove/runtime/lucide-react": [
    "export const ChevronDown = () => null;",
    "export const Loader2 = () => null;",
  ].join("\n"),
  "@cove/runtime/components": [
    "export const DetailListPagination = () => null;",
    "export const DetailListToolbar = () => null;",
    "export const EntityReferenceMultiSelector = () => null;",
    "export const EntityReferenceSelector = () => null;",
    "export const ListPage = () => null;",
    "export const VideoPlayer = () => null;",
    "export const formatDuration = String;",
    "export const getDefaultFilter = () => null;",
    "export const useListUrlState = () => ({});",
    "export const useRegisterExtensionKeyboardActions = () => {};",
    "export const useExtensionKeyboardBindings = () => ({});",
  ].join("\n"),
};

export function resolve(specifier, context, nextResolve) {
  if (Object.hasOwn(runtimeModules, specifier)) {
    const source = Buffer.from(runtimeModules[specifier]).toString("base64");
    return { url: `data:text/javascript;base64,${source}`, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
