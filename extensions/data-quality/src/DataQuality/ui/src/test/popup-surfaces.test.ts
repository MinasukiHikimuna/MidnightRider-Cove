/// <reference types="vite/client" />
import { afterEach, describe, expect, it } from "vitest";
// jsdom cascades the extension's rules (without layout or colour computation).
import "../styles.css";
import styleSource from "../styles.css?raw";

/**
 * A presence check: jsdom cascades the rules but neither weighs `!important` rules against Cove's
 * nor draws colours, so these tests show that every popup has the opaque rule and its layers, not
 * that the rule wins in a browser (the weight it needs is read from the source below, and checked
 * live).
 *
 * Every popup the extension draws, as the stylesheet selects it: menus, popovers, lists, its own
 * dialogs with the batch dialog's sticky table head, the editor drawer with its sticky Actions
 * toolbar, the grid preview's panel, the action bar (sticky over the grid's cards in its dock, and
 * docked in the preview's panel), and the notes that float over the grid's cards (a notice is a
 * `.dq-alert` or `.dq-status` in `.dq-bar-notices`).
 */
const POPUPS = [
  ".dq-menu-list",
  ".dq-scope-popover",
  ".dq-find-action",
  ".dq-key-picker",
  ".dq-combobox-list",
  ".dq-confirm-dialog",
  ".dq-form-dialog",
  ".dq-batch-dialog",
  ".dq-batch-list th",
  ".dq-drawer",
  ".dq-actions-head",
  ".dq-preview-shell",
  ".dq-action-bar",
  ".dq-bar-effect",
  ".dq-bar-notices > .dq-alert",
  ".dq-bar-notices > .dq-status",
];
/** Where a popup is drawn, when that changes its layers. */
const CONTEXT: Record<string, string> = {
  ".dq-preview-shell": ".dq-preview",
  ".dq-batch-list th": ".dq-batch-dialog",
  // The grid's bar, as it floats over the cards (the preview's docked bar is checked on its own).
  ".dq-action-bar": ".dq-bar-dock",
};
/** The surface each popup lays over the theme's background, when it is not the theme's surface. */
const SURFACES: Record<string, string> = {
  ".dq-preview-shell": "transparent",
  ".dq-batch-list th": "var(--color-card)",
};

/**
 * What floats or is a popup without needing a surface of its own, and why. A new element that
 * floats over the page (a fixed layer, or an absolute or sticky one with a z-index) or has a popup
 * role must be in `POPUPS` or here, so a popup without the opaque rule is caught.
 */
const NOT_SURFACES: Record<string, string> = {
  ".dq-wall-autoplay": "the wall's autoplaying video, inside its card",
  ".dq-menu-backdrop": "a transparent layer that catches presses outside the menu",
  ".dq-scope-backdrop": "a transparent layer that catches presses outside the popover",
  ".dq-find-backdrop": "a transparent layer that catches presses outside Find action",
  ".dq-key-picker-backdrop": "a transparent layer that catches presses outside the key picker",
  ".dq-preview": "the preview's backdrop, a dimmed scrim; its panel is the surface",
  ".dq-find-list": "Find action's list, drawn on Find action's surface",
  ".dq-bar-dock": "the dock under the grid's action bar, a fade into the page; the bar is the surface",
};

/** Builds an element the selector matches (classes, element names, children and descendants). */
function popup(selector: string): HTMLElement {
  let parent: HTMLElement = document.body;
  for (const compound of [CONTEXT[selector], ...selector.split(/\s*>\s*|\s+/)]) {
    if (!compound) continue;
    const [tag, ...classes] = compound.split(".");
    const element = document.createElement(tag || "div");
    element.className = classes.join(" ");
    parent = parent.appendChild(element);
  }
  return parent;
}
const LAYERS =
  "linear-gradient(var(--dq-glass-tint), var(--dq-glass-tint)), linear-gradient(var(--dq-glass-surface), var(--dq-glass-surface)), linear-gradient(var(--color-background), var(--color-background)), var(--dq-glass-base)";
/** The selector as a whole, not the start of a longer class (`.dq-action-bar-docked`). */
const whole = (selector: string) =>
  new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`);
const layers = (element: HTMLElement) => getComputedStyle(element).background.replace(/\s+/g, " ");
const variable = (element: HTMLElement, name: string) =>
  getComputedStyle(element).getPropertyValue(name).trim();

/** The end of the JSX opening tag starting at `start` (its `>`, outside strings and braces). */
function tagEnd(source: string, start: number): number {
  let depth = 0;
  for (let index = start + 1; index < source.length; index++) {
    const char = source[index];
    if (char === '"' || char === "'" || char === "`") index = source.indexOf(char, index + 1);
    else if (char === "{") depth++;
    else if (char === "}") depth--;
    else if (char === ">" && depth === 0) return index;
    if (index < 0) break;
  }
  return source.length;
}

/**
 * The first class of every element the components render as a dialog or with a popup role, keyed
 * `(no class)` when its tag has no plain class to name it and `(dynamic role)` when its role is an
 * expression, so neither passes unnoticed.
 */
function renderedPopupClasses(): Map<string, string> {
  const sources = import.meta.glob<string>("../*.tsx", { query: "?raw", import: "default", eager: true });
  const found = new Map<string, string>();
  for (const [file, raw] of Object.entries(sources)) {
    // Comments name tags too (a modal <dialog>); they are left out.
    const source = raw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
    // Only where JSX can start (after ( > } { ? : & | = , or return, or at a line's start), not
    // a generic (useRef<HTMLDivElement>) or a comparison.
    const opening = /(?<=(?:^|[(>}{?:&|=,])\s*|\breturn\s+)<([a-zA-Z][\w.]*)/gm;
    for (const match of source.matchAll(opening)) {
      const tag = source.slice(match.index, tagEnd(source, match.index) + 1);
      if (/\srole=\{/.test(tag)) found.set(`(dynamic role) ${file}`, file);
      const popupRole = /\srole="(?:dialog|alertdialog|menu|listbox|tooltip)"/.test(tag);
      if (match[1] !== "dialog" && !popupRole) continue;
      const name = tag.match(/\sclassName=(?:"|\{`)(dq-[\w-]+)/)?.[1];
      found.set(name ? `.${name}` : `(no class) ${file}`, file);
    }
  }
  return found;
}

/** Every style rule, those inside @media, @supports and other grouping rules included. */
function styleRules(rules: Iterable<CSSRule>): CSSStyleRule[] {
  return [...rules].flatMap((rule) =>
    rule instanceof CSSStyleRule
      ? [rule]
      : "cssRules" in rule
        ? styleRules((rule as CSSGroupingRule).cssRules)
        : [],
  );
}

/**
 * Every element the stylesheet lifts over the page: the last compound of the rule's selector, by
 * its first class, or the whole selector when that compound has none (a table's head cell). It
 * sees a rule that sets `position` (fixed, or absolute or sticky with a z-index) on its own, not
 * one whose z-index and position come from separate rules.
 */
function floatingElements(): Set<string> {
  const found = new Set<string>();
  for (const rule of styleRules([...document.styleSheets].flatMap((sheet) => [...sheet.cssRules]))) {
    const { position, zIndex } = rule.style;
    const floating = position === "fixed" || ((position === "absolute" || position === "sticky") && zIndex);
    if (!floating) continue;
    for (const selector of rule.selectorText.split(",").map((part) => part.trim())) {
      const name = selector.split(/\s*>\s*|\s+/).at(-1)?.match(/^[a-z]*(\.dq-[\w-]+)/)?.[1];
      found.add(name ?? selector);
    }
  }
  return found;
}

describe("popups in Cove's glass and background-animation styles (a presence check)", () => {
  afterEach(() => {
    document.body.replaceChildren();
    delete document.documentElement.dataset.componentStyle;
    delete document.documentElement.dataset.colorScheme;
    delete document.documentElement.dataset.themeBgAnimation;
  });

  it("covers every popup the components render and everything the styles float over the page", () => {
    const listed = new Set(POPUPS.flatMap((selector) => [selector, selector.split(/\s*>\s*|\s+/).at(-1)!]));
    const known = (name: string) => listed.has(name) || name in NOT_SURFACES;
    const rendered = renderedPopupClasses();
    // The scan finds the popups it should: a menu, listboxes, role dialogs and native dialogs.
    for (const name of [".dq-menu-list", ".dq-combobox-list", ".dq-drawer", ".dq-preview", ".dq-batch-dialog"])
      expect(rendered.has(name), name).toBe(true);
    for (const name of rendered.keys()) expect(known(name), `${name} (${rendered.get(name)})`).toBe(true);
    const floating = floatingElements();
    for (const name of [
      ".dq-combobox-list",
      ".dq-drawer",
      ".dq-actions-head",
      ".dq-preview",
      ".dq-batch-list th",
      ".dq-bar-dock",
    ])
      expect(floating.has(name), name).toBe(true);
    for (const name of floating) expect(known(name), name).toBe(true);
  });

  it("keep their own backgrounds in other styles", () => {
    document.documentElement.dataset.componentStyle = "floating";
    for (const name of POPUPS) expect(layers(popup(name)), name).not.toBe(LAYERS);
    expect(getComputedStyle(popup(".dq-menu-list")).background).toBe("var(--color-surface)");
    expect(getComputedStyle(popup(".dq-preview-shell")).background).toBe("var(--color-background)");
    expect(getComputedStyle(popup(".dq-action-bar")).background).toBe("var(--color-surface)");
  });

  it("make the action bar opaque where it is docked in the preview's panel too", () => {
    for (const attributes of [
      { componentStyle: "glass" },
      { themeBgAnimation: "true" },
      { themeBgAnimation: "true", componentStyle: "glass" },
    ]) {
      Object.assign(document.documentElement.dataset, attributes);
      const shell = popup(".dq-preview-shell");
      const bar = shell.appendChild(document.createElement("section"));
      bar.className = "dq-action-bar dq-action-bar-docked";
      expect(layers(bar), JSON.stringify(attributes)).toBe(LAYERS);
      // Its own surface, not the shell's inherited `transparent`.
      expect(variable(bar, "--dq-glass-surface")).toBe("var(--color-surface)");
      delete document.documentElement.dataset.componentStyle;
      delete document.documentElement.dataset.themeBgAnimation;
    }
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
    expect(variable(popup(".dq-menu-list"), "--dq-glass-tint")).toBe("transparent");
    expect(variable(popup(".dq-bar-notices > .dq-alert"), "--dq-glass-tint")).toMatch(/239 68 68/);
    expect(variable(popup(".dq-bar-notices > .dq-status"), "--dq-glass-tint")).toMatch(/--color-accent/);
    // The theme's surface on each, but the preview's panel, which draws the theme's background,
    // and the batch table's head, which draws the card colour.
    for (const name of POPUPS)
      expect(variable(popup(name), "--dq-glass-surface"), name).toBe(SURFACES[name] ?? "var(--color-surface)");
  });

  it("outweigh Cove's own !important glass rules for dialogs", () => {
    // jsdom weighs neither specificity between !important rules nor keeps the flag on a layered
    // background, so the source is read: the rule is !important, and each of its selectors has a
    // notice's two classes in its :is() (which weighs as its heaviest argument) and two elements,
    // so it outweighs Cove's (0,2,1) and (0,3,1) rules for [role="dialog"], the drawer and the
    // preview included.
    const rule = styleSource.match(/^(html\[[^{]*glass[^{]*)\{([^}]*)\}/m);
    expect(rule?.[1]).toContain('html[data-component-style*="glass"] body :is(');
    expect(rule?.[1]).toContain('html[data-theme-bg-animation] body :is(');
    expect(rule?.[1]).toContain('html[data-theme-bg-animation][data-component-style*="glass"] body :is(');
    expect(rule?.[1].match(/\.dq-bar-notices > \.dq-alert/g)).toHaveLength(3);
    // Each of the three selectors names every popup, so none falls back on a lighter one.
    const groups = rule?.[1].replace(/\s+/g, " ").split(/\s*\),\s*/) ?? [];
    expect(groups).toHaveLength(3);
    for (const group of groups) for (const name of POPUPS) expect(group, name).toMatch(whole(name));
    expect(rule?.[2]).toMatch(/background:[^;]*!important;/);
    // Opaque, they drop the backdrop blur Cove gives its dialogs.
    expect(rule?.[2]).toMatch(/(^|[^-])backdrop-filter: none !important;/);
    expect(rule?.[2]).toContain("-webkit-backdrop-filter: none !important;");
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
    // Each of its selectors (glass, a background animation, both) names every popup.
    const groups = forced?.selectorText.replace(/\s+/g, " ").split(/\s*\),\s*/) ?? [];
    expect(groups).toHaveLength(3);
    expect(groups[1]).toContain("html[data-theme-bg-animation] body");
    for (const group of groups) for (const name of POPUPS) expect(group, name).toMatch(whole(name));
    expect(forced?.style.background.toLowerCase()).toBe("canvas");
    expect(forced?.style.getPropertyPriority("background")).toBe("important");
  });
});
