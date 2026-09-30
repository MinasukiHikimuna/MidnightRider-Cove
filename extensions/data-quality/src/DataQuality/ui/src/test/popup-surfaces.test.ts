/// <reference types="vite/client" />
import { afterEach, describe, expect, it } from "vitest";
// jsdom cascades the extension's rules (without layout or colour computation).
import "../styles.css";
import styleSource from "../styles.css?raw";

/**
 * Every popup the extension draws: menus, popovers, lists, its own dialogs, and the notes that
 * float over the grid's cards (a notice is a `.dq-alert` or `.dq-status` in `.dq-bar-notices`).
 */
const POPUPS = [
  "dq-menu-list",
  "dq-scope-popover",
  "dq-find-action",
  "dq-key-picker",
  "dq-combobox-list",
  "dq-confirm-dialog",
  "dq-form-dialog",
  "dq-batch-dialog",
  "dq-bar-effect",
  "dq-bar-notices > dq-alert",
  "dq-bar-notices > dq-status",
];

function popup(name: string): HTMLElement {
  const [outer, inner] = name.split(" > ");
  const element = document.body.appendChild(document.createElement("div"));
  element.className = outer;
  if (!inner) return element;
  const child = element.appendChild(document.createElement("div"));
  child.className = inner;
  return child;
}
const LAYERS =
  "linear-gradient(var(--dq-glass-tint), var(--dq-glass-tint)), linear-gradient(var(--color-surface), var(--color-surface)), linear-gradient(var(--color-background), var(--color-background)), var(--dq-glass-base)";
const layers = (element: HTMLElement) => getComputedStyle(element).background.replace(/\s+/g, " ");
const variable = (element: HTMLElement, name: string) =>
  getComputedStyle(element).getPropertyValue(name).trim();

describe("popups in Cove's glass and background-animation styles", () => {
  afterEach(() => {
    document.body.replaceChildren();
    delete document.documentElement.dataset.componentStyle;
    delete document.documentElement.dataset.colorScheme;
    delete document.documentElement.dataset.themeBgAnimation;
  });

  it("keep their own backgrounds in other styles", () => {
    document.documentElement.dataset.componentStyle = "floating";
    for (const name of POPUPS) expect(layers(popup(name)), name).not.toBe(LAYERS);
    expect(getComputedStyle(popup("dq-menu-list")).background).toBe("var(--color-surface)");
  });

  it("lay their tint and the theme's surface over its background and an opaque base", () => {
    for (const attributes of [
      { componentStyle: "glass" },
      // Glass combined with other styles, as Cove composes them.
      { componentStyle: "floating glass" },
      // A background animation, with or without glass.
      { themeBgAnimation: "true" },
      { themeBgAnimation: "true", componentStyle: "glass" },
    ]) {
      Object.assign(document.documentElement.dataset, attributes);
      for (const name of POPUPS) {
        const element = popup(name);
        expect(layers(element), `${name} ${JSON.stringify(attributes)}`).toBe(LAYERS);
        expect(variable(element, "--dq-glass-base"), name).toBe("#16181d");
      }
      delete document.documentElement.dataset.componentStyle;
      delete document.documentElement.dataset.themeBgAnimation;
    }
    // Notices keep their tint; the others have none.
    expect(variable(popup("dq-menu-list"), "--dq-glass-tint")).toBe("transparent");
    expect(variable(popup("dq-bar-notices > dq-alert"), "--dq-glass-tint")).toMatch(/239 68 68/);
    expect(variable(popup("dq-bar-notices > dq-status"), "--dq-glass-tint")).toMatch(/--color-accent/);
  });

  it("outweigh Cove's own !important glass rules for dialogs", () => {
    // jsdom weighs neither specificity between !important rules nor keeps the flag on a layered
    // background, so the source is read: the rule is !important and has a selector with three
    // attributes for Cove's rule under a background animation with glass.
    const rule = styleSource.match(/^(html\[[^{]*glass[^{]*)\{([^}]*)\}/m);
    expect(rule?.[1]).toContain('html[data-theme-bg-animation] body :is(');
    expect(rule?.[1]).toContain('html[data-theme-bg-animation][data-component-style*="glass"] body :is(');
    expect(rule?.[2]).toMatch(/background:[^;]*!important;/);
  });

  it("take a light base in light themes", () => {
    document.documentElement.dataset.componentStyle = "glass";
    document.documentElement.dataset.colorScheme = "light";
    for (const name of POPUPS) expect(variable(popup(name), "--dq-glass-base"), name).toBe("#f5f8fa");
  });

  it("take the system's window colour in forced colours", () => {
    const forced = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter(
        (rule): rule is CSSMediaRule =>
          rule instanceof CSSMediaRule && rule.media.mediaText.replace(/\s/g, "") === "(forced-colors:active)",
      )
      .flatMap((rule) => [...rule.cssRules] as CSSStyleRule[])
      .find((rule) => rule.selectorText.includes('data-component-style*="glass"'));
    for (const name of POPUPS)
      expect(forced?.selectorText.replace(/\s+/g, " "), name).toContain(`.${name.replace(" > ", " > .")}`);
    expect(forced?.selectorText).toContain("html[data-theme-bg-animation] body");
    expect(forced?.style.background.toLowerCase()).toBe("canvas");
    expect(forced?.style.getPropertyPriority("background")).toBe("important");
  });
});
