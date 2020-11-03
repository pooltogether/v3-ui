function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import 'regenerator-runtime/runtime';
import BigNumber from 'bignumber.js';
import BlocknativeApi from 'bnc-sdk';
import bowser from 'bowser';

function noop() {}

var identity = function identity(x) {
  return x;
};

function assign(tar, src) {
  // @ts-ignore
  for (var k in src) {
    tar[k] = src[k];
  }

  return tar;
}

function run(fn) {
  return fn();
}

function blank_object() {
  return Object.create(null);
}

function run_all(fns) {
  fns.forEach(run);
}

function is_function(thing) {
  return typeof thing === 'function';
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && _typeof(a) === 'object' || typeof a === 'function';
}

function subscribe(store) {
  if (store == null) {
    return noop;
  }

  for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    callbacks[_key - 1] = arguments[_key];
  }

  var unsub = store.subscribe.apply(store, callbacks);
  return unsub.unsubscribe ? function () {
    return unsub.unsubscribe();
  } : unsub;
}

function get_store_value(store) {
  var value;
  subscribe(store, function (_) {
    return value = _;
  })();
  return value;
}

function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}

function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    var slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}

function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    var lets = definition[2](fn(dirty));

    if ($$scope.dirty === undefined) {
      return lets;
    }

    if (_typeof(lets) === 'object') {
      var merged = [];
      var len = Math.max($$scope.dirty.length, lets.length);

      for (var i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }

      return merged;
    }

    return $$scope.dirty | lets;
  }

  return $$scope.dirty;
}

function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
  var slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);

  if (slot_changes) {
    var slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}

var is_client = typeof window !== 'undefined';
var now = is_client ? function () {
  return window.performance.now();
} : function () {
  return Date.now();
};
var raf = is_client ? function (cb) {
  return requestAnimationFrame(cb);
} : noop;
var tasks = new Set();

function run_tasks(now) {
  tasks.forEach(function (task) {
    if (!task.c(now)) {
      tasks["delete"](task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */


function loop(callback) {
  var task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise(function (fulfill) {
      tasks.add(task = {
        c: callback,
        f: fulfill
      });
    }),
    abort: function abort() {
      tasks["delete"](task);
    }
  };
}

function append(target, node) {
  target.appendChild(node);
}

function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}

function detach(node) {
  node.parentNode.removeChild(node);
}

function element(name) {
  return document.createElement(name);
}

function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function text(data) {
  return document.createTextNode(data);
}

function space() {
  return text(' ');
}

function empty() {
  return text('');
}

function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return function () {
    return node.removeEventListener(event, handler, options);
  };
}

function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

function children(element) {
  return Array.from(element.childNodes);
}

function set_data(text, data) {
  data = '' + data;
  if (text.wholeText !== data) text.data = data;
}

function set_style(node, key, value, important) {
  node.style.setProperty(key, value, important ? 'important' : '');
}

function toggle_class(element, name, toggle) {
  element.classList[toggle ? 'add' : 'remove'](name);
}

function custom_event(type, detail) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, false, false, detail);
  return e;
}

var HtmlTag = /*#__PURE__*/function () {
  function HtmlTag() {
    var anchor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, HtmlTag);

    this.a = anchor;
    this.e = this.n = null;
  }

  _createClass(HtmlTag, [{
    key: "m",
    value: function m(html, target) {
      var anchor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!this.e) {
        this.e = element(target.nodeName);
        this.t = target;
        this.h(html);
      }

      this.i(anchor);
    }
  }, {
    key: "h",
    value: function h(html) {
      this.e.innerHTML = html;
      this.n = Array.from(this.e.childNodes);
    }
  }, {
    key: "i",
    value: function i(anchor) {
      for (var i = 0; i < this.n.length; i += 1) {
        insert(this.t, this.n[i], anchor);
      }
    }
  }, {
    key: "p",
    value: function p(html) {
      this.d();
      this.h(html);
      this.i(this.a);
    }
  }, {
    key: "d",
    value: function d() {
      this.n.forEach(detach);
    }
  }]);

  return HtmlTag;
}();

var active_docs = new Set();
var active = 0; // https://github.com/darkskyapp/string-hash/blob/master/index.js

function hash(str) {
  var hash = 5381;
  var i = str.length;

  while (i--) {
    hash = (hash << 5) - hash ^ str.charCodeAt(i);
  }

  return hash >>> 0;
}

function create_rule(node, a, b, duration, delay, ease, fn) {
  var uid = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  var step = 16.666 / duration;
  var keyframes = '{\n';

  for (var p = 0; p <= 1; p += step) {
    var t = a + (b - a) * ease(p);
    keyframes += p * 100 + "%{".concat(fn(t, 1 - t), "}\n");
  }

  var rule = keyframes + "100% {".concat(fn(b, 1 - b), "}\n}");
  var name = "__svelte_".concat(hash(rule), "_").concat(uid);
  var doc = node.ownerDocument;
  active_docs.add(doc);
  var stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
  var current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});

  if (!current_rules[name]) {
    current_rules[name] = true;
    stylesheet.insertRule("@keyframes ".concat(name, " ").concat(rule), stylesheet.cssRules.length);
  }

  var animation = node.style.animation || '';
  node.style.animation = "".concat(animation ? "".concat(animation, ", ") : "").concat(name, " ").concat(duration, "ms linear ").concat(delay, "ms 1 both");
  active += 1;
  return name;
}

function delete_rule(node, name) {
  var previous = (node.style.animation || '').split(', ');
  var next = previous.filter(name ? function (anim) {
    return anim.indexOf(name) < 0;
  } // remove specific animation
  : function (anim) {
    return anim.indexOf('__svelte') === -1;
  } // remove all Svelte animations
  );
  var deleted = previous.length - next.length;

  if (deleted) {
    node.style.animation = next.join(', ');
    active -= deleted;
    if (!active) clear_rules();
  }
}

function clear_rules() {
  raf(function () {
    if (active) return;
    active_docs.forEach(function (doc) {
      var stylesheet = doc.__svelte_stylesheet;
      var i = stylesheet.cssRules.length;

      while (i--) {
        stylesheet.deleteRule(i);
      }

      doc.__svelte_rules = {};
    });
    active_docs.clear();
  });
}

var current_component;

function set_current_component(component) {
  current_component = component;
}

function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}

function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}

function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}

var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;

function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}

function add_render_callback(fn) {
  render_callbacks.push(fn);
}

var flushing = false;
var seen_callbacks = new Set();

function flush() {
  if (flushing) return;
  flushing = true;

  do {
    // first, call beforeUpdate functions
    // and update components
    for (var i = 0; i < dirty_components.length; i += 1) {
      var component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }

    dirty_components.length = 0;

    while (binding_callbacks.length) {
      binding_callbacks.pop()();
    } // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...


    for (var _i = 0; _i < render_callbacks.length; _i += 1) {
      var callback = render_callbacks[_i];

      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }

    render_callbacks.length = 0;
  } while (dirty_components.length);

  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }

  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}

function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    var dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}

var promise;

function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(function () {
      promise = null;
    });
  }

  return promise;
}

function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event("".concat(direction ? 'intro' : 'outro').concat(kind)));
}

var outroing = new Set();
var outros;

function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros // parent group

  };
}

function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }

  outros = outros.p;
}

function transition_in(block, local) {
  if (block && block.i) {
    outroing["delete"](block);
    block.i(local);
  }
}

function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(function () {
      outroing["delete"](block);

      if (callback) {
        if (detach) block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}

var null_transition = {
  duration: 0
};

function create_in_transition(node, fn, params) {
  var config = fn(node, params);
  var running = false;
  var animation_name;
  var task;
  var uid = 0;

  function cleanup() {
    if (animation_name) delete_rule(node, animation_name);
  }

  function go() {
    var _ref = config || null_transition,
        _ref$delay = _ref.delay,
        delay = _ref$delay === void 0 ? 0 : _ref$delay,
        _ref$duration = _ref.duration,
        duration = _ref$duration === void 0 ? 300 : _ref$duration,
        _ref$easing = _ref.easing,
        easing = _ref$easing === void 0 ? identity : _ref$easing,
        _ref$tick = _ref.tick,
        tick = _ref$tick === void 0 ? noop : _ref$tick,
        css = _ref.css;

    if (css) animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    var start_time = now() + delay;
    var end_time = start_time + duration;
    if (task) task.abort();
    running = true;
    add_render_callback(function () {
      return dispatch(node, true, 'start');
    });
    task = loop(function (now) {
      if (running) {
        if (now >= end_time) {
          tick(1, 0);
          dispatch(node, true, 'end');
          cleanup();
          return running = false;
        }

        if (now >= start_time) {
          var t = easing((now - start_time) / duration);
          tick(t, 1 - t);
        }
      }

      return running;
    });
  }

  var started = false;
  return {
    start: function start() {
      if (started) return;
      delete_rule(node);

      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate: function invalidate() {
      started = false;
    },
    end: function end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}

function create_bidirectional_transition(node, fn, params, intro) {
  var config = fn(node, params);
  var t = intro ? 0 : 1;
  var running_program = null;
  var pending_program = null;
  var animation_name = null;

  function clear_animation() {
    if (animation_name) delete_rule(node, animation_name);
  }

  function init(program, duration) {
    var d = program.b - t;
    duration *= Math.abs(d);
    return {
      a: t,
      b: program.b,
      d: d,
      duration: duration,
      start: program.start,
      end: program.start + duration,
      group: program.group
    };
  }

  function go(b) {
    var _ref2 = config || null_transition,
        _ref2$delay = _ref2.delay,
        delay = _ref2$delay === void 0 ? 0 : _ref2$delay,
        _ref2$duration = _ref2.duration,
        duration = _ref2$duration === void 0 ? 300 : _ref2$duration,
        _ref2$easing = _ref2.easing,
        easing = _ref2$easing === void 0 ? identity : _ref2$easing,
        _ref2$tick = _ref2.tick,
        tick = _ref2$tick === void 0 ? noop : _ref2$tick,
        css = _ref2.css;

    var program = {
      start: now() + delay,
      b: b
    };

    if (!b) {
      // @ts-ignore todo: improve typings
      program.group = outros;
      outros.r += 1;
    }

    if (running_program) {
      pending_program = program;
    } else {
      // if this is an intro, and there's a delay, we need to do
      // an initial tick and/or apply CSS animation immediately
      if (css) {
        clear_animation();
        animation_name = create_rule(node, t, b, duration, delay, easing, css);
      }

      if (b) tick(0, 1);
      running_program = init(program, duration);
      add_render_callback(function () {
        return dispatch(node, b, 'start');
      });
      loop(function (now) {
        if (pending_program && now > pending_program.start) {
          running_program = init(pending_program, duration);
          pending_program = null;
          dispatch(node, running_program.b, 'start');

          if (css) {
            clear_animation();
            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
          }
        }

        if (running_program) {
          if (now >= running_program.end) {
            tick(t = running_program.b, 1 - t);
            dispatch(node, running_program.b, 'end');

            if (!pending_program) {
              // we're done
              if (running_program.b) {
                // intro — we can tidy up immediately
                clear_animation();
              } else {
                // outro — needs to be coordinated
                if (! --running_program.group.r) run_all(running_program.group.c);
              }
            }

            running_program = null;
          } else if (now >= running_program.start) {
            var p = now - running_program.start;
            t = running_program.a + running_program.d * easing(p / running_program.duration);
            tick(t, 1 - t);
          }
        }

        return !!(running_program || pending_program);
      });
    }
  }

  return {
    run: function run(b) {
      if (is_function(config)) {
        wait().then(function () {
          // @ts-ignore
          config = config();
          go(b);
        });
      } else {
        go(b);
      }
    },
    end: function end() {
      clear_animation();
      running_program = pending_program = null;
    }
  };
}

function outro_and_destroy_block(block, lookup) {
  transition_out(block, 1, 1, function () {
    lookup["delete"](block.key);
  });
}

function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
  var o = old_blocks.length;
  var n = list.length;
  var i = o;
  var old_indexes = {};

  while (i--) {
    old_indexes[old_blocks[i].key] = i;
  }

  var new_blocks = [];
  var new_lookup = new Map();
  var deltas = new Map();
  i = n;

  while (i--) {
    var child_ctx = get_context(ctx, list, i);
    var key = get_key(child_ctx);
    var block = lookup.get(key);

    if (!block) {
      block = create_each_block(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }

    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
  }

  var will_move = new Set();
  var did_move = new Set();

  function insert(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }

  while (o && n) {
    var new_block = new_blocks[n - 1];
    var old_block = old_blocks[o - 1];
    var new_key = new_block.key;
    var old_key = old_block.key;

    if (new_block === old_block) {
      // do nothing
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      // remove old block
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }

  while (o--) {
    var _old_block = old_blocks[o];
    if (!new_lookup.has(_old_block.key)) destroy(_old_block, lookup);
  }

  while (n) {
    insert(new_blocks[n - 1]);
  }

  return new_blocks;
}

function create_component(block) {
  block && block.c();
}

function mount_component(component, target, anchor) {
  var _component$$$ = component.$$,
      fragment = _component$$$.fragment,
      on_mount = _component$$$.on_mount,
      on_destroy = _component$$$.on_destroy,
      after_update = _component$$$.after_update;
  fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

  add_render_callback(function () {
    var new_on_destroy = on_mount.map(run).filter(is_function);

    if (on_destroy) {
      on_destroy.push.apply(on_destroy, _toConsumableArray(new_on_destroy));
    } else {
      // Edge case - component was destroyed immediately,
      // most likely as a result of a binding initialising
      run_all(new_on_destroy);
    }

    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}

function destroy_component(component, detaching) {
  var $$ = component.$$;

  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)

    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}

function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }

  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}

function init(component, options, instance, create_fragment, not_equal, props) {
  var dirty = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [-1];
  var parent_component = current_component;
  set_current_component(component);
  var prop_values = options.props || {};
  var $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props: props,
    update: noop,
    not_equal: not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty: dirty
  };
  var ready = false;
  $$.ctx = instance ? instance(component, prop_values, function (i, ret) {
    var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if ($$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }

    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update); // `false` as a special case of no DOM component

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

  if (options.target) {
    if (options.hydrate) {
      var nodes = children(options.target); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }

    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }

  set_current_component(parent_component);
}

var SvelteComponent = /*#__PURE__*/function () {
  function SvelteComponent() {
    _classCallCheck(this, SvelteComponent);
  }

  _createClass(SvelteComponent, [{
    key: "$destroy",
    value: function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
  }, {
    key: "$on",
    value: function $on(type, callback) {
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
  }, {
    key: "$set",
    value: function $set() {// overridden by instance, if it has props
    }
  }]);

  return SvelteComponent;
}();

var subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */

function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
  var stop;
  var subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
        var run_queue = !subscriber_queue.length;

        for (var i = 0; i < subscribers.length; i += 1) {
          var s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }

        if (run_queue) {
          for (var _i2 = 0; _i2 < subscriber_queue.length; _i2 += 2) {
            subscriber_queue[_i2][0](subscriber_queue[_i2 + 1]);
          }

          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run) {
    var invalidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
    var subscriber = [run, invalidate];
    subscribers.push(subscriber);

    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }

    run(value);
    return function () {
      var index = subscribers.indexOf(subscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }

      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }

  return {
    set: set,
    update: update,
    subscribe: subscribe
  };
}

function derived(stores, fn, initial_value) {
  var single = !Array.isArray(stores);
  var stores_array = single ? [stores] : stores;
  var auto = fn.length < 2;
  return readable(initial_value, function (set) {
    var inited = false;
    var values = [];
    var pending = 0;
    var cleanup = noop;

    var sync = function sync() {
      if (pending) {
        return;
      }

      cleanup();
      var result = fn(single ? values[0] : values, set);

      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };

    var unsubscribers = stores_array.map(function (store, i) {
      return subscribe(store, function (value) {
        values[i] = value;
        pending &= ~(1 << i);

        if (inited) {
          sync();
        }
      }, function () {
        pending |= 1 << i;
      });
    });
    inited = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
    };
  });
}

function fade(node, _ref3) {
  var _ref3$delay = _ref3.delay,
      delay = _ref3$delay === void 0 ? 0 : _ref3$delay,
      _ref3$duration = _ref3.duration,
      duration = _ref3$duration === void 0 ? 400 : _ref3$duration,
      _ref3$easing = _ref3.easing,
      easing = _ref3$easing === void 0 ? identity : _ref3$easing;
  var o = +getComputedStyle(node).opacity;
  return {
    delay: delay,
    duration: duration,
    easing: easing,
    css: function css(t) {
      return "opacity: ".concat(t * o);
    }
  };
}

var blocknative;

function initializeBlocknative(dappId, networkId, apiUrl) {
  blocknative = new BlocknativeApi({
    dappId: dappId,
    networkId: networkId,
    name: 'Onboard',
    apiUrl: apiUrl
  });
  return blocknative;
}

function getBlocknative() {
  return blocknative;
}

function getNetwork(provider) {
  return new Promise(function (resolve, reject) {
    var params = {
      jsonrpc: '2.0',
      method: 'net_version',
      params: [],
      id: 42
    };

    var callback = function callback(e, res) {
      e && reject(e);
      var result = res && res.result;
      resolve(result && Number(result));
    };

    if (typeof provider.sendAsync === 'function') {
      provider.sendAsync(params, callback);
    } else if (typeof provider.send === 'function') {
      provider.send(params, callback);
    } else {
      resolve(null);
    }
  });
}

function getAddress(provider) {
  return new Promise(function (resolve, reject) {
    var params = {
      jsonrpc: '2.0',
      method: 'eth_accounts',
      params: [],
      id: 42
    };

    var callback = function callback(e, res) {
      e && reject(e);
      var result = res && res.result && res.result[0];
      resolve(result);
    };

    if (typeof provider.sendAsync === 'function') {
      provider.sendAsync(params, callback);
    } else if (typeof provider.send === 'function') {
      provider.send(params, callback);
    } else {
      resolve(null);
    }
  });
}

function getBalance(provider, address) {
  return new Promise( /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
      var currentAddress, params, callback;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.t0 = address;

              if (_context.t0) {
                _context.next = 5;
                break;
              }

              _context.next = 4;
              return getAddress(provider);

            case 4:
              _context.t0 = _context.sent;

            case 5:
              currentAddress = _context.t0;

              if (currentAddress) {
                _context.next = 9;
                break;
              }

              resolve(null);
              return _context.abrupt("return");

            case 9:
              params = {
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [currentAddress, 'latest'],
                id: 42
              };

              callback = function callback(e, res) {
                e && reject(e);
                var result = res && res.result;
                resolve(result && new BigNumber(result).toString(10));
              };

              if (typeof provider.sendAsync === 'function') {
                provider.sendAsync(params, callback);
              } else if (typeof provider.send === 'function') {
                provider.send(params, callback);
              } else {
                resolve(null);
              }

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }());
}

function createModernProviderInterface(provider) {
  provider.autoRefreshOnNetworkChange = false;
  var onFuncExists = typeof provider.on === 'function';
  return {
    address: onFuncExists ? {
      onChange: function onChange(func) {
        // get the initial value
        getAddress(provider).then(func);
        provider.on('accountsChanged', function (accounts) {
          return func(accounts && accounts[0]);
        });
      }
    } : {
      get: function get() {
        return getAddress(provider);
      }
    },
    network: onFuncExists ? {
      onChange: function onChange(func) {
        // get initial value
        getNetwork(provider).then(func); // networkChanged event is deprecated in MM, keep for wallets that may not have updated

        provider.on('networkChanged', function (netId) {
          return func(netId && Number(netId));
        }); // use new chainChanged event for network change

        provider.on('chainChanged', function (netId) {
          return func(netId && Number(netId));
        });
      }
    } : {
      get: function get() {
        return getNetwork(provider);
      }
    },
    balance: {
      get: function get() {
        return getBalance(provider);
      }
    },
    connect: function connect() {
      return new Promise(function (resolve, reject) {
        provider.enable().then(resolve)["catch"](function () {
          return reject({
            message: 'This dapp needs access to your account information.'
          });
        });
      });
    },
    name: getProviderName(provider)
  };
}

function createLegacyProviderInterface(provider) {
  return {
    address: {
      get: function get() {
        return getAddress(provider);
      }
    },
    network: {
      get: function get() {
        return getNetwork(provider);
      }
    },
    balance: {
      get: function get() {
        return getBalance(provider);
      }
    },
    name: getProviderName(provider)
  };
}

function getProviderName(provider) {
  if (!provider) return;

  if (provider.isWalletIO) {
    return 'wallet.io';
  }

  alert(provider.wallet);
  alert(provider.isEnjin);
  alert(provider.isenjin);

  if (provider.wallet === 'Enjin') {
    return 'Enjin';
  }

  if (provider.wallet === 'MEETONE') {
    return 'MEETONE';
  }

  if (provider.isTorus) {
    return 'Torus';
  }

  if (provider.isImToken) {
    return 'imToken';
  }

  if (provider.isDapper) {
    return 'Dapper';
  }

  if (provider.isWalletConnect) {
    return 'WalletConnect';
  }

  if (provider.isTrust) {
    return 'Trust';
  }

  if (provider.isCoinbaseWallet) {
    return 'Coinbase';
  }

  if (provider.isToshi) {
    return 'Toshi';
  }

  if (provider.isCipher) {
    return 'Cipher';
  }

  if (provider.isOpera) {
    return 'Opera';
  }

  if (provider.isStatus) {
    return 'Status';
  }

  if (provider.isMetaMask) {
    return 'MetaMask';
  }

  if (provider.isMYKEY) {
    return 'MYKEY';
  }

  if (provider.isHbWallet) {
    return 'huobiwallet';
  }

  if (provider.isHyperPay) {
    return 'HyperPay';
  }

  if (provider.host && provider.host.indexOf('localhost') !== -1) {
    return 'localhost';
  }

  return 'web3 wallet';
}

function getDeviceInfo() {
  var parsed = bowser.getParser(window.navigator.userAgent);
  var os = parsed.getOS();
  var browser = parsed.getBrowser();

  var _parsed$getPlatform = parsed.getPlatform(),
      type = _parsed$getPlatform.type;

  return {
    isMobile: type ? type !== 'desktop' : window.innerWidth < 600,
    os: os,
    browser: browser
  };
}

function networkName(id) {
  switch (id) {
    case 1:
      return 'mainnet';

    case 3:
      return 'ropsten';

    case 4:
      return 'rinkeby';

    case 5:
      return 'goerli';

    case 42:
      return 'kovan';

    case 100:
      return 'xdai';

    default:
      return 'local';
  }
}

function networkToId(network) {
  switch (network) {
    case 'mainnet':
      return 1;

    case 'ropsten':
      return 3;

    case 'rinkeby':
      return 4;

    case 'goerli':
      return 5;

    case 'kovan':
      return 42;

    case 'xdai':
      return 100;

    default:
      return 0;
  }
}

function wait$1(time) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

function makeCancelable(promise) {
  var rejectFn;
  var wrappedPromise = new Promise(function (resolve, reject) {
    rejectFn = reject;
    promise.then(resolve)["catch"](reject);
  });

  wrappedPromise.cancel = function () {
    rejectFn('canceled');
  };

  return wrappedPromise;
}

function isPromise(val) {
  if (val instanceof Promise) {
    return true;
  }

  return false;
}

function createInterval(func, interval) {
  var id = setInterval(func, interval);
  var status = {
    active: true
  };
  return {
    status: status,
    clear: function clear() {
      clearInterval(id);
      status.active = false;
    }
  };
}

function openLink(url) {
  window.open(url);
}

var validSubscriptionKeys = ['address', 'network', 'balance', 'wallet'];

function validateType(options) {
  var name = options.name,
      value = options.value,
      type = options.type,
      optional = options.optional;

  if (!optional && typeof value === 'undefined') {
    throw new Error("\"".concat(name, "\" is required"));
  }

  if (typeof value !== 'undefined' && (type === 'array' ? Array.isArray(type) : _typeof(value) !== type)) {
    throw new Error("\"".concat(name, "\" must be of type: ").concat(type, ", received type: ").concat(_typeof(value), " from value: ").concat(value));
  }
}

function invalidParams(params, validParams, functionName) {
  var keys = Object.keys(params);
  keys.forEach(function (key) {
    if (!validParams.includes(key)) {
      throw new Error("".concat(key, " is not a valid parameter for ").concat(functionName, ", must be one of the following valid parameters: ").concat(validParams.join(', ')));
    }
  });
}

function validateInit(init) {
  validateType({
    name: 'init',
    value: init,
    type: 'object'
  });

  var dappId = init.dappId,
      networkId = init.networkId,
      subscriptions = init.subscriptions,
      walletSelect = init.walletSelect,
      walletCheck = init.walletCheck,
      darkMode = init.darkMode,
      apiUrl = init.apiUrl,
      hideBranding = init.hideBranding,
      otherParams = _objectWithoutProperties(init, ["dappId", "networkId", "subscriptions", "walletSelect", "walletCheck", "darkMode", "apiUrl", "hideBranding"]);

  invalidParams(otherParams, ['dappId', 'networkId', 'subscriptions', 'walletSelect', 'walletCheck', 'darkMode', 'apiUrl', 'hideBranding'], 'init');
  validateType({
    name: 'dappId',
    value: dappId,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'networkId',
    value: networkId,
    type: 'number'
  });
  validateType({
    name: 'darkMode',
    value: darkMode,
    type: 'boolean',
    optional: true
  });
  validateType({
    name: 'apiUrl',
    value: apiUrl,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'hideBranding',
    value: hideBranding,
    type: 'boolean',
    optional: true
  });
  validateType({
    name: 'subscriptions',
    value: subscriptions,
    type: 'object',
    optional: true
  });

  if (subscriptions) {
    validateSubscriptions(subscriptions);
  }

  validateType({
    name: 'walletSelect',
    value: walletSelect,
    type: 'object',
    optional: true
  });

  if (walletSelect) {
    validateWalletSelect(walletSelect);
  }

  validateType({
    name: 'walletCheck',
    value: walletCheck,
    type: 'object',
    optional: true
  });

  if (walletCheck) {
    validateWalletCheck(walletCheck);
  }
}

function validateSubscriptions(subscriptions) {
  var address = subscriptions.address,
      network = subscriptions.network,
      balance = subscriptions.balance,
      wallet = subscriptions.wallet,
      otherParams = _objectWithoutProperties(subscriptions, ["address", "network", "balance", "wallet"]);

  invalidParams(otherParams, validSubscriptionKeys, 'subscriptions');
  validateType({
    name: 'subscriptions.address',
    value: address,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'subscriptions.network',
    value: network,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'subscriptions.balance',
    value: balance,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'subscriptions.wallet',
    value: wallet,
    type: 'function',
    optional: true
  });
}

function validateWalletSelect(walletSelect) {
  validateType({
    name: 'walletSelect',
    value: walletSelect,
    type: 'object'
  });

  var heading = walletSelect.heading,
      description = walletSelect.description,
      explanation = walletSelect.explanation,
      wallets = walletSelect.wallets,
      otherParams = _objectWithoutProperties(walletSelect, ["heading", "description", "explanation", "wallets"]);

  invalidParams(otherParams, ['heading', 'description', 'explanation', 'wallets'], 'walletSelect');
  validateType({
    name: 'heading',
    value: heading,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'description',
    value: description,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'explanation',
    value: explanation,
    type: 'string',
    optional: true
  });

  if (Array.isArray(wallets)) {
    wallets.forEach(validateWallet);
  }
}

function isWalletModule(obj) {
  return obj.wallet !== undefined;
}

function isWalletInit(obj) {
  return obj.walletName !== undefined;
}

function validateWallet(obj) {
  validateType({
    name: 'selectWallet.wallets item',
    value: obj,
    type: 'object'
  });

  if (isWalletModule(obj)) {
    var name = obj.name,
        iconSrc = obj.iconSrc,
        iconSrcSet = obj.iconSrcSet,
        svg = obj.svg,
        _wallet = obj.wallet,
        link = obj.link,
        installMessage = obj.installMessage,
        preferred = obj.preferred,
        desktop = obj.desktop,
        mobile = obj.mobile,
        type = obj.type,
        osExclusions = obj.osExclusions,
        otherParams = _objectWithoutProperties(obj, ["name", "iconSrc", "iconSrcSet", "svg", "wallet", "link", "installMessage", "preferred", "desktop", "mobile", "type", "osExclusions"]);

    invalidParams(otherParams, ['name', 'iconSrc', 'iconSrcSet', 'svg', 'wallet', 'type', 'link', 'installMessage', 'preferred', 'desktop', 'mobile', 'osExclusions'], 'selectWallets.wallets item');
    validateType({
      name: 'name',
      value: name,
      type: 'string'
    });
    validateType({
      name: 'wallet',
      value: _wallet,
      type: 'function'
    });
    validateType({
      name: 'iconSrc',
      value: iconSrc,
      type: 'string',
      optional: true
    });
    validateType({
      name: 'iconSrcSet',
      value: iconSrcSet,
      type: 'string',
      optional: true
    });
    validateType({
      name: 'svg',
      value: svg,
      type: 'string',
      optional: true
    });
    validateType({
      name: 'link',
      value: link,
      type: 'string',
      optional: true
    });
    validateType({
      name: 'installMessage',
      value: installMessage,
      type: 'function',
      optional: true
    });
    validateType({
      name: 'preferred',
      value: preferred,
      type: 'boolean',
      optional: true
    });
    validateType({
      name: 'desktop',
      value: desktop,
      type: 'boolean',
      optional: true
    });
    validateType({
      name: 'mobile',
      value: mobile,
      type: 'boolean',
      optional: true
    });
    validateType({
      name: 'type',
      value: type,
      type: 'string',
      optional: true
    });
    validateType({
      name: 'osExclusions',
      value: osExclusions,
      type: 'array',
      optional: true
    });
    return;
  }

  validateWalletInit(obj);
}

function isWalletCheckModule(obj) {
  return typeof obj === 'function';
}

function validateWalletCheck(walletCheck) {
  validateType({
    name: 'walletCheck',
    value: walletCheck,
    type: 'array'
  });
  walletCheck.forEach(function (check) {
    if (isWalletCheckModule(check)) {
      validateWalletCheckModule(check);
    } else {
      validateType({
        name: 'walletCheck item',
        value: check,
        type: 'object'
      });

      var checkName = check.checkName,
          heading = check.heading,
          description = check.description,
          minimumBalance = check.minimumBalance,
          html = check.html,
          icon = check.icon,
          button = check.button,
          otherParams = _objectWithoutProperties(check, ["checkName", "heading", "description", "minimumBalance", "html", "icon", "button"]);

      invalidParams(otherParams, ['checkName', 'heading', 'description', 'html', 'icon', 'button', 'minimumBalance'], 'walletCheck item');
      validateType({
        name: 'checkName',
        value: checkName,
        type: 'string'
      });
      validateType({
        name: 'heading',
        value: heading,
        type: 'string',
        optional: true
      });
      validateType({
        name: 'description',
        value: description,
        type: 'string',
        optional: true
      });
      validateType({
        name: 'html',
        value: html,
        type: 'string',
        optional: true
      });
      validateType({
        name: 'icon',
        value: icon,
        type: 'string',
        optional: true
      });
      validateType({
        name: 'button',
        value: button,
        type: 'object',
        optional: true
      });
      validateType({
        name: 'minimumBalance',
        value: minimumBalance,
        type: 'string',
        optional: true
      });
    }
  });
}

function validateWalletCheckModule(module) {
  validateType({
    name: 'walletCheck module',
    value: module,
    type: 'function'
  });
}

function validateConfig(configuration) {
  validateType({
    name: 'configuration',
    value: configuration,
    type: 'object'
  });

  var darkMode = configuration.darkMode,
      networkId = configuration.networkId,
      otherParams = _objectWithoutProperties(configuration, ["darkMode", "networkId"]);

  invalidParams(otherParams, ['darkMode', 'networkId'], 'configuration');
  validateType({
    name: 'darkMode',
    value: darkMode,
    type: 'boolean',
    optional: true
  });
  validateType({
    name: 'networkId',
    value: networkId,
    type: 'number',
    optional: true
  });
}

function validateModal(modal) {
  validateType({
    name: 'modal',
    value: modal,
    type: 'object'
  });

  var heading = modal.heading,
      description = modal.description,
      button = modal.button,
      eventCode = modal.eventCode,
      action = modal.action,
      icon = modal.icon,
      html = modal.html,
      otherParams = _objectWithoutProperties(modal, ["heading", "description", "button", "eventCode", "action", "icon", "html"]);

  invalidParams(otherParams, ['heading', 'description', 'button', 'eventCode', 'action', 'icon', 'html'], 'modal');
  validateType({
    name: 'heading',
    value: heading,
    type: 'string'
  });
  validateType({
    name: 'description',
    value: description,
    type: 'string'
  });
  validateType({
    name: 'eventCode',
    value: eventCode,
    type: 'string'
  });
  validateType({
    name: 'action',
    value: action,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'button',
    value: button,
    type: 'object',
    optional: true
  });
  validateType({
    name: 'html',
    value: html,
    type: 'string',
    optional: true
  });

  if (button) {
    var onclick = button.onclick,
        _text = button.text,
        restParams = _objectWithoutProperties(button, ["onclick", "text"]);

    invalidParams(restParams, ['onclick', 'text'], 'button');
    validateType({
      name: 'onclick',
      value: onclick,
      type: 'function'
    });
    validateType({
      name: 'text',
      value: _text,
      type: 'string'
    });
  }

  validateType({
    name: 'icon',
    value: icon,
    type: 'string',
    optional: true
  });
}

function validateWalletInterface(walletInterface) {
  validateType({
    name: 'walletInterface',
    value: walletInterface,
    type: 'object'
  });

  var name = walletInterface.name,
      connect = walletInterface.connect,
      disconnect = walletInterface.disconnect,
      address = walletInterface.address,
      network = walletInterface.network,
      balance = walletInterface.balance,
      otherParams = _objectWithoutProperties(walletInterface, ["name", "connect", "disconnect", "address", "network", "balance"]);

  invalidParams(otherParams, ['name', 'connect', 'disconnect', 'address', 'network', 'balance'], 'walletInterface');
  validateType({
    name: 'name',
    value: name,
    type: 'string'
  });
  validateType({
    name: 'connect',
    value: connect,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'disconnect',
    value: disconnect,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'address',
    value: address,
    type: 'object'
  });
  validateType({
    name: 'address.get',
    value: address.get,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'address.onChange',
    value: address.onChange,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'network',
    value: network,
    type: 'object'
  });
  validateType({
    name: 'network.get',
    value: network.get,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'network.onChange',
    value: network.onChange,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'balance',
    value: balance,
    type: 'object'
  });
  validateType({
    name: 'balance.get',
    value: balance.get,
    type: 'function',
    optional: true
  });
  validateType({
    name: 'balance.onChange',
    value: balance.onChange,
    type: 'function',
    optional: true
  });
}

function validateWalletInit(walletInit) {
  validateType({
    name: 'walletInit',
    value: walletInit,
    type: 'object'
  });

  var walletName = walletInit.walletName,
      preferred = walletInit.preferred,
      label = walletInit.label,
      iconSrc = walletInit.iconSrc,
      svg = walletInit.svg,
      otherParams = _objectWithoutProperties(walletInit, ["walletName", "preferred", "label", "iconSrc", "svg"]);

  invalidParams(otherParams, ['walletName', 'apiKey', 'networkId', 'infuraKey', 'rpc', 'bridge', 'preferred', 'label', 'iconSrc', 'svg', 'appUrl', 'email', 'rpcUrl', 'LedgerTransport', 'buildEnv', 'buttonPosition', 'enableLogging', 'loginMethod', 'loginConfig', 'showTorusButton', 'modalZindex', 'integrity', 'whiteLabel', 'appName', 'appLogoUrl', 'enabledVerifiers', 'disableNotifications', 'rpcUri', 'webUri', 'xsUri', 'blockedPopupRedirect'], 'walletInitObject');
  validateType({
    name: 'walletInit.walletName',
    value: walletName,
    type: 'string'
  });
  validateType({
    name: 'walletInit.preferred',
    value: preferred,
    type: 'boolean',
    optional: true
  });
  validateType({
    name: 'walletInit.label',
    value: label,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'walletInit.iconSrc',
    value: iconSrc,
    type: 'string',
    optional: true
  });
  validateType({
    name: 'walletInit.svg',
    value: svg,
    type: 'string',
    optional: true
  });
}

var app = writable({
  dappId: '',
  networkId: 1,
  version: '',
  mobileDevice: false,
  os: '',
  darkMode: false,
  walletSelectInProgress: false,
  walletSelectCompleted: false,
  walletCheckInProgress: false,
  walletCheckCompleted: false,
  accountSelectInProgress: false,
  autoSelectWallet: '',
  checkModules: [],
  walletSelectDisplayedUI: false,
  walletCheckDisplayedUI: false,
  displayBranding: false
});
var stateSyncStatus = {
  balance: null,
  address: null,
  network: null
};
var address;
var network;
var balance;
var wallet;
var state;
var walletInterface;
var currentSyncerIntervals;

function initializeStores() {
  address = createWalletStateSliceStore({
    parameter: 'address',
    initialState: null
  });
  network = createWalletStateSliceStore({
    parameter: 'network',
    initialState: null
  });
  balance = get_store_value(app).dappId ? createBalanceStore(null) : createWalletStateSliceStore({
    parameter: 'balance',
    initialState: null,
    intervalSetting: 1000
  });
  wallet = writable({
    name: null,
    provider: null,
    connect: null,
    instance: null,
    dashboard: null,
    type: null
  });
  state = derived([address, network, balance, wallet, app], function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 5),
        $address = _ref6[0],
        $network = _ref6[1],
        $balance = _ref6[2],
        $wallet = _ref6[3],
        $app = _ref6[4];

    return {
      address: $address,
      network: $network,
      balance: $balance,
      wallet: $wallet,
      mobileDevice: $app.mobileDevice,
      appNetworkId: $app.networkId
    };
  });
  currentSyncerIntervals = [];
  walletInterface = createWalletInterfaceStore(null);
  walletInterface.subscribe(function (walletInterface) {
    // make sure that stores have been initialized
    if (state) {
      // clear all current intervals if they exist
      currentSyncerIntervals.forEach(function (interval) {
        return interval && interval.clear();
      });
      var currentState = get_store_value(state); // reset state

      currentState.balance && balance.reset();
      currentState.address && address.reset();
      currentState.network && network.reset();

      if (walletInterface) {
        // start syncing state and save intervals
        currentSyncerIntervals = [address.setStateSyncer(walletInterface.address), network.setStateSyncer(walletInterface.network), balance.setStateSyncer(walletInterface.balance)];
      }

      resetCheckModules();
    }
  });
}

function resetWalletState(options) {
  walletInterface.update(function (currentInterface) {
    // no interface then don't do anything
    if (!currentInterface) {
      return currentInterface;
    } // no options object, so do a full reset by disconnecting and setting interface to null


    if (!options) {
      wallet.update(function () {
        return {
          name: undefined,
          provider: undefined,
          connect: undefined,
          instance: undefined,
          dashboard: undefined,
          type: undefined
        };
      });
      currentInterface.disconnect && currentInterface.disconnect();
      return null;
    }

    var walletName = options.walletName,
        disconnected = options.disconnected; // if walletName is the same as the current interface name then do a full reset (checking if to do a disconnect)

    if (currentInterface.name === walletName) {
      wallet.update(function () {
        return {
          name: undefined,
          provider: undefined,
          connect: undefined,
          instance: undefined,
          dashboard: undefined
        };
      });
      !disconnected && currentInterface.disconnect && currentInterface.disconnect();
      return null;
    }

    return currentInterface;
  });
  resetCheckModules();
  app.update(function (store) {
    return _objectSpread(_objectSpread({}, store), {}, {
      walletSelectInProgress: false,
      walletSelectCompleted: false
    });
  });
}

function resetCheckModules() {
  var _get_store_value = get_store_value(app),
      checkModules = _get_store_value.checkModules;

  if (Array.isArray(checkModules)) {
    checkModules.forEach(function (m) {
      return m.reset && m.reset();
    });
  }
}

function createWalletInterfaceStore(initialState) {
  var _writable = writable(initialState),
      subscribe = _writable.subscribe,
      _set = _writable.set,
      update = _writable.update;

  return {
    subscribe: subscribe,
    update: update,
    set: function set(walletInterface) {
      if (walletInterface) {
        validateWalletInterface(walletInterface);
      }

      _set(walletInterface);
    }
  };
}

function createWalletStateSliceStore(options) {
  var parameter = options.parameter,
      initialState = options.initialState,
      intervalSetting = options.intervalSetting;

  var _writable2 = writable(initialState),
      subscribe = _writable2.subscribe,
      set = _writable2.set;

  var currentState;
  subscribe(function (store) {
    currentState = store;
  });
  return {
    subscribe: subscribe,
    reset: function reset() {
      set(undefined);
    },
    get: function get() {
      return currentState;
    },
    setStateSyncer: function setStateSyncer(stateSyncer) {
      validateType({
        name: 'stateSyncer',
        value: stateSyncer,
        type: 'object'
      });
      var get = stateSyncer.get,
          onChange = stateSyncer.onChange;
      validateType({
        name: "".concat(parameter, ".get"),
        value: get,
        type: 'function',
        optional: true
      });
      validateType({
        name: "".concat(parameter, ".onChange"),
        value: onChange,
        type: 'function',
        optional: true
      });

      if (onChange) {
        stateSyncStatus[parameter] = new Promise(function (resolve) {
          onChange(function (newVal) {
            resolve();

            if (newVal || currentState !== initialState) {
              set(newVal);
            }
          });
        });
        return;
      }

      if (get) {
        var interval = createInterval(function () {
          stateSyncStatus[parameter] = get().then(function (newVal) {
            stateSyncStatus[parameter] = null;

            if (newVal || currentState !== initialState) {
              interval.status.active && set(newVal);
            }
          })["catch"](function (err) {
            console.warn("Error getting ".concat(parameter, " from state syncer: ").concat(err));
            stateSyncStatus[parameter] = null;
          });
        }, intervalSetting || 200);
        return interval;
      }
    }
  };
}

function createBalanceStore(initialState) {
  var stateSyncer;
  var emitter;
  var emitterAddress;

  var cancel = function cancel() {};

  var _derived = derived([address, network], function (_ref7, set) {
    var _ref8 = _slicedToArray(_ref7, 2),
        $address = _ref8[0],
        $network = _ref8[1];

    if (stateSyncer && !stateSyncer.onChange) {
      if ($address && $network && stateSyncer.get && set) {
        cancel = syncStateWithTimeout({
          getState: stateSyncer.get,
          setState: set,
          timeout: 2000,
          currentBalance: get_store_value(balance)
        });

        if (emitterAddress !== $address) {
          var _blocknative = getBlocknative(); // unsubscribe from previous address


          if (emitterAddress) {
            _blocknative.unsubscribe(emitterAddress);
          }

          emitter = _blocknative.account($address).emitter;
          emitter.on('txConfirmed', function () {
            if (stateSyncer.get) {
              cancel = syncStateWithTimeout({
                getState: stateSyncer.get,
                setState: set,
                timeout: 2000,
                currentBalance: get_store_value(balance),
                pollStart: Date.now()
              });
            }

            return false;
          });
          emitterAddress = $address;
        }
      } else if (emitterAddress && !$address) {
        var _blocknative2 = getBlocknative(); // unsubscribe from previous address


        _blocknative2.unsubscribe(emitterAddress); // no address, so set balance to undefined


        set && set(undefined);
        emitterAddress = undefined;
      }
    }

    set(initialState);
  }),
      subscribe = _derived.subscribe;

  var currentState;
  subscribe(function (store) {
    currentState = store;
  });
  return {
    subscribe: subscribe,
    get: function get() {
      return currentState;
    },
    setStateSyncer: function setStateSyncer(syncer) {
      validateType({
        name: 'syncer',
        value: syncer,
        type: 'object'
      });
      var get = syncer.get,
          onChange = syncer.onChange;
      validateType({
        name: 'balance.get',
        value: get,
        type: 'function',
        optional: true
      });
      validateType({
        name: 'balance.onChange',
        value: onChange,
        type: 'function',
        optional: true
      });
      stateSyncer = syncer;
      return undefined;
    },
    reset: cancel
  };
}

function syncStateWithTimeout(options) {
  var getState = options.getState,
      setState = options.setState,
      timeout = options.timeout,
      currentBalance = options.currentBalance,
      pollStart = options.pollStart;

  if (pollStart && Date.now() - pollStart > 25000) {
    return function () {};
  }

  var prom = makeCancelable(getState());
  stateSyncStatus.balance = prom;
  prom.then( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(result) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(result === currentBalance && pollStart)) {
                _context2.next = 6;
                break;
              }

              _context2.next = 3;
              return wait$1(350);

            case 3:
              syncStateWithTimeout(options);
              _context2.next = 8;
              break;

            case 6:
              stateSyncStatus.balance = null;
              setState(result);

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref9.apply(this, arguments);
    };
  }())["catch"](function () {
    stateSyncStatus.balance = null;
  });
  var timedOut = wait$1(timeout);
  timedOut.then(function () {
    prom.cancel();
  });
  return function () {
    return prom.cancel();
  };
}
/* src/elements/Branding.svelte generated by Svelte v3.24.0 */


function add_css() {
  var style = element("style");
  style.id = "svelte-15m9up6-style";
  style.textContent = ".bn-branding.svelte-15m9up6{font-size:0.75rem;font-family:inherit;margin:0.4rem;display:flex;justify-content:center;width:100%;align-items:center}span.svelte-15m9up6{opacity:0.3}a.svelte-15m9up6{color:inherit;display:flex;margin-left:0.25rem;align-items:center}.bn-logo.svelte-15m9up6{height:1.1rem;margin-left:0.25rem;margin-bottom:0.1rem}svg.svelte-15m9up6{height:100%;width:auto}";
  append(document.head, style);
} // (76:6) {:else}


function create_else_block(ctx) {
  var svg;
  var g;
  var path0;
  var path1;
  return {
    c: function c() {
      svg = svg_element("svg");
      g = svg_element("g");
      path0 = svg_element("path");
      path1 = svg_element("path");
      attr(path0, "d", "m1.35473654 25.2695268\n              41.68515786-24.21771792c.5647044-.32807482 1.2619836-.32807795\n              1.8266909-.00000821l19.9275013\n              11.57698923c.5635938.3274228.9088026.9314826.9048094\n              1.5832707l-.1501112 24.5017756 20.8472716\n              12.1113348c.5601525.3254236.9048434.9243111.9048434\n              1.5721317v48.4560123c0 .647825-.3446953 1.246715-.9048537\n              1.572138l-41.6835092\n              24.215895c-.5655731.328567-1.2640448.328023-1.8291052-.001426l-41.5311197-24.21401c-.5587764-.325785-.90240476-.923899-.90240476-1.570712v-49.505258-24.5082917c0-.6478147.34468473-1.2466978.9048293-1.5721235z");
      attr(path1, "d", "m22.0428451 114.442824v-25.2731141l-21.59284788-12.5449388\n              42.75014288 24.6551909c.5648507.325765 1.260898.324109\n              1.8241926-.004339l42.2766571-24.6508519-21.5955473\n              12.6370084v-24.2248276c0-.6488012-.3457266-1.2484405-.9072187-1.5735092l-20.9222804-12.1126883\n              21.6729314-12.6370084-42.4525958\n              24.4763352c-.5545159.3197099-1.236865.3218902-1.7934127.0057303l-20.85286908-11.8459598");
      set_style(g, "stroke", "#000");
      set_style(g, "stroke-width", "2.70793");
      set_style(g, "fill", "none");
      set_style(g, "fill-rule", "evenodd");
      set_style(g, "stroke-linecap", "round");
      set_style(g, "stroke-linejoin", "round");
      attr(g, "transform", "translate(1.818182 .909091)");
      attr(svg, "height", "130");
      attr(svg, "viewBox", "0 0 91 130");
      attr(svg, "width", "91");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "svelte-15m9up6");
    },
    m: function m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, g);
      append(g, path0);
      append(g, path1);
    },
    d: function d(detaching) {
      if (detaching) detach(svg);
    }
  };
} // (48:6) {#if darkMode}


function create_if_block(ctx) {
  var svg;
  var g;
  var path0;
  var path1;
  return {
    c: function c() {
      svg = svg_element("svg");
      g = svg_element("g");
      path0 = svg_element("path");
      path1 = svg_element("path");
      attr(path0, "d", "m1.35473654 25.2695268\n              41.68515786-24.21771792c.5647044-.32807482 1.2619836-.32807795\n              1.8266909-.00000821l19.9275013\n              11.57698923c.5635938.3274228.9088026.9314826.9048094\n              1.5832707l-.1501112 24.5017756 20.8472716\n              12.1113348c.5601525.3254236.9048434.9243111.9048434\n              1.5721317v48.4560123c0 .647825-.3446953 1.246715-.9048537\n              1.572138l-41.6835092\n              24.215895c-.5655731.328567-1.2640448.328023-1.8291052-.001426l-41.5311197-24.21401c-.5587764-.325785-.90240476-.923899-.90240476-1.570712v-49.505258-24.5082917c0-.6478147.34468473-1.2466978.9048293-1.5721235z");
      attr(path1, "d", "m22.0428451 114.442824v-25.2731141l-21.59284788-12.5449388\n              42.75014288 24.6551909c.5648507.325765 1.260898.324109\n              1.8241926-.004339l42.2766571-24.6508519-21.5955473\n              12.6370084v-24.2248276c0-.6488012-.3457266-1.2484405-.9072187-1.5735092l-20.9222804-12.1126883\n              21.6729314-12.6370084-42.4525958\n              24.4763352c-.5545159.3197099-1.236865.3218902-1.7934127.0057303l-20.85286908-11.8459598");
      set_style(g, "stroke", "#fff");
      set_style(g, "stroke-width", "2.70793");
      set_style(g, "fill", "none");
      set_style(g, "fill-rule", "evenodd");
      set_style(g, "stroke-linecap", "round");
      set_style(g, "stroke-linejoin", "round");
      attr(g, "transform", "translate(1.818182 .909091)");
      attr(svg, "height", "130");
      attr(svg, "viewBox", "0 0 91 130");
      attr(svg, "width", "91");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "class", "svelte-15m9up6");
    },
    m: function m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, g);
      append(g, path0);
      append(g, path1);
    },
    d: function d(detaching) {
      if (detaching) detach(svg);
    }
  };
}

function create_fragment(ctx) {
  var div1;
  var span0;
  var t1;
  var a;
  var span1;
  var t3;
  var div0;

  function select_block_type(ctx, dirty) {
    if (
    /*darkMode*/
    ctx[0]) return create_if_block;
    return create_else_block;
  }

  var current_block_type = select_block_type(ctx);
  var if_block = current_block_type(ctx);
  return {
    c: function c() {
      div1 = element("div");
      span0 = element("span");
      span0.textContent = "Powered by";
      t1 = space();
      a = element("a");
      span1 = element("span");
      span1.textContent = "Blocknative";
      t3 = space();
      div0 = element("div");
      if_block.c();
      attr(span0, "class", "svelte-15m9up6");
      attr(span1, "class", "svelte-15m9up6");
      attr(div0, "class", "bn-logo svelte-15m9up6");
      attr(a, "href", "https://hubs.ly/H0qh2g10");
      attr(a, "class", "bn-onboard-clickable svelte-15m9up6");
      attr(a, "target", "_blank");
      attr(a, "rel", "noopener noreferrer");
      attr(div1, "class", "bn-branding svelte-15m9up6");
    },
    m: function m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, span0);
      append(div1, t1);
      append(div1, a);
      append(a, span1);
      append(a, t3);
      append(a, div0);
      if_block.m(div0, null);
    },
    p: function p(ctx, _ref10) {
      var _ref11 = _slicedToArray(_ref10, 1),
          dirty = _ref11[0];

      if (current_block_type !== (current_block_type = select_block_type(ctx))) {
        if_block.d(1);
        if_block = current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(div0, null);
        }
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(div1);
      if_block.d();
    }
  };
}

function instance($$self, $$props, $$invalidate) {
  var darkMode = $$props.darkMode;

  $$self.$set = function ($$props) {
    if ("darkMode" in $$props) $$invalidate(0, darkMode = $$props.darkMode);
  };

  return [darkMode];
}

var Branding = /*#__PURE__*/function (_SvelteComponent) {
  _inherits(Branding, _SvelteComponent);

  var _super = _createSuper(Branding);

  function Branding(options) {
    var _this;

    _classCallCheck(this, Branding);

    _this = _super.call(this);
    if (!document.getElementById("svelte-15m9up6-style")) add_css();
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
      darkMode: 0
    });
    return _this;
  }

  return Branding;
}(SvelteComponent);
/* src/components/Modal.svelte generated by Svelte v3.24.0 */


function add_css$1() {
  var style = element("style");
  style.id = "svelte-rntogh-style";
  style.textContent = "aside.svelte-rntogh{display:flex;font-family:'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;justify-content:center;align-items:center;position:fixed;font-size:16px;top:0;left:0;width:100vw;height:100vh;background:rgba(0, 0, 0, 0.3)}@media screen and (max-width: 420px){aside.svelte-rntogh{font-size:14px}}section.svelte-rntogh{display:block;box-sizing:content-box;background:#ffffff;border-radius:10px;box-shadow:0 1px 5px 0 rgba(0, 0, 0, 0.1);font-family:inherit;font-size:inherit;padding:1.33em;position:relative;overflow:hidden;max-width:37em;color:#4a4a4a}div.svelte-rntogh{height:0.66em;position:absolute;padding:0.25em;top:1.33em;right:1.33em;font-size:inherit;font-family:inherit;border-radius:5px;transition:background 200ms ease-in-out;display:flex;justify-content:center;align-items:center}div.svelte-rntogh:hover{cursor:pointer;background:#eeeeee}svg.svelte-rntogh{width:10px;height:10px}.bn-onboard-dark-mode-close-background.svelte-rntogh:hover{background:#00222c}.no-padding-branding.svelte-rntogh{padding-bottom:0}";
  append(document.head, style);
} // (95:4) {#if $app.displayBranding}


function create_if_block_1(ctx) {
  var branding;
  var current;
  branding = new Branding({
    props: {
      darkMode:
      /*$app*/
      ctx[3].darkMode
    }
  });
  return {
    c: function c() {
      create_component(branding.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(branding, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var branding_changes = {};
      if (dirty &
      /*$app*/
      8) branding_changes.darkMode =
      /*$app*/
      ctx[3].darkMode;
      branding.$set(branding_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(branding.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(branding.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(branding, detaching);
    }
  };
} // (98:4) {#if closeable}


function create_if_block$1(ctx) {
  var div;
  var svg;
  var g0;
  var path;
  var g1;
  var g2;
  var g3;
  var g4;
  var g5;
  var g6;
  var g7;
  var g8;
  var g9;
  var g10;
  var g11;
  var g12;
  var g13;
  var g14;
  var g15;
  var svg_fill_value;
  var mounted;
  var dispose;
  return {
    c: function c() {
      div = element("div");
      svg = svg_element("svg");
      g0 = svg_element("g");
      path = svg_element("path");
      g1 = svg_element("g");
      g2 = svg_element("g");
      g3 = svg_element("g");
      g4 = svg_element("g");
      g5 = svg_element("g");
      g6 = svg_element("g");
      g7 = svg_element("g");
      g8 = svg_element("g");
      g9 = svg_element("g");
      g10 = svg_element("g");
      g11 = svg_element("g");
      g12 = svg_element("g");
      g13 = svg_element("g");
      g14 = svg_element("g");
      g15 = svg_element("g");
      attr(path, "d", "M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88\n              c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242\n              C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879\n              s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z");
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      attr(svg, "x", "0px");
      attr(svg, "y", "0px");
      attr(svg, "viewBox", "0 0 47.971 47.971");
      set_style(svg, "enable-background", "new 0 0 47.971 47.971");
      set_style(svg, "transition", "fill 150ms\n          ease-in-out");
      attr(svg, "fill", svg_fill_value =
      /*closeHovered*/
      ctx[2] ?
      /*$app*/
      ctx[3].darkMode ? "#ffffff" : "#4a4a4a" : "#9B9B9B");
      attr(svg, "xml:space", "preserve");
      attr(svg, "class", "svelte-rntogh");
      attr(div, "class", "bn-onboard-custom bn-onboard-modal-content-close svelte-rntogh");
      toggle_class(div, "bn-onboard-dark-mode-close-background",
      /*$app*/
      ctx[3].darkMode);
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      append(div, svg);
      append(svg, g0);
      append(g0, path);
      append(svg, g1);
      append(svg, g2);
      append(svg, g3);
      append(svg, g4);
      append(svg, g5);
      append(svg, g6);
      append(svg, g7);
      append(svg, g8);
      append(svg, g9);
      append(svg, g10);
      append(svg, g11);
      append(svg, g12);
      append(svg, g13);
      append(svg, g14);
      append(svg, g15);

      if (!mounted) {
        dispose = [listen(div, "click", function () {
          if (is_function(
          /*closeModal*/
          ctx[0]))
            /*closeModal*/
            ctx[0].apply(this, arguments);
        }), listen(div, "mouseenter",
        /*mouseenter_handler*/
        ctx[6]), listen(div, "mouseleave",
        /*mouseleave_handler*/
        ctx[7])];
        mounted = true;
      }
    },
    p: function p(new_ctx, dirty) {
      ctx = new_ctx;

      if (dirty &
      /*closeHovered, $app*/
      12 && svg_fill_value !== (svg_fill_value =
      /*closeHovered*/
      ctx[2] ?
      /*$app*/
      ctx[3].darkMode ? "#ffffff" : "#4a4a4a" : "#9B9B9B")) {
        attr(svg, "fill", svg_fill_value);
      }

      if (dirty &
      /*$app*/
      8) {
        toggle_class(div, "bn-onboard-dark-mode-close-background",
        /*$app*/
        ctx[3].darkMode);
      }
    },
    d: function d(detaching) {
      if (detaching) detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}

function create_fragment$1(ctx) {
  var aside;
  var section;
  var t0;
  var t1;
  var aside_transition;
  var current;
  var mounted;
  var dispose;
  var default_slot_template =
  /*$$slots*/
  ctx[5]["default"];
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[4], null);
  var if_block0 =
  /*$app*/
  ctx[3].displayBranding && create_if_block_1(ctx);
  var if_block1 =
  /*closeable*/
  ctx[1] && create_if_block$1(ctx);
  return {
    c: function c() {
      aside = element("aside");
      section = element("section");
      if (default_slot) default_slot.c();
      t0 = space();
      if (if_block0) if_block0.c();
      t1 = space();
      if (if_block1) if_block1.c();
      attr(section, "class", "bn-onboard-custom bn-onboard-modal-content svelte-rntogh");
      toggle_class(section, "bn-onboard-dark-mode",
      /*$app*/
      ctx[3].darkMode);
      toggle_class(section, "no-padding-branding",
      /*$app*/
      ctx[3].displayBranding);
      attr(aside, "class", "bn-onboard-custom bn-onboard-modal svelte-rntogh");
    },
    m: function m(target, anchor) {
      insert(target, aside, anchor);
      append(aside, section);

      if (default_slot) {
        default_slot.m(section, null);
      }

      append(section, t0);
      if (if_block0) if_block0.m(section, null);
      append(section, t1);
      if (if_block1) if_block1.m(section, null);
      current = true;

      if (!mounted) {
        dispose = [listen(section, "click", click_handler), listen(aside, "click", function () {
          if (is_function(
          /*closeModal*/
          ctx[0]))
            /*closeModal*/
            ctx[0].apply(this, arguments);
        })];
        mounted = true;
      }
    },
    p: function p(new_ctx, _ref12) {
      var _ref13 = _slicedToArray(_ref12, 1),
          dirty = _ref13[0];

      ctx = new_ctx;

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        16) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[4], dirty, null, null);
        }
      }

      if (
      /*$app*/
      ctx[3].displayBranding) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*$app*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(section, t1);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, function () {
          if_block0 = null;
        });
        check_outros();
      }

      if (
      /*closeable*/
      ctx[1]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block$1(ctx);
          if_block1.c();
          if_block1.m(section, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      if (dirty &
      /*$app*/
      8) {
        toggle_class(section, "bn-onboard-dark-mode",
        /*$app*/
        ctx[3].darkMode);
      }

      if (dirty &
      /*$app*/
      8) {
        toggle_class(section, "no-padding-branding",
        /*$app*/
        ctx[3].displayBranding);
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(default_slot, local);
      transition_in(if_block0);
      add_render_callback(function () {
        if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fade, {}, true);
        aside_transition.run(1);
      });
      current = true;
    },
    o: function o(local) {
      transition_out(default_slot, local);
      transition_out(if_block0);
      if (!aside_transition) aside_transition = create_bidirectional_transition(aside, fade, {}, false);
      aside_transition.run(0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(aside);
      if (default_slot) default_slot.d(detaching);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      if (detaching && aside_transition) aside_transition.end();
      mounted = false;
      run_all(dispose);
    }
  };
}

var click_handler = function click_handler(e) {
  return e.stopPropagation();
};

function instance$1($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(3, $app = $$value);
  });
  var closeModal = $$props.closeModal;
  var _$$props$closeable = $$props.closeable,
      closeable = _$$props$closeable === void 0 ? true : _$$props$closeable;
  var closeHovered;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  var mouseenter_handler = function mouseenter_handler() {
    return $$invalidate(2, closeHovered = true);
  };

  var mouseleave_handler = function mouseleave_handler() {
    return $$invalidate(2, closeHovered = false);
  };

  $$self.$set = function ($$props) {
    if ("closeModal" in $$props) $$invalidate(0, closeModal = $$props.closeModal);
    if ("closeable" in $$props) $$invalidate(1, closeable = $$props.closeable);
    if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
  };

  return [closeModal, closeable, closeHovered, $app, $$scope, $$slots, mouseenter_handler, mouseleave_handler];
}

var Modal = /*#__PURE__*/function (_SvelteComponent2) {
  _inherits(Modal, _SvelteComponent2);

  var _super2 = _createSuper(Modal);

  function Modal(options) {
    var _this2;

    _classCallCheck(this, Modal);

    _this2 = _super2.call(this);
    if (!document.getElementById("svelte-rntogh-style")) add_css$1();
    init(_assertThisInitialized(_this2), options, instance$1, create_fragment$1, safe_not_equal, {
      closeModal: 0,
      closeable: 1
    });
    return _this2;
  }

  return Modal;
}(SvelteComponent);
/* src/components/ModalHeader.svelte generated by Svelte v3.24.0 */


function add_css$2() {
  var style = element("style");
  style.id = "svelte-8i8o6j-style";
  style.textContent = "header.svelte-8i8o6j{display:flex;align-items:center;font-size:inherit;font-family:inherit;margin-bottom:1em}div.svelte-8i8o6j{display:flex;justify-content:center;align-items:center;font-size:inherit;font-family:inherit;padding:0.6em;border-radius:30px;background:#eeeeee}h3.svelte-8i8o6j{font-weight:bold;font-size:1.33em;font-family:inherit;margin:0 0 0 0.5em}";
  append(document.head, style);
}

function create_fragment$2(ctx) {
  var header;
  var div;
  var t0;
  var h3;
  var t1;
  return {
    c: function c() {
      header = element("header");
      div = element("div");
      t0 = space();
      h3 = element("h3");
      t1 = text(
      /*heading*/
      ctx[0]);
      attr(div, "class", "bn-onboard-custom bn-onboard-modal-content-header-icon svelte-8i8o6j");
      toggle_class(div, "bn-onboard-dark-mode-background",
      /*$app*/
      ctx[2].darkMode);
      attr(h3, "class", "bn-onboard-custom bn-onboard-modal-content-header-heading svelte-8i8o6j");
      attr(header, "class", "bn-onboard-custom bn-onboard-modal-content-header svelte-8i8o6j");
    },
    m: function m(target, anchor) {
      insert(target, header, anchor);
      append(header, div);
      div.innerHTML =
      /*icon*/
      ctx[1];
      append(header, t0);
      append(header, h3);
      append(h3, t1);
    },
    p: function p(ctx, _ref14) {
      var _ref15 = _slicedToArray(_ref14, 1),
          dirty = _ref15[0];

      if (dirty &
      /*icon*/
      2) div.innerHTML =
      /*icon*/
      ctx[1];

      if (dirty &
      /*$app*/
      4) {
        toggle_class(div, "bn-onboard-dark-mode-background",
        /*$app*/
        ctx[2].darkMode);
      }

      if (dirty &
      /*heading*/
      1) set_data(t1,
      /*heading*/
      ctx[0]);
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(header);
    }
  };
}

function instance$2($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(2, $app = $$value);
  });
  var heading = $$props.heading;
  var icon = $$props.icon;

  $$self.$set = function ($$props) {
    if ("heading" in $$props) $$invalidate(0, heading = $$props.heading);
    if ("icon" in $$props) $$invalidate(1, icon = $$props.icon);
  };

  return [heading, icon, $app];
}

var ModalHeader = /*#__PURE__*/function (_SvelteComponent3) {
  _inherits(ModalHeader, _SvelteComponent3);

  var _super3 = _createSuper(ModalHeader);

  function ModalHeader(options) {
    var _this3;

    _classCallCheck(this, ModalHeader);

    _this3 = _super3.call(this);
    if (!document.getElementById("svelte-8i8o6j-style")) add_css$2();
    init(_assertThisInitialized(_this3), options, instance$2, create_fragment$2, safe_not_equal, {
      heading: 0,
      icon: 1
    });
    return _this3;
  }

  return ModalHeader;
}(SvelteComponent);
/* src/elements/Button.svelte generated by Svelte v3.24.0 */


function add_css$3() {
  var style = element("style");
  style.id = "svelte-r5g1v4-style";
  style.textContent = "button.svelte-r5g1v4{background:inherit;font-size:0.889em;font-family:inherit;border:1px solid #4a90e2;border-radius:40px;padding:0.55em 1.4em;cursor:pointer;color:#4a90e2;font-family:inherit;transition:background 150ms ease-in-out;line-height:1.15}button.svelte-r5g1v4:focus{outline:none}button.svelte-r5g1v4:hover{background:#ecf3fc}.bn-onboard-prepare-button-right.svelte-r5g1v4{position:absolute;right:0}.bn-onboard-prepare-button-left.svelte-r5g1v4{position:absolute;left:0}";
  append(document.head, style);
}

function create_fragment$3(ctx) {
  var button;
  var current;
  var mounted;
  var dispose;
  var default_slot_template =
  /*$$slots*/
  ctx[4]["default"];
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[3], null);
  return {
    c: function c() {
      button = element("button");
      if (default_slot) default_slot.c();
      attr(button, "class", "bn-onboard-custom bn-onboard-prepare-button svelte-r5g1v4");
      toggle_class(button, "bn-onboard-prepare-button-right",
      /*position*/
      ctx[1] === "right");
      toggle_class(button, "bn-onboard-prepare-button-left",
      /*position*/
      ctx[1] === "left");
      toggle_class(button, "bn-onboard-prepare-button-center",
      /*position*/
      ctx[1] !== "left" &&
      /*position*/
      ctx[1] !== "right");
      toggle_class(button, "bn-onboard-dark-mode-link",
      /*$app*/
      ctx[2].darkMode);
      toggle_class(button, "bn-onboard-dark-mode-background-hover",
      /*$app*/
      ctx[2].darkMode);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);

      if (default_slot) {
        default_slot.m(button, null);
      }

      current = true;

      if (!mounted) {
        dispose = listen(button, "click", function () {
          if (is_function(
          /*onclick*/
          ctx[0]))
            /*onclick*/
            ctx[0].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p: function p(new_ctx, _ref16) {
      var _ref17 = _slicedToArray(_ref16, 1),
          dirty = _ref17[0];

      ctx = new_ctx;

      if (default_slot) {
        if (default_slot.p && dirty &
        /*$$scope*/
        8) {
          update_slot(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[3], dirty, null, null);
        }
      }

      if (dirty &
      /*position*/
      2) {
        toggle_class(button, "bn-onboard-prepare-button-right",
        /*position*/
        ctx[1] === "right");
      }

      if (dirty &
      /*position*/
      2) {
        toggle_class(button, "bn-onboard-prepare-button-left",
        /*position*/
        ctx[1] === "left");
      }

      if (dirty &
      /*position*/
      2) {
        toggle_class(button, "bn-onboard-prepare-button-center",
        /*position*/
        ctx[1] !== "left" &&
        /*position*/
        ctx[1] !== "right");
      }

      if (dirty &
      /*$app*/
      4) {
        toggle_class(button, "bn-onboard-dark-mode-link",
        /*$app*/
        ctx[2].darkMode);
      }

      if (dirty &
      /*$app*/
      4) {
        toggle_class(button, "bn-onboard-dark-mode-background-hover",
        /*$app*/
        ctx[2].darkMode);
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(button);
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}

function instance$3($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(2, $app = $$value);
  });
  var _$$props$onclick = $$props.onclick,
      onclick = _$$props$onclick === void 0 ? function () {} : _$$props$onclick;
  var position = $$props.position;
  var _$$props$$$slots2 = $$props.$$slots,
      $$slots = _$$props$$$slots2 === void 0 ? {} : _$$props$$$slots2,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ("onclick" in $$props) $$invalidate(0, onclick = $$props.onclick);
    if ("position" in $$props) $$invalidate(1, position = $$props.position);
    if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
  };

  return [onclick, position, $app, $$scope, $$slots];
}

var Button = /*#__PURE__*/function (_SvelteComponent4) {
  _inherits(Button, _SvelteComponent4);

  var _super4 = _createSuper(Button);

  function Button(options) {
    var _this4;

    _classCallCheck(this, Button);

    _this4 = _super4.call(this);
    if (!document.getElementById("svelte-r5g1v4-style")) add_css$3();
    init(_assertThisInitialized(_this4), options, instance$3, create_fragment$3, safe_not_equal, {
      onclick: 0,
      position: 1
    });
    return _this4;
  }

  return Button;
}(SvelteComponent);
/* src/elements/Spinner.svelte generated by Svelte v3.24.0 */


function add_css$4() {
  var style = element("style");
  style.id = "svelte-16ghk2h-style";
  style.textContent = ".bn-onboard-loading-container.svelte-16ghk2h{display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:inherit;font-size:inherit;color:inherit}span.svelte-16ghk2h{font-family:inherit;font-size:0.889em;margin-top:1rem}.bn-onboard-loading{display:inline-block;position:relative;width:2em;height:2em}.bn-onboard-loading div{box-sizing:border-box;font-size:inherit;display:block;position:absolute;width:2em;height:2em;border:3px solid;border-radius:50%;animation:bn-onboard-loading 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;border-color:currentColor transparent transparent transparent}.bn-onboard-loading .bn-onboard-loading-first{animation-delay:-0.45s}.bn-onboard-loading .bn-onboard-loading-second{animation-delay:-0.3s}.bn-onboard-loading .bn-onboard-loading-third{animation-delay:-0.15s}@keyframes bn-onboard-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}";
  append(document.head, style);
} // (65:2) {#if description}


function create_if_block$2(ctx) {
  var span;
  var t;
  return {
    c: function c() {
      span = element("span");
      t = text(
      /*description*/
      ctx[0]);
      attr(span, "class", "svelte-16ghk2h");
    },
    m: function m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*description*/
      1) set_data(t,
      /*description*/
      ctx[0]);
    },
    d: function d(detaching) {
      if (detaching) detach(span);
    }
  };
}

function create_fragment$4(ctx) {
  var div4;
  var div3;
  var t2;
  var if_block =
  /*description*/
  ctx[0] && create_if_block$2(ctx);
  return {
    c: function c() {
      div4 = element("div");
      div3 = element("div");
      div3.innerHTML = "<div class=\"bn-onboard-loading-first\"></div> \n    <div class=\"bn-onboard-loading-second\"></div> \n    <div class=\"bn-onboard-loading-third\"></div>";
      t2 = space();
      if (if_block) if_block.c();
      attr(div3, "class", "bn-onboard-custom bn-onboard-loading");
      attr(div4, "class", "bn-onboard-loading-container svelte-16ghk2h");
    },
    m: function m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div4, t2);
      if (if_block) if_block.m(div4, null);
    },
    p: function p(ctx, _ref18) {
      var _ref19 = _slicedToArray(_ref18, 1),
          dirty = _ref19[0];

      if (
      /*description*/
      ctx[0]) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block$2(ctx);
          if_block.c();
          if_block.m(div4, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(div4);
      if (if_block) if_block.d();
    }
  };
}

function instance$4($$self, $$props, $$invalidate) {
  var description = $$props.description;

  $$self.$set = function ($$props) {
    if ("description" in $$props) $$invalidate(0, description = $$props.description);
  };

  return [description];
}

var Spinner = /*#__PURE__*/function (_SvelteComponent5) {
  _inherits(Spinner, _SvelteComponent5);

  var _super5 = _createSuper(Spinner);

  function Spinner(options) {
    var _this5;

    _classCallCheck(this, Spinner);

    _this5 = _super5.call(this);
    if (!document.getElementById("svelte-16ghk2h-style")) add_css$4();
    init(_assertThisInitialized(_this5), options, instance$4, create_fragment$4, safe_not_equal, {
      description: 0
    });
    return _this5;
  }

  return Spinner;
}(SvelteComponent);
/* src/elements/IconButton.svelte generated by Svelte v3.24.0 */


function add_css$5() {
  var style = element("style");
  style.id = "svelte-1skxsnk-style";
  style.textContent = "button.svelte-1skxsnk{display:flex;align-items:center;border:none;margin:0.33em 0;background:inherit;font-size:inherit;width:18em;padding:0.625em 1.25em;transition:box-shadow 150ms ease-in-out, background 200ms ease-in-out;border-radius:40px;cursor:pointer;color:inherit;line-height:1.15;font-family:inherit}button.svelte-1skxsnk:hover{box-shadow:0 2px 10px 0 rgba(0, 0, 0, 0.1)}button.svelte-1skxsnk:focus{outline:none}div.svelte-1skxsnk{display:flex;justify-content:center;align-items:center;text-align:center;height:40px;width:40px;line-height:40px;font-family:inherit}img.svelte-1skxsnk{max-height:100%;max-width:100%;vertical-align:middle}span.svelte-1skxsnk{width:100%;display:flex;justify-content:space-between;align-items:center;font-size:inherit;margin-left:0.66em;font-weight:bold;text-align:left;font-family:inherit}i.svelte-1skxsnk{font-size:0.8rem;font-weight:lighter;color:inherit;text-decoration:underline}@media only screen and (max-width: 450px){button.svelte-1skxsnk{width:100%}}.bn-onboard-selected-wallet.svelte-1skxsnk{background:#c3c3c3}";
  append(document.head, style);
} // (96:4) {:else}


function create_else_block$1(ctx) {
  var img;
  var img_src_value;
  return {
    c: function c() {
      img = element("img");
      if (img.src !== (img_src_value =
      /*iconSrc*/
      ctx[0])) attr(img, "src", img_src_value);
      attr(img, "srcset",
      /*iconSrcSet*/
      ctx[1]);
      attr(img, "alt",
      /*text*/
      ctx[4]);
      attr(img, "class", "svelte-1skxsnk");
    },
    m: function m(target, anchor) {
      insert(target, img, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*iconSrc*/
      1 && img.src !== (img_src_value =
      /*iconSrc*/
      ctx[0])) {
        attr(img, "src", img_src_value);
      }

      if (dirty &
      /*iconSrcSet*/
      2) {
        attr(img, "srcset",
        /*iconSrcSet*/
        ctx[1]);
      }

      if (dirty &
      /*text*/
      16) {
        attr(img, "alt",
        /*text*/
        ctx[4]);
      }
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(img);
    }
  };
} // (94:18) 


function create_if_block_2(ctx) {
  var html_tag;
  var html_anchor;
  return {
    c: function c() {
      html_anchor = empty();
      html_tag = new HtmlTag(html_anchor);
    },
    m: function m(target, anchor) {
      html_tag.m(
      /*svg*/
      ctx[2], target, anchor);
      insert(target, html_anchor, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*svg*/
      4) html_tag.p(
      /*svg*/
      ctx[2]);
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
} // (92:4) {#if loadingWallet === text}


function create_if_block_1$1(ctx) {
  var spinner;
  var current;
  spinner = new Spinner({});
  return {
    c: function c() {
      create_component(spinner.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(spinner, target, anchor);
      current = true;
    },
    p: noop,
    i: function i(local) {
      if (current) return;
      transition_in(spinner.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(spinner.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(spinner, detaching);
    }
  };
} // (102:4) {#if currentlySelected}


function create_if_block$3(ctx) {
  var i;
  return {
    c: function c() {
      i = element("i");
      i.textContent = "selected";
      attr(i, "class", "svelte-1skxsnk");
    },
    m: function m(target, anchor) {
      insert(target, i, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(i);
    }
  };
}

function create_fragment$5(ctx) {
  var button;
  var div;
  var current_block_type_index;
  var if_block0;
  var t0;
  var span;
  var t1;
  var t2;
  var current;
  var mounted;
  var dispose;
  var if_block_creators = [create_if_block_1$1, create_if_block_2, create_else_block$1];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*loadingWallet*/
    ctx[5] ===
    /*text*/
    ctx[4]) return 0;
    if (
    /*svg*/
    ctx[2]) return 1;
    return 2;
  }

  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  var if_block1 =
  /*currentlySelected*/
  ctx[6] && create_if_block$3();
  return {
    c: function c() {
      button = element("button");
      div = element("div");
      if_block0.c();
      t0 = space();
      span = element("span");
      t1 = text(
      /*text*/
      ctx[4]);
      t2 = space();
      if (if_block1) if_block1.c();
      attr(div, "class", "svelte-1skxsnk");
      attr(span, "class", "svelte-1skxsnk");
      attr(button, "class", "bn-onboard-custom bn-onboard-icon-button svelte-1skxsnk");
      toggle_class(button, "bn-onboard-dark-mode-background-hover",
      /*$app*/
      ctx[7].darkMode);
      toggle_class(button, "bn-onboard-selected-wallet",
      /*currentlySelected*/
      ctx[6]);
    },
    m: function m(target, anchor) {
      insert(target, button, anchor);
      append(button, div);
      if_blocks[current_block_type_index].m(div, null);
      append(button, t0);
      append(button, span);
      append(span, t1);
      append(span, t2);
      if (if_block1) if_block1.m(span, null);
      current = true;

      if (!mounted) {
        dispose = listen(button, "click", function () {
          if (is_function(
          /*onclick*/
          ctx[3]))
            /*onclick*/
            ctx[3].apply(this, arguments);
        });
        mounted = true;
      }
    },
    p: function p(new_ctx, _ref20) {
      var _ref21 = _slicedToArray(_ref20, 1),
          dirty = _ref21[0];

      ctx = new_ctx;
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, function () {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];

        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block0.c();
        }

        transition_in(if_block0, 1);
        if_block0.m(div, null);
      }

      if (!current || dirty &
      /*text*/
      16) set_data(t1,
      /*text*/
      ctx[4]);

      if (
      /*currentlySelected*/
      ctx[6]) {
        if (if_block1) ;else {
          if_block1 = create_if_block$3();
          if_block1.c();
          if_block1.m(span, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      if (dirty &
      /*$app*/
      128) {
        toggle_class(button, "bn-onboard-dark-mode-background-hover",
        /*$app*/
        ctx[7].darkMode);
      }

      if (dirty &
      /*currentlySelected*/
      64) {
        toggle_class(button, "bn-onboard-selected-wallet",
        /*currentlySelected*/
        ctx[6]);
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(if_block0);
      current = true;
    },
    o: function o(local) {
      transition_out(if_block0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(button);
      if_blocks[current_block_type_index].d();
      if (if_block1) if_block1.d();
      mounted = false;
      dispose();
    }
  };
}

function instance$5($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(7, $app = $$value);
  });
  var iconSrc = $$props.iconSrc;
  var iconSrcSet = $$props.iconSrcSet;
  var svg = $$props.svg;
  var _$$props$onclick2 = $$props.onclick,
      onclick = _$$props$onclick2 === void 0 ? function () {} : _$$props$onclick2;
  var text = $$props.text;
  var loadingWallet = $$props.loadingWallet;
  var _$$props$currentlySel = $$props.currentlySelected,
      currentlySelected = _$$props$currentlySel === void 0 ? false : _$$props$currentlySel;

  $$self.$set = function ($$props) {
    if ("iconSrc" in $$props) $$invalidate(0, iconSrc = $$props.iconSrc);
    if ("iconSrcSet" in $$props) $$invalidate(1, iconSrcSet = $$props.iconSrcSet);
    if ("svg" in $$props) $$invalidate(2, svg = $$props.svg);
    if ("onclick" in $$props) $$invalidate(3, onclick = $$props.onclick);
    if ("text" in $$props) $$invalidate(4, text = $$props.text);
    if ("loadingWallet" in $$props) $$invalidate(5, loadingWallet = $$props.loadingWallet);
    if ("currentlySelected" in $$props) $$invalidate(6, currentlySelected = $$props.currentlySelected);
  };

  return [iconSrc, iconSrcSet, svg, onclick, text, loadingWallet, currentlySelected, $app];
}

var IconButton = /*#__PURE__*/function (_SvelteComponent6) {
  _inherits(IconButton, _SvelteComponent6);

  var _super6 = _createSuper(IconButton);

  function IconButton(options) {
    var _this6;

    _classCallCheck(this, IconButton);

    _this6 = _super6.call(this);
    if (!document.getElementById("svelte-1skxsnk-style")) add_css$5();
    init(_assertThisInitialized(_this6), options, instance$5, create_fragment$5, safe_not_equal, {
      iconSrc: 0,
      iconSrcSet: 1,
      svg: 2,
      onclick: 3,
      text: 4,
      loadingWallet: 5,
      currentlySelected: 6
    });
    return _this6;
  }

  return IconButton;
}(SvelteComponent);
/* src/components/Wallets.svelte generated by Svelte v3.24.0 */


function add_css$6() {
  var style = element("style");
  style.id = "svelte-q1527-style";
  style.textContent = "ul.svelte-q1527.svelte-q1527{display:flex;flex-flow:row wrap;align-items:center;list-style-type:none;margin:1.25em 0;padding:0;font-family:inherit;font-size:inherit;line-height:1.15;box-sizing:border-box}ul.svelte-q1527 li.svelte-q1527{padding:0 0.25em}div.svelte-q1527.svelte-q1527{width:100%;display:flex;font-size:inherit;font-family:inherit;justify-content:center;margin-top:1.25em}.svelte-q1527.svelte-q1527::-webkit-scrollbar{display:none}@media only screen and (max-width: 450px){ul.svelte-q1527 li.svelte-q1527{width:100%}ul.svelte-q1527.svelte-q1527{max-height:66vh;overflow-y:scroll}}";
  append(document.head, style);
}

function get_each_context(ctx, list, i) {
  var child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[11] = i;
  return child_ctx;
}

function get_each_context_1(ctx, list, i) {
  var child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[11] = i;
  return child_ctx;
} // (61:2) {#each modalData.primaryWallets as wallet, i (wallet.name)}


function create_each_block_1(key_1, ctx) {
  var li;
  var iconbutton;
  var current;

  function func() {
    var _ctx;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return (
      /*func*/
      (_ctx = ctx)[6].apply(_ctx, [
      /*wallet*/
      ctx[9]].concat(args))
    );
  }

  iconbutton = new IconButton({
    props: {
      onclick: func,
      iconSrc:
      /*wallet*/
      ctx[9].iconSrc,
      iconSrcSet:
      /*wallet*/
      ctx[9].iconSrcSet,
      svg:
      /*wallet*/
      ctx[9].svg,
      text:
      /*wallet*/
      ctx[9].name,
      currentlySelected:
      /*wallet*/
      ctx[9].name ===
      /*selectedWallet*/
      ctx[5].name,
      loadingWallet:
      /*loadingWallet*/
      ctx[2]
    }
  });
  return {
    key: key_1,
    first: null,
    c: function c() {
      li = element("li");
      create_component(iconbutton.$$.fragment);
      attr(li, "class", "svelte-q1527");
      this.first = li;
    },
    m: function m(target, anchor) {
      insert(target, li, anchor);
      mount_component(iconbutton, li, null);
      current = true;
    },
    p: function p(new_ctx, dirty) {
      ctx = new_ctx;
      var iconbutton_changes = {};
      if (dirty &
      /*handleWalletSelect, modalData*/
      3) iconbutton_changes.onclick = func;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.iconSrc =
      /*wallet*/
      ctx[9].iconSrc;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.iconSrcSet =
      /*wallet*/
      ctx[9].iconSrcSet;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.svg =
      /*wallet*/
      ctx[9].svg;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.text =
      /*wallet*/
      ctx[9].name;
      if (dirty &
      /*modalData, selectedWallet*/
      33) iconbutton_changes.currentlySelected =
      /*wallet*/
      ctx[9].name ===
      /*selectedWallet*/
      ctx[5].name;
      if (dirty &
      /*loadingWallet*/
      4) iconbutton_changes.loadingWallet =
      /*loadingWallet*/
      ctx[2];
      iconbutton.$set(iconbutton_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(iconbutton.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(iconbutton.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(li);
      destroy_component(iconbutton);
    }
  };
} // (74:2) {#if modalData.secondaryWallets && modalData.secondaryWallets.length && !showingAllWalletModules}


function create_if_block_1$2(ctx) {
  var div;
  var button;
  var current;
  button = new Button({
    props: {
      onclick:
      /*showAllWallets*/
      ctx[4],
      $$slots: {
        "default": [create_default_slot]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      div = element("div");
      create_component(button.$$.fragment);
      attr(div, "class", "svelte-q1527");
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      mount_component(button, div, null);
      current = true;
    },
    p: function p(ctx, dirty) {
      var button_changes = {};
      if (dirty &
      /*showAllWallets*/
      16) button_changes.onclick =
      /*showAllWallets*/
      ctx[4];

      if (dirty &
      /*$$scope*/
      8192) {
        button_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(div);
      destroy_component(button);
    }
  };
} // (76:6) <Button onclick={showAllWallets}>


function create_default_slot(ctx) {
  var t;
  return {
    c: function c() {
      t = text("Show More");
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
} // (80:2) {#if showingAllWalletModules}


function create_if_block$4(ctx) {
  var each_blocks = [];
  var each_1_lookup = new Map();
  var each_1_anchor;
  var current;
  var each_value =
  /*modalData*/
  ctx[0].secondaryWallets;

  var get_key = function get_key(ctx) {
    return (
      /*wallet*/
      ctx[9].name
    );
  };

  for (var i = 0; i < each_value.length; i += 1) {
    var child_ctx = get_each_context(ctx, each_value, i);
    var key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }

  return {
    c: function c() {
      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].c();
      }

      each_1_anchor = empty();
    },
    m: function m(target, anchor) {
      for (var _i4 = 0; _i4 < each_blocks.length; _i4 += 1) {
        each_blocks[_i4].m(target, anchor);
      }

      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*handleWalletSelect, modalData, selectedWallet, loadingWallet*/
      39) {
        var _each_value =
        /*modalData*/
        ctx[0].secondaryWallets;
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, _each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block, each_1_anchor, get_each_context);
        check_outros();
      }
    },
    i: function i(local) {
      if (current) return;

      for (var _i5 = 0; _i5 < each_value.length; _i5 += 1) {
        transition_in(each_blocks[_i5]);
      }

      current = true;
    },
    o: function o(local) {
      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
        transition_out(each_blocks[_i6]);
      }

      current = false;
    },
    d: function d(detaching) {
      for (var _i7 = 0; _i7 < each_blocks.length; _i7 += 1) {
        each_blocks[_i7].d(detaching);
      }

      if (detaching) detach(each_1_anchor);
    }
  };
} // (81:4) {#each modalData.secondaryWallets as wallet, i (wallet.name)}


function create_each_block(key_1, ctx) {
  var li;
  var iconbutton;
  var t;
  var current;

  function func_1() {
    var _ctx2;

    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return (
      /*func_1*/
      (_ctx2 = ctx)[7].apply(_ctx2, [
      /*wallet*/
      ctx[9]].concat(args))
    );
  }

  iconbutton = new IconButton({
    props: {
      onclick: func_1,
      iconSrc:
      /*wallet*/
      ctx[9].iconSrc,
      iconSrcSet:
      /*wallet*/
      ctx[9].iconSrcSet,
      svg:
      /*wallet*/
      ctx[9].svg,
      text:
      /*wallet*/
      ctx[9].name,
      currentlySelected:
      /*wallet*/
      ctx[9].name ===
      /*selectedWallet*/
      ctx[5].name,
      loadingWallet:
      /*loadingWallet*/
      ctx[2]
    }
  });
  return {
    key: key_1,
    first: null,
    c: function c() {
      li = element("li");
      create_component(iconbutton.$$.fragment);
      t = space();
      attr(li, "class", "svelte-q1527");
      this.first = li;
    },
    m: function m(target, anchor) {
      insert(target, li, anchor);
      mount_component(iconbutton, li, null);
      append(li, t);
      current = true;
    },
    p: function p(new_ctx, dirty) {
      ctx = new_ctx;
      var iconbutton_changes = {};
      if (dirty &
      /*handleWalletSelect, modalData*/
      3) iconbutton_changes.onclick = func_1;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.iconSrc =
      /*wallet*/
      ctx[9].iconSrc;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.iconSrcSet =
      /*wallet*/
      ctx[9].iconSrcSet;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.svg =
      /*wallet*/
      ctx[9].svg;
      if (dirty &
      /*modalData*/
      1) iconbutton_changes.text =
      /*wallet*/
      ctx[9].name;
      if (dirty &
      /*modalData, selectedWallet*/
      33) iconbutton_changes.currentlySelected =
      /*wallet*/
      ctx[9].name ===
      /*selectedWallet*/
      ctx[5].name;
      if (dirty &
      /*loadingWallet*/
      4) iconbutton_changes.loadingWallet =
      /*loadingWallet*/
      ctx[2];
      iconbutton.$set(iconbutton_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(iconbutton.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(iconbutton.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(li);
      destroy_component(iconbutton);
    }
  };
}

function create_fragment$6(ctx) {
  var ul;
  var each_blocks = [];
  var each_1_lookup = new Map();
  var t0;
  var t1;
  var current;
  var each_value_1 =
  /*modalData*/
  ctx[0].primaryWallets;

  var get_key = function get_key(ctx) {
    return (
      /*wallet*/
      ctx[9].name
    );
  };

  for (var i = 0; i < each_value_1.length; i += 1) {
    var child_ctx = get_each_context_1(ctx, each_value_1, i);
    var key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
  }

  var if_block0 =
  /*modalData*/
  ctx[0].secondaryWallets &&
  /*modalData*/
  ctx[0].secondaryWallets.length && !
  /*showingAllWalletModules*/
  ctx[3] && create_if_block_1$2(ctx);
  var if_block1 =
  /*showingAllWalletModules*/
  ctx[3] && create_if_block$4(ctx);
  return {
    c: function c() {
      ul = element("ul");

      for (var _i8 = 0; _i8 < each_blocks.length; _i8 += 1) {
        each_blocks[_i8].c();
      }

      t0 = space();
      if (if_block0) if_block0.c();
      t1 = space();
      if (if_block1) if_block1.c();
      attr(ul, "class", "bn-onboard-custom bn-onboard-modal-select-wallets svelte-q1527");
    },
    m: function m(target, anchor) {
      insert(target, ul, anchor);

      for (var _i9 = 0; _i9 < each_blocks.length; _i9 += 1) {
        each_blocks[_i9].m(ul, null);
      }

      append(ul, t0);
      if (if_block0) if_block0.m(ul, null);
      append(ul, t1);
      if (if_block1) if_block1.m(ul, null);
      current = true;
    },
    p: function p(ctx, _ref22) {
      var _ref23 = _slicedToArray(_ref22, 1),
          dirty = _ref23[0];

      if (dirty &
      /*handleWalletSelect, modalData, selectedWallet, loadingWallet*/
      39) {
        var _each_value_ =
        /*modalData*/
        ctx[0].primaryWallets;
        group_outros();
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, _each_value_, each_1_lookup, ul, outro_and_destroy_block, create_each_block_1, t0, get_each_context_1);
        check_outros();
      }

      if (
      /*modalData*/
      ctx[0].secondaryWallets &&
      /*modalData*/
      ctx[0].secondaryWallets.length && !
      /*showingAllWalletModules*/
      ctx[3]) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*modalData, showingAllWalletModules*/
          9) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$2(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(ul, t1);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, function () {
          if_block0 = null;
        });
        check_outros();
      }

      if (
      /*showingAllWalletModules*/
      ctx[3]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);

          if (dirty &
          /*showingAllWalletModules*/
          8) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$4(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(ul, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, function () {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i: function i(local) {
      if (current) return;

      for (var _i10 = 0; _i10 < each_value_1.length; _i10 += 1) {
        transition_in(each_blocks[_i10]);
      }

      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o: function o(local) {
      for (var _i11 = 0; _i11 < each_blocks.length; _i11 += 1) {
        transition_out(each_blocks[_i11]);
      }

      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(ul);

      for (var _i12 = 0; _i12 < each_blocks.length; _i12 += 1) {
        each_blocks[_i12].d();
      }

      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
    }
  };
}

function instance$6($$self, $$props, $$invalidate) {
  var modalData = $$props.modalData;
  var handleWalletSelect = $$props.handleWalletSelect;
  var loadingWallet = $$props.loadingWallet;
  var _$$props$showingAllWa = $$props.showingAllWalletModules,
      showingAllWalletModules = _$$props$showingAllWa === void 0 ? false : _$$props$showingAllWa;
  var showAllWallets = $$props.showAllWallets;
  var selectedWallet;
  var unsubscribe = wallet.subscribe(function (wallet) {
    return $$invalidate(5, selectedWallet = wallet);
  });
  onDestroy(function () {
    return unsubscribe();
  });

  var func = function func(wallet) {
    return handleWalletSelect(wallet);
  };

  var func_1 = function func_1(wallet) {
    return handleWalletSelect(wallet);
  };

  $$self.$set = function ($$props) {
    if ("modalData" in $$props) $$invalidate(0, modalData = $$props.modalData);
    if ("handleWalletSelect" in $$props) $$invalidate(1, handleWalletSelect = $$props.handleWalletSelect);
    if ("loadingWallet" in $$props) $$invalidate(2, loadingWallet = $$props.loadingWallet);
    if ("showingAllWalletModules" in $$props) $$invalidate(3, showingAllWalletModules = $$props.showingAllWalletModules);
    if ("showAllWallets" in $$props) $$invalidate(4, showAllWallets = $$props.showAllWallets);
  };

  return [modalData, handleWalletSelect, loadingWallet, showingAllWalletModules, showAllWallets, selectedWallet, func, func_1];
}

var Wallets = /*#__PURE__*/function (_SvelteComponent7) {
  _inherits(Wallets, _SvelteComponent7);

  var _super7 = _createSuper(Wallets);

  function Wallets(options) {
    var _this7;

    _classCallCheck(this, Wallets);

    _this7 = _super7.call(this);
    if (!document.getElementById("svelte-q1527-style")) add_css$6();
    init(_assertThisInitialized(_this7), options, instance$6, create_fragment$6, safe_not_equal, {
      modalData: 0,
      handleWalletSelect: 1,
      loadingWallet: 2,
      showingAllWalletModules: 3,
      showAllWallets: 4
    });
    return _this7;
  }

  return Wallets;
}(SvelteComponent);
/* src/elements/IconDisplay.svelte generated by Svelte v3.24.0 */


function add_css$7() {
  var style = element("style");
  style.id = "svelte-18zts4b-style";
  style.textContent = "div.svelte-18zts4b{display:flex;align-items:center;border:none;margin:0;font-size:inherit;font-family:inherit;background:inherit;padding:0;width:18em;border-radius:40px;color:inherit}img.svelte-18zts4b{width:auto;height:3em}span.svelte-18zts4b{margin-left:0.66em;font-weight:bold;font-size:inherit;font-family:inherit;opacity:0.7;text-align:left}";
  append(document.head, style);
} // (41:2) {:else}


function create_else_block$2(ctx) {
  var img;
  var img_src_value;
  return {
    c: function c() {
      img = element("img");
      if (img.src !== (img_src_value =
      /*iconSrc*/
      ctx[0])) attr(img, "src", img_src_value);
      attr(img, "srcset",
      /*iconSrcSet*/
      ctx[1]);
      attr(img, "alt",
      /*text*/
      ctx[2]);
      attr(img, "class", "svelte-18zts4b");
    },
    m: function m(target, anchor) {
      insert(target, img, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*iconSrc*/
      1 && img.src !== (img_src_value =
      /*iconSrc*/
      ctx[0])) {
        attr(img, "src", img_src_value);
      }

      if (dirty &
      /*iconSrcSet*/
      2) {
        attr(img, "srcset",
        /*iconSrcSet*/
        ctx[1]);
      }

      if (dirty &
      /*text*/
      4) {
        attr(img, "alt",
        /*text*/
        ctx[2]);
      }
    },
    d: function d(detaching) {
      if (detaching) detach(img);
    }
  };
} // (39:2) {#if svg}


function create_if_block$5(ctx) {
  var html_tag;
  var html_anchor;
  return {
    c: function c() {
      html_anchor = empty();
      html_tag = new HtmlTag(html_anchor);
    },
    m: function m(target, anchor) {
      html_tag.m(
      /*svg*/
      ctx[3], target, anchor);
      insert(target, html_anchor, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*svg*/
      8) html_tag.p(
      /*svg*/
      ctx[3]);
    },
    d: function d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
}

function create_fragment$7(ctx) {
  var div;
  var t0;
  var span;
  var t1;

  function select_block_type(ctx, dirty) {
    if (
    /*svg*/
    ctx[3]) return create_if_block$5;
    return create_else_block$2;
  }

  var current_block_type = select_block_type(ctx);
  var if_block = current_block_type(ctx);
  return {
    c: function c() {
      div = element("div");
      if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
      /*text*/
      ctx[2]);
      attr(span, "class", "svelte-18zts4b");
      attr(div, "class", "bn-onboard-custom bn-onboard-icon-display svelte-18zts4b");
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
      if_block.m(div, null);
      append(div, t0);
      append(div, span);
      append(span, t1);
    },
    p: function p(ctx, _ref24) {
      var _ref25 = _slicedToArray(_ref24, 1),
          dirty = _ref25[0];

      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(div, t0);
        }
      }

      if (dirty &
      /*text*/
      4) set_data(t1,
      /*text*/
      ctx[2]);
    },
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(div);
      if_block.d();
    }
  };
}

function instance$7($$self, $$props, $$invalidate) {
  var iconSrc = $$props.iconSrc;
  var iconSrcSet = $$props.iconSrcSet;
  var text = $$props.text;
  var svg = $$props.svg;

  $$self.$set = function ($$props) {
    if ("iconSrc" in $$props) $$invalidate(0, iconSrc = $$props.iconSrc);
    if ("iconSrcSet" in $$props) $$invalidate(1, iconSrcSet = $$props.iconSrcSet);
    if ("text" in $$props) $$invalidate(2, text = $$props.text);
    if ("svg" in $$props) $$invalidate(3, svg = $$props.svg);
  };

  return [iconSrc, iconSrcSet, text, svg];
}

var IconDisplay = /*#__PURE__*/function (_SvelteComponent8) {
  _inherits(IconDisplay, _SvelteComponent8);

  var _super8 = _createSuper(IconDisplay);

  function IconDisplay(options) {
    var _this8;

    _classCallCheck(this, IconDisplay);

    _this8 = _super8.call(this);
    if (!document.getElementById("svelte-18zts4b-style")) add_css$7();
    init(_assertThisInitialized(_this8), options, instance$7, create_fragment$7, safe_not_equal, {
      iconSrc: 0,
      iconSrcSet: 1,
      text: 2,
      svg: 3
    });
    return _this8;
  }

  return IconDisplay;
}(SvelteComponent);
/* src/components/SelectedWallet.svelte generated by Svelte v3.24.0 */


function add_css$8() {
  var style = element("style");
  style.id = "svelte-mi6ahc-style";
  style.textContent = "section.svelte-mi6ahc{color:inherit;font-size:inherit;font-family:inherit;display:block}footer.svelte-mi6ahc{display:flex;font-size:inherit;font-family:inherit;justify-content:space-between}";
  append(document.head, style);
} // (33:2) {#if installMessage}


function create_if_block$6(ctx) {
  var html_tag;
  var html_anchor;
  return {
    c: function c() {
      html_anchor = empty();
      html_tag = new HtmlTag(html_anchor);
    },
    m: function m(target, anchor) {
      html_tag.m(
      /*installMessage*/
      ctx[2], target, anchor);
      insert(target, html_anchor, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*installMessage*/
      4) html_tag.p(
      /*installMessage*/
      ctx[2]);
    },
    d: function d(detaching) {
      if (detaching) detach(html_anchor);
      if (detaching) html_tag.d();
    }
  };
} // (42:6) <Button>


function create_default_slot_1(ctx) {
  var t0;
  var t1_value =
  /*selectedWalletModule*/
  ctx[0].name + "";
  var t1;
  return {
    c: function c() {
      t0 = text("Open or install ");
      t1 = text(t1_value);
    },
    m: function m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*selectedWalletModule*/
      1 && t1_value !== (t1_value =
      /*selectedWalletModule*/
      ctx[0].name + "")) set_data(t1, t1_value);
    },
    d: function d(detaching) {
      if (detaching) detach(t0);
      if (detaching) detach(t1);
    }
  };
} // (44:4) <Button onclick={onBack}>


function create_default_slot$1(ctx) {
  var t;
  return {
    c: function c() {
      t = text("Back");
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
}

function create_fragment$8(ctx) {
  var section;
  var icondisplay;
  var t0;
  var t1;
  var footer;
  var a;
  var button0;
  var a_href_value;
  var t2;
  var button1;
  var section_intro;
  var current;
  icondisplay = new IconDisplay({
    props: {
      iconSrc:
      /*selectedWalletModule*/
      ctx[0].iconSrc,
      iconSrcSet:
      /*selectedWalletModule*/
      ctx[0].iconSrcSet,
      svg:
      /*selectedWalletModule*/
      ctx[0].svg,
      text:
      /*selectedWalletModule*/
      ctx[0].name
    }
  });
  var if_block =
  /*installMessage*/
  ctx[2] && create_if_block$6(ctx);
  button0 = new Button({
    props: {
      $$slots: {
        "default": [create_default_slot_1]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  button1 = new Button({
    props: {
      onclick:
      /*onBack*/
      ctx[1],
      $$slots: {
        "default": [create_default_slot$1]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      section = element("section");
      create_component(icondisplay.$$.fragment);
      t0 = space();
      if (if_block) if_block.c();
      t1 = space();
      footer = element("footer");
      a = element("a");
      create_component(button0.$$.fragment);
      t2 = space();
      create_component(button1.$$.fragment);
      attr(a, "href", a_href_value =
      /*selectedWalletModule*/
      ctx[0].link);
      attr(a, "rel", "noreferrer noopener");
      attr(a, "target", "_blank");
      attr(footer, "class", "bn-onboard-custom bn-onboard-modal-selected-wallet-footer svelte-mi6ahc");
      attr(section, "class", "bn-onboard-custom bn-onboard-modal-selected-wallet svelte-mi6ahc");
    },
    m: function m(target, anchor) {
      insert(target, section, anchor);
      mount_component(icondisplay, section, null);
      append(section, t0);
      if (if_block) if_block.m(section, null);
      append(section, t1);
      append(section, footer);
      append(footer, a);
      mount_component(button0, a, null);
      append(footer, t2);
      mount_component(button1, footer, null);
      current = true;
    },
    p: function p(ctx, _ref26) {
      var _ref27 = _slicedToArray(_ref26, 1),
          dirty = _ref27[0];

      var icondisplay_changes = {};
      if (dirty &
      /*selectedWalletModule*/
      1) icondisplay_changes.iconSrc =
      /*selectedWalletModule*/
      ctx[0].iconSrc;
      if (dirty &
      /*selectedWalletModule*/
      1) icondisplay_changes.iconSrcSet =
      /*selectedWalletModule*/
      ctx[0].iconSrcSet;
      if (dirty &
      /*selectedWalletModule*/
      1) icondisplay_changes.svg =
      /*selectedWalletModule*/
      ctx[0].svg;
      if (dirty &
      /*selectedWalletModule*/
      1) icondisplay_changes.text =
      /*selectedWalletModule*/
      ctx[0].name;
      icondisplay.$set(icondisplay_changes);

      if (
      /*installMessage*/
      ctx[2]) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block$6(ctx);
          if_block.c();
          if_block.m(section, t1);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }

      var button0_changes = {};

      if (dirty &
      /*$$scope, selectedWalletModule*/
      9) {
        button0_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button0.$set(button0_changes);

      if (!current || dirty &
      /*selectedWalletModule*/
      1 && a_href_value !== (a_href_value =
      /*selectedWalletModule*/
      ctx[0].link)) {
        attr(a, "href", a_href_value);
      }

      var button1_changes = {};
      if (dirty &
      /*onBack*/
      2) button1_changes.onclick =
      /*onBack*/
      ctx[1];

      if (dirty &
      /*$$scope*/
      8) {
        button1_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button1.$set(button1_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(icondisplay.$$.fragment, local);
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);

      if (!section_intro) {
        add_render_callback(function () {
          section_intro = create_in_transition(section, fade, {});
          section_intro.start();
        });
      }

      current = true;
    },
    o: function o(local) {
      transition_out(icondisplay.$$.fragment, local);
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(section);
      destroy_component(icondisplay);
      if (if_block) if_block.d();
      destroy_component(button0);
      destroy_component(button1);
    }
  };
}

function instance$8($$self, $$props, $$invalidate) {
  var selectedWalletModule = $$props.selectedWalletModule;
  var onBack = $$props.onBack;
  var installMessage = $$props.installMessage;

  $$self.$set = function ($$props) {
    if ("selectedWalletModule" in $$props) $$invalidate(0, selectedWalletModule = $$props.selectedWalletModule);
    if ("onBack" in $$props) $$invalidate(1, onBack = $$props.onBack);
    if ("installMessage" in $$props) $$invalidate(2, installMessage = $$props.installMessage);
  };

  return [selectedWalletModule, onBack, installMessage];
}

var SelectedWallet = /*#__PURE__*/function (_SvelteComponent9) {
  _inherits(SelectedWallet, _SvelteComponent9);

  var _super9 = _createSuper(SelectedWallet);

  function SelectedWallet(options) {
    var _this9;

    _classCallCheck(this, SelectedWallet);

    _this9 = _super9.call(this);
    if (!document.getElementById("svelte-mi6ahc-style")) add_css$8();
    init(_assertThisInitialized(_this9), options, instance$8, create_fragment$8, safe_not_equal, {
      selectedWalletModule: 0,
      onBack: 1,
      installMessage: 2
    });
    return _this9;
  }

  return SelectedWallet;
}(SvelteComponent);

var walletIcon = "\n<svg\nheight=\"18\"\nviewBox=\"0 0 19 18\"\nwidth=\"19\"\nxmlns=\"http://www.w3.org/2000/svg\">\n<g fill=\"currentColor\" fill-rule=\"evenodd\">\n\t<path\n\t\td=\"m15.7721618.00006623h-13.27469839c-.86762065\n\t\t0-1.48592681.3078086-1.89741046.76113193-.40615823.44745064-.60839063\n\t\t1.04661988-.59978974\n\t\t1.64464107.00029187.005124.00040335.01025653.00033423.01538822v3.66899811c.06682404-.11685776.14162507-.22938827.22533894-.33628895.36778845-.46959466.90812952-.82116145\n\t\t1.61866132-.95623339v-.59093422c0-.55214353.17649657-1.05790163.47278173-1.43388645.29630745-.37596275.72292065-.62513272\n\t\t1.19969088-.62513272h11.23546239c.4765474 0 .9032497.24850764\n\t\t1.199624.62424961.2963743.37574196.4728709.88161045.4728709\n\t\t1.43476956v.4652895c.5235626-.11047728.9266682-.35445897\n\t\t1.2246022-.6733727.4116397-.44060653.6210469-1.03392515.6210469-1.63015804s-.2094072-1.18955151-.6210469-1.63018011c-.4116396-.44060653-1.0238627-.73834765-1.877468-.73834765z\" />\n\t<path\n\t\td=\"m14.6096047 2.57151734h-11.21914267c-.32073002\n\t\t0-.6185428.16561433-.84722564.45769739s-.37782286.70763901-.37782286\n\t\t1.16808814v.53953924c.06265527-.0036172.12640078-.00570319.19125878-.00616921.00518482-.00032924.01037961-.00047727.01557482-.00044383h.01326084\n\t\t13.24215593c.0706652 0\n\t\t.1395281-.00228571.2069226-.00630235v-.52671262c0-.46164746-.1491623-.87711464-.3777561-1.16884264-.2286161-.29175019-.5263622-.45694289-.8473147-.45694289z\" />\n\t<path\n\t\td=\"m18.2706767\n\t\t3.92481203c-.0857195.13278047-.1837832.25906993-.2945478.376829-.495466.52680184-1.2439236.87400468-2.2045296.87400468h-13.26144765c-.93286471\n\t\t0-1.53628777.33766369-1.93268731.8403655s-.57746434\n\t\t1.18877443-.57746434\n\t\t1.87212785v.41252951c.13725808.14817467.29229732.20450824.50016754.23211693.21170276.02811305.46814809.01403459.74212947.02170977h5.25979191c.94146564\n\t\t0 1.67588548.36084271 2.15878435.90341155.48289887.54259078.7188669\n\t\t1.25649138.7188669 1.96738768s-.23596803 1.4247969-.7188669\n\t\t1.9673877c-.48289887.5425689-1.21731871.9033896-2.15878435.9033896h-5.25979191c-.25038458\n\t\t0-.55749953-.0171046-.84908381-.0866198-.13520812-.0322576-.27003744-.0756114-.3932132-.1380653v1.5302318c0\n\t\t1.3201295 1.09561358 2.3983815 2.43697706\n\t\t2.3983815h13.39672254c1.3413635 0 2.4369771-1.078252\n\t\t2.4369771-2.3983815z\" />\n\t<path\n\t\td=\"m0\n\t\t8.79699248c.14260628.06959022.29864665.11050376.44557501.1299645.2753208.03649163.54484912.01335327.79368049.02057717.002302.00003506.00460441.00003506.00690641\n\t\t0h5.25640383c.82827939 0 1.4220972.30156492\n\t\t1.8240727.75248941.40199777.45094634.60569239 1.06221954.60569239\n\t\t1.67601014 0 .6137467-.20369462 1.2250637-.60569239\n\t\t1.6759882-.4019755.4509463-.99579331.7524894-1.8240727.7524894h-5.25640383c-.22831264\n\t\t0-.50846792-.0188259-.74493458-.075238-.23646666-.0563245-.41416197-.1517676-.48734767-.2599728-.00440013-.0047203-.00900883-.0092487-.01387966-.0135722v-4.65860448zm6.42601595\n\t\t1.42288912c-.62979799 0-1.14873693.5024111-1.14873693 1.1218933 0\n\t\t.6211677.51893894 1.128745 1.14873693 1.128745.62984256 0\n\t\t1.14178597-.5082122 1.14178597-1.128745\n\t\t0-.6188692-.51194341-1.1218933-1.14178597-1.1218933z\" />\n</g>\n</svg>\n\t";
/* src/views/WalletSelect.svelte generated by Svelte v3.24.0 */

function add_css$9() {
  var style = element("style");
  style.id = "svelte-rj3fpa-style";
  style.textContent = "p.svelte-rj3fpa.svelte-rj3fpa{font-size:0.889em;margin:1.6em 0 0 0;font-family:inherit}div.svelte-rj3fpa.svelte-rj3fpa{display:flex;font-size:inherit;font-family:inherit;justify-content:space-between}div.svelte-rj3fpa span.svelte-rj3fpa{color:#4a90e2;font-size:inherit;font-family:inherit;margin-top:0.66em;cursor:pointer}";
  append(document.head, style);
} // (180:0) {#if modalData}


function create_if_block$7(ctx) {
  var modal;
  var current;
  modal = new Modal({
    props: {
      closeModal:
      /*func_2*/
      ctx[15],
      $$slots: {
        "default": [create_default_slot$2]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(modal.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var modal_changes = {};

      if (dirty &
      /*$$scope, modalData, showWalletDefinition, loadingWallet, showingAllWalletModules, selectedWalletModule, walletAlreadyInstalled, installMessage*/
      33554559) {
        modal_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      modal.$set(modal_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(modal, detaching);
    }
  };
} // (210:4) {:else}


function create_else_block$3(ctx) {
  var selectedwallet;
  var current;
  selectedwallet = new SelectedWallet({
    props: {
      selectedWalletModule:
      /*selectedWalletModule*/
      ctx[4],
      onBack:
      /*func_1*/
      ctx[14],
      installMessage:
      /*installMessage*/
      ctx[3]
    }
  });
  return {
    c: function c() {
      create_component(selectedwallet.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(selectedwallet, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var selectedwallet_changes = {};
      if (dirty &
      /*selectedWalletModule*/
      16) selectedwallet_changes.selectedWalletModule =
      /*selectedWalletModule*/
      ctx[4];
      if (dirty &
      /*selectedWalletModule, walletAlreadyInstalled*/
      20) selectedwallet_changes.onBack =
      /*func_1*/
      ctx[14];
      if (dirty &
      /*installMessage*/
      8) selectedwallet_changes.installMessage =
      /*installMessage*/
      ctx[3];
      selectedwallet.$set(selectedwallet_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(selectedwallet.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(selectedwallet.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(selectedwallet, detaching);
    }
  };
} // (183:4) {#if !selectedWalletModule}


function create_if_block_1$3(ctx) {
  var _p;

  var raw_value =
  /*modalData*/
  ctx[0].description + "";
  var t0;
  var wallets_1;
  var t1;
  var div;
  var span;
  var t3;
  var t4;
  var if_block1_anchor;
  var current;
  var mounted;
  var dispose;
  wallets_1 = new Wallets({
    props: {
      modalData:
      /*modalData*/
      ctx[0],
      handleWalletSelect:
      /*handleWalletSelect*/
      ctx[9],
      loadingWallet:
      /*loadingWallet*/
      ctx[5],
      showingAllWalletModules:
      /*showingAllWalletModules*/
      ctx[6],
      showAllWallets:
      /*showAllWallets*/
      ctx[8]
    }
  });
  var if_block0 =
  /*mobileDevice*/
  ctx[7] && create_if_block_3(ctx);
  var if_block1 =
  /*showWalletDefinition*/
  ctx[1] && create_if_block_2$1(ctx);
  return {
    c: function c() {
      _p = element("p");
      t0 = space();
      create_component(wallets_1.$$.fragment);
      t1 = space();
      div = element("div");
      span = element("span");
      span.textContent = "What is a wallet?";
      t3 = space();
      if (if_block0) if_block0.c();
      t4 = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
      attr(_p, "class", "bn-onboard-custom bn-onboard-select-description svelte-rj3fpa");
      attr(span, "class", "bn-onboard-custom bn-onboard-select-wallet-info svelte-rj3fpa");
      attr(div, "class", "bn-onboard-custom bn-onboard-select-info-container svelte-rj3fpa");
    },
    m: function m(target, anchor) {
      insert(target, _p, anchor);
      _p.innerHTML = raw_value;
      insert(target, t0, anchor);
      mount_component(wallets_1, target, anchor);
      insert(target, t1, anchor);
      insert(target, div, anchor);
      append(div, span);
      append(div, t3);
      if (if_block0) if_block0.m(div, null);
      insert(target, t4, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;

      if (!mounted) {
        dispose = listen(span, "click",
        /*click_handler*/
        ctx[12]);
        mounted = true;
      }
    },
    p: function p(ctx, dirty) {
      if ((!current || dirty &
      /*modalData*/
      1) && raw_value !== (raw_value =
      /*modalData*/
      ctx[0].description + "")) _p.innerHTML = raw_value;
      var wallets_1_changes = {};
      if (dirty &
      /*modalData*/
      1) wallets_1_changes.modalData =
      /*modalData*/
      ctx[0];
      if (dirty &
      /*loadingWallet*/
      32) wallets_1_changes.loadingWallet =
      /*loadingWallet*/
      ctx[5];
      if (dirty &
      /*showingAllWalletModules*/
      64) wallets_1_changes.showingAllWalletModules =
      /*showingAllWalletModules*/
      ctx[6];
      wallets_1.$set(wallets_1_changes);
      if (
      /*mobileDevice*/
      ctx[7]) if_block0.p(ctx, dirty);

      if (
      /*showWalletDefinition*/
      ctx[1]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);

          if (dirty &
          /*showWalletDefinition*/
          2) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_2$1(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(wallets_1.$$.fragment, local);
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o: function o(local) {
      transition_out(wallets_1.$$.fragment, local);
      transition_out(if_block0);
      current = false;
    },
    d: function d(detaching) {
      if (detaching) detach(_p);
      if (detaching) detach(t0);
      destroy_component(wallets_1, detaching);
      if (detaching) detach(t1);
      if (detaching) detach(div);
      if (if_block0) if_block0.d();
      if (detaching) detach(t4);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
      mounted = false;
      dispose();
    }
  };
} // (199:8) {#if mobileDevice}


function create_if_block_3(ctx) {
  var button;
  var current;
  button = new Button({
    props: {
      onclick:
      /*func*/
      ctx[13],
      $$slots: {
        "default": [create_default_slot_1$1]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(button.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var button_changes = {};

      if (dirty &
      /*$$scope*/
      33554432) {
        button_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(button, detaching);
    }
  };
} // (200:10) <Button onclick={() => finish({ completed: false })}>


function create_default_slot_1$1(ctx) {
  var t;
  return {
    c: function c() {
      t = text("Dismiss");
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
} // (203:6) {#if showWalletDefinition}


function create_if_block_2$1(ctx) {
  var _p2;

  var raw_value =
  /*modalData*/
  ctx[0].explanation + "";
  var p_intro;
  return {
    c: function c() {
      _p2 = element("p");
      attr(_p2, "class", "bn-onboard-custom bn-onboard-select-wallet-definition svelte-rj3fpa");
    },
    m: function m(target, anchor) {
      insert(target, _p2, anchor);
      _p2.innerHTML = raw_value;
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*modalData*/
      1 && raw_value !== (raw_value =
      /*modalData*/
      ctx[0].explanation + "")) _p2.innerHTML = raw_value;
    },
    i: function i(local) {
      if (!p_intro) {
        add_render_callback(function () {
          p_intro = create_in_transition(_p2, fade, {});
          p_intro.start();
        });
      }
    },
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(_p2);
    }
  };
} // (181:2) <Modal closeModal={() => finish({ completed: false })}>


function create_default_slot$2(ctx) {
  var modalheader;
  var t;
  var current_block_type_index;
  var if_block;
  var if_block_anchor;
  var current;
  modalheader = new ModalHeader({
    props: {
      icon: walletIcon,
      heading:
      /*modalData*/
      ctx[0].heading
    }
  });
  var if_block_creators = [create_if_block_1$3, create_else_block$3];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (!
    /*selectedWalletModule*/
    ctx[4]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c: function c() {
      create_component(modalheader.$$.fragment);
      t = space();
      if_block.c();
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      mount_component(modalheader, target, anchor);
      insert(target, t, anchor);
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var modalheader_changes = {};
      if (dirty &
      /*modalData*/
      1) modalheader_changes.heading =
      /*modalData*/
      ctx[0].heading;
      modalheader.$set(modalheader_changes);
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, function () {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(modalheader.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o: function o(local) {
      transition_out(modalheader.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(modalheader, detaching);
      if (detaching) detach(t);
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}

function create_fragment$9(ctx) {
  var if_block_anchor;
  var current;
  var if_block =
  /*modalData*/
  ctx[0] && create_if_block$7(ctx);
  return {
    c: function c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m: function m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p: function p(ctx, _ref28) {
      var _ref29 = _slicedToArray(_ref28, 1),
          dirty = _ref29[0];

      if (
      /*modalData*/
      ctx[0]) {
        if (if_block) {
          if_block.p(ctx, dirty);

          if (dirty &
          /*modalData*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$7(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function o(local) {
      transition_out(if_block);
      current = false;
    },
    d: function d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}

function lockScroll() {
  window.scrollTo(0, 0);
}

function instance$9($$self, $$props, $$invalidate) {
  var _$$props$module = $$props.module,
      module = _$$props$module === void 0 ? {
    heading: "",
    description: "",
    wallets: []
  } : _$$props$module;
  var modalData;
  var showWalletDefinition;
  var walletAlreadyInstalled;
  var installMessage;
  var selectedWalletModule;

  var _get_store_value2 = get_store_value(app),
      mobileDevice = _get_store_value2.mobileDevice,
      os = _get_store_value2.os;

  var _module = module,
      heading = _module.heading,
      description = _module.description,
      explanation = _module.explanation,
      wallets = _module.wallets;
  var primaryWallets;
  var secondaryWallets;
  var loadingWallet = undefined;
  var showingAllWalletModules = false;

  var showAllWallets = function showAllWallets() {
    return $$invalidate(6, showingAllWalletModules = true);
  };

  var originalOverflowValue;
  onMount(function () {
    originalOverflowValue = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    window.addEventListener("scroll", lockScroll);
  });
  onDestroy(function () {
    window.removeEventListener("scroll", lockScroll);
    window.document.body.style.overflow = originalOverflowValue;
  });
  renderWalletSelect();

  function renderWalletSelect() {
    return _renderWalletSelect.apply(this, arguments);
  }

  function _renderWalletSelect() {
    _renderWalletSelect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var appState, deviceWallets, _module2;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              appState = get_store_value(app);
              _context3.next = 3;
              return wallets;

            case 3:
              wallets = _context3.sent;
              deviceWallets = wallets.filter(function (wallet) {
                return wallet[mobileDevice ? "mobile" : "desktop"];
              }).filter(function (wallet) {
                var _wallet$osExclusions = wallet.osExclusions,
                    osExclusions = _wallet$osExclusions === void 0 ? [] : _wallet$osExclusions;
                return !osExclusions.includes(os.name);
              });

              if (deviceWallets.find(function (wallet) {
                return wallet.preferred;
              })) {
                // if preferred wallets, then split in to preferred and not preferred
                primaryWallets = deviceWallets.filter(function (wallet) {
                  return wallet.preferred;
                });
                secondaryWallets = deviceWallets.filter(function (wallet) {
                  return !wallet.preferred;
                });
              } else {
                // otherwise make the first 4 wallets preferred
                primaryWallets = deviceWallets.slice(0, 4);
                secondaryWallets = deviceWallets.length > 4 ? deviceWallets.slice(4) : undefined;
              }

              if (!appState.autoSelectWallet) {
                _context3.next = 12;
                break;
              }

              _module2 = deviceWallets.find(function (m) {
                return m.name === appState.autoSelectWallet;
              });
              app.update(function (store) {
                return _objectSpread(_objectSpread({}, store), {}, {
                  autoSelectWallet: ""
                });
              });

              if (!_module2) {
                _context3.next = 12;
                break;
              }

              handleWalletSelect(_module2, true);
              return _context3.abrupt("return");

            case 12:
              $$invalidate(0, modalData = {
                heading: heading,
                description: description,
                explanation: explanation,
                primaryWallets: primaryWallets,
                secondaryWallets: secondaryWallets
              });
              app.update(function (store) {
                return _objectSpread(_objectSpread({}, store), {}, {
                  walletSelectDisplayedUI: true
                });
              });

            case 14:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _renderWalletSelect.apply(this, arguments);
  }

  function handleWalletSelect(_x4, _x5) {
    return _handleWalletSelect.apply(this, arguments);
  }

  function _handleWalletSelect() {
    _handleWalletSelect = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(module, autoSelected) {
      var currentWalletInterface, _get_store_value3, browser, os, _yield$module$wallet, provider, selectedWalletInterface, instance;

      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              currentWalletInterface = get_store_value(walletInterface);
              _get_store_value3 = get_store_value(app), browser = _get_store_value3.browser, os = _get_store_value3.os;

              if (!(currentWalletInterface && currentWalletInterface.name === module.name)) {
                _context4.next = 5;
                break;
              }

              finish({
                completed: true
              });
              return _context4.abrupt("return");

            case 5:
              $$invalidate(5, loadingWallet = module.name);
              _context4.next = 8;
              return module.wallet({
                getProviderName: getProviderName,
                createLegacyProviderInterface: createLegacyProviderInterface,
                createModernProviderInterface: createModernProviderInterface,
                BigNumber: BigNumber,
                getNetwork: getNetwork,
                getAddress: getAddress,
                getBalance: getBalance,
                resetWalletState: resetWalletState,
                networkName: networkName,
                browser: browser,
                os: os
              });

            case 8:
              _yield$module$wallet = _context4.sent;
              provider = _yield$module$wallet.provider;
              selectedWalletInterface = _yield$module$wallet["interface"];
              instance = _yield$module$wallet.instance;
              $$invalidate(5, loadingWallet = undefined); // if no interface then the user does not have the wallet they selected installed or available

              if (selectedWalletInterface) {
                _context4.next = 19;
                break;
              }

              $$invalidate(4, selectedWalletModule = module);
              $$invalidate(2, walletAlreadyInstalled = provider && getProviderName(provider));
              $$invalidate(3, installMessage = module.installMessage && module.installMessage({
                currentWallet: walletAlreadyInstalled,
                selectedWallet: selectedWalletModule.name
              })); // if it was autoSelected then we need to add modalData to show the modal

              if (autoSelected) {
                $$invalidate(0, modalData = {
                  heading: heading,
                  description: description,
                  explanation: explanation,
                  primaryWallets: primaryWallets,
                  secondaryWallets: secondaryWallets
                });
                app.update(function (store) {
                  return _objectSpread(_objectSpread({}, store), {}, {
                    walletSelectDisplayedUI: true
                  });
                });
              }

              return _context4.abrupt("return");

            case 19:
              walletInterface.update(function (currentInterface) {
                if (currentInterface && currentInterface.disconnect) {
                  currentInterface.disconnect();
                }

                return selectedWalletInterface;
              });
              wallet.set({
                provider: provider,
                instance: instance,
                dashboard: selectedWalletInterface.dashboard,
                name: module.name,
                connect: selectedWalletInterface.connect,
                type: module.type
              });
              finish({
                completed: true
              });

            case 22:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _handleWalletSelect.apply(this, arguments);
  }

  function finish(options) {
    $$invalidate(0, modalData = null);
    app.update(function (store) {
      return _objectSpread(_objectSpread({}, store), {}, {
        walletSelectInProgress: false,
        walletSelectCompleted: options.completed
      });
    });
  }

  var click_handler = function click_handler() {
    return $$invalidate(1, showWalletDefinition = !showWalletDefinition);
  };

  var func = function func() {
    return finish({
      completed: false
    });
  };

  var func_1 = function func_1() {
    $$invalidate(4, selectedWalletModule = null);
    $$invalidate(2, walletAlreadyInstalled = null);
  };

  var func_2 = function func_2() {
    return finish({
      completed: false
    });
  };

  $$self.$set = function ($$props) {
    if ("module" in $$props) $$invalidate(11, module = $$props.module);
  };

  return [modalData, showWalletDefinition, walletAlreadyInstalled, installMessage, selectedWalletModule, loadingWallet, showingAllWalletModules, mobileDevice, showAllWallets, handleWalletSelect, finish, module, click_handler, func, func_1, func_2];
}

var WalletSelect = /*#__PURE__*/function (_SvelteComponent10) {
  _inherits(WalletSelect, _SvelteComponent10);

  var _super10 = _createSuper(WalletSelect);

  function WalletSelect(options) {
    var _this10;

    _classCallCheck(this, WalletSelect);

    _this10 = _super10.call(this);
    if (!document.getElementById("svelte-rj3fpa-style")) add_css$9();
    init(_assertThisInitialized(_this10), options, instance$9, create_fragment$9, safe_not_equal, {
      module: 11
    });
    return _this10;
  }

  return WalletSelect;
}(SvelteComponent);
/* src/views/WalletCheck.svelte generated by Svelte v3.24.0 */


function add_css$a() {
  var style = element("style");
  style.id = "svelte-zrvscw-style";
  style.textContent = "p.svelte-zrvscw{font-size:0.889em;font-family:inherit;margin:1em 0}span.svelte-zrvscw{color:#e2504a;font-size:0.889em;font-family:inherit;display:block;margin-bottom:0.75em;padding:0.5em;border:1px solid #e2504a;border-radius:5px}div.svelte-zrvscw{display:flex;justify-content:center;align-items:center;min-height:2.5rem;position:relative}section.svelte-zrvscw{display:flex;justify-content:center;flex-direction:column;align-items:center;margin-bottom:1rem}";
  append(document.head, style);
} // (239:0) {#if loadingModal}


function create_if_block_6(ctx) {
  var modal;
  var current;
  modal = new Modal({
    props: {
      closeable: false,
      $$slots: {
        "default": [create_default_slot_4]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(modal.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    i: function i(local) {
      if (current) return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(modal, detaching);
    }
  };
} // (240:2) <Modal closeable={false}>


function create_default_slot_4(ctx) {
  var spinner;
  var current;
  spinner = new Spinner({
    props: {
      description: "Checking wallet"
    }
  });
  return {
    c: function c() {
      create_component(spinner.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(spinner, target, anchor);
      current = true;
    },
    p: noop,
    i: function i(local) {
      if (current) return;
      transition_in(spinner.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(spinner.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(spinner, detaching);
    }
  };
} // (245:0) {#if activeModal}


function create_if_block$8(ctx) {
  var modal;
  var current;
  modal = new Modal({
    props: {
      closeModal:
      /*func_1*/
      ctx[10],
      $$slots: {
        "default": [create_default_slot$3]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(modal.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(modal, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var modal_changes = {};

      if (dirty &
      /*$$scope, loading, activeModal, errorMsg, $app*/
      16777239) {
        modal_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      modal.$set(modal_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(modal.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(modal.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(modal, detaching);
    }
  };
} // (251:4) {#if errorMsg}


function create_if_block_5(ctx) {
  var span;
  var t;
  var span_intro;
  return {
    c: function c() {
      span = element("span");
      t = text(
      /*errorMsg*/
      ctx[1]);
      attr(span, "class", "bn-onboard-custom bn-onboard-prepare-error svelte-zrvscw");
      toggle_class(span, "bn-onboard-dark-mode-background",
      /*$app*/
      ctx[4].darkMode);
    },
    m: function m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*errorMsg*/
      2) set_data(t,
      /*errorMsg*/
      ctx[1]);

      if (dirty &
      /*$app*/
      16) {
        toggle_class(span, "bn-onboard-dark-mode-background",
        /*$app*/
        ctx[4].darkMode);
      }
    },
    i: function i(local) {
      if (!span_intro) {
        add_render_callback(function () {
          span_intro = create_in_transition(span, fade, {});
          span_intro.start();
        });
      }
    },
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(span);
    }
  };
} // (260:4) {#if activeModal.html}


function create_if_block_4(ctx) {
  var section;
  var raw_value =
  /*activeModal*/
  ctx[0].html + "";
  return {
    c: function c() {
      section = element("section");
      attr(section, "class", "svelte-zrvscw");
    },
    m: function m(target, anchor) {
      insert(target, section, anchor);
      section.innerHTML = raw_value;
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*activeModal*/
      1 && raw_value !== (raw_value =
      /*activeModal*/
      ctx[0].html + "")) section.innerHTML = raw_value;
    },
    d: function d(detaching) {
      if (detaching) detach(section);
    }
  };
} // (267:6) {#if activeModal.button}


function create_if_block_3$1(ctx) {
  var button;
  var current;
  button = new Button({
    props: {
      position: "left",
      onclick:
      /*activeModal*/
      ctx[0].button.onclick,
      $$slots: {
        "default": [create_default_slot_3]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(button.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var button_changes = {};
      if (dirty &
      /*activeModal*/
      1) button_changes.onclick =
      /*activeModal*/
      ctx[0].button.onclick;

      if (dirty &
      /*$$scope, activeModal*/
      16777217) {
        button_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(button, detaching);
    }
  };
} // (268:8) <Button position="left" onclick={activeModal.button.onclick}>


function create_default_slot_3(ctx) {
  var t_value =
  /*activeModal*/
  ctx[0].button.text + "";
  var t;
  return {
    c: function c() {
      t = text(t_value);
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    p: function p(ctx, dirty) {
      if (dirty &
      /*activeModal*/
      1 && t_value !== (t_value =
      /*activeModal*/
      ctx[0].button.text + "")) set_data(t, t_value);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
} // (276:6) {:else}


function create_else_block$4(ctx) {
  var div;
  return {
    c: function c() {
      div = element("div");
      attr(div, "class", "svelte-zrvscw");
    },
    m: function m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function d(detaching) {
      if (detaching) detach(div);
    }
  };
} // (272:6) {#if errorMsg}


function create_if_block_2$2(ctx) {
  var button;
  var current;
  button = new Button({
    props: {
      position: !
      /*activeModal*/
      ctx[0].button && "left",
      onclick:
      /*doAction*/
      ctx[5],
      $$slots: {
        "default": [create_default_slot_2]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(button.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(button, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var button_changes = {};
      if (dirty &
      /*activeModal*/
      1) button_changes.position = !
      /*activeModal*/
      ctx[0].button && "left";

      if (dirty &
      /*$$scope*/
      16777216) {
        button_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(button, detaching);
    }
  };
} // (273:8) <Button position={!activeModal.button && 'left'} onclick={doAction}>


function create_default_slot_2(ctx) {
  var t;
  return {
    c: function c() {
      t = text("Try Again");
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
} // (279:6) {#if loading}


function create_if_block_1$4(ctx) {
  var spinner;
  var current;
  spinner = new Spinner({});
  return {
    c: function c() {
      create_component(spinner.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(spinner, target, anchor);
      current = true;
    },
    i: function i(local) {
      if (current) return;
      transition_in(spinner.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(spinner.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(spinner, detaching);
    }
  };
} // (282:6) <Button position="right" onclick={() => handleExit(false)}>


function create_default_slot_1$2(ctx) {
  var t;
  return {
    c: function c() {
      t = text("Dismiss");
    },
    m: function m(target, anchor) {
      insert(target, t, anchor);
    },
    d: function d(detaching) {
      if (detaching) detach(t);
    }
  };
} // (246:2) <Modal closeModal={() => handleExit()}>


function create_default_slot$3(ctx) {
  var modalheader;
  var t0;

  var _p3;

  var raw_value =
  /*activeModal*/
  ctx[0].description + "";
  var t1;
  var t2;
  var t3;
  var div;
  var t4;
  var current_block_type_index;
  var if_block3;
  var t5;
  var t6;
  var button;
  var current;
  modalheader = new ModalHeader({
    props: {
      icon:
      /*activeModal*/
      ctx[0].icon,
      heading:
      /*activeModal*/
      ctx[0].heading
    }
  });
  var if_block0 =
  /*errorMsg*/
  ctx[1] && create_if_block_5(ctx);
  var if_block1 =
  /*activeModal*/
  ctx[0].html && create_if_block_4(ctx);
  var if_block2 =
  /*activeModal*/
  ctx[0].button && create_if_block_3$1(ctx);
  var if_block_creators = [create_if_block_2$2, create_else_block$4];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*errorMsg*/
    ctx[1]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  var if_block4 =
  /*loading*/
  ctx[2] && create_if_block_1$4();
  button = new Button({
    props: {
      position: "right",
      onclick:
      /*func*/
      ctx[9],
      $$slots: {
        "default": [create_default_slot_1$2]
      },
      $$scope: {
        ctx: ctx
      }
    }
  });
  return {
    c: function c() {
      create_component(modalheader.$$.fragment);
      t0 = space();
      _p3 = element("p");
      t1 = space();
      if (if_block0) if_block0.c();
      t2 = space();
      if (if_block1) if_block1.c();
      t3 = space();
      div = element("div");
      if (if_block2) if_block2.c();
      t4 = space();
      if_block3.c();
      t5 = space();
      if (if_block4) if_block4.c();
      t6 = space();
      create_component(button.$$.fragment);
      attr(_p3, "class", "bn-onboard-custom bn-onboard-prepare-description svelte-zrvscw");
      attr(div, "class", "bn-onboard-custom bn-onboard-prepare-button-container svelte-zrvscw");
    },
    m: function m(target, anchor) {
      mount_component(modalheader, target, anchor);
      insert(target, t0, anchor);
      insert(target, _p3, anchor);
      _p3.innerHTML = raw_value;
      insert(target, t1, anchor);
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t2, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, t3, anchor);
      insert(target, div, anchor);
      if (if_block2) if_block2.m(div, null);
      append(div, t4);
      if_blocks[current_block_type_index].m(div, null);
      append(div, t5);
      if (if_block4) if_block4.m(div, null);
      append(div, t6);
      mount_component(button, div, null);
      current = true;
    },
    p: function p(ctx, dirty) {
      var modalheader_changes = {};
      if (dirty &
      /*activeModal*/
      1) modalheader_changes.icon =
      /*activeModal*/
      ctx[0].icon;
      if (dirty &
      /*activeModal*/
      1) modalheader_changes.heading =
      /*activeModal*/
      ctx[0].heading;
      modalheader.$set(modalheader_changes);
      if ((!current || dirty &
      /*activeModal*/
      1) && raw_value !== (raw_value =
      /*activeModal*/
      ctx[0].description + "")) _p3.innerHTML = raw_value;

      if (
      /*errorMsg*/
      ctx[1]) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*errorMsg*/
          2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_5(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t2.parentNode, t2);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }

      if (
      /*activeModal*/
      ctx[0].html) {
        if (if_block1) {
          if_block1.p(ctx, dirty);
        } else {
          if_block1 = create_if_block_4(ctx);
          if_block1.c();
          if_block1.m(t3.parentNode, t3);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }

      if (
      /*activeModal*/
      ctx[0].button) {
        if (if_block2) {
          if_block2.p(ctx, dirty);

          if (dirty &
          /*activeModal*/
          1) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block_3$1(ctx);
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(div, t4);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, function () {
          if_block2 = null;
        });
        check_outros();
      }

      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, function () {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block3 = if_blocks[current_block_type_index];

        if (!if_block3) {
          if_block3 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block3.c();
        }

        transition_in(if_block3, 1);
        if_block3.m(div, t5);
      }

      if (
      /*loading*/
      ctx[2]) {
        if (if_block4) {
          if (dirty &
          /*loading*/
          4) {
            transition_in(if_block4, 1);
          }
        } else {
          if_block4 = create_if_block_1$4();
          if_block4.c();
          transition_in(if_block4, 1);
          if_block4.m(div, t6);
        }
      } else if (if_block4) {
        group_outros();
        transition_out(if_block4, 1, 1, function () {
          if_block4 = null;
        });
        check_outros();
      }

      var button_changes = {};

      if (dirty &
      /*$$scope*/
      16777216) {
        button_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      button.$set(button_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(modalheader.$$.fragment, local);
      transition_in(if_block0);
      transition_in(if_block2);
      transition_in(if_block3);
      transition_in(if_block4);
      transition_in(button.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(modalheader.$$.fragment, local);
      transition_out(if_block2);
      transition_out(if_block3);
      transition_out(if_block4);
      transition_out(button.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(modalheader, detaching);
      if (detaching) detach(t0);
      if (detaching) detach(_p3);
      if (detaching) detach(t1);
      if (if_block0) if_block0.d(detaching);
      if (detaching) detach(t2);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(t3);
      if (detaching) detach(div);
      if (if_block2) if_block2.d();
      if_blocks[current_block_type_index].d();
      if (if_block4) if_block4.d();
      destroy_component(button);
    }
  };
}

function create_fragment$a(ctx) {
  var t;
  var if_block1_anchor;
  var current;
  var if_block0 =
  /*loadingModal*/
  ctx[3] && create_if_block_6(ctx);
  var if_block1 =
  /*activeModal*/
  ctx[0] && create_if_block$8(ctx);
  return {
    c: function c() {
      if (if_block0) if_block0.c();
      t = space();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
    },
    m: function m(target, anchor) {
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
    },
    p: function p(ctx, _ref30) {
      var _ref31 = _slicedToArray(_ref30, 1),
          dirty = _ref31[0];

      if (
      /*loadingModal*/
      ctx[3]) {
        if (if_block0) {
          if (dirty &
          /*loadingModal*/
          8) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_6(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t.parentNode, t);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, function () {
          if_block0 = null;
        });
        check_outros();
      }

      if (
      /*activeModal*/
      ctx[0]) {
        if (if_block1) {
          if_block1.p(ctx, dirty);

          if (dirty &
          /*activeModal*/
          1) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$8(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, function () {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o: function o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d: function d(detaching) {
      if (if_block0) if_block0.d(detaching);
      if (detaching) detach(t);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
    }
  };
}

function lockScroll$1() {
  window.scrollTo(0, 0);
}

function isCheckModal(val) {
  return val.heading !== undefined;
}

function instance$a($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(4, $app = $$value);
  });
  var walletSelect = $$props.walletSelect;
  var modules = $$props.modules;
  var blocknative = getBlocknative();
  var currentState;
  var activeModal = undefined;
  var currentModule = undefined;
  var errorMsg;
  var pollingInterval;
  var checkingModule = false;
  var actionResolved = undefined;
  var loading = false;
  var loadingModal = false;
  var unsubscribe = walletInterface.subscribe(function (currentInterface) {
    if (currentInterface === null) {
      handleExit();
      unsubscribe();
    }
  });
  var originalOverflowValue;
  var unsubscribeCurrentState = state.subscribe(function (store) {
    return currentState = store;
  });
  onMount(function () {
    originalOverflowValue = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    window.addEventListener("scroll", lockScroll$1);
  });
  onDestroy(function () {
    unsubscribeCurrentState();
    window.removeEventListener("scroll", lockScroll$1);
    window.document.body.style.overflow = originalOverflowValue;
  });

  function renderModule() {
    return _renderModule.apply(this, arguments);
  }

  function _renderModule() {
    _renderModule = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
      var checkModules, currentWallet;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              $$invalidate(14, checkingModule = true);
              checkModules = modules || get_store_value(app).checkModules;

              if (!isPromise(checkModules)) {
                _context7.next = 8;
                break;
              }

              _context7.next = 5;
              return checkModules;

            case 5:
              checkModules = _context7.sent;
              checkModules.forEach(validateWalletCheckModule);
              app.update(function (store) {
                return _objectSpread(_objectSpread({}, store), {}, {
                  checkModules: checkModules
                });
              });

            case 8:
              currentWallet = get_store_value(wallet).name; // loop through and run each module to check if a modal needs to be shown

              runModules(checkModules).then(function (result) {
                // no result then user has passed all conditions
                if (!result.modal) {
                  blocknative && blocknative.event({
                    categoryCode: "onboard",
                    eventCode: "onboardingCompleted"
                  });
                  handleExit(true);
                  return;
                } // set that UI has been displayed, so that timeouts can be added for UI transitions


                app.update(function (store) {
                  return _objectSpread(_objectSpread({}, store), {}, {
                    walletCheckDisplayedUI: true
                  });
                });
                $$invalidate(0, activeModal = result.modal);
                currentModule = result.module; // log the event code for this module

                blocknative && blocknative.event({
                  eventCode: activeModal.eventCode,
                  categoryCode: "onboard"
                }); // run any actions that module require as part of this step

                if (activeModal.action) {
                  doAction();
                } // poll to automatically to check if condition has been met


                pollingInterval = setInterval( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                  var _result;

                  return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                      switch (_context6.prev = _context6.next) {
                        case 0:
                          if (!currentModule) {
                            _context6.next = 5;
                            break;
                          }

                          _context6.next = 3;
                          return invalidState(currentModule, get_store_value(state));

                        case 3:
                          _result = _context6.sent;

                          if (!_result && actionResolved !== false) {
                            resetState(); // delayed for animations

                            setTimeout(function () {
                              $$invalidate(14, checkingModule = false);
                            }, 250);
                          } else {
                            $$invalidate(0, activeModal = _result && _result.modal ? _result.modal : activeModal);
                          }

                        case 5:
                        case "end":
                          return _context6.stop();
                      }
                    }
                  }, _callee6);
                })), 100);
              });

            case 10:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _renderModule.apply(this, arguments);
  }

  function doAction() {
    actionResolved = false;
    $$invalidate(2, loading = true);
    activeModal && activeModal.action && activeModal.action().then(function () {
      actionResolved = true;
      $$invalidate(2, loading = false);
    })["catch"](function (err) {
      $$invalidate(1, errorMsg = err.message);
      $$invalidate(2, loading = false);
    });
  }

  function handleExit(completed) {
    resetState();
    app.update(function (store) {
      return _objectSpread(_objectSpread({}, store), {}, {
        walletCheckInProgress: false,
        walletCheckCompleted: completed ? completed : false,
        accountSelectInProgress: false
      });
    });
  }

  function resetState() {
    clearInterval(pollingInterval);
    $$invalidate(1, errorMsg = "");
    actionResolved = undefined;
    $$invalidate(0, activeModal = undefined);
    currentModule = undefined;
  }

  function runModules(modules) {
    return new Promise( /*#__PURE__*/function () {
      var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(resolve) {
        var _iterator, _step, module, result;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _iterator = _createForOfIteratorHelper(modules);
                _context5.prev = 1;

                _iterator.s();

              case 3:
                if ((_step = _iterator.n()).done) {
                  _context5.next = 12;
                  break;
                }

                module = _step.value;
                _context5.next = 7;
                return invalidState(module, currentState);

              case 7:
                result = _context5.sent;

                if (!result) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", resolve(result));

              case 10:
                _context5.next = 3;
                break;

              case 12:
                _context5.next = 17;
                break;

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](1);

                _iterator.e(_context5.t0);

              case 17:
                _context5.prev = 17;

                _iterator.f();

                return _context5.finish(17);

              case 20:
                return _context5.abrupt("return", resolve({
                  modal: undefined,
                  module: undefined
                }));

              case 21:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[1, 14, 17, 20]]);
      }));

      return function (_x6) {
        return _ref32.apply(this, arguments);
      };
    }());
  }

  function invalidState(_x7, _x8) {
    return _invalidState.apply(this, arguments);
  }

  function _invalidState() {
    _invalidState = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(module, state) {
      var result, modal;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              result = module(_objectSpread(_objectSpread({}, state), {}, {
                BigNumber: BigNumber,
                walletSelect: walletSelect,
                exit: handleExit,
                wallet: get_store_value(wallet),
                stateSyncStatus: stateSyncStatus,
                stateStore: {
                  address: address,
                  network: network,
                  balance: balance
                }
              }));

              if (!result) {
                _context8.next = 12;
                break;
              }

              if (!isCheckModal(result)) {
                _context8.next = 7;
                break;
              }

              validateModal(result);
              return _context8.abrupt("return", {
                module: module,
                modal: result
              });

            case 7:
              _context8.next = 9;
              return new Promise(function (resolve) {
                var completed = false;
                result.then(function (res) {
                  $$invalidate(3, loadingModal = false);
                  completed = true;
                  modal = res;
                  resolve();
                });
                setTimeout(function () {
                  if (!completed) {
                    $$invalidate(3, loadingModal = true);
                  }
                }, 650);
              });

            case 9:
              if (!modal) {
                _context8.next = 12;
                break;
              }

              validateModal(modal);
              return _context8.abrupt("return", {
                module: module,
                modal: modal
              });

            case 12:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));
    return _invalidState.apply(this, arguments);
  }

  var func = function func() {
    return handleExit(false);
  };

  var func_1 = function func_1() {
    return handleExit();
  };

  $$self.$set = function ($$props) {
    if ("walletSelect" in $$props) $$invalidate(7, walletSelect = $$props.walletSelect);
    if ("modules" in $$props) $$invalidate(8, modules = $$props.modules);
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*activeModal, checkingModule*/
    16385) {
      // recheck modules if below conditions
      if (!activeModal && !checkingModule) {
        renderModule();
      }
    }
  };

  return [activeModal, errorMsg, loading, loadingModal, $app, doAction, handleExit, walletSelect, modules, func, func_1];
}

var WalletCheck = /*#__PURE__*/function (_SvelteComponent11) {
  _inherits(WalletCheck, _SvelteComponent11);

  var _super11 = _createSuper(WalletCheck);

  function WalletCheck(options) {
    var _this11;

    _classCallCheck(this, WalletCheck);

    _this11 = _super11.call(this);
    if (!document.getElementById("svelte-zrvscw-style")) add_css$a();
    init(_assertThisInitialized(_this11), options, instance$a, create_fragment$a, safe_not_equal, {
      walletSelect: 7,
      modules: 8
    });
    return _this11;
  }

  return WalletCheck;
}(SvelteComponent);

var usbIcon = "\n\t<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 512 512\" style=\"enable-background:new 0 0 512 512;\" xml:space=\"preserve\" width=\"18px\" height=\"18px\">\n\t<g>\n\t<g>\n\t<path fill=\"currentColor\" d=\"M314.468,157.197v103.942h31.553v2.312c0,9.888-4.815,19.205-12.881,24.924l-56.652,40.171V109.939h44.546L257.634,0\n\t\tl-66.527,109.939h45.404V358.25l-56.652-40.171c-8.066-5.719-12.881-15.037-12.881-24.924v-8.489\n\t\tc20.19-7.815,34.552-27.427,34.552-50.342c0-29.759-24.211-53.97-53.97-53.97c-29.76,0-53.97,24.211-53.97,53.97\n\t\tc0,22.482,13.821,41.789,33.41,49.891v8.94c0,22.824,11.116,44.333,29.735,57.536l66.895,47.434\n\t\tc4.255,3.016,7.593,7.04,9.809,11.615c-17.713,8.862-29.909,27.173-29.909,48.29c0,29.76,24.211,53.97,53.97,53.97\n\t\tc29.759,0,53.97-24.211,53.97-53.97c0-23.078-14.564-42.81-34.981-50.511v-14.174c0-9.888,4.815-19.205,12.881-24.924\n\t\tl66.895-47.434c18.619-13.202,29.735-34.711,29.735-57.536v-2.312h32.411V157.197H314.468z M147.56,248.316\n\t\tc-7.716,0-13.992-6.277-13.992-13.992c0-7.716,6.276-13.992,13.992-13.992c7.716,0,13.992,6.276,13.992,13.992\n\t\tC161.552,242.04,155.276,248.316,147.56,248.316z M257.499,472.022c-7.716,0-13.992-6.276-13.992-13.992\n\t\tc0-7.716,6.277-13.992,13.992-13.992c7.716,0,13.992,6.276,13.992,13.992C271.491,465.746,265.215,472.022,257.499,472.022z\n\t\tM378.432,221.161h-23.987v-23.987h23.987V221.161z\"/>\n\t</g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t<g>\n\t</g>\n\t</svg>\t  \n";
var connectIcon = "\n\t<svg height=\"14\" viewBox=\"0 0 18 14\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n\t\t<g fill=\"currentColor\">\n\t\t\t<path d=\"m10.29375 4.05351563c0-.04921875 0-.09140625 0-.13007813 0-1.0546875 0-2.109375 0-3.1640625 0-.43945312.3480469-.76992188.7804688-.7453125.2003906.01054688.3585937.10546875.4992187.24609375.5800781.58359375 1.1566406 1.16367188 1.7367187 1.74023438 1.4695313 1.46953125 2.9390625 2.93906249 4.4050782 4.40859375.1335937.13359375.2425781.27421875.2707031.46757812.0351562.20742188-.0246094.421875-.1652344.58007813-.0246094.028125-.0492187.05273437-.0738281.08085937-2.0601563 2.06367188-4.1203125 4.1238281-6.1804688 6.1875-.2109375.2109375-.4570312.3023438-.7453125.2179688-.2707031-.0808594-.4464843-.2707032-.5132812-.5484375-.0140625-.0738282-.0175781-.1441407-.0140625-.2179688 0-1.0335937 0-2.0707031 0-3.1042969 0-.0386719 0-.08085935 0-.13359372h-5.06953125c-.49570313 0-.80507813-.309375-.80507813-.80859375 0-1.42382813 0-2.84414063 0-4.26796875 0-.49570313.30585938-.8015625.8015625-.8015625h4.93593748z\"/>\n\t\t\t<path d=\"m5.69882812 13.978125h-4.01132812c-.928125 0-1.6875-.8753906-1.6875-1.9511719v-10.06171872c0-1.07578125.75585938-1.95117188 1.6875-1.95117188h4.01132812c.34101563 0 .61523438.31992188.61523438.71015625 0 .39023438-.27421875.71015625-.61523438.71015625h-4.01132812c-.253125 0-.45703125.23554688-.45703125.52734375v10.06171875c0 .2917969.20390625.5273437.45703125.5273437h4.01132812c.34101563 0 .61523438.3199219.61523438.7101563s-.27773438.7171875-.61523438.7171875z\"/>\n\t\t</g>\n\t</svg>\n";
var balanceIcon = "\n\t<svg height=\"18\" viewBox=\"0 0 429 695\" width=\"18\" xmlns=\"http://www.w3.org/2000/svg\">\n\t\t<g fill=\"currentColor\" fill-rule=\"evenodd\">\n\t\t\t<path d=\"m0 394 213 126.228516 214-126.228516-214 301z\"/>\n\t\t\t<path d=\"m0 353.962264 213.5-353.962264 213.5 353.962264-213.5 126.037736z\"/>\n\t\t</g>\n\t</svg>\n";
var msgStyles = "\n  display: block;\n  font-size: 0.889em;\n  font-family: inherit;\n  color: inherit;\n  margin-top: 0.5rem;\n";

function accountSelect() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var heading = options.heading,
      description = options.description,
      icon = options.icon;
  var completed = false;
  var loadingAccounts = false;
  var accountsAndBalances = [];

  function checkModule(_x9) {
    return _checkModule.apply(this, arguments);
  }

  function _checkModule() {
    _checkModule = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(stateAndHelpers) {
      var wallet, BigNumber, provider, type, _accounts, deleteWindowProperties, loadMoreAccounts, _accountSelect;

      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              wallet = stateAndHelpers.wallet, BigNumber = stateAndHelpers.BigNumber;
              provider = wallet.provider, type = wallet.type;

              if (!(type === 'hardware' && !completed && !provider.isCustomPath())) {
                _context10.next = 18;
                break;
              }

              if (!(accountsAndBalances.length === 0)) {
                _context10.next = 12;
                break;
              }

              loadingAccounts = true;
              _context10.next = 7;
              return provider.enable();

            case 7:
              _accounts = _context10.sent;
              _context10.next = 10;
              return provider.getBalances(_accounts);

            case 10:
              accountsAndBalances = _context10.sent;
              loadingAccounts = false;

            case 12:
              deleteWindowProperties = function deleteWindowProperties() {
                delete window.accountSelect;
                delete window.loadMoreAccounts;
              };

              loadMoreAccounts = /*#__PURE__*/function () {
                var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                  return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                      switch (_context9.prev = _context9.next) {
                        case 0:
                          loadingAccounts = true;
                          _context9.next = 3;
                          return provider.getMoreAccounts();

                        case 3:
                          accountsAndBalances = _context9.sent;
                          loadingAccounts = false;

                        case 5:
                        case "end":
                          return _context9.stop();
                      }
                    }
                  }, _callee9);
                }));

                return function loadMoreAccounts() {
                  return _ref34.apply(this, arguments);
                };
              }();

              _accountSelect = function _accountSelect() {
                var accountIndex = document.getElementById('account-select').selectedIndex;
                provider.setPrimaryAccount(accountsAndBalances[accountIndex].address);
              };

              window.accountSelect = _accountSelect;
              window.loadMoreAccounts = loadMoreAccounts;
              return _context10.abrupt("return", {
                heading: heading || 'Select Account',
                description: description || "Please select which account you would like to use with this Dapp:",
                eventCode: 'accountSelect',
                html: loadingAccounts ? "<div class=\"bn-onboard-custom bn-onboard-loading\">\n              <div class=\"bn-onboard-loading-first\"></div>\n              <div class=\"bn-onboard-loading-second\"></div>\n              <div class=\"bn-onboard-loading-third\"></div>\n            </div>\n            <span style=\"".concat(msgStyles, "\">Loading More Accounts...</span>\n            ") : "\n          <div style=\"display: flex; align-items: center;\">\n            <select id=\"account-select\" onchange=\"window.accountSelect()\" style=\"padding: 0.5rem;\">\n              ".concat(accountsAndBalances.map(function (account) {
                  return "<option>".concat(account.address, " --- ").concat(account.balance != null ? new BigNumber(account.balance).div('1000000000000000000').toFixed(3) : '0', " ETH</option>");
                }), "\n            </select>\n            <button style=\"display: flex; align-items: center; text-align: center; height: 1.5rem; background: transparent; margin: 0 0.25rem; padding: 0 0.5rem; border-radius: 40px; cursor: pointer; color: inherit; border-color: inherit; border-width: 1px; border-style: solid;\" onclick=\"window.loadMoreAccounts()\">Load More</button>\n          </div>\n        "),
                button: {
                  onclick: function onclick() {
                    deleteWindowProperties();
                    completed = true;
                  },
                  text: 'Done'
                },
                icon: icon || usbIcon
              });

            case 18:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _checkModule.apply(this, arguments);
  }

  checkModule.reset = function () {
    completed = false;
    accountsAndBalances = [];
    loadingAccounts = false;
  };

  return checkModule;
}

var accounts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': accountSelect
});
var derivationPaths = {
  Ledger: [{
    path: "m/44'/60'/0'",
    label: 'Ethereum'
  }, {
    path: "m/44'/60'",
    label: 'Ethereum Ledger Live'
  }],
  Trezor: [{
    path: "m/44'/60'/0'/0",
    label: 'Ethereum'
  }],
  Lattice: [{
    path: "m/44'/60'/0'/0",
    label: 'Ethereum'
  }]
};
var styles = "\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n";
var baseStyles = "\n  background: inherit;\n  font-size: 0.889em;\n  font-family: inherit;\n  border-width: 1px;\n  border-style: solid;\n  border-color: inherit;\n  border-radius: 40px;\n  margin-top: 0.5rem;\n  padding: 0.55em 1.4em;\n  text-align: center;\n  color: inherit;\n  font-family: inherit;\n  transition: background 150ms ease-in-out;\n  line-height: 1.15;\n";
var buttonStyles = "\n  cursor: pointer;\n";
var selectedStyles = "\n  border: 1px solid #4a90e2;\n";
var errorStyles = "\n  border: 1px solid #e2504a;\n";
var msgStyles$1 = "\n  display: block;\n  font-size: 0.889em;\n  font-family: inherit;\n  color: inherit;\n  margin-top: 0.5rem;\n";
var errorMsgStyles = "\n  color: #e2504a;\n";

function derivationPath() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var heading = options.heading,
      description = options.description,
      icon = options.icon;
  var state = {
    completed: false,
    showCustomInput: false,
    dPath: '',
    loading: false,
    error: ''
  };

  var customInputHtmlString = function customInputHtmlString(error) {
    return "\n      <input \n        id=\"custom-derivation-input\" \n        style=\"".concat(baseStyles + selectedStyles + (error ? errorStyles : ''), "\" \n        type=\"text\" \n        value=\"").concat(state.dPath, "\"\n        placeholder=\"custom derivation path\" \n        onchange=\"window.handleCustomInput(this.value)\" />\n      ");
  };

  function derivationSelectHtmlString(walletName) {
    return "\n      <div id=\"derivation-select\" style=\"".concat(styles, "\">\n        ").concat(derivationPaths[walletName].map(function (derivation) {
      var path = derivation.path,
          label = derivation.label;
      return "\n              <button style=\"".concat(baseStyles + buttonStyles + (state.dPath === path && !state.showCustomInput ? selectedStyles : ''), "\" onclick=\"window.handleDerivationClick(this)\" data-path=\"").concat(path, "\">\n                ").concat(label, " - ").concat(path, "\n              </button>\n            ");
    }).join(' '), "\n        ").concat(state.showCustomInput ? customInputHtmlString(state.error) : "<button style=\"".concat(baseStyles + buttonStyles, "\" onclick=\"window.handleDerivationClick(this)\" data-path=\"custom\">Custom Path</button>"), "\n        ").concat(state.loading ? "<div class=\"bn-onboard-custom bn-onboard-loading\" style=\"margin-top: 1rem;\">\n                <div class=\"bn-onboard-loading-first\"></div>\n                <div class=\"bn-onboard-loading-second\"></div>\n                <div class=\"bn-onboard-loading-third\"></div>\n              </div>\n              <span style=\"".concat(msgStyles$1, "\">Loading Accounts...</span>\n              ") : state.error ? "<span style=\"".concat(msgStyles$1 + errorMsgStyles, "\">").concat(state.error, "</span>") : '', "\n      </div>\n    ");
  }

  function resetState() {
    state.completed = false;
    state.showCustomInput = false;
    state.dPath = '';
    state.loading = false;
    state.error = '';
  }

  function checkModule(stateAndHelpers) {
    var wallet = stateAndHelpers.wallet;

    if (wallet && wallet.type === 'hardware' && !state.completed) {
      var handleCustomInput = function handleCustomInput() {
        var input = document.getElementById('custom-derivation-input');
        state.dPath = input && input.value;
        state.error = '';
      };

      var handleDerivationClick = function handleDerivationClick(button) {
        var selectedPath = button.dataset.path;

        if (selectedPath === 'custom') {
          state.showCustomInput = true;
          setTimeout(function () {
            var input = document.getElementById('custom-derivation-input');
            input && input.focus();
          }, 100);
        } else {
          state.error = '';
          state.showCustomInput = false;
          state.dPath = selectedPath;
        }
      };

      var deleteWindowProperties = function deleteWindowProperties() {
        delete window.handleCustomInput;
        delete window.handleDerivationSelect;
      };

      window.handleCustomInput = handleCustomInput;
      window.handleDerivationClick = handleDerivationClick;
      return {
        heading: heading || 'Hardware Wallet Connect',
        description: description || "Make sure your ".concat(wallet.name, " is plugged in, ").concat(wallet.name === 'Ledger' ? 'and the Ethereum app is open, ' : '', "then select a derivation path to connect your accounts:"),
        eventCode: 'derivationPath',
        html: derivationSelectHtmlString(wallet.name),
        button: {
          text: 'Connect',
          onclick: function () {
            var _onclick = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
              var path, validPath;
              return regeneratorRuntime.wrap(function _callee11$(_context11) {
                while (1) {
                  switch (_context11.prev = _context11.next) {
                    case 0:
                      state.loading = true;
                      path = state.dPath || derivationPaths[wallet.name][0].path;
                      _context11.prev = 2;
                      _context11.next = 5;
                      return wallet.provider.setPath(path, state.showCustomInput);

                    case 5:
                      validPath = _context11.sent;

                      if (validPath) {
                        _context11.next = 10;
                        break;
                      }

                      state.error = "".concat(path, " is not a valid derivation path");
                      state.loading = false;
                      return _context11.abrupt("return");

                    case 10:
                      _context11.next = 17;
                      break;

                    case 12:
                      _context11.prev = 12;
                      _context11.t0 = _context11["catch"](2);
                      state.error = _context11.t0;
                      state.loading = false;
                      return _context11.abrupt("return");

                    case 17:
                      state.error = '';

                      if (wallet.connect) {
                        wallet.connect().then(function () {
                          deleteWindowProperties();
                          state.loading = false;
                          state.completed = true;
                        })["catch"](function (error) {
                          state.error = error.message;
                          state.loading = false;
                        });
                      }

                    case 19:
                    case "end":
                      return _context11.stop();
                  }
                }
              }, _callee11, null, [[2, 12]]);
            }));

            function onclick() {
              return _onclick.apply(this, arguments);
            }

            return onclick;
          }()
        },
        icon: icon || usbIcon
      };
    }
  }

  checkModule.reset = resetState;
  return checkModule;
}

var derivationPath$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': derivationPath
});
/* src/views/Onboard.svelte generated by Svelte v3.24.0 */

function add_css$b() {
  var style = element("style");
  style.id = "svelte-1pen0yy-style";
  style.textContent = ".bn-onboard-custom.bn-onboard-dark-mode{background:#283944;color:#ffffff}.bn-onboard-custom.bn-onboard-dark-mode-background-hover:hover, .bn-onboard-custom.bn-onboard-dark-mode-background{background:#0e212a}.bn-onboard-clickable{text-decoration:none}.bn-onboard-clickable:hover{cursor:pointer;text-decoration:underline}.bn-onboard-custom.bn-onboard-dark-mode-link{color:#91bced;border-color:#91bced}";
  append(document.head, style);
} // (36:0) {#if $app.walletSelectInProgress}


function create_if_block_2$3(ctx) {
  var walletselect;
  var current;
  walletselect = new WalletSelect({
    props: {
      module:
      /*walletSelectModule*/
      ctx[0]
    }
  });
  return {
    c: function c() {
      create_component(walletselect.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(walletselect, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var walletselect_changes = {};
      if (dirty &
      /*walletSelectModule*/
      1) walletselect_changes.module =
      /*walletSelectModule*/
      ctx[0];
      walletselect.$set(walletselect_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(walletselect.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(walletselect.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(walletselect, detaching);
    }
  };
} // (40:0) {#if $app.walletCheckInProgress}


function create_if_block_1$5(ctx) {
  var walletcheck;
  var current;
  walletcheck = new WalletCheck({
    props: {
      walletSelect:
      /*walletSelect*/
      ctx[1]
    }
  });
  return {
    c: function c() {
      create_component(walletcheck.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(walletcheck, target, anchor);
      current = true;
    },
    p: function p(ctx, dirty) {
      var walletcheck_changes = {};
      if (dirty &
      /*walletSelect*/
      2) walletcheck_changes.walletSelect =
      /*walletSelect*/
      ctx[1];
      walletcheck.$set(walletcheck_changes);
    },
    i: function i(local) {
      if (current) return;
      transition_in(walletcheck.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(walletcheck.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(walletcheck, detaching);
    }
  };
} // (44:0) {#if $app.accountSelectInProgress}


function create_if_block$9(ctx) {
  var walletcheck;
  var current;
  walletcheck = new WalletCheck({
    props: {
      modules: [derivationPath(), accountSelect()]
    }
  });
  return {
    c: function c() {
      create_component(walletcheck.$$.fragment);
    },
    m: function m(target, anchor) {
      mount_component(walletcheck, target, anchor);
      current = true;
    },
    p: noop,
    i: function i(local) {
      if (current) return;
      transition_in(walletcheck.$$.fragment, local);
      current = true;
    },
    o: function o(local) {
      transition_out(walletcheck.$$.fragment, local);
      current = false;
    },
    d: function d(detaching) {
      destroy_component(walletcheck, detaching);
    }
  };
}

function create_fragment$b(ctx) {
  var t0;
  var t1;
  var if_block2_anchor;
  var current;
  var if_block0 =
  /*$app*/
  ctx[2].walletSelectInProgress && create_if_block_2$3(ctx);
  var if_block1 =
  /*$app*/
  ctx[2].walletCheckInProgress && create_if_block_1$5(ctx);
  var if_block2 =
  /*$app*/
  ctx[2].accountSelectInProgress && create_if_block$9();
  return {
    c: function c() {
      if (if_block0) if_block0.c();
      t0 = space();
      if (if_block1) if_block1.c();
      t1 = space();
      if (if_block2) if_block2.c();
      if_block2_anchor = empty();
    },
    m: function m(target, anchor) {
      if (if_block0) if_block0.m(target, anchor);
      insert(target, t0, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, t1, anchor);
      if (if_block2) if_block2.m(target, anchor);
      insert(target, if_block2_anchor, anchor);
      current = true;
    },
    p: function p(ctx, _ref35) {
      var _ref36 = _slicedToArray(_ref35, 1),
          dirty = _ref36[0];

      if (
      /*$app*/
      ctx[2].walletSelectInProgress) {
        if (if_block0) {
          if_block0.p(ctx, dirty);

          if (dirty &
          /*$app*/
          4) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_2$3(ctx);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(t0.parentNode, t0);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, function () {
          if_block0 = null;
        });
        check_outros();
      }

      if (
      /*$app*/
      ctx[2].walletCheckInProgress) {
        if (if_block1) {
          if_block1.p(ctx, dirty);

          if (dirty &
          /*$app*/
          4) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_1$5(ctx);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(t1.parentNode, t1);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, function () {
          if_block1 = null;
        });
        check_outros();
      }

      if (
      /*$app*/
      ctx[2].accountSelectInProgress) {
        if (if_block2) {
          if_block2.p(ctx, dirty);

          if (dirty &
          /*$app*/
          4) {
            transition_in(if_block2, 1);
          }
        } else {
          if_block2 = create_if_block$9();
          if_block2.c();
          transition_in(if_block2, 1);
          if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
        }
      } else if (if_block2) {
        group_outros();
        transition_out(if_block2, 1, 1, function () {
          if_block2 = null;
        });
        check_outros();
      }
    },
    i: function i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(if_block1);
      transition_in(if_block2);
      current = true;
    },
    o: function o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      transition_out(if_block2);
      current = false;
    },
    d: function d(detaching) {
      if (if_block0) if_block0.d(detaching);
      if (detaching) detach(t0);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(t1);
      if (if_block2) if_block2.d(detaching);
      if (detaching) detach(if_block2_anchor);
    }
  };
}

function instance$b($$self, $$props, $$invalidate) {
  var $app;
  component_subscribe($$self, app, function ($$value) {
    return $$invalidate(2, $app = $$value);
  });
  var walletSelectModule = $$props.walletSelectModule;
  var walletSelect = $$props.walletSelect;

  $$self.$set = function ($$props) {
    if ("walletSelectModule" in $$props) $$invalidate(0, walletSelectModule = $$props.walletSelectModule);
    if ("walletSelect" in $$props) $$invalidate(1, walletSelect = $$props.walletSelect);
  };

  return [walletSelectModule, walletSelect, $app];
}

var Onboard = /*#__PURE__*/function (_SvelteComponent12) {
  _inherits(Onboard, _SvelteComponent12);

  var _super12 = _createSuper(Onboard);

  function Onboard(options) {
    var _this12;

    _classCallCheck(this, Onboard);

    _this12 = _super12.call(this);
    if (!document.getElementById("svelte-1pen0yy-style")) add_css$b();
    init(_assertThisInitialized(_this12), options, instance$b, create_fragment$b, safe_not_equal, {
      walletSelectModule: 0,
      walletSelect: 1
    });
    return _this12;
  }

  return Onboard;
}(SvelteComponent);

var version = "1.14.0b"; // wallets that qualify for default wallets need to have no
// init parameters that are required for full functionality

var defaultWalletNames = ['enjin', 'metamask', 'dapper', 'coinbase', 'trust', 'authereum', 'torus', 'opera', 'operaTouch', 'status', 'hyperpay', 'unilogin'];

function select(wallets, networkId) {
  if (wallets) {
    return Promise.all(wallets.map(function (wallet) {
      if (isWalletInit(wallet)) {
        var walletName = wallet.walletName,
            initParams = _objectWithoutProperties(wallet, ["walletName"]);

        var module = getModule(walletName);

        if (!module) {
          throw new Error("".concat(walletName, " is not a valid walletName."));
        }

        return module && module.then(function (m) {
          return m["default"](_objectSpread(_objectSpread({}, initParams), {}, {
            networkId: networkId
          }));
        });
      }

      return Promise.resolve(wallet);
    }));
  }

  return Promise.all(defaultWalletNames.map(function (walletName) {
    var module = getModule(walletName);

    if (module) {
      return module.then(function (m) {
        return m["default"]({
          networkId: networkId
        });
      });
    }
  }));
}

function getModule(name) {
  switch (name) {
    case 'meetone':
      return import('./meetone-498d5b39.js');

    case 'metamask':
      return import('./metamask-d437f138.js');

    case 'dapper':
      return import('./dapper-be95b0e6.js');

    case 'portis':
      return import('./portis-eb9eb906.js');

    case 'fortmatic':
      return import('./fortmatic-b82403c2.js');

    case 'squarelink':
      return import('./squarelink-cb19e917.js');

    case 'authereum':
      return import('./authereum-a78cd6de.js');

    case 'trust':
      return import('./trust-67e47ffa.js');

    case 'coinbase':
      return import('./coinbase-c0bb4449.js');

    case 'walletConnect':
      return import('./wallet-connect-74bfa317.js');

    case 'opera':
      return import('./opera-c8be8526.js');

    case 'operaTouch':
      return import('./opera-touch-36d44122.js');

    case 'torus':
      return import('./torus-2c6c807e.js');

    case 'status':
      return import('./status-17aacc06.js');

    case 'trezor':
      return import('./trezor-05345fcc.js');

    case 'lattice':
      return import('./lattice-63e72a8f.js');

    case 'ledger':
      return import('./ledger-71657cc6.js');

    case 'walletLink':
      return import('./wallet-link-a4e44053.js');

    case 'imToken':
      return import('./imtoken-df621d5a.js');

    case 'unilogin':
      return import('./unilogin-fc5d8386.js');

    case 'mykey':
      return import('./mykey-f9a238ed.js');

    case 'enjin':
      return import('./enjin-fbd3634a.js');

    case 'huobiwallet':
      return import('./huobiwallet-119ccc28.js');

    case 'wallet.io':
      return import('./wallet-io-ad35ae77.js');

    case 'hyperpay':
      return import('./hyperpay-da3865b4.js');

    default:
      return;
  }
}

var defaultChecks = ['connect', 'network'];

function check(_x10, _x11) {
  return _check.apply(this, arguments);
}

function _check() {
  _check = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(walletChecks, networkId) {
    var checks;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (!walletChecks) {
              _context12.next = 3;
              break;
            }

            checks = walletChecks.map(function (checkOrModule) {
              if (!isWalletCheckModule(checkOrModule)) {
                var checkName = checkOrModule.checkName,
                    otherParams = _objectWithoutProperties(checkOrModule, ["checkName"]);

                var module = getModule$1(checkName);
                return module && module.then(function (m) {
                  return m["default"](_objectSpread(_objectSpread({}, otherParams), {}, {
                    networkId: networkId
                  }));
                });
              }

              return Promise.resolve(checkOrModule);
            });
            return _context12.abrupt("return", Promise.all(checks));

          case 3:
            return _context12.abrupt("return", Promise.all(defaultChecks.map(function (checkName) {
              var module = getModule$1(checkName);
              return module && module.then(function (m) {
                return m["default"]({
                  networkId: networkId
                });
              });
            })));

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _check.apply(this, arguments);
}

function getModule$1(name) {
  switch (name) {
    case 'connect':
      return import('./connect-268c9f03.js');

    case 'network':
      return import('./network-d99e073b.js');

    case 'balance':
      return import('./balance-73febc10.js');

    case 'accounts':
      return Promise.resolve().then(function () {
        return accounts;
      });

    case 'derivationPath':
      return Promise.resolve().then(function () {
        return derivationPath$1;
      });

    default:
      throw new Error("invalid module name: ".concat(name));
  }
}

var defaultHeading = 'Select a Wallet';
var defaultDescription = 'Please select a wallet to connect to this dapp:';
var defaultWalletExplanation = "Wallets are used to send, receive, and store digital assets like Ether. Wallets come in many forms. They are either built into your browser, an extension added to your browser, a piece of hardware plugged into your computer or even an app on your phone. For more information about wallets, see <a style=\"color: #4a90e2; font-size: 0.889rem; font-family: inherit;\" class=\"bn-onboard-clickable\" href=\"https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/\" target=\"_blank\" rel=\"noopener noreferrer\">this explanation</a>.";

function initializeModules(networkId, walletSelect, walletCheck) {
  var wallets = select(walletSelect && walletSelect.wallets, networkId);
  return {
    walletSelect: {
      heading: walletSelect && walletSelect.heading || defaultHeading,
      description: walletSelect && walletSelect.description || defaultDescription,
      wallets: wallets,
      explanation: walletSelect && walletSelect.explanation || defaultWalletExplanation
    },
    walletCheck: check(walletCheck, networkId)
  };
}

var onboard;

function init$1(initialization) {
  if (onboard) {
    console.warn('onboard has already been initialized');
    onboard.$destroy();
  }

  validateInit(initialization);
  var subscriptions = initialization.subscriptions,
      dappId = initialization.dappId,
      networkId = initialization.networkId,
      darkMode = initialization.darkMode,
      apiUrl = initialization.apiUrl,
      hideBranding = initialization.hideBranding;

  var _getDeviceInfo = getDeviceInfo(),
      os = _getDeviceInfo.os,
      browser = _getDeviceInfo.browser,
      isMobile = _getDeviceInfo.isMobile;

  var initializedModules = initializeModules(networkId, initialization.walletSelect, initialization.walletCheck);
  var displayBranding;

  if (dappId) {
    if (hideBranding !== false) {
      displayBranding = false;
    } else {
      displayBranding = true;
    }
  } else {
    if (hideBranding !== true) {
      displayBranding = true;
    } else {
      displayBranding = false;
    }
  }

  app.update(function (store) {
    return _objectSpread(_objectSpread({}, store), {}, {
      dappId: dappId,
      networkId: networkId,
      version: version,
      mobileDevice: isMobile,
      os: os,
      browser: browser,
      darkMode: darkMode,
      displayBranding: displayBranding,
      checkModules: initializedModules.walletCheck
    });
  });
  initializeStores();

  if (dappId) {
    initializeBlocknative(dappId, networkId, apiUrl);
  }

  onboard = new Onboard({
    target: document.body,
    props: {
      walletSelectModule: initializedModules.walletSelect,
      walletSelect: walletSelect
    }
  }); // register subscriptions

  if (subscriptions) {
    if (subscriptions.address) {
      address.subscribe(function (address) {
        if (address !== null) {
          subscriptions.address && subscriptions.address(address);
        }
      });
    }

    if (subscriptions.network) {
      network.subscribe(function (networkId) {
        if (networkId !== null) {
          subscriptions.network && subscriptions.network(networkId);
        }
      });
    }

    if (subscriptions.balance) {
      balance.subscribe(function (balance) {
        if (balance !== null) {
          subscriptions.balance && subscriptions.balance(balance);
        }
      });
    }

    if (subscriptions.wallet) {
      wallet.subscribe(function (wallet) {
        if (wallet.provider !== null) {
          subscriptions.wallet && subscriptions.wallet(wallet);
        }
      });
    }
  }

  function walletSelect(autoSelectWallet) {
    return new Promise(function (resolve) {
      app.update(function (store) {
        return _objectSpread(_objectSpread({}, store), {}, {
          walletSelectInProgress: true,
          autoSelectWallet: typeof autoSelectWallet === 'string' && autoSelectWallet
        });
      });
      var appUnsubscribe = app.subscribe(function (store) {
        var walletSelectInProgress = store.walletSelectInProgress,
            walletSelectCompleted = store.walletSelectCompleted,
            walletSelectDisplayedUI = store.walletSelectDisplayedUI;

        if (walletSelectInProgress === false) {
          appUnsubscribe(); // timeout for UI transitions if it was displayed

          walletSelectDisplayedUI ? setTimeout(function () {
            resolve(walletSelectCompleted);
            app.update(function (store) {
              return _objectSpread(_objectSpread({}, store), {}, {
                displayedUI: false
              });
            });
          }, 500) : resolve(walletSelectCompleted);
        }
      });
    });
  }

  function walletCheck() {
    return new Promise(function (resolve) {
      if (!get_store_value(walletInterface)) {
        throw new Error('walletSelect must be called before walletCheck');
      }

      app.update(function (store) {
        return _objectSpread(_objectSpread({}, store), {}, {
          walletCheckInProgress: true
        });
      });
      var appUnsubscribe = app.subscribe(function (store) {
        var walletCheckInProgress = store.walletCheckInProgress,
            walletCheckCompleted = store.walletCheckCompleted,
            walletCheckDisplayedUI = store.walletCheckDisplayedUI;

        if (walletCheckInProgress === false) {
          appUnsubscribe();
          walletCheckDisplayedUI ? setTimeout(function () {
            resolve(walletCheckCompleted);
            app.update(function (store) {
              return _objectSpread(_objectSpread({}, store), {}, {
                displayedUI: false
              });
            });
          }, 500) : resolve(walletCheckCompleted);
        }
      });
    });
  }

  function walletReset() {
    resetWalletState();
  }

  function accountSelect() {
    return new Promise(function (resolve) {
      var _get_store_value4 = get_store_value(wallet),
          type = _get_store_value4.type;

      if (type !== 'hardware') {
        resolve(false);
      }

      app.update(function (store) {
        return _objectSpread(_objectSpread({}, store), {}, {
          accountSelectInProgress: true
        });
      });
      var appUnsubscribe = app.subscribe(function (store) {
        var accountSelectInProgress = store.accountSelectInProgress,
            walletSelectDisplayedUI = store.walletSelectDisplayedUI;

        if (accountSelectInProgress === false) {
          appUnsubscribe();
          walletSelectDisplayedUI ? setTimeout(function () {
            resolve(true);
            app.update(function (store) {
              return _objectSpread(_objectSpread({}, store), {}, {
                displayedUI: false
              });
            });
          }, 500) : resolve(true);
        }
      });
    });
  }

  function config(options) {
    validateConfig(options);
    app.update(function (store) {
      return _objectSpread(_objectSpread({}, store), options);
    });
  }

  function getState() {
    return get_store_value(state);
  }

  return {
    walletSelect: walletSelect,
    walletCheck: walletCheck,
    walletReset: walletReset,
    config: config,
    getState: getState,
    accountSelect: accountSelect
  };
}

export { networkToId as a, balanceIcon as b, connectIcon as c, init$1 as i, networkName as n, openLink as o };