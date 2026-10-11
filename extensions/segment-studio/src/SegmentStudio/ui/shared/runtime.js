import React from "@cove/runtime/react";

import { createPortal } from "@cove/runtime/react-dom";

import { extensionFetch } from "@cove/runtime/api";

import {
  DetailListPagination,
  DetailListToolbar,
  EntityReferenceMultiSelector,
  EntityReferenceSelector,
  ListPage,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  VideoPlayer,
  formatDuration,
  getDefaultFilter,
  useRegisterExtensionKeyboardActions,
  useExtensionKeyboardBindings,
  useListUrlState,
} from "@cove/runtime/components";

// Components that only newer Cove hosts export. A named import of a missing
// export fails the whole bundle at load time, so these are looked up on the
// module namespace instead and render nothing on hosts that lack them.
import * as hostComponents from "@cove/runtime/components";

function MissingHostComponent() {
  return null;
}

// A component is a function, or the object React.memo or forwardRef returns,
// which carries $$typeof.
function isComponent(value) {
  return typeof value === "function"
    || (typeof value === "object" && value !== null && "$$typeof" in value);
}

function optionalHostComponent(components, name) {
  const component = components[name];
  return isComponent(component) ? component : MissingHostComponent;
}

const ExtensionEntityActions = optionalHostComponent(hostComponents, "ExtensionEntityActions");
const ExtensionSelectionActions = optionalHostComponent(hostComponents, "ExtensionSelectionActions");

const { useEffect, useId, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } = React;

const h = React.createElement;

// Cove 1.5 added the performer criteria catalog; older hosts offer role filters without nested performer conditions.
const PERFORMER_CRITERIA = hostComponents.PERFORMER_CRITERIA ?? [];

export { React, createPortal, extensionFetch, DetailListPagination, DetailListToolbar, EntityReferenceMultiSelector, EntityReferenceSelector, ExtensionEntityActions, ExtensionSelectionActions, ListPage, PERFORMER_CRITERIA, VIDEO_CRITERIA, VIDEO_SORT_OPTIONS, VideoPlayer, formatDuration, getDefaultFilter, optionalHostComponent, useListUrlState, useRegisterExtensionKeyboardActions, useExtensionKeyboardBindings, useEffect, useId, useLayoutEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore, h };
