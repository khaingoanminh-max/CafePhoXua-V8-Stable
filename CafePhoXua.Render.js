/*!
 * CafePhoXua.Render.js
 * CafePhoXua V8 Stable - lightweight render coordinator
 */
(function (window, document) {
  'use strict';

  const Core = window.CafePhoXua;
  if (!Core) throw new Error('[CafePhoXua.Render] CafePhoXua.Core.js chưa được tải.');
  if (Core.Render) return;

  const registry = new Map();
  const dom = Object.create(null);
  const queue = new Set();
  let frameId = null;
  let initialized = false;

  function cache(selectors = {}) {
    Object.entries(selectors).forEach(([key, selector]) => {
      dom[key] = typeof selector === 'string' ? document.querySelector(selector) : selector || null;
    });
    return Render;
  }

  function register(name, renderer) {
    if (typeof name !== 'string' || !name.trim() || typeof renderer !== 'function') return false;
    registry.set(name, renderer);
    return true;
  }

  function unregister(name) {
    return registry.delete(name);
  }

  function flush() {
    frameId = null;
    const names = [...queue];
    queue.clear();
    names.forEach(name => {
      const renderer = registry.get(name);
      if (!renderer) return;
      try { renderer(dom, Core); }
      catch (err) { Core.log?.error?.('[Render]', name, err); }
    });
  }

  function render(name) {
    if (!registry.has(name)) return false;
    queue.add(name);
    if (frameId === null) {
      frameId = typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame(flush)
        : window.setTimeout(flush, 0);
    }
    return true;
  }

  const Render = {
    init() {
      initialized = true;
      return Render;
    },
    cache,
    getCached(key) { return dom[key] || null; },
    register,
    unregister,
    render,
    refresh: render,
    refreshMany(names = []) {
      if (Array.isArray(names)) names.forEach(render);
      return Render;
    },
    clear() {
      queue.clear();
      Object.keys(dom).forEach(key => delete dom[key]);
      return Render;
    },
    destroy() {
      Render.clear();
      registry.clear();
      initialized = false;
      return Render;
    },
    isInitialized() { return initialized; },
    getRegistered() { return [...registry.keys()]; }
  };

  Core.Render = Render;
  Render.init();
})(window, document);
