import { ag as ssr_context, ae as setContext, o as getContext, j as fallback, s as slot, ah as store_get, ai as unsubscribe_stores, b as bind_props, g as sanitize_props, i as rest_props, k as attributes, aj as spread_props, ak as store_set, h as head, e as escape_html, a as ensure_array_like, m as attr_class, c as attr, al as attr_style } from "../../../chunks/renderer.js";
import "../../../chunks/url.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "clsx";
import { B as Badge } from "../../../chunks/badge.js";
import { B as Button } from "../../../chunks/button.js";
import "dequal";
import { d as derived, g as get, w as writable, r as readable, a as readonly } from "../../../chunks/index2.js";
import { nanoid } from "nanoid/non-secure";
import { createFocusTrap as createFocusTrap$1 } from "focus-trap";
import "@chenglou/pretext";
import { b as invalid_default_snippet } from "../../../chunks/render-context.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
async function tick() {
}
function last(array) {
  return array[array.length - 1];
}
function styleToString$1(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
({
  style: styleToString$1({
    position: "absolute",
    opacity: 0,
    "pointer-events": "none",
    margin: 0,
    transform: "translateX(-100%)"
  })
});
function portalAttr(portal) {
  if (portal !== null) {
    return "";
  }
  return void 0;
}
function lightable(value) {
  function subscribe(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe };
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
makeElement("empty");
function makeElement(name2, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return hiddenAction({
              ...result(...args2),
              [`data-melt-${name2}`]: "",
              action: action ?? noop$1
            });
          };
          fn.action = action ?? noop$1;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name2}`]: "",
          action: action ?? noop$1
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return hiddenAction({
            ...result(...args2),
            [`data-melt-${name2}`]: "",
            action: action ?? noop$1
          });
        };
        resultFn.action = action ?? noop$1;
        return lightable(resultFn);
      }
      return lightable(hiddenAction({
        ...result,
        [`data-melt-${name2}`]: "",
        action: action ?? noop$1
      }));
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix) {
  const name2 = (part) => part ? `${prefix}-${part}` : prefix;
  const attribute = (part) => `data-melt-${prefix}${part ? `-${part}` : ""}`;
  const selector = (part) => `[data-melt-${prefix}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector(part));
  return {
    name: name2,
    attribute,
    selector,
    getEl
  };
}
const isBrowser$1 = typeof document !== "undefined";
const isFunction = (v) => typeof v === "function";
function isElement(element) {
  return element instanceof Element;
}
function isHTMLElement$1(element) {
  return element instanceof HTMLElement;
}
function isObject(value) {
  return value !== null && typeof value === "object";
}
function isReadable(value) {
  return isObject(value) && "subscribe" in value;
}
function executeCallbacks(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function noop$1() {
}
function addEventListener$1(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
function addMeltEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  if (typeof handler === "function") {
    const handlerWithMelt = withMelt((_event) => handler(_event));
    events.forEach((_event) => target.addEventListener(_event, handlerWithMelt, options));
    return () => {
      events.forEach((_event) => target.removeEventListener(_event, handlerWithMelt, options));
    };
  }
  return () => noop$1();
}
function dispatchMeltEvent(originalEvent) {
  const node = originalEvent.currentTarget;
  if (!isHTMLElement$1(node))
    return null;
  const customMeltEvent = new CustomEvent(`m-${originalEvent.type}`, {
    detail: {
      originalEvent
    },
    cancelable: true
  });
  node.dispatchEvent(customMeltEvent);
  return customMeltEvent;
}
function withMelt(handler) {
  return (event) => {
    const customEvent = dispatchMeltEvent(event);
    if (customEvent?.defaultPrevented)
      return;
    return handler(event);
  };
}
const safeOnDestroy$1 = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn;
  }
};
function omit$1(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function withGet(store) {
  return {
    ...store,
    get: () => get(store)
  };
}
withGet.writable = function(initial) {
  const internal = writable(initial);
  let value = initial;
  return {
    subscribe: internal.subscribe,
    set(newValue) {
      internal.set(newValue);
      value = newValue;
    },
    update(updater) {
      const newValue = updater(value);
      internal.set(newValue);
      value = newValue;
    },
    get() {
      return value;
    }
  };
};
withGet.derived = function(stores, fn) {
  const subscribers = /* @__PURE__ */ new Map();
  const get2 = () => {
    const values = Array.isArray(stores) ? stores.map((store) => store.get()) : stores.get();
    return fn(values);
  };
  const subscribe = (subscriber) => {
    const unsubscribers = [];
    const storesArr = Array.isArray(stores) ? stores : [stores];
    storesArr.forEach((store) => {
      unsubscribers.push(store.subscribe(() => {
        subscriber(get2());
      }));
    });
    subscriber(get2());
    subscribers.set(subscriber, unsubscribers);
    return () => {
      const unsubscribers2 = subscribers.get(subscriber);
      if (unsubscribers2) {
        for (const unsubscribe of unsubscribers2) {
          unsubscribe();
        }
      }
      subscribers.delete(subscriber);
    };
  };
  return {
    get: get2,
    subscribe
  };
};
const overridable$1 = (_store, onChange) => {
  const store = withGet(_store);
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function sleep$1(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function generateId() {
  return nanoid(10);
}
function generateIds(args) {
  return args.reduce((acc, curr) => {
    acc[curr] = generateId();
    return acc;
  }, {});
}
const kbd = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " "
};
const isDom = () => typeof window !== "undefined";
function getPlatform() {
  const agent = navigator.userAgentData;
  return agent?.platform ?? navigator.platform;
}
const pt = (v) => isDom() && v.test(getPlatform().toLowerCase());
const isTouchDevice = () => isDom() && !!navigator.maxTouchPoints;
const isMac$1 = () => pt(/^mac/) && !isTouchDevice();
const isApple = () => pt(/mac|iphone|ipad|ipod/i);
const isIos = () => isApple() && !isMac$1();
const LOCK_CLASSNAME = "data-melt-scroll-lock";
function assignStyle(el, style) {
  if (!el)
    return;
  const previousStyle = el.style.cssText;
  Object.assign(el.style, style);
  return () => {
    el.style.cssText = previousStyle;
  };
}
function setCSSProperty$1(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function getPaddingProperty$1(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function removeScroll(_document) {
  const doc = document;
  const win = doc.defaultView ?? window;
  const { documentElement, body } = doc;
  const locked = body.hasAttribute(LOCK_CLASSNAME);
  if (locked)
    return noop$1;
  body.setAttribute(LOCK_CLASSNAME, "");
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty$1(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty$1(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  const setStyle2 = () => assignStyle(body, {
    overflow: "hidden",
    [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
  });
  const setIOSStyle = () => {
    const { scrollX, scrollY, visualViewport: visualViewport2 } = win;
    const offsetLeft = visualViewport2?.offsetLeft ?? 0;
    const offsetTop = visualViewport2?.offsetTop ?? 0;
    const restoreStyle = assignStyle(body, {
      position: "fixed",
      overflow: "hidden",
      top: `${-(scrollY - Math.floor(offsetTop))}px`,
      left: `${-(scrollX - Math.floor(offsetLeft))}px`,
      right: "0",
      [paddingProperty]: `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`
    });
    return () => {
      restoreStyle?.();
      win.scrollTo(scrollX, scrollY);
    };
  };
  const cleanups = [setScrollbarWidthProperty(), isIos() ? setIOSStyle() : setStyle2()];
  return () => {
    cleanups.forEach((fn) => fn?.());
    body.removeAttribute(LOCK_CLASSNAME);
  };
}
function effect$1(stores, fn) {
  let cb = void 0;
  const destroy = derived(stores, (stores2) => {
    cb?.();
    cb = fn(stores2);
  }).subscribe(noop$1);
  const unsub = () => {
    destroy();
    cb?.();
  };
  safeOnDestroy$1(unsub);
  return unsub;
}
function toWritableStores$1(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = withGet(writable(value));
  });
  return result;
}
function getPortalParent(node) {
  let parent = node.parentElement;
  while (isHTMLElement$1(parent) && !parent.hasAttribute("data-portal")) {
    parent = parent.parentElement;
  }
  return parent || "body";
}
function getPortalDestination(node, portalProp) {
  if (portalProp !== void 0)
    return portalProp;
  const portalParent = getPortalParent(node);
  if (portalParent === "body")
    return document.body;
  return null;
}
async function handleFocus(args) {
  const { prop, defaultEl } = args;
  await Promise.all([sleep$1(1), tick]);
  if (prop === void 0) {
    defaultEl?.focus();
    return;
  }
  const returned = isFunction(prop) ? prop(defaultEl) : prop;
  if (typeof returned === "string") {
    const el = document.querySelector(returned);
    if (!isHTMLElement$1(el))
      return;
    el.focus();
  } else if (isHTMLElement$1(returned)) {
    returned.focus();
  }
}
readable(void 0, (set2) => {
  function clicked(event) {
    set2(event);
    set2(void 0);
  }
  const unsubscribe = addEventListener$1(document, "pointerup", clicked, {
    passive: false,
    capture: true
  });
  return unsubscribe;
});
const documentEscapeKeyStore$1 = readable(void 0, (set2) => {
  function keydown(event) {
    if (event && event.key === kbd.ESCAPE) {
      set2(event);
    }
    set2(void 0);
  }
  const unsubscribe = addEventListener$1(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
const useEscapeKeydown = ((node, config = {}) => {
  let unsub = noop$1;
  function update(config2 = {}) {
    unsub();
    const options = { enabled: true, ...config2 };
    const enabled = isReadable(options.enabled) ? options.enabled : readable(options.enabled);
    unsub = executeCallbacks(
      // Handle escape keydowns
      documentEscapeKeyStore$1.subscribe((e) => {
        if (!e || !get(enabled))
          return;
        const target = e.target;
        if (!isHTMLElement$1(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        if (options.ignore) {
          if (isFunction(options.ignore)) {
            if (options.ignore(e))
              return;
          } else if (Array.isArray(options.ignore)) {
            if (options.ignore.length > 0 && options.ignore.some((ignoreEl) => {
              return ignoreEl && target === ignoreEl;
            }))
              return;
          }
        }
        options.handler?.(e);
      }),
      effect$1(enabled, ($enabled) => {
        if ($enabled) {
          node.dataset.escapee = "";
        } else {
          delete node.dataset.escapee;
        }
      })
    );
  }
  update(config);
  return {
    update,
    destroy() {
      node.removeAttribute("data-escapee");
      unsub();
    }
  };
});
function createFocusTrap(config = {}) {
  let trap;
  const { immediate, ...focusTrapOptions } = config;
  const hasFocus = writable(false);
  const isPaused = writable(false);
  const activate = (opts) => trap?.activate(opts);
  const deactivate = (opts) => {
    trap?.deactivate(opts);
  };
  const pause = () => {
    if (trap) {
      trap.pause();
      isPaused.set(true);
    }
  };
  const unpause = () => {
    if (trap) {
      trap.unpause();
      isPaused.set(false);
    }
  };
  const useFocusTrap = (node) => {
    trap = createFocusTrap$1(node, {
      ...focusTrapOptions,
      onActivate() {
        hasFocus.set(true);
        config.onActivate?.();
      },
      onDeactivate() {
        hasFocus.set(false);
        config.onDeactivate?.();
      }
    });
    if (immediate) {
      activate();
    }
    return {
      destroy() {
        deactivate();
        trap = void 0;
      }
    };
  };
  return {
    useFocusTrap,
    hasFocus: readonly(hasFocus),
    isPaused: readonly(isPaused),
    activate,
    deactivate,
    pause,
    unpause
  };
}
const visibleModals = [];
const useModal = ((node, config) => {
  let unsubInteractOutside = noop$1;
  function removeNodeFromVisibleModals() {
    const index = visibleModals.indexOf(node);
    if (index >= 0) {
      visibleModals.splice(index, 1);
    }
  }
  function update(config2) {
    unsubInteractOutside();
    const { open, onClose, shouldCloseOnInteractOutside, closeOnInteractOutside } = config2;
    sleep$1(100).then(() => {
      if (open) {
        visibleModals.push(node);
      } else {
        removeNodeFromVisibleModals();
      }
    });
    function isLastModal() {
      return last(visibleModals) === node;
    }
    function closeModal() {
      if (isLastModal() && onClose) {
        onClose();
        removeNodeFromVisibleModals();
      }
    }
    function onInteractOutsideStart(e) {
      const target = e.target;
      if (!isElement(target))
        return;
      if (target && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
    function onInteractOutside(e) {
      if (shouldCloseOnInteractOutside?.(e) && isLastModal()) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        closeModal();
      }
    }
    unsubInteractOutside = useInteractOutside(node, {
      onInteractOutsideStart,
      onInteractOutside: closeOnInteractOutside ? onInteractOutside : void 0,
      enabled: open
    }).destroy;
  }
  update(config);
  return {
    update,
    destroy() {
      removeNodeFromVisibleModals();
      unsubInteractOutside();
    }
  };
});
const usePortal = ((el, target = "body") => {
  let targetEl;
  if (!isHTMLElement$1(target) && typeof target !== "string") {
    return {
      destroy: noop$1
    };
  }
  async function update(newTarget) {
    target = newTarget;
    if (typeof target === "string") {
      targetEl = document.querySelector(target);
      if (targetEl === null) {
        await tick();
        targetEl = document.querySelector(target);
      }
      if (targetEl === null) {
        throw new Error(`No element found matching css selector: "${target}"`);
      }
    } else if (target instanceof HTMLElement) {
      targetEl = target;
    } else {
      throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
    }
    el.dataset.portal = "";
    targetEl.appendChild(el);
    el.hidden = false;
  }
  function destroy() {
    el.remove();
  }
  update(target);
  return {
    update,
    destroy
  };
});
const useInteractOutside = ((node, config) => {
  let unsub = noop$1;
  let unsubClick = noop$1;
  let isPointerDown = false;
  let isPointerDownInside = false;
  let ignoreEmulatedMouseEvents = false;
  function update(config2) {
    unsub();
    unsubClick();
    const { onInteractOutside, onInteractOutsideStart, enabled } = config2;
    if (!enabled)
      return;
    function onPointerDown(e) {
      if (onInteractOutside && isValidEvent(e, node)) {
        onInteractOutsideStart?.(e);
      }
      const target = e.target;
      if (isElement(target) && isOrContainsTarget(node, target)) {
        isPointerDownInside = true;
      }
      isPointerDown = true;
    }
    function triggerInteractOutside(e) {
      onInteractOutside?.(e);
    }
    const documentObj = getOwnerDocument(node);
    if (typeof PointerEvent !== "undefined") {
      const onPointerUp = (e) => {
        unsubClick();
        const handler = (e2) => {
          if (shouldTriggerInteractOutside(e2)) {
            triggerInteractOutside(e2);
          }
          resetPointerState();
        };
        if (e.pointerType === "touch") {
          unsubClick = addEventListener$1(documentObj, "click", handler, {
            capture: true,
            once: true
          });
          return;
        }
        handler(e);
      };
      unsub = executeCallbacks(addEventListener$1(documentObj, "pointerdown", onPointerDown, true), addEventListener$1(documentObj, "pointerup", onPointerUp, true));
    } else {
      const onMouseUp = (e) => {
        if (ignoreEmulatedMouseEvents) {
          ignoreEmulatedMouseEvents = false;
        } else if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      const onTouchEnd = (e) => {
        ignoreEmulatedMouseEvents = true;
        if (shouldTriggerInteractOutside(e)) {
          triggerInteractOutside(e);
        }
        resetPointerState();
      };
      unsub = executeCallbacks(addEventListener$1(documentObj, "mousedown", onPointerDown, true), addEventListener$1(documentObj, "mouseup", onMouseUp, true), addEventListener$1(documentObj, "touchstart", onPointerDown, true), addEventListener$1(documentObj, "touchend", onTouchEnd, true));
    }
  }
  function shouldTriggerInteractOutside(e) {
    if (isPointerDown && !isPointerDownInside && isValidEvent(e, node)) {
      return true;
    }
    return false;
  }
  function resetPointerState() {
    isPointerDown = false;
    isPointerDownInside = false;
  }
  update(config);
  return {
    update,
    destroy() {
      unsub();
      unsubClick();
    }
  };
});
function isValidEvent(e, node) {
  if ("button" in e && e.button > 0)
    return false;
  const target = e.target;
  if (!isElement(target))
    return false;
  const ownerDocument = target.ownerDocument;
  if (!ownerDocument || !ownerDocument.documentElement.contains(target)) {
    return false;
  }
  return node && !isOrContainsTarget(node, target);
}
function isOrContainsTarget(node, target) {
  return node === target || node.contains(target);
}
function getOwnerDocument(el) {
  return el?.ownerDocument ?? document;
}
({
  disabled: readable(false),
  required: readable(false),
  name: readable(void 0)
});
const defaults$1 = {
  isDateDisabled: void 0,
  isDateUnavailable: void 0,
  value: void 0,
  preventDeselect: false,
  numberOfMonths: 1,
  pagedNavigation: false,
  weekStartsOn: 0,
  fixedWeeks: false,
  calendarLabel: "Event Date",
  locale: "en",
  minValue: void 0,
  maxValue: void 0,
  disabled: false,
  readonly: false,
  weekdayFormat: "narrow"
};
({
  ...omit$1(defaults$1, "isDateDisabled", "isDateUnavailable", "value", "locale", "disabled", "readonly", "minValue", "maxValue", "weekdayFormat")
});
const { name } = createElHelpers("dialog");
const defaults = {
  preventScroll: true,
  closeOnEscape: true,
  closeOnOutsideClick: true,
  role: "dialog",
  defaultOpen: false,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const dialogIdParts = ["content", "title", "description"];
function createDialog(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores$1(omit$1(withDefaults, "ids"));
  const { preventScroll: preventScroll2, closeOnEscape, closeOnOutsideClick, role, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores$1({
    ...generateIds(dialogIdParts),
    ...withDefaults.ids
  });
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable$1(openWritable, withDefaults?.onOpenChange);
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => {
    return $open || $forceVisible;
  });
  let unsubScroll = noop$1;
  function handleOpen(e) {
    const el = e.currentTarget;
    const triggerEl = e.currentTarget;
    if (!isHTMLElement$1(el) || !isHTMLElement$1(triggerEl))
      return;
    open.set(true);
    activeTrigger.set(triggerEl);
  }
  function handleClose() {
    open.set(false);
    handleFocus({
      prop: closeFocus.get(),
      defaultEl: activeTrigger.get()
    });
  }
  const trigger = makeElement(name("trigger"), {
    stores: [open],
    returned: ([$open]) => {
      return {
        "aria-haspopup": "dialog",
        "aria-expanded": $open,
        type: "button"
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        handleOpen(e);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        handleOpen(e);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name("overlay"), {
    stores: [isVisible, open],
    returned: ([$isVisible, $open]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": true,
        "data-state": $open ? "open" : "closed"
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop$1;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      return {
        destroy() {
          unsubEscapeKeydown();
        }
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: [isVisible, ids.content, ids.description, ids.title, open],
    returned: ([$isVisible, $contentId, $descriptionId, $titleId, $open]) => {
      return {
        id: $contentId,
        role: role.get(),
        "aria-describedby": $descriptionId,
        "aria-labelledby": $titleId,
        "aria-modal": $isVisible ? "true" : void 0,
        "data-state": $open ? "open" : "closed",
        tabindex: -1,
        hidden: $isVisible ? void 0 : true,
        style: styleToString$1({
          display: $isVisible ? void 0 : "none"
        })
      };
    },
    action: (node) => {
      let activate = noop$1;
      let deactivate = noop$1;
      const destroy = executeCallbacks(effect$1([open, closeOnOutsideClick, closeOnEscape], ([$open, $closeOnOutsideClick, $closeOnEscape]) => {
        if (!$open)
          return;
        const focusTrap = createFocusTrap({
          immediate: false,
          escapeDeactivates: $closeOnEscape,
          clickOutsideDeactivates: $closeOnOutsideClick,
          allowOutsideClick: true,
          returnFocusOnDeactivate: false,
          fallbackFocus: node
        });
        activate = focusTrap.activate;
        deactivate = focusTrap.deactivate;
        const ac = focusTrap.useFocusTrap(node);
        if (ac && ac.destroy) {
          return ac.destroy;
        } else {
          return focusTrap.deactivate;
        }
      }), effect$1([closeOnOutsideClick, open], ([$closeOnOutsideClick, $open]) => {
        return useModal(node, {
          open: $open,
          closeOnInteractOutside: $closeOnOutsideClick,
          onClose() {
            handleClose();
          },
          shouldCloseOnInteractOutside(e) {
            onOutsideClick.get()?.(e);
            if (e.defaultPrevented)
              return false;
            return true;
          }
        }).destroy;
      }), effect$1([closeOnEscape], ([$closeOnEscape]) => {
        if (!$closeOnEscape)
          return noop$1;
        return useEscapeKeydown(node, { handler: handleClose }).destroy;
      }), effect$1([isVisible], ([$isVisible]) => {
        tick().then(() => {
          if (!$isVisible) {
            deactivate();
          } else {
            activate();
          }
        });
      }));
      return {
        destroy: () => {
          unsubScroll();
          destroy();
        }
      };
    }
  });
  const portalled = makeElement(name("portalled"), {
    stores: portal,
    returned: ($portal) => ({
      "data-portal": portalAttr($portal)
    }),
    action: (node) => {
      const unsubPortal = effect$1([portal], ([$portal]) => {
        if ($portal === null)
          return noop$1;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return noop$1;
        return usePortal(node, portalDestination).destroy;
      });
      return {
        destroy() {
          unsubPortal();
        }
      };
    }
  });
  const title = makeElement(name("title"), {
    stores: [ids.title],
    returned: ([$titleId]) => ({
      id: $titleId
    })
  });
  const description = makeElement(name("description"), {
    stores: [ids.description],
    returned: ([$descriptionId]) => ({
      id: $descriptionId
    })
  });
  const close = makeElement(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.SPACE && e.key !== kbd.ENTER)
          return;
        e.preventDefault();
        handleClose();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect$1([open, preventScroll2], ([$open, $preventScroll]) => {
    if (!isBrowser$1)
      return;
    if ($preventScroll && $open)
      unsubScroll = removeScroll();
    if ($open) {
      const contentEl = document.getElementById(ids.content.get());
      handleFocus({ prop: openFocus.get(), defaultEl: contentEl });
    }
    return () => {
      if (!forceVisible.get()) {
        unsubScroll();
      }
    };
  });
  return {
    ids,
    elements: {
      content,
      trigger,
      title,
      description,
      overlay,
      close,
      portalled
    },
    states: {
      open
    },
    options
  };
}
function createBitAttrs(bit, parts) {
  const attrs = {};
  parts.forEach((part) => {
    attrs[part] = {
      [`data-${bit}-${part}`]: ""
    };
  });
  return (part) => attrs[part];
}
function removeUndefined$1(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
function getOptionUpdater$1(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
function getDialogData() {
  const NAME = "dialog";
  const PARTS = [
    "close",
    "content",
    "description",
    "overlay",
    "portal",
    "title",
    "trigger"
  ];
  return {
    NAME,
    PARTS
  };
}
function setCtx$1(props) {
  const { NAME, PARTS } = getDialogData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const dialog = {
    ...createDialog({ ...removeUndefined$1(props), role: "dialog", forceVisible: true }),
    getAttrs
  };
  setContext(NAME, dialog);
  return {
    ...dialog,
    updateOption: getOptionUpdater$1(dialog.options)
  };
}
function getCtx$1() {
  const { NAME } = getDialogData();
  return getContext(NAME);
}
function Dialog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let preventScroll2 = fallback($$props["preventScroll"], () => void 0, true);
    let closeOnEscape = fallback($$props["closeOnEscape"], () => void 0, true);
    let closeOnOutsideClick = fallback($$props["closeOnOutsideClick"], () => void 0, true);
    let portal = fallback($$props["portal"], () => void 0, true);
    let open = fallback($$props["open"], () => void 0, true);
    let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
    let openFocus = fallback($$props["openFocus"], () => void 0, true);
    let closeFocus = fallback($$props["closeFocus"], () => void 0, true);
    let onOutsideClick = fallback($$props["onOutsideClick"], () => void 0, true);
    const { states: { open: localOpen }, updateOption, ids } = setCtx$1({
      closeOnEscape,
      preventScroll: preventScroll2,
      closeOnOutsideClick,
      portal,
      forceVisible: true,
      defaultOpen: open,
      openFocus,
      closeFocus,
      onOutsideClick,
      onOpenChange: ({ next }) => {
        if (open !== next) {
          onOpenChange?.(next);
          open = next;
        }
        return next;
      }
    });
    const idValues = derived([ids.content, ids.description, ids.title], ([$contentId, $descriptionId, $titleId]) => ({
      content: $contentId,
      description: $descriptionId,
      title: $titleId
    }));
    open !== void 0 && localOpen.set(open);
    updateOption("preventScroll", preventScroll2);
    updateOption("closeOnEscape", closeOnEscape);
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
    updateOption("portal", portal);
    updateOption("openFocus", openFocus);
    updateOption("closeFocus", closeFocus);
    updateOption("onOutsideClick", onOutsideClick);
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { ids: store_get($$store_subs ??= {}, "$idValues", idValues) });
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      preventScroll: preventScroll2,
      closeOnEscape,
      closeOnOutsideClick,
      portal,
      open,
      onOpenChange,
      openFocus,
      closeFocus,
      onOutsideClick
    });
  });
}
function Dialog_close($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let builder;
    let asChild = fallback($$props["asChild"], false);
    let el = fallback($$props["el"], () => void 0, true);
    const { elements: { close }, getAttrs } = getCtx$1();
    const attrs = getAttrs("close");
    builder = store_get($$store_subs ??= {}, "$close", close);
    Object.assign(builder, attrs);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<button${attributes({ ...builder, type: "button", ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { asChild, el });
  });
}
function Dialog_portal($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let builder;
    let asChild = fallback($$props["asChild"], false);
    let el = fallback($$props["el"], () => void 0, true);
    const { elements: { portalled }, getAttrs } = getCtx$1();
    const attrs = getAttrs("portal");
    builder = store_get($$store_subs ??= {}, "$portalled", portalled);
    Object.assign(builder, attrs);
    if (asChild) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { asChild, el });
  });
}
function Dialog_content($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "el"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let builder;
    let transition = fallback($$props["transition"], () => void 0, true);
    let transitionConfig = fallback($$props["transitionConfig"], () => void 0, true);
    let inTransition = fallback($$props["inTransition"], () => void 0, true);
    let inTransitionConfig = fallback($$props["inTransitionConfig"], () => void 0, true);
    let outTransition = fallback($$props["outTransition"], () => void 0, true);
    let outTransitionConfig = fallback($$props["outTransitionConfig"], () => void 0, true);
    let asChild = fallback($$props["asChild"], false);
    let id = fallback($$props["id"], () => void 0, true);
    let el = fallback($$props["el"], () => void 0, true);
    const { elements: { content }, states: { open }, ids, getAttrs } = getCtx$1();
    const attrs = getAttrs("content");
    if (id) {
      ids.content.set(id);
    }
    builder = store_get($$store_subs ??= {}, "$content", content);
    Object.assign(builder, attrs);
    if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]-->`);
    } else if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    } else if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    } else if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    } else if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    } else if (store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}><!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      transition,
      transitionConfig,
      inTransition,
      inTransitionConfig,
      outTransition,
      outTransitionConfig,
      asChild,
      id,
      el
    });
  });
}
function Dialog_overlay($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let builder;
    let transition = fallback($$props["transition"], () => void 0, true);
    let transitionConfig = fallback($$props["transitionConfig"], () => void 0, true);
    let inTransition = fallback($$props["inTransition"], () => void 0, true);
    let inTransitionConfig = fallback($$props["inTransitionConfig"], () => void 0, true);
    let outTransition = fallback($$props["outTransition"], () => void 0, true);
    let outTransitionConfig = fallback($$props["outTransitionConfig"], () => void 0, true);
    let asChild = fallback($$props["asChild"], false);
    let el = fallback($$props["el"], () => void 0, true);
    const { elements: { overlay }, states: { open }, getAttrs } = getCtx$1();
    const attrs = getAttrs("overlay");
    builder = store_get($$store_subs ??= {}, "$overlay", overlay);
    Object.assign(builder, attrs);
    if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", { builder });
      $$renderer2.push(`<!--]-->`);
    } else if (transition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}></div>`);
    } else if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}></div>`);
    } else if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}></div>`);
    } else if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}></div>`);
    } else if (store_get($$store_subs ??= {}, "$open", open)) {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`<div${attributes({ ...builder, ...$$restProps })}></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      transition,
      transitionConfig,
      inTransition,
      inTransitionConfig,
      outTransition,
      outTransitionConfig,
      asChild,
      el
    });
  });
}
function getOptionUpdater(options) {
  return function(key, value) {
    if (value === void 0)
      return;
    const store = options[key];
    if (store) {
      store.set(value);
    }
  };
}
const TRANSITIONS = {
  DURATION: 0.5,
  EASE: [0.32, 0.72, 0, 1]
};
const VELOCITY_THRESHOLD = 0.4;
function effect(stores, fn) {
  if (typeof document === "undefined") {
    return () => {
    };
  }
  const unsub = derivedWithUnsubscribe(stores, (stores2, onUnsubscribe) => {
    return {
      stores: stores2,
      onUnsubscribe
    };
  }).subscribe(({ stores: stores2, onUnsubscribe }) => {
    const returned = fn(stores2);
    if (returned) {
      onUnsubscribe(returned);
    }
  });
  safeOnDestroy(unsub);
  return unsub;
}
function derivedWithUnsubscribe(stores, fn) {
  let unsubscribers = [];
  const onUnsubscribe = (cb) => {
    unsubscribers.push(cb);
  };
  const unsubscribe = () => {
    unsubscribers.forEach((fn2) => fn2());
    unsubscribers = [];
  };
  const derivedStore = derived(stores, ($storeValues) => {
    unsubscribe();
    return fn($storeValues, onUnsubscribe);
  });
  safeOnDestroy(unsubscribe);
  const subscribe = (...args) => {
    const unsub = derivedStore.subscribe(...args);
    return () => {
      unsub();
      unsubscribe();
    };
  };
  return {
    ...derivedStore,
    subscribe
  };
}
const safeOnDestroy = (fn) => {
  try {
    onDestroy(fn);
  } catch {
    return fn();
  }
};
const overridable = (store, onChange) => {
  const update = (updater, sideEffect) => {
    store.update((curr) => {
      const next = updater(curr);
      let res = next;
      if (onChange) {
        res = onChange({ curr, next });
      }
      sideEffect?.(res);
      return res;
    });
  };
  const set2 = (curr) => {
    update(() => curr);
  };
  return {
    ...store,
    update,
    set: set2
  };
};
function toWritableStores(properties) {
  const result = {};
  Object.keys(properties).forEach((key) => {
    const propertyKey = key;
    const value = properties[propertyKey];
    result[propertyKey] = writable(value);
  });
  return result;
}
function omit(obj, ...keys) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}
function removeUndefined(obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (value !== void 0) {
      result[key] = value;
    }
  }
  return result;
}
const cache = /* @__PURE__ */ new WeakMap();
function set(el, styles, ignoreCache = false) {
  if (!el || !(el instanceof HTMLElement) || !styles)
    return;
  const originalStyles = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (key.startsWith("--")) {
      el.style.setProperty(key, value);
      return;
    }
    originalStyles[key] = el.style[key];
    el.style[key] = value;
  });
  if (ignoreCache)
    return;
  cache.set(el, originalStyles);
}
function reset(el, prop) {
  if (!el || !(el instanceof HTMLElement))
    return;
  const originalStyles = cache.get(el);
  if (!originalStyles) {
    return;
  }
  if (prop) {
    el.style[prop] = originalStyles[prop];
  } else {
    Object.entries(originalStyles).forEach(([key, value]) => {
      el.style[key] = value;
    });
  }
}
function getTranslate(element, direction) {
  const style = window.getComputedStyle(element);
  const transform = (
    // @ts-expect-error - vendor prefix
    style.transform || style.webkitTransform || style.mozTransform
  );
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(", ")[isVertical(direction) ? 13 : 12]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(", ")[isVertical(direction) ? 5 : 4]) : null;
}
function styleToString(style) {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === void 0)
      return str;
    return str + `${key}:${style[key]};`;
  }, "");
}
function noop() {
}
function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? event : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
const nonTextInputTypes = /* @__PURE__ */ new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset"
]);
const isBrowser = typeof document !== "undefined";
function isInput(target) {
  return target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type) || target instanceof HTMLTextAreaElement || target instanceof HTMLElement && target.isContentEditable;
}
function isVertical(direction) {
  if (direction === "top" || direction === "bottom")
    return true;
  return false;
}
function isBottomOrRight(direction) {
  if (direction === "bottom" || direction === "right")
    return true;
  return false;
}
function chain(...callbacks) {
  return (...args) => {
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        callback(...args);
      }
    }
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function handleSnapPoints({ activeSnapPoint, snapPoints, drawerRef, overlayRef, fadeFromIndex, openTime, direction }) {
  const isLastSnapPoint = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => {
    return $activeSnapPoint === $snapPoints?.[$snapPoints.length - 1];
  });
  const shouldFade = derived([snapPoints, fadeFromIndex, activeSnapPoint], ([$snapPoints, $fadeFromIndex, $activeSnapPoint]) => {
    return $snapPoints && $snapPoints.length > 0 && ($fadeFromIndex || $fadeFromIndex === 0) && !Number.isNaN($fadeFromIndex) && $snapPoints[$fadeFromIndex] === $activeSnapPoint || !$snapPoints;
  });
  const activeSnapPointIndex = derived([snapPoints, activeSnapPoint], ([$snapPoints, $activeSnapPoint]) => $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? null);
  const snapPointsOffset = derived(snapPoints, ($snapPoints) => {
    if ($snapPoints) {
      return $snapPoints.map((snapPoint) => {
        const hasWindow = typeof window !== "undefined";
        const isPx = typeof snapPoint === "string";
        let snapPointAsNumber = 0;
        if (isPx) {
          snapPointAsNumber = parseInt(snapPoint, 10);
        }
        const $direction = get(direction);
        if (isVertical($direction)) {
          const height = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerHeight : 0;
          if (hasWindow) {
            return $direction === "bottom" ? window.innerHeight - height : window.innerHeight + height;
          }
          return height;
        }
        const width = isPx ? snapPointAsNumber : hasWindow ? snapPoint * window.innerWidth : 0;
        if (hasWindow) {
          return $direction === "right" ? window.innerWidth - width : window.innerWidth + width;
        }
        return width;
      });
    }
    return [];
  });
  const activeSnapPointOffset = derived([snapPointsOffset, activeSnapPointIndex], ([$snapPointsOffset, $activeSnapPointIndex]) => $activeSnapPointIndex !== null ? $snapPointsOffset?.[$activeSnapPointIndex] : null);
  effect([activeSnapPoint, drawerRef], ([$activeSnapPoint, $drawerRef]) => {
    if ($activeSnapPoint && $drawerRef) {
      const $snapPoints = get(snapPoints);
      const $snapPointsOffset = get(snapPointsOffset);
      const newIndex = $snapPoints?.findIndex((snapPoint) => snapPoint === $activeSnapPoint) ?? -1;
      if ($snapPointsOffset && newIndex !== -1 && typeof $snapPointsOffset[newIndex] === "number") {
        snapToPoint($snapPointsOffset[newIndex]);
      }
    }
  });
  function snapToPoint(dimension) {
    tick().then(() => {
      const $snapPointsOffset = get(snapPointsOffset);
      const newSnapPointIndex = $snapPointsOffset?.findIndex((snapPointDim) => snapPointDim === dimension) ?? null;
      const $drawerRef = get(drawerRef);
      const $direction = get(direction);
      onSnapPointChange(newSnapPointIndex);
      set($drawerRef, {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `translate3d(0, ${dimension}px, 0)` : `translate3d(${dimension}px, 0, 0)`
      });
      const $fadeFromIndex = get(fadeFromIndex);
      const $overlayRef = get(overlayRef);
      if (snapPointsOffset && newSnapPointIndex !== $snapPointsOffset.length - 1 && newSnapPointIndex !== $fadeFromIndex) {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "0"
        });
      } else {
        set($overlayRef, {
          transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
          opacity: "1"
        });
      }
      activeSnapPoint.update(() => {
        const $snapPoints = get(snapPoints);
        if (newSnapPointIndex === null || !$snapPoints)
          return null;
        return $snapPoints[newSnapPointIndex];
      });
    });
  }
  function onRelease({ draggedDistance, closeDrawer, velocity, dismissible }) {
    const $fadeFromIndex = get(fadeFromIndex);
    if ($fadeFromIndex === void 0)
      return;
    const $activeSnapPointOffset = get(activeSnapPointOffset);
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $overlayRef = get(overlayRef);
    const $snapPointsOffset = get(snapPointsOffset);
    const $snapPoints = get(snapPoints);
    const $direction = get(direction);
    const currentPosition = $direction === "bottom" || $direction === "right" ? ($activeSnapPointOffset ?? 0) - draggedDistance : ($activeSnapPointOffset ?? 0) + draggedDistance;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isFirst = $activeSnapPointIndex === 0;
    const hasDraggedUp = draggedDistance > 0;
    if (isOverlaySnapPoint) {
      set($overlayRef, {
        transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
    if (velocity > 2 && !hasDraggedUp) {
      if (dismissible)
        closeDrawer();
      else
        snapToPoint($snapPointsOffset[0]);
      return;
    }
    if (velocity > 2 && hasDraggedUp && $snapPointsOffset && $snapPoints) {
      snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
      return;
    }
    const closestSnapPoint = $snapPointsOffset?.reduce((prev, curr) => {
      if (typeof prev !== "number" || typeof curr !== "number")
        return prev;
      return Math.abs(curr - currentPosition) < Math.abs(prev - currentPosition) ? curr : prev;
    });
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    if (velocity > VELOCITY_THRESHOLD && Math.abs(draggedDistance) < dim * 0.4) {
      const dragDirection = hasDraggedUp ? 1 : -1;
      if (dragDirection > 0 && get(isLastSnapPoint) && $snapPoints) {
        snapToPoint($snapPointsOffset[$snapPoints.length - 1]);
        return;
      }
      if (isFirst && dragDirection < 0 && dismissible) {
        closeDrawer();
      }
      if ($activeSnapPointIndex === null)
        return;
      snapToPoint($snapPointsOffset[$activeSnapPointIndex + dragDirection]);
      return;
    }
    snapToPoint(closestSnapPoint);
  }
  function onDrag({ draggedDistance }) {
    const $drawerRef = get(drawerRef);
    const $activeSnapPointOffset = get(activeSnapPointOffset);
    if ($activeSnapPointOffset === null)
      return;
    const $snapPointsOffset = get(snapPointsOffset);
    const $direction = get(direction);
    const newValue = $direction === "bottom" || $direction === "right" ? $activeSnapPointOffset - draggedDistance : $activeSnapPointOffset + draggedDistance;
    const lastSnapPoint = $snapPointsOffset[$snapPointsOffset.length - 1];
    if (isBottomOrRight($direction) && newValue < lastSnapPoint) {
      return;
    }
    if (!isBottomOrRight($direction) && newValue > lastSnapPoint) {
      return;
    }
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${newValue}px, 0)` : `translate3d(${newValue}px, 0, 0)`
    });
  }
  function getPercentageDragged(absDraggedDistance, isDraggingDown) {
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $snapPointsOffset = get(snapPointsOffset);
    const $snapPoints = get(snapPoints);
    const $fadeFromIndex = get(fadeFromIndex);
    if (!$snapPoints || typeof $activeSnapPointIndex !== "number" || !$snapPointsOffset || $fadeFromIndex === void 0)
      return null;
    const isOverlaySnapPoint = $activeSnapPointIndex === $fadeFromIndex - 1;
    const isOverlaySnapPointOrHigher = $activeSnapPointIndex >= $fadeFromIndex;
    if (isOverlaySnapPointOrHigher && isDraggingDown) {
      return 0;
    }
    if (isOverlaySnapPoint && !isDraggingDown)
      return 1;
    if (!get(shouldFade) && !isOverlaySnapPoint)
      return null;
    const targetSnapPointIndex = isOverlaySnapPoint ? $activeSnapPointIndex + 1 : $activeSnapPointIndex - 1;
    const snapPointDistance = isOverlaySnapPoint ? $snapPointsOffset[targetSnapPointIndex] - $snapPointsOffset[targetSnapPointIndex - 1] : $snapPointsOffset[targetSnapPointIndex + 1] - $snapPointsOffset[targetSnapPointIndex];
    const percentageDragged = absDraggedDistance / Math.abs(snapPointDistance);
    if (isOverlaySnapPoint) {
      return 1 - percentageDragged;
    } else {
      return percentageDragged;
    }
  }
  function onSnapPointChange(activeSnapPointIndex2) {
    const $snapPoints = get(snapPoints);
    const $snapPointsOffset = get(snapPointsOffset);
    if ($snapPoints && activeSnapPointIndex2 === $snapPointsOffset.length - 1) {
      openTime.set(/* @__PURE__ */ new Date());
    }
  }
  return {
    isLastSnapPoint,
    shouldFade,
    getPercentageDragged,
    activeSnapPointIndex,
    onRelease,
    onDrag,
    snapPointsOffset
  };
}
function isMac() {
  return testPlatform(/^Mac/);
}
function isIPhone() {
  return testPlatform(/^iPhone/);
}
function isIPad() {
  return testPlatform(/^iPad/) || // iPadOS 13 lies and says it's a Mac, but we can distinguish by detecting touch support.
  isMac() && navigator.maxTouchPoints > 1;
}
function isIOS() {
  return isIPhone() || isIPad();
}
function testPlatform(re) {
  return typeof window !== "undefined" && window.navigator != null ? re.test(window.navigator.platform) : void 0;
}
const visualViewport = typeof document !== "undefined" && window.visualViewport;
function isScrollable(node) {
  const style = window.getComputedStyle(node);
  return /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
}
function getScrollParent(node) {
  if (isScrollable(node)) {
    node = node.parentElement;
  }
  while (node && !isScrollable(node)) {
    node = node.parentElement;
  }
  return node || document.scrollingElement || document.documentElement;
}
let preventScrollCount = 0;
let restore;
function preventScroll() {
  if (typeof document === "undefined")
    return () => {
    };
  preventScrollCount++;
  if (preventScrollCount === 1) {
    if (isIOS()) {
      restore = preventScrollMobileSafari();
    } else {
      restore = preventScrollStandard();
    }
  }
  return () => {
    preventScrollCount--;
    if (preventScrollCount === 0) {
      restore();
    }
  };
}
function getPaddingProperty(documentElement) {
  const documentLeft = documentElement.getBoundingClientRect().left;
  const scrollbarX = Math.round(documentLeft) + documentElement.scrollLeft;
  return scrollbarX ? "paddingLeft" : "paddingRight";
}
function setCSSProperty(el, property, value) {
  if (!el)
    return;
  const previousValue = el.style.getPropertyValue(property);
  el.style.setProperty(property, value);
  return () => {
    if (previousValue) {
      el.style.setProperty(property, previousValue);
    } else {
      el.style.removeProperty(property);
    }
  };
}
function preventScrollStandard() {
  if (typeof document === "undefined")
    return () => {
    };
  const win = document.defaultView ?? window;
  const { documentElement, body } = document;
  const scrollbarWidth = win.innerWidth - documentElement.clientWidth;
  const setScrollbarWidthProperty = () => setCSSProperty(documentElement, "--scrollbar-width", `${scrollbarWidth}px`);
  const paddingProperty = getPaddingProperty(documentElement);
  const scrollbarSidePadding = win.getComputedStyle(body)[paddingProperty];
  return chain(setScrollbarWidthProperty(), setStyle(body, paddingProperty, `calc(${scrollbarSidePadding} + ${scrollbarWidth}px)`), setStyle(body, "overflow", "hidden"));
}
function preventScrollMobileSafari() {
  let scrollable;
  let lastY = 0;
  const { documentElement, body, activeElement } = document;
  function onTouchStart(e) {
    scrollable = getScrollParent(e.target);
    if (scrollable === documentElement && scrollable === body)
      return;
    lastY = e.changedTouches[0].pageY;
  }
  function onTouchMove(e) {
    if (!scrollable || scrollable === documentElement || scrollable === body) {
      e.preventDefault();
      return;
    }
    const y = e.changedTouches[0].pageY;
    const scrollTop = scrollable.scrollTop;
    const bottom = scrollable.scrollHeight - scrollable.clientHeight;
    if (bottom === 0)
      return;
    if (scrollTop <= 0 && y > lastY || scrollTop >= bottom && y < lastY) {
      e.preventDefault();
    }
    lastY = y;
  }
  function onTouchEnd(e) {
    const target = e.target;
    if (!(isInput(target) && target !== activeElement))
      return;
    e.preventDefault();
    target.style.transform = "translateY(-2000px)";
    target.focus();
    requestAnimationFrame(() => {
      target.style.transform = "";
    });
  }
  function onFocus(e) {
    const target = e.target;
    if (!isInput(target))
      return;
    target.style.transform = "translateY(-2000px)";
    requestAnimationFrame(() => {
      target.style.transform = "";
      if (visualViewport) {
        if (visualViewport.height < window.innerHeight) {
          requestAnimationFrame(() => {
            scrollIntoView(target);
          });
        } else {
          visualViewport.addEventListener("resize", () => scrollIntoView(target), { once: true });
        }
      }
    });
  }
  function onWindowScroll() {
    window.scrollTo(0, 0);
  }
  const scrollX = window.pageXOffset;
  const scrollY = window.pageYOffset;
  const restoreStyles = chain(
    setStyle(documentElement, "paddingRight", `${window.innerWidth - documentElement.clientWidth}px`),
    setStyle(documentElement, "overflow", "hidden")
    // setStyle(document.body, 'marginTop', `-${scrollY}px`),
  );
  window.scrollTo(0, 0);
  const removeEvents = chain(addEventListener(document, "touchstart", onTouchStart, { passive: false, capture: true }), addEventListener(document, "touchmove", onTouchMove, { passive: false, capture: true }), addEventListener(document, "touchend", onTouchEnd, { passive: false, capture: true }), addEventListener(document, "focus", onFocus, true), addEventListener(window, "scroll", onWindowScroll));
  return () => {
    restoreStyles();
    removeEvents();
    window.scrollTo(scrollX, scrollY);
  };
}
function setStyle(element, style, value) {
  const cur = element.style[style];
  element.style[style] = value;
  return () => {
    element.style[style] = cur;
  };
}
function scrollIntoView(target) {
  const { documentElement, body, scrollingElement } = document;
  const root = scrollingElement || documentElement;
  while (target && target !== root) {
    const scrollable = getScrollParent(target);
    if (scrollable !== documentElement && scrollable !== body && scrollable !== target) {
      const scrollableTop = scrollable.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const targetBottom = target.getBoundingClientRect().bottom;
      const keyboardHeight = scrollable.getBoundingClientRect().bottom;
      if (targetBottom > keyboardHeight) {
        scrollable.scrollTop += targetTop - scrollableTop;
      }
    }
    target = scrollable.parentElement;
  }
}
const documentEscapeKeyStore = readable(void 0, (set2) => {
  function keydown(event) {
    if (event && event.key === "Escape") {
      set2(event);
    }
    set2(void 0);
  }
  const unsubscribe = addEventListener(document, "keydown", keydown, {
    passive: false
  });
  return unsubscribe;
});
function handleEscapeKeydown(node, handler) {
  let unsub = noop;
  function update(handler2) {
    unsub();
    unsub = chain(
      // Handle escape keydowns
      documentEscapeKeyStore.subscribe((e) => {
        if (!e)
          return;
        const target = e.target;
        if (!isHTMLElement(target) || target.closest("[data-escapee]") !== node) {
          return;
        }
        e.preventDefault();
        handler2(e);
      })
    );
    node.setAttribute("data-escapee", "");
  }
  update(handler);
  return () => {
    unsub();
    node.removeAttribute("data-escapee");
  };
}
function isHTMLElement(el) {
  return el instanceof HTMLElement;
}
let previousBodyPosition = null;
function handlePositionFixed({ isOpen, modal, nested, hasBeenOpened }) {
  const activeUrl = writable(typeof window !== "undefined" ? window.location.href : "");
  let scrollPos = 0;
  function setPositionFixed(open) {
    if (!(previousBodyPosition === null && open))
      return;
    previousBodyPosition = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      height: document.body.style.height
    };
    const { scrollX, innerHeight } = window;
    document.body.style.setProperty("position", "fixed", "important");
    document.body.style.top = `${-scrollPos}px`;
    document.body.style.left = `${-scrollX}px`;
    document.body.style.right = "0px";
    document.body.style.height = "auto";
    setTimeout(() => requestAnimationFrame(() => {
      const bottomBarHeight = innerHeight - window.innerHeight;
      if (bottomBarHeight && scrollPos >= innerHeight) {
        document.body.style.top = `${-(scrollPos + bottomBarHeight)}px`;
      }
    }), 300);
  }
  function restorePositionSetting() {
    if (previousBodyPosition === null)
      return;
    const $activeUrl = get(activeUrl);
    const y = -parseInt(document.body.style.top, 10);
    const x = -parseInt(document.body.style.left, 10);
    document.body.style.position = previousBodyPosition.position;
    document.body.style.top = previousBodyPosition.top;
    document.body.style.left = previousBodyPosition.left;
    document.body.style.height = previousBodyPosition.height;
    document.body.style.right = "unset";
    requestAnimationFrame(() => {
      if ($activeUrl !== window.location.href) {
        activeUrl.set(window.location.href);
        return;
      }
      window.scrollTo(x, y);
    });
    previousBodyPosition = null;
  }
  effect([isOpen, activeUrl], ([$isOpen, _]) => {
    if (typeof document === "undefined")
      return;
    if (get(nested) || !get(hasBeenOpened))
      return;
    if ($isOpen) {
      setPositionFixed($isOpen);
      if (!get(modal)) {
        setTimeout(() => {
          restorePositionSetting();
        }, 500);
      }
    } else {
      restorePositionSetting();
    }
  });
  return { restorePositionSetting };
}
const CLOSE_THRESHOLD = 0.25;
const SCROLL_LOCK_TIMEOUT = 100;
const BORDER_RADIUS = 8;
const NESTED_DISPLACEMENT = 16;
const WINDOW_TOP_OFFSET = 26;
const DRAG_CLASS = "vaul-dragging";
const openDrawerIds = writable([]);
const defaultProps = {
  closeThreshold: CLOSE_THRESHOLD,
  shouldScaleBackground: true,
  scrollLockTimeout: SCROLL_LOCK_TIMEOUT,
  onDrag: void 0,
  onRelease: void 0,
  snapPoints: void 0,
  fadeFromIndex: void 0,
  defaultActiveSnapPoint: void 0,
  onActiveSnapPointChange: void 0,
  defaultOpen: false,
  onOpenChange: void 0,
  fixed: void 0,
  dismissible: true,
  modal: true,
  nested: false,
  onClose: void 0,
  direction: "bottom"
};
const omittedOptions = [
  "defaultOpen",
  "onOpenChange",
  "defaultActiveSnapPoint",
  "onActiveSnapPointChange",
  "onDrag",
  "onRelease",
  "onClose"
];
function createVaul(props) {
  const { snapPoints: snapPointsProp, fadeFromIndex: fadeFromIndexProp = snapPointsProp && snapPointsProp.length - 1, ...withDefaults } = { ...defaultProps, ...removeUndefined(props) };
  const options = toWritableStores(omit({
    ...withDefaults,
    snapPoints: snapPointsProp,
    fadeFromIndex: fadeFromIndexProp
  }, ...omittedOptions));
  const triggerRef = writable(void 0);
  const { onDrag: onDragProp, onRelease: onReleaseProp, onClose, onOpenChange } = withDefaults;
  const { snapPoints, fadeFromIndex, fixed, dismissible, modal, nested, shouldScaleBackground, scrollLockTimeout, closeThreshold, direction } = options;
  const openStore = writable(withDefaults.defaultOpen);
  const isOpen = overridable(openStore, withDefaults.onOpenChange);
  const hasBeenOpened = writable(false);
  const visible = writable(false);
  const justReleased = writable(false);
  const overlayRef = writable(void 0);
  const openTime = writable(null);
  const keyboardIsOpen = writable(false);
  const drawerRef = writable(void 0);
  const drawerId = writable(void 0);
  let isDragging = false;
  let dragStartTime = null;
  let isClosing = false;
  let pointerStart = 0;
  let dragEndTime = null;
  let lastTimeDragPrevented = null;
  let isAllowedToDrag = false;
  let drawerHeightRef = get(drawerRef)?.getBoundingClientRect().height || 0;
  let previousDiffFromInitial = 0;
  let initialDrawerHeight = 0;
  let nestedOpenChangeTimer = null;
  const activeSnapPoint = overridable(writable(withDefaults.defaultActiveSnapPoint), withDefaults.onActiveSnapPointChange);
  const { activeSnapPointIndex, getPercentageDragged: getSnapPointsPercentageDragged, onDrag: onDragSnapPoints, onRelease: onReleaseSnapPoints, shouldFade, snapPointsOffset } = handleSnapPoints({
    snapPoints,
    activeSnapPoint,
    drawerRef,
    fadeFromIndex,
    overlayRef,
    openTime,
    direction
  });
  const getContentStyle = derived([snapPointsOffset], ([$snapPointsOffset]) => {
    return (style = "") => {
      if ($snapPointsOffset && $snapPointsOffset.length > 0) {
        const styleProp = styleToString({
          "--snap-point-height": `${$snapPointsOffset[0]}px`
        });
        return style + styleProp;
      }
      return style;
    };
  });
  effect([drawerRef], ([$drawerRef]) => {
    if ($drawerRef) {
      drawerId.set($drawerRef.id);
    }
  });
  effect([isOpen], ([$open]) => {
    sleep(100).then(() => {
      const id = get(drawerId);
      if ($open && id) {
        openDrawerIds.update((prev) => {
          if (prev.includes(id)) {
            return prev;
          }
          prev.push(id);
          return prev;
        });
      } else {
        openDrawerIds.update((prev) => prev.filter((id2) => id2 !== id2));
      }
    });
  });
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen && get(shouldScaleBackground)) {
      const id = setTimeout(() => {
        reset(document.body, "background");
      }, 200);
      return () => clearTimeout(id);
    }
  });
  effect([isOpen], ([$isOpen]) => {
    let unsub = () => {
    };
    if ($isOpen) {
      unsub = preventScroll();
    }
    return unsub;
  });
  const { restorePositionSetting } = handlePositionFixed({ isOpen, modal, nested, hasBeenOpened });
  effect([drawerRef], ([$drawerRef]) => {
    let unsub = noop;
    if ($drawerRef) {
      unsub = handleEscapeKeydown($drawerRef, () => {
        closeDrawer(true);
      });
    }
    return () => {
      unsub();
    };
  });
  function openDrawer() {
    if (isClosing)
      return;
    hasBeenOpened.set(true);
    isOpen.set(true);
  }
  function onPress(event) {
    const $drawerRef = get(drawerRef);
    if (!get(dismissible) && !get(snapPoints))
      return;
    if ($drawerRef && !$drawerRef.contains(event.target))
      return;
    drawerHeightRef = $drawerRef?.getBoundingClientRect().height || 0;
    isDragging = true;
    dragStartTime = /* @__PURE__ */ new Date();
    if (isIOS()) {
      window.addEventListener("touchend", () => isAllowedToDrag = false, { once: true });
    }
    event.target.setPointerCapture(event.pointerId);
    pointerStart = isVertical(get(direction)) ? event.screenY : event.screenX;
  }
  function shouldDrag(el, isDraggingInDirection) {
    const $drawerRef = get(drawerRef);
    let element = el;
    const highlightedText = window.getSelection()?.toString();
    const $direction = get(direction);
    const swipeAmount = $drawerRef ? getTranslate($drawerRef, $direction) : null;
    const date = /* @__PURE__ */ new Date();
    if (element.hasAttribute("data-vaul-no-drag") || element.closest("[data-vaul-no-drag]")) {
      return false;
    }
    const $openTime = get(openTime);
    if ($openTime && date.getTime() - $openTime.getTime() < 500) {
      return false;
    }
    if (swipeAmount !== null) {
      if ($direction === "bottom" || $direction === "right" ? swipeAmount > 0 : swipeAmount < 0) {
        return true;
      }
    }
    if (swipeAmount !== null && swipeAmount > 0) {
      return true;
    }
    if (highlightedText && highlightedText.length > 0) {
      return false;
    }
    const $scrollLockTimeout = get(scrollLockTimeout);
    if (lastTimeDragPrevented && date.getTime() - lastTimeDragPrevented.getTime() < $scrollLockTimeout && swipeAmount === 0) {
      lastTimeDragPrevented = date;
      return false;
    }
    if (isDraggingInDirection) {
      lastTimeDragPrevented = date;
      return false;
    }
    while (element) {
      if (element.scrollHeight > element.clientHeight) {
        if (element.scrollTop !== 0) {
          lastTimeDragPrevented = /* @__PURE__ */ new Date();
          return false;
        }
        if (element.getAttribute("role") === "dialog") {
          return true;
        }
      }
      element = element.parentNode;
    }
    return true;
  }
  function onDrag(event) {
    const $drawerRef = get(drawerRef);
    if (!$drawerRef || !isDragging)
      return;
    const $direction = get(direction);
    const directionMultiplier = getDirectionMultiplier($direction);
    const draggedDistance = getDistanceMoved(pointerStart, $direction, event) * directionMultiplier;
    const isDraggingInDirection = draggedDistance > 0;
    const $activeSnapPointIndex = get(activeSnapPointIndex);
    const $snapPoints = get(snapPoints);
    if ($snapPoints && $activeSnapPointIndex === 0 && !get(dismissible))
      return;
    if (!isAllowedToDrag && !shouldDrag(event.target, isDraggingInDirection)) {
      return;
    }
    $drawerRef.classList.add(DRAG_CLASS);
    isAllowedToDrag = true;
    set($drawerRef, {
      transition: "none"
    });
    const $overlayRef = get(overlayRef);
    set($overlayRef, {
      transition: "none"
    });
    if ($snapPoints) {
      onDragSnapPoints({ draggedDistance });
    }
    if (isDraggingInDirection && !$snapPoints) {
      const dampenedDraggedDistance = dampenValue(draggedDistance);
      const translateValue = Math.min(dampenedDraggedDistance * -1, 0) * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
      return;
    }
    const absDraggedDistance = Math.abs(draggedDistance);
    let percentageDragged = absDraggedDistance / drawerHeightRef;
    const snapPointPercentageDragged = getSnapPointsPercentageDragged(absDraggedDistance, isDraggingInDirection);
    if (snapPointPercentageDragged !== null) {
      percentageDragged = snapPointPercentageDragged;
    }
    const opacityValue = 1 - percentageDragged;
    const $fadeFromIndex = get(fadeFromIndex);
    const $shouldFade = get(shouldFade);
    if ($shouldFade || $fadeFromIndex && $activeSnapPointIndex === $fadeFromIndex - 1) {
      onDragProp?.(event, percentageDragged);
      set($overlayRef, {
        opacity: `${opacityValue}`,
        transition: "none"
      }, true);
    }
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (wrapper && $overlayRef && get(shouldScaleBackground)) {
      const scaleValue = Math.min(getScale() + percentageDragged * (1 - getScale()), 1);
      const borderRadiusValue = 8 - percentageDragged * 8;
      const translateValue = Math.max(0, 14 - percentageDragged * 14);
      set(wrapper, {
        borderRadius: `${borderRadiusValue}px`,
        transform: isVertical($direction) ? `scale(${scaleValue}) translate3d(0, ${translateValue}px, 0)` : `scale(${scaleValue}) translate3d(${translateValue}px, 0, 0)`,
        transition: "none"
      }, true);
    }
    if (!$snapPoints) {
      const translateValue = absDraggedDistance * directionMultiplier;
      set($drawerRef, {
        transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
      });
    }
  }
  function scaleBackground(open, backgroundColor = "black") {
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    if (!wrapper || !get(shouldScaleBackground))
      return;
    const $direction = get(direction);
    if (open) {
      set(document.body, {
        background: document.body.style.backgroundColor || document.body.style.background
      });
      set(document.body, {
        background: backgroundColor
      }, true);
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    } else {
      reset(wrapper, "overflow");
      reset(wrapper, "transform");
      reset(wrapper, "borderRadius");
      set(wrapper, {
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      });
    }
  }
  effect([activeSnapPointIndex, snapPoints, snapPointsOffset], ([$activeSnapPointIndex, $snapPoints, $snapPointsOffset]) => {
    function onVisualViewportChange() {
      const $drawerRef = get(drawerRef);
      if (!$drawerRef)
        return;
      const $keyboardIsOpen = get(keyboardIsOpen);
      const focusedElement = document.activeElement;
      if (isInput(focusedElement) || $keyboardIsOpen) {
        const visualViewportHeight = window.visualViewport?.height || 0;
        let diffFromInitial = window.innerHeight - visualViewportHeight;
        const drawerHeight = $drawerRef.getBoundingClientRect().height || 0;
        if (!initialDrawerHeight) {
          initialDrawerHeight = drawerHeight;
        }
        const offsetFromTop = $drawerRef.getBoundingClientRect().top;
        if (Math.abs(previousDiffFromInitial - diffFromInitial) > 60) {
          keyboardIsOpen.set(!$keyboardIsOpen);
        }
        if ($snapPoints && $snapPoints.length > 0 && $snapPointsOffset && $activeSnapPointIndex) {
          const activeSnapPointHeight = $snapPointsOffset[$activeSnapPointIndex] || 0;
          diffFromInitial += activeSnapPointHeight;
        }
        previousDiffFromInitial = diffFromInitial;
        if (drawerHeight > visualViewportHeight || $keyboardIsOpen) {
          const height = $drawerRef.getBoundingClientRect().height;
          let newDrawerHeight = height;
          if (height > visualViewportHeight) {
            newDrawerHeight = visualViewportHeight - WINDOW_TOP_OFFSET;
          }
          if (get(fixed)) {
            $drawerRef.style.height = `${height - Math.max(diffFromInitial, 0)}px`;
          } else {
            $drawerRef.style.height = `${Math.max(newDrawerHeight, visualViewportHeight - offsetFromTop)}px`;
          }
        } else {
          $drawerRef.style.height = `${initialDrawerHeight}px`;
        }
        if ($snapPoints && $snapPoints.length > 0 && !$keyboardIsOpen) {
          $drawerRef.style.bottom = `0px`;
        } else {
          $drawerRef.style.bottom = `${Math.max(diffFromInitial, 0)}px`;
        }
      }
    }
    let removeListener = noop;
    if (window.visualViewport) {
      removeListener = addEventListener(window.visualViewport, "resize", onVisualViewportChange);
    }
    return () => {
      removeListener();
    };
  });
  function closeDrawer(withKeyboard = false) {
    if (isClosing)
      return;
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const $direction = get(direction);
    onClose?.();
    set($drawerRef, {
      transform: isVertical($direction) ? `translate3d(0, ${$direction === "bottom" ? "100%" : "-100%"}, 0)` : `translate3d(${$direction === "right" ? "100%" : "-100%"}, 0, 0)`,
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set(get(overlayRef), {
      opacity: "0",
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    scaleBackground(false);
    isClosing = true;
    setTimeout(() => {
      visible.set(false);
      isOpen.set(false);
      isClosing = false;
      if (withKeyboard) {
        get(triggerRef)?.focus();
      }
    }, 300);
    const $snapPoints = get(snapPoints);
    setTimeout(() => {
      reset(document.documentElement, "scrollBehavior");
      if ($snapPoints) {
        activeSnapPoint.set($snapPoints[0]);
      }
    }, TRANSITIONS.DURATION * 1e3);
  }
  effect([isOpen], ([$isOpen]) => {
    if ($isOpen) {
      hasBeenOpened.set(true);
    } else {
      closeDrawer();
    }
  });
  function resetDrawer() {
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const $overlayRef = get(overlayRef);
    const wrapper = document.querySelector("[data-vaul-drawer-wrapper]");
    const $direction = get(direction);
    const currentSwipeAmount = getTranslate($drawerRef, $direction);
    set($drawerRef, {
      transform: "translate3d(0, 0, 0)",
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`
    });
    set($overlayRef, {
      transition: `opacity ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      opacity: "1"
    });
    const $shouldScaleBackground = get(shouldScaleBackground);
    const $isOpen = get(isOpen);
    if ($shouldScaleBackground && currentSwipeAmount && currentSwipeAmount > 0 && $isOpen) {
      set(wrapper, {
        borderRadius: `${BORDER_RADIUS}px`,
        overflow: "hidden",
        ...isVertical($direction) ? {
          transform: `scale(${getScale()}) translate3d(0, calc(env(safe-area-inset-top) + 14px), 0)`,
          transformOrigin: "top"
        } : {
          transform: `scale(${getScale()}) translate3d(calc(env(safe-area-inset-top) + 14px), 0, 0)`,
          transformOrigin: "left"
        },
        transitionProperty: "transform, border-radius",
        transitionDuration: `${TRANSITIONS.DURATION}s`,
        transitionTimingFunction: `cubic-bezier(${TRANSITIONS.EASE.join(",")})`
      }, true);
    }
  }
  function onRelease(event) {
    const $drawerRef = get(drawerRef);
    if (!isDragging || !$drawerRef)
      return;
    if (isAllowedToDrag && isInput(event.target)) {
      event.target.blur();
    }
    $drawerRef.classList.remove(DRAG_CLASS);
    isAllowedToDrag = false;
    isDragging = false;
    dragEndTime = /* @__PURE__ */ new Date();
    const $direction = get(direction);
    const swipeAmount = getTranslate($drawerRef, $direction);
    if (event.target && !shouldDrag(event.target, false) || !swipeAmount || Number.isNaN(swipeAmount))
      return;
    if (dragStartTime === null)
      return;
    const timeTaken = dragEndTime.getTime() - dragStartTime.getTime();
    const distMoved = getDistanceMoved(pointerStart, $direction, event);
    const velocity = Math.abs(distMoved) / timeTaken;
    if (velocity > 0.05) {
      justReleased.set(true);
      setTimeout(() => {
        justReleased.set(false);
      }, 200);
    }
    if (get(snapPoints)) {
      onReleaseSnapPoints({
        draggedDistance: distMoved * getDirectionMultiplier($direction),
        closeDrawer,
        velocity,
        dismissible: get(dismissible)
      });
      onReleaseProp?.(event, true);
      return;
    }
    if ($direction === "bottom" || $direction === "right" ? distMoved > 0 : distMoved < 0) {
      resetDrawer();
      onReleaseProp?.(event, true);
      return;
    }
    if (velocity > VELOCITY_THRESHOLD) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    const visibleDrawerHeight = Math.min(get(drawerRef)?.getBoundingClientRect().height ?? 0, window.innerHeight);
    if (swipeAmount >= visibleDrawerHeight * get(closeThreshold)) {
      closeDrawer();
      onReleaseProp?.(event, false);
      return;
    }
    onReleaseProp?.(event, true);
    resetDrawer();
  }
  effect([isOpen], ([$isOpen]) => {
    if (!$isOpen)
      return;
    if (isBrowser) {
      set(document.documentElement, {
        scrollBehavior: "auto"
      });
    }
    openTime.set(/* @__PURE__ */ new Date());
    scaleBackground(true, props.backgroundColor);
  });
  effect([visible], ([$visible]) => {
    if (!$visible)
      return;
    const $drawerRef = get(drawerRef);
    if (!$drawerRef)
      return;
    const children = $drawerRef.querySelectorAll("*");
    children.forEach((child) => {
      const htmlChild = child;
      if (htmlChild.scrollHeight > htmlChild.clientHeight || htmlChild.scrollWidth > htmlChild.clientWidth) {
        htmlChild.classList.add("vaul-scrollable");
      }
    });
  });
  function onNestedOpenChange(o) {
    const $drawerRef = get(drawerRef);
    const scale = o ? (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth : 1;
    const y = o ? -NESTED_DISPLACEMENT : 0;
    if (nestedOpenChangeTimer) {
      window.clearTimeout(nestedOpenChangeTimer);
    }
    set($drawerRef, {
      transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
      transform: `scale(${scale}) translate3d(0, ${y}px, 0)`
    });
    if (!o && $drawerRef) {
      nestedOpenChangeTimer = setTimeout(() => {
        const $direction = get(direction);
        const translateValue = getTranslate($drawerRef, $direction);
        set($drawerRef, {
          transition: "none",
          transform: isVertical($direction) ? `translate3d(0, ${translateValue}px, 0)` : `translate3d(${translateValue}px, 0, 0)`
        });
      }, 500);
    }
  }
  function onNestedDrag(_, percentageDragged) {
    if (percentageDragged < 0)
      return;
    const initialScale = (window.innerWidth - NESTED_DISPLACEMENT) / window.innerWidth;
    const newScale = initialScale + percentageDragged * (1 - initialScale);
    const newTranslate = -NESTED_DISPLACEMENT + percentageDragged * NESTED_DISPLACEMENT;
    const $direction = get(direction);
    set(get(drawerRef), {
      transform: isVertical($direction) ? `scale(${newScale}) translate3d(0, ${newTranslate}px, 0)` : `scale(${newScale}) translate3d(${newTranslate}px, 0, 0)`,
      transition: "none"
    });
  }
  function onNestedRelease(_, o) {
    const $direction = get(direction);
    const dim = isVertical($direction) ? window.innerHeight : window.innerWidth;
    const scale = o ? (dim - NESTED_DISPLACEMENT) / dim : 1;
    const translate = o ? -NESTED_DISPLACEMENT : 0;
    if (o) {
      set(get(drawerRef), {
        transition: `transform ${TRANSITIONS.DURATION}s cubic-bezier(${TRANSITIONS.EASE.join(",")})`,
        transform: isVertical($direction) ? `scale(${scale}) translate3d(0, ${translate}px, 0)` : `scale(${scale}) translate3d(${translate}px, 0, 0)`
      });
    }
  }
  return {
    states: {
      isOpen,
      hasBeenOpened,
      snapPoints,
      activeSnapPoint,
      snapPointsOffset,
      keyboardIsOpen,
      shouldFade,
      visible,
      drawerId,
      openDrawerIds
    },
    helpers: {
      getContentStyle
    },
    methods: {
      closeDrawer,
      onOpenChange,
      onPress,
      onRelease,
      onDrag,
      scaleBackground,
      onNestedDrag,
      onNestedOpenChange,
      onNestedRelease,
      restorePositionSetting,
      openDrawer
    },
    refs: {
      drawerRef,
      overlayRef,
      triggerRef
    },
    options
  };
}
function dampenValue(v) {
  return 8 * (Math.log(v + 1) - 2);
}
function getScale() {
  return (window.innerWidth - WINDOW_TOP_OFFSET) / window.innerWidth;
}
function getDistanceMoved(pointerStart, direction, event) {
  if (event.type.startsWith("touch")) {
    return getDistanceMovedForTouch(pointerStart, direction, event);
  } else {
    return getDistanceMovedForPointer(pointerStart, direction, event);
  }
}
function getDistanceMovedForPointer(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.screenY : event.screenX);
}
function getDistanceMovedForTouch(pointerStart, direction, event) {
  return pointerStart - (isVertical(direction) ? event.changedTouches[0].screenY : event.changedTouches[0].screenX);
}
function getDirectionMultiplier(direction) {
  return direction === "bottom" || direction === "right" ? 1 : -1;
}
const VAUL_ROOT = Symbol("VAUL_ROOT");
function setCtx(props = {}) {
  const vaul = createVaul(props);
  const updateOption = getOptionUpdater(vaul.options);
  setContext(VAUL_ROOT, { ...vaul, updateOption });
  return {
    ...vaul,
    updateOption
  };
}
function getCtx() {
  return getContext(VAUL_ROOT);
}
function Root($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "open",
    "onOpenChange",
    "closeThreshold",
    "scrollLockTimeout",
    "snapPoints",
    "fadeFromIndex",
    "openFocus",
    "onOutsideClick",
    "closeOnOutsideClick",
    "backgroundColor",
    "nested",
    "shouldScaleBackground",
    "activeSnapPoint",
    "onActiveSnapPointChange",
    "onRelease",
    "onDrag",
    "onClose",
    "dismissible",
    "direction"
  ]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let open = fallback($$props["open"], false);
    let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
    let closeThreshold = fallback($$props["closeThreshold"], () => void 0, true);
    let scrollLockTimeout = fallback($$props["scrollLockTimeout"], () => void 0, true);
    let snapPoints = fallback($$props["snapPoints"], () => void 0, true);
    let fadeFromIndex = fallback($$props["fadeFromIndex"], () => void 0, true);
    let openFocus = fallback($$props["openFocus"], () => void 0, true);
    let onOutsideClick = fallback($$props["onOutsideClick"], () => void 0, true);
    let closeOnOutsideClick = fallback($$props["closeOnOutsideClick"], true);
    let backgroundColor = fallback($$props["backgroundColor"], "black");
    let nested = fallback($$props["nested"], false);
    let shouldScaleBackground = fallback($$props["shouldScaleBackground"], false);
    let activeSnapPoint = fallback($$props["activeSnapPoint"], () => void 0, true);
    let onActiveSnapPointChange = fallback($$props["onActiveSnapPointChange"], () => void 0, true);
    let onRelease = fallback($$props["onRelease"], () => void 0, true);
    let onDrag = fallback($$props["onDrag"], () => void 0, true);
    let onClose = fallback($$props["onClose"], () => void 0, true);
    let dismissible = fallback($$props["dismissible"], () => void 0, true);
    let direction = fallback($$props["direction"], "bottom");
    const {
      states: {
        keyboardIsOpen,
        activeSnapPoint: localActiveSnapPoint,
        drawerId,
        openDrawerIds: openDrawerIds2,
        isOpen
      },
      methods: { closeDrawer, openDrawer },
      options: { dismissible: localDismissible },
      updateOption
    } = setCtx({
      defaultOpen: open,
      defaultActiveSnapPoint: activeSnapPoint,
      onOpenChange: ({ next }) => {
        if (open !== next) {
          onOpenChange?.(next);
          open = next;
        }
        return next;
      },
      onActiveSnapPointChange: ({ next }) => {
        if (next === void 0 && snapPoints && activeSnapPoint !== next) {
          const newNext = snapPoints[0];
          onActiveSnapPointChange?.(newNext);
          activeSnapPoint = newNext;
          return newNext;
        }
        if (activeSnapPoint !== next) {
          onActiveSnapPointChange?.(next);
          activeSnapPoint = next;
        }
        return next;
      },
      closeThreshold,
      scrollLockTimeout,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      snapPoints,
      fadeFromIndex,
      nested,
      onDrag,
      onClose,
      onRelease,
      shouldScaleBackground,
      backgroundColor,
      dismissible,
      direction
    });
    activeSnapPoint !== void 0 && localActiveSnapPoint.set(activeSnapPoint);
    updateOption("closeThreshold", closeThreshold);
    updateOption("scrollLockTimeout", scrollLockTimeout);
    updateOption("snapPoints", snapPoints);
    updateOption("fadeFromIndex", fadeFromIndex);
    updateOption("openFocus", openFocus);
    updateOption("shouldScaleBackground", shouldScaleBackground);
    updateOption("backgroundColor", backgroundColor);
    updateOption("dismissible", dismissible);
    updateOption("direction", direction);
    open && !store_get($$store_subs ??= {}, "$isOpen", isOpen) && openDrawer();
    !open && store_get($$store_subs ??= {}, "$isOpen", isOpen) && closeDrawer();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Dialog($$renderer3, spread_props([
        {
          closeOnOutsideClick,
          closeOnEscape: false,
          preventScroll: false,
          onOpenChange: (o) => {
            onOpenChange?.(o);
            if (!o) {
              closeDrawer();
            } else if (o) {
              openDrawer();
            }
          },
          onOutsideClick: (e) => {
            if (!closeOnOutsideClick) return;
            onOutsideClick?.(e);
            if (e?.defaultPrevented) return;
            if (store_get($$store_subs ??= {}, "$keyboardIsOpen", keyboardIsOpen)) {
              keyboardIsOpen.set(false);
            }
            e.preventDefault();
            if (!store_get($$store_subs ??= {}, "$localDismissible", localDismissible)) {
              return;
            }
            const $openDialogIds = get(openDrawerIds2);
            const isLast = $openDialogIds[$openDialogIds.length - 1] === get(drawerId);
            if (isLast) {
              onOpenChange?.(false);
              closeDrawer();
            }
          }
        },
        $$restProps,
        {
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children: ($$renderer4) => {
            $$renderer4.push(`<!--[-->`);
            slot($$renderer4, $$props, "default", {});
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, {
      open,
      onOpenChange,
      closeThreshold,
      scrollLockTimeout,
      snapPoints,
      fadeFromIndex,
      openFocus,
      onOutsideClick,
      closeOnOutsideClick,
      backgroundColor,
      nested,
      shouldScaleBackground,
      activeSnapPoint,
      onActiveSnapPointChange,
      onRelease,
      onDrag,
      onClose,
      dismissible,
      direction
    });
  });
}
function Visible($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const {
      states: { visible },
      methods: { scaleBackground, restorePositionSetting }
    } = getCtx();
  });
}
function Content($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["style"]);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const {
      refs: { drawerRef },
      states: { visible },
      helpers: { getContentStyle },
      methods: { onPress, onDrag, onRelease },
      options: { direction }
    } = getCtx();
    let style = fallback($$props["style"], "");
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Dialog_content($$renderer3, spread_props([
        {
          style: store_get($$store_subs ??= {}, "$getContentStyle", getContentStyle)(style),
          "data-vaul-drawer": "",
          "data-vaul-drawer-direction": store_get($$store_subs ??= {}, "$direction", direction),
          "data-vaul-drawer-visible": store_get($$store_subs ??= {}, "$visible", visible) ? "true" : "false"
        },
        $$restProps,
        {
          get el() {
            return store_get($$store_subs ??= {}, "$drawerRef", drawerRef);
          },
          set el($$value) {
            store_set(drawerRef, $$value);
            $$settled = false;
          },
          children: ($$renderer4) => {
            Visible($$renderer4);
            $$renderer4.push(`<!----> <!--[-->`);
            slot($$renderer4, $$props, "default", {});
            $$renderer4.push(`<!--]-->`);
          },
          $$slots: { default: true }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { style });
  });
}
function Overlay($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, []);
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let hasSnapPoints;
    const {
      refs: { overlayRef },
      states: { isOpen, visible, snapPoints, shouldFade },
      methods: { onRelease }
    } = getCtx();
    hasSnapPoints = store_get($$store_subs ??= {}, "$snapPoints", snapPoints) && store_get($$store_subs ??= {}, "$snapPoints", snapPoints).length > 0;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      Dialog_overlay($$renderer3, spread_props([
        {
          "data-vaul-drawer-visible": store_get($$store_subs ??= {}, "$visible", visible) ? "true" : "false",
          "data-vaul-overlay": "",
          "data-vaul-snap-points": store_get($$store_subs ??= {}, "$isOpen", isOpen) && hasSnapPoints ? "true" : "false",
          "data-vaul-snap-points-overlay": store_get($$store_subs ??= {}, "$isOpen", isOpen) && store_get($$store_subs ??= {}, "$shouldFade", shouldFade) ? "true" : "false"
        },
        $$restProps,
        {
          get el() {
            return store_get($$store_subs ??= {}, "$overlayRef", overlayRef);
          },
          set el($$value) {
            store_set(overlayRef, $$value);
            $$settled = false;
          }
        }
      ]));
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function Close_wrapper($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let _, rest;
    let meltBuilder = $$props["meltBuilder"];
    const { methods: { closeDrawer } } = getCtx();
    const wrappedAction = (node) => {
      const handleKeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          closeDrawer(true);
        }
      };
      const handleClick = () => {
        closeDrawer();
      };
      node.addEventListener("keydown", handleKeydown);
      node.addEventListener("click", handleClick);
      return () => {
        node.removeEventListener("keydown", handleKeydown);
        node.removeEventListener("click", handleClick);
      };
    };
    ({ _, ...rest } = meltBuilder);
    Object.assign(rest, { action: wrappedAction });
    $$renderer2.push(`<!--[-->`);
    slot($$renderer2, $$props, "default", { newBuilder: rest });
    $$renderer2.push(`<!--]-->`);
    bind_props($$props, { meltBuilder });
  });
}
function Close($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["el", "asChild"]);
  $$renderer.component(($$renderer2) => {
    let el = fallback($$props["el"], () => void 0, true);
    let asChild = fallback($$props["asChild"], false);
    const { methods: { closeDrawer } } = getCtx();
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (asChild) {
        $$renderer3.push("<!--[0-->");
        Dialog_close($$renderer3, spread_props([
          $$restProps,
          {
            asChild,
            get el() {
              return el;
            },
            set el($$value) {
              el = $$value;
              $$settled = false;
            },
            children: invalid_default_snippet,
            $$slots: {
              default: ($$renderer4, { builder }) => {
                Close_wrapper($$renderer4, {
                  meltBuilder: builder,
                  children: invalid_default_snippet,
                  $$slots: {
                    default: ($$renderer5, { newBuilder }) => {
                      $$renderer5.push(`<!--[-->`);
                      slot($$renderer5, $$props, "default", { builder: newBuilder });
                      $$renderer5.push(`<!--]-->`);
                    }
                  }
                });
              }
            }
          }
        ]));
      } else {
        $$renderer3.push("<!--[-1-->");
        Dialog_close($$renderer3, spread_props([
          $$restProps,
          {
            asChild,
            get el() {
              return el;
            },
            set el($$value) {
              el = $$value;
              $$settled = false;
            },
            children: invalid_default_snippet,
            $$slots: {
              default: ($$renderer4, { builder }) => {
                $$renderer4.push(`<!--[-->`);
                slot($$renderer4, $$props, "default", { builder });
                $$renderer4.push(`<!--]-->`);
              }
            }
          }
        ]));
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { el, asChild });
  });
}
const Portal = Dialog_portal;
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let hasRecords, activeItems, activeCategoryLabel, activeCategoryCount, scorePoints, confidencePoints;
    let data = $$props["data"];
    const form = {};
    const chartWidth = 780;
    const chartHeight = 240;
    const chartPadding = 26;
    let cameraOpen = false;
    let settingsOpen = false;
    let openingCamera = false;
    let stream = null;
    let videoElement = null;
    let capturedImage = "";
    let mimeType = "image/jpeg";
    let note = "";
    let cameraError = "";
    let uploadError = "";
    let captureBusy = false;
    let activeCategory = "svelte";
    function scalePoints(values, maxValue = 100, minValue = 0) {
      if (!values.length) {
        return "";
      }
      if (values.length === 1) {
        const singleX = chartPadding + (chartWidth - chartPadding * 2) / 2;
        const singleY = chartHeight - chartPadding - (values[0] - minValue) / (maxValue - minValue || 1) * (chartHeight - chartPadding * 2);
        return `${singleX},${singleY}`;
      }
      return values.map((value, index) => {
        const x = chartPadding + index * (chartWidth - chartPadding * 2) / (values.length - 1);
        const y = chartHeight - chartPadding - (value - minValue) / (maxValue - minValue || 1) * (chartHeight - chartPadding * 2);
        return `${x},${y}`;
      }).join(" ");
    }
    function statusLabel(status) {
      return status.replace(/-/g, " ");
    }
    function percent(value) {
      return `${Math.round(value)}%`;
    }
    function excerpt(text, length = 150) {
      const normalized = text.replace(/\s+/g, " ").trim();
      if (normalized.length <= length) return normalized;
      return `${normalized.slice(0, length).trimEnd()}…`;
    }
    function sourceTypeLabel(item) {
      return item.kind.toUpperCase();
    }
    function formatDate(value) {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
    }
    function formatClock(value) {
      return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
    }
    async function startCamera() {
      if (stream || openingCamera) return;
      openingCamera = true;
      cameraError = "";
      try {
        await tick();
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not available on this device.");
        }
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        stream = mediaStream;
        if (videoElement) ;
      } catch (error) {
        cameraError = error instanceof Error ? error.message : "Camera access failed.";
      } finally {
        openingCamera = false;
      }
    }
    function stopCamera() {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      stream = null;
    }
    async function captureFrame() {
      {
        return;
      }
    }
    hasRecords = data.summary.count > 0;
    activeItems = data.sourceSummary.byCategory[activeCategory] ?? [];
    activeCategoryLabel = data.toolCategoryLabels[activeCategory];
    activeCategoryCount = activeItems.length;
    scorePoints = scalePoints(data.series.map((entry) => entry.score));
    confidencePoints = scalePoints(data.series.map((entry) => entry.confidence));
    if (cameraOpen) {
      void startCamera();
    } else {
      stopCamera();
      capturedImage = "";
      mimeType = "image/jpeg";
      cameraError = "";
      uploadError = "";
      note = "";
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1jef3w8", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Svelte Tool Dashboard</title>`);
        });
      });
      $$renderer3.push(`<div class="dashboard-grid zen-grid">`);
      if (form?.error) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="card" style="border: 1px solid rgba(155, 73, 66, 0.34); color: var(--danger);">${escape_html(form.error)}</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> <header class="hero-panel card zen-hero"><div class="hero-slab"><div class="hero-copy pretext-frame" style="max-width: 68ch;"><div class="eyebrow">Japanese minimalist signal board</div> <h1 class="hero-title">Svelte Tool Dashboard</h1> <p class="lede" style="max-width: 60ch;">A Japanese-minimal dashboard for discovering Svelte, Rust, Go, Ruby, HTML/CSS, C/C++/C#, and general news signals from GitHub, X, Instagram, and YouTube, with a calm layout and fast page-flip transitions.</p> <div class="toolbar-row">`);
      Badge($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Whitespace-first layout`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Badge($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->motion.dev transitions`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Badge($$renderer3, {
        variant: "secondary",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->pretext sizing`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Badge($$renderer3, {
        variant: "muted",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->daily source refresh`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div> <div class="zen-stat-grid" style="max-width: 520px; width: 100%;"><article class="stat-chip zen-stat"><span class="nav-label">Sources active</span> <span class="value">${escape_html(data.sourceSummary.sourceCount || 4)}</span> <span class="metric-detail">GitHub, Instagram, X, and YouTube lanes are wired into the dashboard.</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Language lanes</span> <span class="value">${escape_html(data.sourceSummary.categoryCount || 0)}</span> <span class="metric-detail">Language lanes ready for the daily refresh.</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Tool snapshot</span> <span class="value">${escape_html(hasRecords ? Math.round(data.summary.averageScore) : "—")}</span> <span class="metric-detail">Existing analysis timeline still loads beneath the new source board.</span></article> <article class="stat-chip zen-stat"><span class="nav-label">Refresh cadence</span> <span class="value">Daily</span> <span class="metric-detail">Automated refresh runs every day through the Vercel cron route.</span></article></div></div> <div class="meta-grid"><div class="meta-card"><span class="nav-label">Latest source</span> `);
      if (data.sourceSummary.latest) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<strong>${escape_html(data.sourceSummary.latest.title)}</strong> <div class="metric-detail">${escape_html(data.toolSourceLabels[data.sourceSummary.latest.source])} · ${escape_html(data.toolCategoryLabels[data.sourceSummary.latest.category ?? "general-news"])} · ${escape_html(formatDate(data.sourceSummary.latest.publishedAt))}</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<strong>No source items yet</strong> <div class="metric-detail">Add category-specific feed URLs to the refresh route and the dashboard will populate automatically.</div>`);
      }
      $$renderer3.push(`<!--]--></div> <div class="meta-card"><span class="nav-label">Workspace status</span> `);
      if (hasRecords) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<strong>Existing timeline preserved</strong> <div class="metric-detail">The old analysis archive remains available below the source board.</div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<strong>Empty archive</strong> <div class="metric-detail">No captured entries are stored yet.</div>`);
      }
      $$renderer3.push(`<!--]--></div></div></header> <section class="card content-card zen-panel"><div style="display:flex; justify-content:space-between; gap: 16px; align-items:flex-start; flex-wrap: wrap;"><div><div class="section-kicker">Live aggregation</div> <h2 class="panel-title" style="margin-top: 8px;">Language board</h2> <p class="subtle" style="max-width: 58ch; margin: 10px 0 0;">Each language lane stays visually quiet, but the selected board flips quickly when you move between categories.</p></div> <div class="source-rail"><!--[-->`);
      const each_array = ensure_array_like(data.toolCategoryOrder);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let category = each_array[$$index];
        $$renderer3.push(`<button${attr_class(`source-tab ${activeCategory === category ? "is-active" : ""}`)} type="button">${escape_html(data.toolCategoryLabels[category])} · ${escape_html(data.sourceSummary.byCategory[category].length)}</button>`);
      }
      $$renderer3.push(`<!--]--></div></div> <!---->`);
      {
        $$renderer3.push(`<article class="source-card card"><div class="source-card__header"><div><div class="eyebrow">${escape_html(activeCategoryLabel)}</div> <h3 class="panel-title" style="margin-top: 8px;">${escape_html(activeCategoryLabel)} feed</h3> <p class="subtle" style="margin: 8px 0 0; max-width: 46ch;">${escape_html(activeCategoryCount ? `${activeCategoryCount} items are currently cached for this lane.` : "No items have been cached for this lane yet.")}</p></div> <span class="source-chip">${escape_html(activeItems[0]?.publishedAt ? formatDate(activeItems[0].publishedAt) : "pending")}</span></div> `);
        if (activeItems.length) {
          $$renderer3.push("<!--[0-->");
          $$renderer3.push(`<div class="source-list"><!--[-->`);
          const each_array_1 = ensure_array_like(activeItems.slice(0, 4));
          for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
            let item = each_array_1[$$index_2];
            $$renderer3.push(`<a class="source-item"${attr("href", item.url)} target="_blank" rel="noreferrer"><div class="source-item__head"><div style="display:grid; gap: 6px; flex: 1;"><div class="source-item__meta">`);
            Badge($$renderer3, {
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(sourceTypeLabel(item))}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----> `);
            Badge($$renderer3, {
              variant: "secondary",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(item.score > 0 ? `score ${Math.round(item.score)}` : "fresh scan")}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div> <h4 class="source-item__title">${escape_html(item.title)}</h4></div> `);
            Badge($$renderer3, {
              variant: "muted",
              children: ($$renderer4) => {
                $$renderer4.push(`<!---->${escape_html(formatDate(item.publishedAt))}`);
              },
              $$slots: { default: true }
            });
            $$renderer3.push(`<!----></div> <p class="source-item__summary">${escape_html(excerpt(item.summary, 220))}</p> <div class="source-item__meta"><div class="metric-detail">${escape_html(item.author ? `${item.author} · ` : "")}${escape_html(formatClock(item.publishedAt))}</div> <div style="display:flex; flex-wrap:wrap; gap: 8px;"><!--[-->`);
            const each_array_2 = ensure_array_like(item.tags);
            for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
              let tag = each_array_2[$$index_1];
              $$renderer3.push(`<span class="tag">${escape_html(tag)}</span>`);
            }
            $$renderer3.push(`<!--]--></div></div></a>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        } else {
          $$renderer3.push("<!--[-1-->");
          $$renderer3.push(`<div class="source-empty"><strong>Waiting for the first feed pull</strong> <p class="metric-detail" style="margin: 0;">The refresh route is wired, and the lane will populate once the category-specific source URLs are configured.</p></div>`);
        }
        $$renderer3.push(`<!--]--></article>`);
      }
      $$renderer3.push(`<!----></section> <section class="grid-two"><article class="card content-card chart-card"><div style="display:flex; justify-content:space-between; gap: 16px; align-items:flex-start;"><div><div class="section-kicker">Archive signal</div> <h2 class="panel-title" style="margin-top: 8px;">Timeline pulse</h2> <p class="subtle" style="max-width: 54ch; margin: 10px 0 0;">The legacy analysis archive still renders beneath the source board, keeping the app’s existing history intact.</p></div> <div class="toolbar-row" style="justify-content:flex-end;">`);
      Button($$renderer3, {
        type: "button",
        variant: "secondary",
        onclick: () => settingsOpen = true,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Settings`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        type: "button",
        onclick: () => cameraOpen = true,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Take photo`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></div> `);
      if (data.series.length) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<svg${attr("viewBox", `0 0 ${chartWidth} ${chartHeight}`)} class="chart-frame" role="img" aria-label="Archive timeline chart"><defs><linearGradient id="score-line" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#2f3b31"></stop><stop offset="100%" stop-color="#6f806f"></stop></linearGradient></defs><polyline${attr("points", scorePoints)} fill="none" stroke="url(#score-line)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline><polyline${attr("points", confidencePoints)} fill="none" stroke="rgba(23,20,17,0.2)" stroke-width="3" stroke-dasharray="5 8" stroke-linecap="round" stroke-linejoin="round"></polyline><!--[-->`);
        const each_array_3 = ensure_array_like(data.series);
        for (let index = 0, $$length = each_array_3.length; index < $$length; index++) {
          let entry = each_array_3[index];
          $$renderer3.push(`<circle${attr("cx", chartPadding + index * (chartWidth - chartPadding * 2) / (data.series.length - 1 || 1))}${attr("cy", chartHeight - chartPadding - (entry.score - 0) / 100 * (chartHeight - chartPadding * 2))} r="4.5" fill="#fff" stroke="#2f3b31" stroke-width="2"></circle>`);
        }
        $$renderer3.push(`<!--]--></svg> <div class="surface-list"${attr_style(`grid-template-columns: repeat(${Math.min(data.series.length, 4)}, minmax(0, 1fr)); display:grid; gap: 12px;`)}><!--[-->`);
        const each_array_4 = ensure_array_like(data.series.slice(-4));
        for (let $$index_4 = 0, $$length = each_array_4.length; $$index_4 < $$length; $$index_4++) {
          let entry = each_array_4[$$index_4];
          $$renderer3.push(`<div class="surface-row" style="display:grid; gap:6px; align-items:start; background: rgba(255,255,255,0.5);"><div style="display:flex; justify-content:space-between; gap:12px; align-items:baseline;"><strong>${escape_html(entry.label)}</strong> `);
          Badge($$renderer3, {
            variant: "secondary",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(statusLabel(entry.status))}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <div class="metric-detail">Score ${escape_html(entry.score)} · Confidence ${escape_html(entry.confidence)}% · ${escape_html(entry.brackets)} brackets</div></div>`);
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="empty-state" style="margin-top: 12px;"><div class="eyebrow">Empty history</div> <h1>No photos yet</h1> <p class="lede">The legacy archive stays quiet until a real frame is captured.</p> <div class="toolbar-row">`);
        Button($$renderer3, {
          type: "button",
          onclick: () => cameraOpen = true,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Take first photo`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----> <label class="button-secondary" style="position:relative; overflow:hidden;">Upload photo <input class="input" type="file" accept="image/*" capture="environment" style="position:absolute; inset:0; opacity:0; cursor:pointer;"/></label></div></div>`);
      }
      $$renderer3.push(`<!--]--> `);
      if (data.latest) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="surface-row pulse-line" style="align-items:flex-start; gap: 14px; background: rgba(255,255,255,0.5);"><img${attr("src", data.latest.imageDataUrl)}${attr("alt", data.latest.label)} style="width: 118px; height: 118px; object-fit: cover; border-radius: 22px; border: 1px solid rgba(35,31,27,0.1);"/> <div style="flex: 1; display:grid; gap: 10px;"><div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;"><div class="history-title"><strong>${escape_html(data.latest.label)}</strong> <p class="metric-detail">${escape_html(data.latest.dayLabel)} · ${escape_html(data.latest.timeLabel)}</p></div> `);
        Badge($$renderer3, {
          variant: "secondary",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->${escape_html(statusLabel(data.latest.metrics.status))}`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></div> <div class="metric-detail">Visibility ${escape_html(percent(data.latest.metrics.visibility * 100))} · Confidence ${escape_html(percent(data.latest.metrics.confidence * 100))} · ${escape_html(data.latest.metrics.visibleBrackets)} brackets</div> <div class="caption">${escape_html(excerpt(data.latest.analysisText, 180))}</div></div></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></article> <article class="card content-card"><div class="section-kicker">Recent captures</div> <h2 class="panel-title" style="margin-top: 8px;">Archive list</h2> <p class="subtle" style="max-width: 48ch; margin-top: 10px;">The existing record history remains in place while the new source board handles discovery.</p> <div class="history-grid" style="margin-top: 18px;">`);
      if (data.records.length) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<!--[-->`);
        const each_array_5 = ensure_array_like(data.records);
        for (let $$index_5 = 0, $$length = each_array_5.length; $$index_5 < $$length; $$index_5++) {
          let record = each_array_5[$$index_5];
          $$renderer3.push(`<div class="history-row" style="background: rgba(255,255,255,0.5);"><img${attr("src", record.imageDataUrl)}${attr("alt", record.label)}/> <div class="history-copy"><div class="history-head"><div class="history-title"><strong>${escape_html(record.label)}</strong> <p class="metric-detail">${escape_html(record.dayLabel)} · ${escape_html(record.timeLabel)}</p></div> `);
          Badge($$renderer3, {
            variant: "secondary",
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->${escape_html(statusLabel(record.metrics.status))}`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div> <div class="metric-detail">Visibility ${escape_html(percent(record.metrics.visibility * 100))} · Confidence ${escape_html(percent(record.metrics.confidence * 100))} · ${escape_html(record.metrics.visibleBrackets)} brackets</div> <div class="caption">${escape_html(excerpt(record.analysisText, 170))}</div> `);
          if (record.note) {
            $$renderer3.push("<!--[0-->");
            $$renderer3.push(`<div class="surface-row" style="padding: 12px 14px; border-radius: 18px; background: rgba(255,255,255,0.54);"><span class="nav-label">Note</span> <span class="body-copy">${escape_html(record.note)}</span></div>`);
          } else {
            $$renderer3.push("<!--[-1-->");
          }
          $$renderer3.push(`<!--]--></div></div>`);
        }
        $$renderer3.push(`<!--]-->`);
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="surface-row" style="justify-content:flex-start; background: rgba(255,255,255,0.54);">No photos have been saved yet.</div>`);
      }
      $$renderer3.push(`<!--]--></div></article></section> `);
      Root($$renderer3, {
        direction: "bottom",
        shouldScaleBackground: true,
        get open() {
          return cameraOpen;
        },
        set open($$value) {
          cameraOpen = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          Portal($$renderer4, {
            children: ($$renderer5) => {
              Overlay($$renderer5, { class: "drawer-overlay" });
              $$renderer5.push(`<!----> `);
              Content($$renderer5, {
                class: "drawer-content",
                children: ($$renderer6) => {
                  $$renderer6.push(`<div class="drawer-handle"></div> <form class="drawer-panel card"><div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;"><div><div class="section-kicker">Capture</div> <h2 class="panel-title" style="margin-top: 8px;">Take a frame</h2> <p class="subtle" style="max-width: 48ch; margin-top: 10px;">Use the camera, capture a frame, and save it with Gemini analysis.</p></div> `);
                  Close($$renderer6, {
                    asChild: true,
                    children: ($$renderer7) => {
                      Button($$renderer7, {
                        type: "button",
                        variant: "secondary",
                        children: ($$renderer8) => {
                          $$renderer8.push(`<!---->Close`);
                        },
                        $$slots: { default: true }
                      });
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div> <div class="split-grid" style="align-items: start; margin-top: 18px;"><div style="display:grid; gap: 12px;"><video autoplay="" playsinline="" muted="" class="camera-preview"></video> <canvas hidden=""></canvas> `);
                  if (cameraError) {
                    $$renderer6.push("<!--[0-->");
                    $$renderer6.push(`<p class="caption" style="color: var(--danger); margin: 0;">${escape_html(cameraError)}</p>`);
                  } else {
                    $$renderer6.push("<!--[-1-->");
                  }
                  $$renderer6.push(`<!--]--> `);
                  if (uploadError) {
                    $$renderer6.push("<!--[0-->");
                    $$renderer6.push(`<p class="caption" style="color: var(--danger); margin: 0;">${escape_html(uploadError)}</p>`);
                  } else {
                    $$renderer6.push("<!--[-1-->");
                  }
                  $$renderer6.push(`<!--]--> <div style="display:flex; flex-wrap:wrap; gap:12px;">`);
                  Button($$renderer6, {
                    type: "button",
                    disabled: captureBusy,
                    onclick: captureFrame,
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->${escape_html("Capture frame")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> <label class="button-secondary" style="position:relative; overflow:hidden;">Upload instead <input class="input" type="file" accept="image/*" capture="environment" style="position:absolute; inset:0; opacity:0; cursor:pointer;"/></label></div></div> <div style="display:grid; gap: 12px;">`);
                  if (capturedImage) {
                    $$renderer6.push("<!--[0-->");
                    $$renderer6.push(`<img${attr("src", capturedImage)} alt="Captured preview" class="captured-preview"/>`);
                  } else {
                    $$renderer6.push("<!--[-1-->");
                    $$renderer6.push(`<div class="captured-preview empty-preview"><span class="eyebrow">No frame yet</span> <p class="subtle" style="margin: 10px 0 0;">Capture a frame or upload a photo to continue.</p></div>`);
                  }
                  $$renderer6.push(`<!--]--> <label class="surface-list" style="gap:14px; display:grid; margin-top: 6px;"><span class="small-label">Note</span> <input class="input"${attr("value", note)} placeholder="Optional label like after lunch or evening check-in"/></label> <input type="hidden" name="imageDataUrl"${attr("value", capturedImage)}/> <input type="hidden" name="mimeType"${attr("value", mimeType)}/> `);
                  Button($$renderer6, {
                    type: "submit",
                    disabled: !capturedImage,
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Save photo and analyze`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div></div></form>`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!---->`);
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Root($$renderer3, {
        direction: "right",
        shouldScaleBackground: true,
        get open() {
          return settingsOpen;
        },
        set open($$value) {
          settingsOpen = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          Portal($$renderer4, {
            children: ($$renderer5) => {
              Overlay($$renderer5, { class: "drawer-overlay" });
              $$renderer5.push(`<!----> `);
              Content($$renderer5, {
                class: "drawer-shell-right",
                children: ($$renderer6) => {
                  $$renderer6.push(`<section class="card drawer-panel-right"><div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;"><div><div class="section-kicker">Settings</div> <h2 class="panel-title" style="margin-top: 8px;">Workspace controls</h2> <p class="subtle" style="max-width: 34ch; margin-top: 10px;">Capture defaults, privacy signals, and the current dashboard state.</p></div> `);
                  Close($$renderer6, {
                    class: "button-secondary",
                    type: "button",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Close`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div> <div class="meta-grid"><div class="meta-card"><span class="nav-label">Capture mode</span> <strong>Rear camera</strong> <div class="metric-detail">Optimized for close-up progress photos.</div></div> <div class="meta-card"><span class="nav-label">Analysis flow</span> <strong>Gemini review</strong> <div class="metric-detail">Records are stored after each analysis pass.</div></div></div> <div class="surface-list"><div class="surface-row" style="background: rgba(255,255,255,0.54);"><div><strong>Account</strong> <p class="metric-detail">Private admin dashboard</p></div> `);
                  Badge($$renderer6, {
                    variant: "secondary",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->secure`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div> <div class="surface-row" style="background: rgba(255,255,255,0.54);"><div><strong>Typography</strong> <p class="metric-detail">Inter with Japanese sans support</p></div> `);
                  Badge($$renderer6, {
                    variant: "secondary",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->locked in`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div> <div class="surface-row" style="background: rgba(255,255,255,0.54);"><div><strong>Theme</strong> <p class="metric-detail">Paper, ink, and quiet green accents</p></div> `);
                  Badge($$renderer6, {
                    variant: "secondary",
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->zen`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div></div> <div class="surface-row" style="align-items:flex-start; background: rgba(255,255,255,0.54);"><div><strong>Latest capture</strong> `);
                  if (data.latest) {
                    $$renderer6.push("<!--[0-->");
                    $$renderer6.push(`<p class="metric-detail" style="margin-top: 6px;">${escape_html(data.latest.dayLabel)} · ${escape_html(data.latest.timeLabel)}</p> <p class="caption" style="margin: 8px 0 0;">${escape_html(excerpt(data.latest.analysisText, 120))}</p>`);
                  } else {
                    $$renderer6.push("<!--[-1-->");
                    $$renderer6.push(`<p class="metric-detail" style="margin-top: 6px;">No capture is stored yet.</p>`);
                  }
                  $$renderer6.push(`<!--]--></div></div> <div class="toolbar-row" style="justify-content:space-between; margin-top: auto;">`);
                  Button($$renderer6, {
                    type: "button",
                    variant: "secondary",
                    onclick: () => cameraOpen = true,
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Open camera`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----> `);
                  Badge($$renderer6, {
                    children: ($$renderer7) => {
                      $$renderer7.push(`<!---->Admin dashboard`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer6.push(`<!----></div></section>`);
                },
                $$slots: { default: true }
              });
              $$renderer5.push(`<!---->`);
            },
            $$slots: { default: true }
          });
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { data });
  });
}
export {
  _page as default
};
