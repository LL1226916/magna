/*!
 * bpmn-js - bpmn-properties-panel v0.24.2
 *
 * Copyright (c) 2014-present, camunda Services GmbH
 *
 * Released under the bpmn.io license
 * http://bpmn.io/license
 *
 * Source Code: https://github.com/bpmn-io/bpmn-js
 *
 * Date: 2019-04-05
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('indexof'), require('query'), require('matches-selector'), require('event'), require('closest'), require('events')) :
    typeof define === 'function' && define.amd ? define(['indexof', 'query', 'matches-selector', 'event', 'closest', 'events'], factory) :
      (global.PropertiesPanel = factory(null, global.query, null, global.event, null, global.events));
}(this, (function (indexof, query, matchesSelector, event, closest, events) {
  'use strict';

  query = query && query.hasOwnProperty('default') ? query['default'] : query;
  event = event && event.hasOwnProperty('default') ? event['default'] : event;
  events = events && events.hasOwnProperty('default') ? events['default'] : events;

  /**
   * Set attribute `name` to `val`, or get attr `name`.
   *
   * @param {Element} el
   * @param {String} name
   * @param {String} [val]
   * @api public
   */
  function attr(el, name, val) {
    // get
    if (arguments.length == 2) {
      return el.getAttribute(name);
    }

    // remove
    if (val === null) {
      return el.removeAttribute(name);
    }

    // set
    el.setAttribute(name, val);

    return el;
  }

  var indexOf = [].indexOf;

  var indexof$1 = function (arr, obj) {
    if (indexOf) return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };

  /**
   * Taken from https://github.com/component/classes
   *
   * Without the component bits.
   */

  /**
   * Whitespace regexp.
   */

  var re = /\s+/;

  /**
   * toString reference.
   */

  var toString = Object.prototype.toString;

  /**
   * Wrap `el` in a `ClassList`.
   *
   * @param {Element} el
   * @return {ClassList}
   * @api public
   */

  function classes(el) {
    return new ClassList(el);
  }

  /**
   * Initialize a new ClassList for `el`.
   *
   * @param {Element} el
   * @api private
   */

  function ClassList(el) {
    if (!el || !el.nodeType) {
      throw new Error('A DOM element reference is required');
    }
    this.el = el;
    this.list = el.classList;
  }

  /**
   * Add class `name` if not already present.
   *
   * @param {String} name
   * @return {ClassList}
   * @api public
   */

  ClassList.prototype.add = function (name) {
    // classList
    if (this.list) {
      this.list.add(name);
      return this;
    }

    // fallback
    var arr = this.array();
    var i = indexof$1(arr, name);
    if (!~i) arr.push(name);
    this.el.className = arr.join(' ');
    return this;
  };

  /**
   * Remove class `name` when present, or
   * pass a regular expression to remove
   * any which match.
   *
   * @param {String|RegExp} name
   * @return {ClassList}
   * @api public
   */

  ClassList.prototype.remove = function (name) {
    if ('[object RegExp]' == toString.call(name)) {
      return this.removeMatching(name);
    }

    // classList
    if (this.list) {
      this.list.remove(name);
      return this;
    }

    // fallback
    var arr = this.array();
    var i = indexof$1(arr, name);
    if (~i) arr.splice(i, 1);
    this.el.className = arr.join(' ');
    return this;
  };

  /**
   * Remove all classes matching `re`.
   *
   * @param {RegExp} re
   * @return {ClassList}
   * @api private
   */

  ClassList.prototype.removeMatching = function (re) {
    var arr = this.array();
    for (var i = 0; i < arr.length; i++) {
      if (re.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
    return this;
  };

  /**
   * Toggle class `name`, can force state via `force`.
   *
   * For browsers that support classList, but do not support `force` yet,
   * the mistake will be detected and corrected.
   *
   * @param {String} name
   * @param {Boolean} force
   * @return {ClassList}
   * @api public
   */

  ClassList.prototype.toggle = function (name, force) {
    // classList
    if (this.list) {
      if ('undefined' !== typeof force) {
        if (force !== this.list.toggle(name, force)) {
          this.list.toggle(name); // toggle again to correct
        }
      } else {
        this.list.toggle(name);
      }
      return this;
    }

    // fallback
    if ('undefined' !== typeof force) {
      if (!force) {
        this.remove(name);
      } else {
        this.add(name);
      }
    } else {
      if (this.has(name)) {
        this.remove(name);
      } else {
        this.add(name);
      }
    }

    return this;
  };

  /**
   * Return an array of classes.
   *
   * @return {Array}
   * @api public
   */

  ClassList.prototype.array = function () {
    var className = this.el.getAttribute('class') || '';
    var str = className.replace(/^\s+|\s+$/g, '');
    var arr = str.split(re);
    if ('' === arr[0]) arr.shift();
    return arr;
  };

  /**
   * Check if class `name` is present.
   *
   * @param {String} name
   * @return {ClassList}
   * @api public
   */

  ClassList.prototype.has = ClassList.prototype.contains = function (name) {
    return this.list ? this.list.contains(name) : !!~indexof$1(this.array(), name);
  };

  /**
   * Remove all children from the given element.
   */
  function clear(el) {

    var c;

    while (el.childNodes.length) {
      c = el.childNodes[0];
      el.removeChild(c);
    }

    return el;
  }

  /**
   * Element prototype.
   */

  var proto = Element.prototype;

  /**
   * Vendor function.
   */

  var vendor = proto.matchesSelector
    || proto.webkitMatchesSelector
    || proto.mozMatchesSelector
    || proto.msMatchesSelector
    || proto.oMatchesSelector;

  /**
   * Expose `match()`.
   */

  var matchesSelector$1 = match;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match(el, selector) {
    if (vendor) return vendor.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  var closest$1 = function (element, selector, checkYoSelf) {
    var parent = checkYoSelf ? element : element.parentNode;

    while (parent && parent !== document) {
      if (matchesSelector$1(parent, selector)) return parent;
      parent = parent.parentNode;
    }
  };

  var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

  /**
   * Bind `el` event `type` to `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var bind_1 = function (el, type, fn, capture) {
    el[bind](prefix + type, fn, capture || false);
    return fn;
  };

  /**
   * Unbind `el` event `type`'s callback `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var unbind_1 = function (el, type, fn, capture) {
    el[unbind](prefix + type, fn, capture || false);
    return fn;
  };

  var componentEvent = {
    bind: bind_1,
    unbind: unbind_1
  };

  /**
   * Module dependencies.
   */



  /**
   * Delegate event `type` to `selector`
   * and invoke `fn(e)`. A callback function
   * is returned which may be passed to `.unbind()`.
   *
   * @param {Element} el
   * @param {String} selector
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  // Some events don't bubble, so we want to bind to the capture phase instead
  // when delegating.
  var forceCaptureEvents = ['focus', 'blur'];

  var bind$1 = function (el, selector, type, fn, capture) {
    if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

    return componentEvent.bind(el, type, function (e) {
      var target = e.target || e.srcElement;
      e.delegateTarget = closest$1(target, selector, true, el);
      if (e.delegateTarget) fn.call(el, e);
    }, capture);
  };

  /**
   * Unbind event `type`'s callback `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @api public
   */

  var unbind$1 = function (el, type, fn, capture) {
    if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

    componentEvent.unbind(el, type, fn, capture);
  };

  var delegateEvents = {
    bind: bind$1,
    unbind: unbind$1
  };

  /**
   * Expose `parse`.
   */

  var domify = parse;

  /**
   * Tests for browser support.
   */

  var innerHTMLBug = false;
  var bugTestDiv;
  if (typeof document !== 'undefined') {
    bugTestDiv = document.createElement('div');
    // Setup
    bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
    bugTestDiv = undefined;
  }

  /**
   * Wrap map from jquery.
   */

  var map = {
    legend: [1, '<fieldset>', '</fieldset>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    // for script/link/style tags to work in IE6-8, you have to wrap
    // in a div with a non-whitespace character in front, ha!
    _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
  };

  map.td =
    map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

  map.option =
    map.optgroup = [1, '<select multiple="multiple">', '</select>'];

  map.thead =
    map.tbody =
    map.colgroup =
    map.caption =
    map.tfoot = [1, '<table>', '</table>'];

  map.polyline =
    map.ellipse =
    map.polygon =
    map.circle =
    map.text =
    map.line =
    map.path =
    map.rect =
    map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

  /**
   * Parse `html` and return a DOM Node instance, which could be a TextNode,
   * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
   * instance, depending on the contents of the `html` string.
   *
   * @param {String} html - HTML string to "domify"
   * @param {Document} doc - The `document` instance to create the Node for
   * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
   * @api private
   */

  function parse(html, doc) {
    if ('string' != typeof html) throw new TypeError('String expected');

    // default to the global `document` object
    if (!doc) doc = document;

    // tag name
    var m = /<([\w:]+)/.exec(html);
    if (!m) return doc.createTextNode(html);

    html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

    var tag = m[1];

    // body support
    if (tag == 'body') {
      var el = doc.createElement('html');
      el.innerHTML = html;
      return el.removeChild(el.lastChild);
    }

    // wrap map
    var wrap = map[tag] || map._default;
    var depth = wrap[0];
    var prefix = wrap[1];
    var suffix = wrap[2];
    var el = doc.createElement('div');
    el.innerHTML = prefix + html + suffix;
    while (depth--) el = el.lastChild;

    // one element
    if (el.firstChild == el.lastChild) {
      return el.removeChild(el.firstChild);
    }

    // several elements
    var fragment = doc.createDocumentFragment();
    while (el.firstChild) {
      fragment.appendChild(el.removeChild(el.firstChild));
    }

    return fragment;
  }

  var proto$1 = typeof Element !== 'undefined' ? Element.prototype : {};
  var vendor$1 = proto$1.matches
    || proto$1.matchesSelector
    || proto$1.webkitMatchesSelector
    || proto$1.mozMatchesSelector
    || proto$1.msMatchesSelector
    || proto$1.oMatchesSelector;

  var matchesSelector$1$1 = match$1;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match$1(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    if (vendor$1) return vendor$1.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  function query$1(selector, el) {
    el = el || document;

    return el.querySelector(selector);
  }

  function all(selector, el) {
    el = el || document;

    return el.querySelectorAll(selector);
  }

  function remove(el) {
    el.parentNode && el.parentNode.removeChild(el);
  }

  var index_esm = /*#__PURE__*/Object.freeze({
    attr: attr,
    classes: classes,
    clear: clear,
    closest: closest$1,
    delegate: delegateEvents,
    domify: domify,
    event: componentEvent,
    matches: matchesSelector$1$1,
    query: query$1,
    queryAll: all,
    remove: remove
  });

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
      length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  var arrayEach_1 = arrayEach;

  /**
   * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return !!value && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /**
   * Converts `value` to an object if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    return isObject_1(value) ? value : Object(value);
  }

  var toObject_1 = toObject;

  /**
   * Creates a base function for `_.forIn` or `_.forInRight`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function (object, iteratee, keysFunc) {
      var iterable = toObject_1(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

      while ((fromRight ? index-- : ++index < length)) {
        var key = props[index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  var createBaseFor_1 = createBaseFor;

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iteratee functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor_1();

  var baseFor_1 = baseFor;

  /** `Object#toString` result references. */
  var funcTag = '[object Function]';

  /** Used for native method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString = objectProto.toString;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in older versions of Chrome and Safari which return 'function' for regexes
    // and Safari 8 which returns 'object' for typed array constructors.
    return isObject_1(value) && objToString.call(value) == funcTag;
  }

  var isFunction_1 = isFunction;

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** Used to detect host constructors (Safari > 5). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for native method references. */
  var objectProto$1 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (isFunction_1(value)) {
      return reIsNative.test(fnToString.call(value));
    }
    return isObjectLike_1(value) && reIsHostCtor.test(value);
  }

  var isNative_1 = isNative;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = object == null ? undefined : object[key];
    return isNative_1(value) ? value : undefined;
  }

  var getNative_1 = getNative;

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function (object) {
      return object == null ? undefined : object[key];
    };
  }

  var baseProperty_1 = baseProperty;

  /**
   * Gets the "length" property value of `object`.
   *
   * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
   * that affects Safari on at least iOS 8.1-8.3 ARM64.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {*} Returns the "length" value.
   */
  var getLength = baseProperty_1('length');

  var getLength_1 = getLength;

  /**
   * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
   * of an array-like value.
   */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  var isLength_1 = isLength;

  /**
   * Checks if `value` is array-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   */
  function isArrayLike(value) {
    return value != null && isLength_1(getLength_1(value));
  }

  var isArrayLike_1 = isArrayLike;

  /** Used for native method references. */
  var objectProto$2 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Native method references. */
  var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    return isObjectLike_1(value) && isArrayLike_1(value) &&
      hasOwnProperty$1.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
  }

  var isArguments_1 = isArguments;

  /** `Object#toString` result references. */
  var arrayTag = '[object Array]';

  /** Used for native method references. */
  var objectProto$3 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString$1 = objectProto$3.toString;

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeIsArray = getNative_1(Array, 'isArray');

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(function() { return arguments; }());
   * // => false
   */
  var isArray = nativeIsArray || function (value) {
    return isObjectLike_1(value) && isLength_1(value.length) && objToString$1.call(value) == arrayTag;
  };

  var isArray_1 = isArray;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^\d+$/;

  /**
   * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
   * of an array-like value.
   */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
    length = length == null ? MAX_SAFE_INTEGER$1 : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  var isIndex_1 = isIndex;

  /** Used for native method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$4.hasOwnProperty;

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject_1(object)) {
      object = Object(object);
    }
    var length = object.length;
    length = (length && isLength_1(length) &&
      (isArray_1(object) || isArguments_1(object)) && length) || 0;

    var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

    while (++index < length) {
      result[index] = (index + '');
    }
    for (var key in object) {
      if (!(skipIndexes && isIndex_1(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty$2.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  var keysIn_1 = keysIn;

  /** Used for native method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

  /**
   * A fallback implementation of `Object.keys` which creates an array of the
   * own enumerable property names of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function shimKeys(object) {
    var props = keysIn_1(object),
      propsLength = props.length,
      length = propsLength && object.length;

    var allowIndexes = !!length && isLength_1(length) &&
      (isArray_1(object) || isArguments_1(object));

    var index = -1,
      result = [];

    while (++index < propsLength) {
      var key = props[index];
      if ((allowIndexes && isIndex_1(key, length)) || hasOwnProperty$3.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  var shimKeys_1 = shimKeys;

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeKeys = getNative_1(Object, 'keys');

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = !nativeKeys ? shimKeys_1 : function (object) {
    var Ctor = object == null ? undefined : object.constructor;
    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike_1(object))) {
      return shimKeys_1(object);
    }
    return isObject_1(object) ? nativeKeys(object) : [];
  };

  var keys_1 = keys;

  /**
   * The base implementation of `_.forOwn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return baseFor_1(object, iteratee, keys_1);
  }

  var baseForOwn_1 = baseForOwn;

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function (collection, iteratee) {
      var length = collection ? getLength_1(collection) : 0;
      if (!isLength_1(length)) {
        return eachFunc(collection, iteratee);
      }
      var index = fromRight ? length : -1,
        iterable = toObject_1(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  var createBaseEach_1 = createBaseEach;

  /**
   * The base implementation of `_.forEach` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  var baseEach = createBaseEach_1(baseForOwn_1);

  var baseEach_1 = baseEach;

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   *
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * A specialized version of `baseCallback` which only supports `this` binding
   * and specifying the number of arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity_1;
    }
    if (thisArg === undefined) {
      return func;
    }
    switch (argCount) {
      case 1: return function (value) {
        return func.call(thisArg, value);
      };
      case 3: return function (value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function (accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
      case 5: return function (value, other, key, object, source) {
        return func.call(thisArg, value, other, key, object, source);
      };
    }
    return function () {
      return func.apply(thisArg, arguments);
    };
  }

  var bindCallback_1 = bindCallback;

  /**
   * Creates a function for `_.forEach` or `_.forEachRight`.
   *
   * @private
   * @param {Function} arrayFunc The function to iterate over an array.
   * @param {Function} eachFunc The function to iterate over a collection.
   * @returns {Function} Returns the new each function.
   */
  function createForEach(arrayFunc, eachFunc) {
    return function (collection, iteratee, thisArg) {
      return (typeof iteratee == 'function' && thisArg === undefined && isArray_1(collection))
        ? arrayFunc(collection, iteratee)
        : eachFunc(collection, bindCallback_1(iteratee, thisArg, 3));
    };
  }

  var createForEach_1 = createForEach;

  /**
   * Iterates over elements of `collection` invoking `iteratee` for each element.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection). Iteratee functions may exit iteration early
   * by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length" property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2]).forEach(function(n) {
   *   console.log(n);
   * }).value();
   * // => logs each value from left to right and returns the array
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
   *   console.log(n, key);
   * });
   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
   */
  var forEach = createForEach_1(arrayEach_1, baseEach_1);

  var forEach_1 = forEach;

  /**
   * A specialized version of `_.filter` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
      length = array.length,
      resIndex = -1,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[++resIndex] = value;
      }
    }
    return result;
  }

  var arrayFilter_1 = arrayFilter;

  /**
   * A specialized version of `_.some` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
      length = array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  var arraySome_1 = arraySome;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing arrays.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var index = -1,
      arrLength = array.length,
      othLength = other.length;

    if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
      return false;
    }
    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
        othValue = other[index],
        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;

      if (result !== undefined) {
        if (result) {
          continue;
        }
        return false;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (isLoose) {
        if (!arraySome_1(other, function (othValue) {
          return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
        })) {
          return false;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
        return false;
      }
    }
    return true;
  }

  var equalArrays_1 = equalArrays;

  /** `Object#toString` result references. */
  var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag) {
    switch (tag) {
      case boolTag:
      case dateTag:
        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
        return +object == +other;

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case numberTag:
        // Treat `NaN` vs. `NaN` as equal.
        return (object != +object)
          ? other != +other
          : object == +other;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings primitives and string
        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
        return object == (other + '');
    }
    return false;
  }

  var equalByTag_1 = equalByTag;

  /** Used for native method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objProps = keys_1(object),
      objLength = objProps.length,
      othProps = keys_1(other),
      othLength = othProps.length;

    if (objLength != othLength && !isLoose) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isLoose ? key in other : hasOwnProperty$4.call(other, key))) {
        return false;
      }
    }
    var skipCtor = isLoose;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
        othValue = other[key],
        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose ? objValue : othValue, key) : undefined;

      // Recursively compare objects (susceptible to call stack limits).
      if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
        return false;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (!skipCtor) {
      var objCtor = object.constructor,
        othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        return false;
      }
    }
    return true;
  }

  var equalObjects_1 = equalObjects;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
    typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
    typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
    typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
    typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag$1] =
    typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag$1] =
    typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] =
    typedArrayTags[funcTag$1] = typedArrayTags[mapTag] =
    typedArrayTags[numberTag$1] = typedArrayTags[objectTag] =
    typedArrayTags[regexpTag$1] = typedArrayTags[setTag] =
    typedArrayTags[stringTag$1] = typedArrayTags[weakMapTag] = false;

  /** Used for native method references. */
  var objectProto$7 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString$2 = objectProto$7.toString;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  function isTypedArray(value) {
    return isObjectLike_1(value) && isLength_1(value.length) && !!typedArrayTags[objToString$2.call(value)];
  }

  var isTypedArray_1 = isTypedArray;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    objectTag$1 = '[object Object]';

  /** Used for native method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$8.hasOwnProperty;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString$3 = objectProto$8.toString;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
    var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = arrayTag$2,
      othTag = arrayTag$2;

    if (!objIsArr) {
      objTag = objToString$3.call(object);
      if (objTag == argsTag$1) {
        objTag = objectTag$1;
      } else if (objTag != objectTag$1) {
        objIsArr = isTypedArray_1(object);
      }
    }
    if (!othIsArr) {
      othTag = objToString$3.call(other);
      if (othTag == argsTag$1) {
        othTag = objectTag$1;
      } else if (othTag != objectTag$1) {
        othIsArr = isTypedArray_1(other);
      }
    }
    var objIsObj = objTag == objectTag$1,
      othIsObj = othTag == objectTag$1,
      isSameTag = objTag == othTag;

    if (isSameTag && !(objIsArr || objIsObj)) {
      return equalByTag_1(object, other, objTag);
    }
    if (!isLoose) {
      var objIsWrapped = objIsObj && hasOwnProperty$5.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$5.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
      }
    }
    if (!isSameTag) {
      return false;
    }
    // Assume cyclic values are equal.
    // For more information on detecting circular references see https://es5.github.io/#JO.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == object) {
        return stackB[length] == other;
      }
    }
    // Add `object` and `other` to the stack of traversed objects.
    stackA.push(object);
    stackB.push(other);

    var result = (objIsArr ? equalArrays_1 : equalObjects_1)(object, other, equalFunc, customizer, isLoose, stackA, stackB);

    stackA.pop();
    stackB.pop();

    return result;
  }

  var baseIsEqualDeep_1 = baseIsEqualDeep;

  /**
   * The base implementation of `_.isEqual` without support for `this` binding
   * `customizer` functions.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isLoose] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObject_1(value) && !isObjectLike_1(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep_1(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
  }

  var baseIsEqual_1 = baseIsEqual;

  /**
   * The base implementation of `_.isMatch` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} matchData The propery names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, matchData, customizer) {
    var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = toObject_1(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
        ? data[1] !== object[data[0]]
        : !(data[0] in object)
      ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
        objValue = object[key],
        srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var result = customizer ? customizer(objValue, srcValue, key) : undefined;
        if (!(result === undefined ? baseIsEqual_1(srcValue, objValue, customizer, true) : result)) {
          return false;
        }
      }
    }
    return true;
  }

  var baseIsMatch_1 = baseIsMatch;

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject_1(value);
  }

  var isStrictComparable_1 = isStrictComparable;

  /**
   * Creates a two dimensional array of the key-value pairs for `object`,
   * e.g. `[[key1, value1], [key2, value2]]`.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the new array of key-value pairs.
   * @example
   *
   * _.pairs({ 'barney': 36, 'fred': 40 });
   * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
   */
  function pairs(object) {
    object = toObject_1(object);

    var index = -1,
      props = keys_1(object),
      length = props.length,
      result = Array(length);

    while (++index < length) {
      var key = props[index];
      result[index] = [key, object[key]];
    }
    return result;
  }

  var pairs_1 = pairs;

  /**
   * Gets the propery names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = pairs_1(object),
      length = result.length;

    while (length--) {
      result[length][2] = isStrictComparable_1(result[length][1]);
    }
    return result;
  }

  var getMatchData_1 = getMatchData;

  /**
   * The base implementation of `_.matches` which does not clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   */
  function baseMatches(source) {
    var matchData = getMatchData_1(source);
    if (matchData.length == 1 && matchData[0][2]) {
      var key = matchData[0][0],
        value = matchData[0][1];

      return function (object) {
        if (object == null) {
          return false;
        }
        return object[key] === value && (value !== undefined || (key in toObject_1(object)));
      };
    }
    return function (object) {
      return baseIsMatch_1(object, matchData);
    };
  }

  var baseMatches_1 = baseMatches;

  /**
   * The base implementation of `get` without support for string paths
   * and default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} path The path of the property to get.
   * @param {string} [pathKey] The key representation of path.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path, pathKey) {
    if (object == null) {
      return;
    }
    if (pathKey !== undefined && pathKey in toObject_1(object)) {
      path = [pathKey];
    }
    var index = 0,
      length = path.length;

    while (object != null && index < length) {
      object = object[path[index++]];
    }
    return (index && index == length) ? object : undefined;
  }

  var baseGet_1 = baseGet;

  /**
   * The base implementation of `_.slice` without an iteratee call guard.
   *
   * @private
   * @param {Array} array The array to slice.
   * @param {number} [start=0] The start position.
   * @param {number} [end=array.length] The end position.
   * @returns {Array} Returns the slice of `array`.
   */
  function baseSlice(array, start, end) {
    var index = -1,
      length = array.length;

    start = start == null ? 0 : (+start || 0);
    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = (end === undefined || end > length) ? length : (+end || 0);
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  var baseSlice_1 = baseSlice;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    var type = typeof value;
    if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
      return true;
    }
    if (isArray_1(value)) {
      return false;
    }
    var result = !reIsDeepProp.test(value);
    return result || (object != null && value in toObject_1(object));
  }

  var isKey_1 = isKey;

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  var last_1 = last;

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  var baseToString_1 = baseToString;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `value` to property path array if it's not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Array} Returns the property path array.
   */
  function toPath(value) {
    if (isArray_1(value)) {
      return value;
    }
    var result = [];
    baseToString_1(value).replace(rePropName, function (match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  }

  var toPath_1 = toPath;

  /**
   * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to compare.
   * @returns {Function} Returns the new function.
   */
  function baseMatchesProperty(path, srcValue) {
    var isArr = isArray_1(path),
      isCommon = isKey_1(path) && isStrictComparable_1(srcValue),
      pathKey = (path + '');

    path = toPath_1(path);
    return function (object) {
      if (object == null) {
        return false;
      }
      var key = pathKey;
      object = toObject_1(object);
      if ((isArr || !isCommon) && !(key in object)) {
        object = path.length == 1 ? object : baseGet_1(object, baseSlice_1(path, 0, -1));
        if (object == null) {
          return false;
        }
        key = last_1(path);
        object = toObject_1(object);
      }
      return object[key] === srcValue
        ? (srcValue !== undefined || (key in object))
        : baseIsEqual_1(srcValue, object[key], undefined, true);
    };
  }

  var baseMatchesProperty_1 = baseMatchesProperty;

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new function.
   */
  function basePropertyDeep(path) {
    var pathKey = (path + '');
    path = toPath_1(path);
    return function (object) {
      return baseGet_1(object, path, pathKey);
    };
  }

  var basePropertyDeep_1 = basePropertyDeep;

  /**
   * Creates a function that returns the property value at `path` on a
   * given object.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': { 'c': 2 } } },
   *   { 'a': { 'b': { 'c': 1 } } }
   * ];
   *
   * _.map(objects, _.property('a.b.c'));
   * // => [2, 1]
   *
   * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
   * // => [1, 2]
   */
  function property(path) {
    return isKey_1(path) ? baseProperty_1(path) : basePropertyDeep_1(path);
  }

  var property_1 = property;

  /**
   * The base implementation of `_.callback` which supports specifying the
   * number of arguments to provide to `func`.
   *
   * @private
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function baseCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (type == 'function') {
      return thisArg === undefined
        ? func
        : bindCallback_1(func, thisArg, argCount);
    }
    if (func == null) {
      return identity_1;
    }
    if (type == 'object') {
      return baseMatches_1(func);
    }
    return thisArg === undefined
      ? property_1(func)
      : baseMatchesProperty_1(func, thisArg);
  }

  var baseCallback_1 = baseCallback;

  /**
   * The base implementation of `_.filter` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function baseFilter(collection, predicate) {
    var result = [];
    baseEach_1(collection, function (value, index, collection) {
      if (predicate(value, index, collection)) {
        result.push(value);
      }
    });
    return result;
  }

  var baseFilter_1 = baseFilter;

  /**
   * Iterates over elements of `collection`, returning an array of all elements
   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
   * invoked with three arguments: (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias select
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {Array} Returns the new filtered array.
   * @example
   *
   * _.filter([4, 5, 6], function(n) {
   *   return n % 2 == 0;
   * });
   * // => [4, 6]
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * // using the `_.matches` callback shorthand
   * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
   * // => ['barney']
   *
   * // using the `_.matchesProperty` callback shorthand
   * _.pluck(_.filter(users, 'active', false), 'user');
   * // => ['fred']
   *
   * // using the `_.property` callback shorthand
   * _.pluck(_.filter(users, 'active'), 'user');
   * // => ['barney']
   */
  function filter(collection, predicate, thisArg) {
    var func = isArray_1(collection) ? arrayFilter_1 : baseFilter_1;
    predicate = baseCallback_1(predicate, thisArg, 3);
    return func(collection, predicate);
  }

  var filter_1 = filter;

  /**
   * Gets the property value at `path` of `object`. If the resolved value is
   * `undefined` the `defaultValue` is used in its place.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned if the resolved value is `undefined`.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet_1(object, toPath_1(path), (path + ''));
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  /** `Object#toString` result references. */
  var stringTag$2 = '[object String]';

  /** Used for native method references. */
  var objectProto$9 = Object.prototype;

  /**
   * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objToString$4 = objectProto$9.toString;

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike_1(value) && objToString$4.call(value) == stringTag$2);
  }

  var isString_1 = isString;

  /**
   * Checks if `value` is empty. A value is considered empty unless it's an
   * `arguments` object, array, string, or jQuery-like collection with a length
   * greater than `0` or an object with own enumerable properties.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {Array|Object|string} value The value to inspect.
   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
   * @example
   *
   * _.isEmpty(null);
   * // => true
   *
   * _.isEmpty(true);
   * // => true
   *
   * _.isEmpty(1);
   * // => true
   *
   * _.isEmpty([1, 2, 3]);
   * // => false
   *
   * _.isEmpty({ 'a': 1 });
   * // => false
   */
  function isEmpty(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike_1(value) && (isArray_1(value) || isString_1(value) || isArguments_1(value) ||
      (isObjectLike_1(value) && isFunction_1(value.splice)))) {
      return !value.length;
    }
    return !keys_1(value).length;
  }

  var isEmpty_1 = isEmpty;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
      length = values.length,
      offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var arrayPush_1 = arrayPush;

  /**
   * Gets the index at which the first occurrence of `NaN` is found in `array`.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
   */
  function indexOfNaN(array, fromIndex, fromRight) {
    var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      var other = array[index];
      if (other !== other) {
        return index;
      }
    }
    return -1;
  }

  var indexOfNaN_1 = indexOfNaN;

  /**
   * The base implementation of `_.indexOf` without support for binary searches.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    if (value !== value) {
      return indexOfNaN_1(array, fromIndex);
    }
    var index = fromIndex - 1,
      length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  var baseIndexOf_1 = baseIndexOf;

  /**
   * Checks if `value` is in `cache` mimicking the return signature of
   * `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache to search.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var data = cache.data,
      result = (typeof value == 'string' || isObject_1(value)) ? data.set.has(value) : data.hash[value];

    return result ? 0 : -1;
  }

  var cacheIndexOf_1 = cacheIndexOf;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /**
   * Adds `value` to the cache.
   *
   * @private
   * @name push
   * @memberOf SetCache
   * @param {*} value The value to cache.
   */
  function cachePush(value) {
    var data = this.data;
    if (typeof value == 'string' || isObject_1(value)) {
      data.set.add(value);
    } else {
      data.hash[value] = true;
    }
  }

  var cachePush_1 = cachePush;

  /** Native method references. */
  var Set = getNative_1(commonjsGlobal, 'Set');

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeCreate = getNative_1(Object, 'create');

  /**
   *
   * Creates a cache object to store unique values.
   *
   * @private
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var length = values ? values.length : 0;

    this.data = { 'hash': nativeCreate(null), 'set': new Set };
    while (length--) {
      this.push(values[length]);
    }
  }

  // Add functions to the `Set` cache.
  SetCache.prototype.push = cachePush_1;

  var SetCache_1 = SetCache;

  /** Native method references. */
  var Set$1 = getNative_1(commonjsGlobal, 'Set');

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeCreate$1 = getNative_1(Object, 'create');

  /**
   * Creates a `Set` cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [values] The values to cache.
   * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
   */
  function createCache(values) {
    return (nativeCreate$1 && Set$1) ? new SetCache_1(values) : null;
  }

  var createCache_1 = createCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * The base implementation of `_.difference` which accepts a single array
   * of values to exclude.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   */
  function baseDifference(array, values) {
    var length = array ? array.length : 0,
      result = [];

    if (!length) {
      return result;
    }
    var index = -1,
      indexOf = baseIndexOf_1,
      isCommon = true,
      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache_1(values) : null,
      valuesLength = values.length;

    if (cache) {
      indexOf = cacheIndexOf_1;
      isCommon = false;
      values = cache;
    }
    outer:
    while (++index < length) {
      var value = array[index];

      if (isCommon && value === value) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === value) {
            continue outer;
          }
        }
        result.push(value);
      }
      else if (indexOf(values, value, 0) < 0) {
        result.push(value);
      }
    }
    return result;
  }

  var baseDifference_1 = baseDifference;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE$1 = 200;

  /**
   * The base implementation of `_.uniq` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} [iteratee] The function invoked per iteration.
   * @returns {Array} Returns the new duplicate free array.
   */
  function baseUniq(array, iteratee) {
    var index = -1,
      indexOf = baseIndexOf_1,
      length = array.length,
      isCommon = true,
      isLarge = isCommon && length >= LARGE_ARRAY_SIZE$1,
      seen = isLarge ? createCache_1() : null,
      result = [];

    if (seen) {
      indexOf = cacheIndexOf_1;
      isCommon = false;
    } else {
      isLarge = false;
      seen = iteratee ? [] : result;
    }
    outer:
    while (++index < length) {
      var value = array[index],
        computed = iteratee ? iteratee(value, index, array) : value;

      if (isCommon && value === value) {
        var seenIndex = seen.length;
        while (seenIndex--) {
          if (seen[seenIndex] === computed) {
            continue outer;
          }
        }
        if (iteratee) {
          seen.push(computed);
        }
        result.push(value);
      }
      else if (indexOf(seen, computed, 0) < 0) {
        if (iteratee || isLarge) {
          seen.push(computed);
        }
        result.push(value);
      }
    }
    return result;
  }

  var baseUniq_1 = baseUniq;

  /**
   * Creates an array of unique values that is the [symmetric difference](https://en.wikipedia.org/wiki/Symmetric_difference)
   * of the provided arrays.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {...Array} [arrays] The arrays to inspect.
   * @returns {Array} Returns the new array of values.
   * @example
   *
   * _.xor([1, 2], [4, 2]);
   * // => [1, 4]
   */
  function xor() {
    var index = -1,
      length = arguments.length;

    while (++index < length) {
      var array = arguments[index];
      if (isArrayLike_1(array)) {
        var result = result
          ? arrayPush_1(baseDifference_1(result, array), baseDifference_1(array, result))
          : array;
      }
    }
    return result ? baseUniq_1(result) : [];
  }

  var xor_1 = xor;

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeNow = getNative_1(Date, 'now');

  /**
   * Gets the number of milliseconds that have elapsed since the Unix epoch
   * (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @category Date
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => logs the number of milliseconds it took for the deferred function to be invoked
   */
  var now = nativeNow || function () {
    return new Date().getTime();
  };

  var now_1 = now;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed invocations. Provide an options object to indicate that `func`
   * should be invoked on the leading and/or trailing edge of the `wait` timeout.
   * Subsequent calls to the debounced function return the result of the last
   * `func` invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
   * on the trailing edge of the timeout only if the the debounced function is
   * invoked more than once during the `wait` timeout.
   *
   * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options] The options object.
   * @param {boolean} [options.leading=false] Specify invoking on the leading
   *  edge of the timeout.
   * @param {number} [options.maxWait] The maximum time `func` is allowed to be
   *  delayed before it's invoked.
   * @param {boolean} [options.trailing=true] Specify invoking on the trailing
   *  edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // avoid costly calculations while the window size is in flux
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
   * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // ensure `batchLog` is invoked once after 1 second of debounced calls
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', _.debounce(batchLog, 250, {
   *   'maxWait': 1000
   * }));
   *
   * // cancel a debounced call
   * var todoChanges = _.debounce(batchLog, 1000);
   * Object.observe(models.todo, todoChanges);
   *
   * Object.observe(models, function(changes) {
   *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
   *     todoChanges.cancel();
   *   }
   * }, ['delete']);
   *
   * // ...at some point `models.todo` is changed
   * models.todo.completed = true;
   *
   * // ...before 1 second has passed `models.todo` is deleted
   * // which cancels the debounced `todoChanges` call
   * delete models.todo;
   */
  function debounce(func, wait, options) {
    var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = wait < 0 ? 0 : (+wait || 0);
    if (options === true) {
      var leading = true;
      trailing = false;
    } else if (isObject_1(options)) {
      leading = !!options.leading;
      maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function cancel() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId);
      }
      lastCalled = 0;
      maxTimeoutId = timeoutId = trailingCall = undefined;
    }

    function complete(isCalled, id) {
      if (id) {
        clearTimeout(id);
      }
      maxTimeoutId = timeoutId = trailingCall = undefined;
      if (isCalled) {
        lastCalled = now_1();
        result = func.apply(thisArg, args);
        if (!timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
      }
    }

    function delayed() {
      var remaining = wait - (now_1() - stamp);
      if (remaining <= 0 || remaining > wait) {
        complete(trailingCall, maxTimeoutId);
      } else {
        timeoutId = setTimeout(delayed, remaining);
      }
    }

    function maxDelayed() {
      complete(trailing, timeoutId);
    }

    function debounced() {
      args = arguments;
      stamp = now_1();
      thisArg = this;
      trailingCall = trailing && (timeoutId || !leading);

      if (maxWait === false) {
        var leadingCall = leading && !timeoutId;
      } else {
        if (!maxTimeoutId && !leading) {
          lastCalled = stamp;
        }
        var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

        if (isCalled) {
          if (maxTimeoutId) {
            maxTimeoutId = clearTimeout(maxTimeoutId);
          }
          lastCalled = stamp;
          result = func.apply(thisArg, args);
        }
        else if (!maxTimeoutId) {
          maxTimeoutId = setTimeout(maxDelayed, remaining);
        }
      }
      if (isCalled && timeoutId) {
        timeoutId = clearTimeout(timeoutId);
      }
      else if (!timeoutId && wait !== maxWait) {
        timeoutId = setTimeout(delayed, wait);
      }
      if (leadingCall) {
        isCalled = true;
        result = func.apply(thisArg, args);
      }
      if (isCalled && !timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
      return result;
    }
    debounced.cancel = cancel;
    return debounced;
  }

  var debounce_1 = debounce;

  /**
   * Calculate the selection update for the given
   * current and new input values.
   *
   * @param {Object} currentSelection as {start, end}
   * @param {String} currentValue
   * @param {String} newValue
   *
   * @return {Object} newSelection as {start, end}
   */
  function calculateUpdate(currentSelection, currentValue, newValue) {

    var currentCursor = currentSelection.start,
      newCursor = currentCursor,
      diff = newValue.length - currentValue.length;

    var lengthDelta = newValue.length - currentValue.length;

    var currentTail = currentValue.substring(currentCursor);

    // check if we can remove common ending from the equation
    // to be able to properly detect a selection change for
    // the following scenarios:
    //
    //  * (AAATTT|TF) => (AAAT|TF)
    //  * (AAAT|TF) =>  (AAATTT|TF)
    //
    if (newValue.lastIndexOf(currentTail) === newValue.length - currentTail.length) {
      currentValue = currentValue.substring(0, currentValue.length - currentTail.length);
      newValue = newValue.substring(0, newValue.length - currentTail.length);
    }

    // diff
    var diff = createDiff(currentValue, newValue);

    if (diff) {
      if (diff.type === 'remove') {
        newCursor = diff.newStart;
      } else {
        newCursor = diff.newEnd;
      }
    }

    return range(newCursor);
  }

  var selectionUpdate = calculateUpdate;


  function createDiff(currentValue, newValue) {

    var insert;

    var l_str, l_char, l_idx = 0,
      s_str, s_char, s_idx = 0;

    if (newValue.length > currentValue.length) {
      l_str = newValue;
      s_str = currentValue;
    } else {
      l_str = currentValue;
      s_str = newValue;
    }

    // assume there will be only one insert / remove and
    // detect that _first_ edit operation only
    while (l_idx < l_str.length) {

      l_char = l_str.charAt(l_idx);
      s_char = s_str.charAt(s_idx);

      // chars no not equal
      if (l_char !== s_char) {

        if (!insert) {
          insert = {
            l_start: l_idx,
            s_start: s_idx
          };
        }

        l_idx++;
      }

      // chars equal (again?)
      else {

        if (insert && !insert.complete) {
          insert.l_end = l_idx;
          insert.s_end = s_idx;
          insert.complete = true;
        }

        s_idx++;
        l_idx++;
      }
    }

    if (insert && !insert.complete) {
      insert.complete = true;
      insert.s_end = s_str.length;
      insert.l_end = l_str.length;
    }

    // no diff
    if (!insert) {
      return;
    }

    if (newValue.length > currentValue.length) {
      return {
        newStart: insert.l_start,
        newEnd: insert.l_end,
        type: 'add'
      };
    } else {
      return {
        newStart: insert.s_start,
        newEnd: insert.s_end,
        type: newValue.length < currentValue.length ? 'remove' : 'replace'
      };
    }
  }

  /**
   * Utility method for creating a new selection range {start, end} object.
   *
   * @param {Number} start
   * @param {Number} [end]
   *
   * @return {Object} selection range as {start, end}
   */
  function range(start, end) {
    return {
      start: start,
      end: end === undefined ? start : end
    };
  }

  var range_1 = range;
  selectionUpdate.range = range_1;

  /**
   * Expose `parse`.
   */

  var domify$1 = parse$1;

  /**
   * Tests for browser support.
   */

  var innerHTMLBug$1 = false;
  var bugTestDiv$1;
  if (typeof document !== 'undefined') {
    bugTestDiv$1 = document.createElement('div');
    // Setup
    bugTestDiv$1.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    innerHTMLBug$1 = !bugTestDiv$1.getElementsByTagName('link').length;
    bugTestDiv$1 = undefined;
  }

  /**
   * Wrap map from jquery.
   */

  var map$1 = {
    legend: [1, '<fieldset>', '</fieldset>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    // for script/link/style tags to work in IE6-8, you have to wrap
    // in a div with a non-whitespace character in front, ha!
    _default: innerHTMLBug$1 ? [1, 'X<div>', '</div>'] : [0, '', '']
  };

  map$1.td =
    map$1.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

  map$1.option =
    map$1.optgroup = [1, '<select multiple="multiple">', '</select>'];

  map$1.thead =
    map$1.tbody =
    map$1.colgroup =
    map$1.caption =
    map$1.tfoot = [1, '<table>', '</table>'];

  map$1.polyline =
    map$1.ellipse =
    map$1.polygon =
    map$1.circle =
    map$1.text =
    map$1.line =
    map$1.path =
    map$1.rect =
    map$1.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

  /**
   * Parse `html` and return a DOM Node instance, which could be a TextNode,
   * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
   * instance, depending on the contents of the `html` string.
   *
   * @param {String} html - HTML string to "domify"
   * @param {Document} doc - The `document` instance to create the Node for
   * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
   * @api private
   */

  function parse$1(html, doc) {
    if ('string' != typeof html) throw new TypeError('String expected');

    // default to the global `document` object
    if (!doc) doc = document;

    // tag name
    var m = /<([\w:]+)/.exec(html);
    if (!m) return doc.createTextNode(html);

    html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

    var tag = m[1];

    // body support
    if (tag == 'body') {
      var el = doc.createElement('html');
      el.innerHTML = html;
      return el.removeChild(el.lastChild);
    }

    // wrap map
    var wrap = map$1[tag] || map$1._default;
    var depth = wrap[0];
    var prefix = wrap[1];
    var suffix = wrap[2];
    var el = doc.createElement('div');
    el.innerHTML = prefix + html + suffix;
    while (depth--) el = el.lastChild;

    // one element
    if (el.firstChild == el.lastChild) {
      return el.removeChild(el.firstChild);
    }

    // several elements
    var fragment = doc.createDocumentFragment();
    while (el.firstChild) {
      fragment.appendChild(el.removeChild(el.firstChild));
    }

    return fragment;
  }

  var domify$2 = domify$1;

  var componentIndexof = function (arr, obj) {
    if (arr.indexOf) return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };

  var indexOf$1 = [].indexOf;

  var indexof$2 = function (arr, obj) {
    if (indexOf$1) return arr.indexOf(obj);
    for (var i = 0; i < arr.length; ++i) {
      if (arr[i] === obj) return i;
    }
    return -1;
  };

  /**
   * Module dependencies.
   */

  try {
    var index = indexof$2;
  } catch (err) {
    var index = componentIndexof;
  }

  /**
   * Whitespace regexp.
   */

  var re$1 = /\s+/;

  /**
   * toString reference.
   */

  var toString$1 = Object.prototype.toString;

  /**
   * Wrap `el` in a `ClassList`.
   *
   * @param {Element} el
   * @return {ClassList}
   * @api public
   */

  var componentClasses = function (el) {
    return new ClassList$1(el);
  };

  /**
   * Initialize a new ClassList for `el`.
   *
   * @param {Element} el
   * @api private
   */

  function ClassList$1(el) {
    if (!el || !el.nodeType) {
      throw new Error('A DOM element reference is required');
    }
    this.el = el;
    this.list = el.classList;
  }

  /**
   * Add class `name` if not already present.
   *
   * @param {String} name
   * @return {ClassList}
   * @api public
   */

  ClassList$1.prototype.add = function (name) {
    // classList
    if (this.list) {
      this.list.add(name);
      return this;
    }

    // fallback
    var arr = this.array();
    var i = index(arr, name);
    if (!~i) arr.push(name);
    this.el.className = arr.join(' ');
    return this;
  };

  /**
   * Remove class `name` when present, or
   * pass a regular expression to remove
   * any which match.
   *
   * @param {String|RegExp} name
   * @return {ClassList}
   * @api public
   */

  ClassList$1.prototype.remove = function (name) {
    if ('[object RegExp]' == toString$1.call(name)) {
      return this.removeMatching(name);
    }

    // classList
    if (this.list) {
      this.list.remove(name);
      return this;
    }

    // fallback
    var arr = this.array();
    var i = index(arr, name);
    if (~i) arr.splice(i, 1);
    this.el.className = arr.join(' ');
    return this;
  };

  /**
   * Remove all classes matching `re`.
   *
   * @param {RegExp} re
   * @return {ClassList}
   * @api private
   */

  ClassList$1.prototype.removeMatching = function (re) {
    var arr = this.array();
    for (var i = 0; i < arr.length; i++) {
      if (re.test(arr[i])) {
        this.remove(arr[i]);
      }
    }
    return this;
  };

  /**
   * Toggle class `name`, can force state via `force`.
   *
   * For browsers that support classList, but do not support `force` yet,
   * the mistake will be detected and corrected.
   *
   * @param {String} name
   * @param {Boolean} force
   * @return {ClassList}
   * @api public
   */

  ClassList$1.prototype.toggle = function (name, force) {
    // classList
    if (this.list) {
      if ("undefined" !== typeof force) {
        if (force !== this.list.toggle(name, force)) {
          this.list.toggle(name); // toggle again to correct
        }
      } else {
        this.list.toggle(name);
      }
      return this;
    }

    // fallback
    if ("undefined" !== typeof force) {
      if (!force) {
        this.remove(name);
      } else {
        this.add(name);
      }
    } else {
      if (this.has(name)) {
        this.remove(name);
      } else {
        this.add(name);
      }
    }

    return this;
  };

  /**
   * Return an array of classes.
   *
   * @return {Array}
   * @api public
   */

  ClassList$1.prototype.array = function () {
    var className = this.el.getAttribute('class') || '';
    var str = className.replace(/^\s+|\s+$/g, '');
    var arr = str.split(re$1);
    if ('' === arr[0]) arr.shift();
    return arr;
  };

  /**
   * Check if class `name` is present.
   *
   * @param {String} name
   * @return {ClassList}
   * @api public
   */

  ClassList$1.prototype.has =
    ClassList$1.prototype.contains = function (name) {
      return this.list
        ? this.list.contains(name)
        : !! ~index(this.array(), name);
    };

  var classes$1 = componentClasses;

  var componentQuery = createCommonjsModule(function (module, exports) {
    function one(selector, el) {
      return el.querySelector(selector);
    }

    exports = module.exports = function (selector, el) {
      el = el || document;
      return one(selector, el);
    };

    exports.all = function (selector, el) {
      el = el || document;
      return el.querySelectorAll(selector);
    };

    exports.engine = function (obj) {
      if (!obj.one) throw new Error('.one callback required');
      if (!obj.all) throw new Error('.all callback required');
      one = obj.one;
      exports.all = obj.all;
      return exports;
    };
  });
  var componentQuery_1 = componentQuery.all;
  var componentQuery_2 = componentQuery.engine;

  /**
   * Module dependencies.
   */

  try {
    var query$2 = query;
  } catch (err) {
    var query$2 = componentQuery;
  }

  /**
   * Element prototype.
   */

  var proto$2 = Element.prototype;

  /**
   * Vendor function.
   */

  var vendor$2 = proto$2.matches
    || proto$2.webkitMatchesSelector
    || proto$2.mozMatchesSelector
    || proto$2.msMatchesSelector
    || proto$2.oMatchesSelector;

  /**
   * Expose `match()`.
   */

  var componentMatchesSelector = match$2;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match$2(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    if (vendor$2) return vendor$2.call(el, selector);
    var nodes = query$2.all(selector, el.parentNode);
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  var matches = componentMatchesSelector;

  var proto$3 = typeof Element !== 'undefined' ? Element.prototype : {};
  var vendor$3 = proto$3.matches
    || proto$3.matchesSelector
    || proto$3.webkitMatchesSelector
    || proto$3.mozMatchesSelector
    || proto$3.msMatchesSelector
    || proto$3.oMatchesSelector;

  var matchesSelector$2 = match$3;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match$3(el, selector) {
    if (!el || el.nodeType !== 1) return false;
    if (vendor$3) return vendor$3.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  var componentClosest = function (element, selector, checkYoSelf, root) {
    element = checkYoSelf ? { parentNode: element } : element;

    root = root || document;

    // Make sure `element !== document` and `element != null`
    // otherwise we get an illegal invocation
    while ((element = element.parentNode) && element !== document) {
      if (matchesSelector$2(element, selector))
        return element
      // After `matches` on the edge case that
      // the selector matches the root
      // (when the root is not the document)
      if (element === root)
        return
    }
  };

  var bind$2 = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind$2 = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix$1 = bind$2 !== 'addEventListener' ? 'on' : '';

  /**
   * Bind `el` event `type` to `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var bind_1$1 = function (el, type, fn, capture) {
    el[bind$2](prefix$1 + type, fn, capture || false);
    return fn;
  };

  /**
   * Unbind `el` event `type`'s callback `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var unbind_1$1 = function (el, type, fn, capture) {
    el[unbind$2](prefix$1 + type, fn, capture || false);
    return fn;
  };

  var componentEvent$1 = {
    bind: bind_1$1,
    unbind: unbind_1$1
  };

  /**
   * Element prototype.
   */

  var proto$4 = Element.prototype;

  /**
   * Vendor function.
   */

  var vendor$4 = proto$4.matchesSelector
    || proto$4.webkitMatchesSelector
    || proto$4.mozMatchesSelector
    || proto$4.msMatchesSelector
    || proto$4.oMatchesSelector;

  /**
   * Expose `match()`.
   */

  var matchesSelector$3 = match$4;

  /**
   * Match `el` to `selector`.
   *
   * @param {Element} el
   * @param {String} selector
   * @return {Boolean}
   * @api public
   */

  function match$4(el, selector) {
    if (vendor$4) return vendor$4.call(el, selector);
    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i] == el) return true;
    }
    return false;
  }

  var closest$2 = function (element, selector, checkYoSelf) {
    var parent = checkYoSelf ? element : element.parentNode;

    while (parent && parent !== document) {
      if (matchesSelector$3(parent, selector)) return parent;
      parent = parent.parentNode;
    }
  };

  /**
   * Module dependencies.
   */

  try {
    var closest$3 = closest$2;
  } catch (err) {
    var closest$3 = componentClosest;
  }

  try {
    var event$1 = event;
  } catch (err) {
    var event$1 = componentEvent$1;
  }

  /**
   * Delegate event `type` to `selector`
   * and invoke `fn(e)`. A callback function
   * is returned which may be passed to `.unbind()`.
   *
   * @param {Element} el
   * @param {String} selector
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @return {Function}
   * @api public
   */

  var bind$3 = function (el, selector, type, fn, capture) {
    // return event$1.bind(el, type, function(e){
    //   var target = e.target || e.srcElement;
    //   e.delegateTarget = closest$3(target, selector, true, el);
    //   if (e.delegateTarget) fn.call(el, e);
    // }, capture);
  };

  /**
   * Unbind event `type`'s callback `fn`.
   *
   * @param {Element} el
   * @param {String} type
   * @param {Function} fn
   * @param {Boolean} capture
   * @api public
   */

  var unbind$3 = function (el, type, fn, capture) {
    event$1.unbind(el, type, fn, capture);
  };

  var componentDelegate = {
    bind: bind$3,
    unbind: unbind$3
  };

  var delegate = componentDelegate;

  var query$3 = componentQuery;

  var event$2 = componentEvent$1;

  /**
   * Set attribute `name` to `val`, or get attr `name`.
   *
   * @param {Element} el
   * @param {String} name
   * @param {String} [val]
   * @api public
   */

  var attr$1 = function (el, name, val) {
    // get
    if (arguments.length == 2) {
      return el.getAttribute(name);
    }

    // remove
    if (val === null) {
      return el.removeAttribute(name);
    }

    // set
    el.setAttribute(name, val);

    return el;
  };

  /**
   * A specialized version of `_.assign` for customizing assigned values without
   * support for argument juggling, multiple sources, and `this` binding `customizer`
   * functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {Function} customizer The function to customize assigned values.
   * @returns {Object} Returns `object`.
   */
  function assignWith(object, source, customizer) {
    var index = -1,
      props = keys_1(source),
      length = props.length;

    while (++index < length) {
      var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

      if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
        object[key] = result;
      }
    }
    return object;
  }

  var assignWith_1 = assignWith;

  /**
   * Copies properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Array} props The property names to copy.
   * @param {Object} [object={}] The object to copy properties to.
   * @returns {Object} Returns `object`.
   */
  function baseCopy(source, props, object) {
    object || (object = {});

    var index = -1,
      length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  var baseCopy_1 = baseCopy;

  /**
   * The base implementation of `_.assign` without support for argument juggling,
   * multiple sources, and `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @returns {Object} Returns `object`.
   */
  function baseAssign(object, source) {
    return source == null
      ? object
      : baseCopy_1(source, keys_1(source), object);
  }

  var baseAssign_1 = baseAssign;

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject_1(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number'
      ? (isArrayLike_1(object) && isIndex_1(index, object.length))
      : (type == 'string' && index in object)) {
      var other = object[index];
      return value === value ? (value === other) : (other !== other);
    }
    return false;
  }

  var isIterateeCall_1 = isIterateeCall;

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT$1 = 'Expected a function';

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeMax$1 = Math.max;

  /**
   * Creates a function that invokes `func` with the `this` binding of the
   * created function and arguments from `start` and beyond provided as an array.
   *
   * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
   *
   * @static
   * @memberOf _
   * @category Function
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var say = _.restParam(function(what, names) {
   *   return what + ' ' + _.initial(names).join(', ') +
   *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
   * });
   *
   * say('hello', 'fred', 'barney', 'pebbles');
   * // => 'hello fred, barney, & pebbles'
   */
  function restParam(func, start) {
    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    start = nativeMax$1(start === undefined ? (func.length - 1) : (+start || 0), 0);
    return function () {
      var args = arguments,
        index = -1,
        length = nativeMax$1(args.length - start, 0),
        rest = Array(length);

      while (++index < length) {
        rest[index] = args[start + index];
      }
      switch (start) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, args[0], rest);
        case 2: return func.call(this, args[0], args[1], rest);
      }
      var otherArgs = Array(start + 1);
      index = -1;
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = rest;
      return func.apply(this, otherArgs);
    };
  }

  var restParam_1 = restParam;

  /**
   * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return restParam_1(function (object, sources) {
      var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

      if (typeof customizer == 'function') {
        customizer = bindCallback_1(customizer, thisArg, 5);
        length -= 2;
      } else {
        customizer = typeof thisArg == 'function' ? thisArg : undefined;
        length -= (customizer ? 1 : 0);
      }
      if (guard && isIterateeCall_1(sources[0], sources[1], guard)) {
        customizer = length < 3 ? undefined : customizer;
        length = 1;
      }
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, customizer);
        }
      }
      return object;
    });
  }

  var createAssigner_1 = createAssigner;

  /**
   * Assigns own enumerable properties of source object(s) to the destination
   * object. Subsequent sources overwrite property assignments of previous sources.
   * If `customizer` is provided it's invoked to produce the assigned values.
   * The `customizer` is bound to `thisArg` and invoked with five arguments:
   * (objectValue, sourceValue, key, object, source).
   *
   * **Note:** This method mutates `object` and is based on
   * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
   *
   * @static
   * @memberOf _
   * @alias extend
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @param {Function} [customizer] The function to customize assigned values.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
   * // => { 'user': 'fred', 'age': 40 }
   *
   * // using a customizer callback
   * var defaults = _.partialRight(_.assign, function(value, other) {
   *   return _.isUndefined(value) ? other : value;
   * });
   *
   * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
   * // => { 'user': 'barney', 'age': 36 }
   */
  var assign = createAssigner_1(function (object, source, customizer) {
    return customizer
      ? assignWith_1(object, source, customizer)
      : baseAssign_1(object, source);
  });

  var assign_1 = assign;

  var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () { };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
  });

  var DEFAULT_OPTIONS = {
    scrollSymbolLeft: '‹',
    scrollSymbolRight: '›'
  };


  /**
   * This component adds the functionality to scroll over a list of tabs.
   *
   * It adds scroll buttons on the left and right side of the tabs container
   * if not all tabs are visible. It also adds a mouse wheel listener on the
   * container.
   *
   * If either a button is clicked or the mouse wheel is used over the tabs,
   * a 'scroll' event is being fired. This event contains the node elements
   * of the new and old active tab, and the direction in which the tab has
   * changed relative to the old active tab.
   *
   * @example:
   * (1) provide a tabs-container:
   *
   * var $el = (
   *   <div>
   *     <!-- button added by scrollTabs -->
   *     <span class="scroll-tabs-button scroll-tabs-left"></span>
   *     <ul class="my-tabs-container">
   *       <li class="my-tab i-am-active"></li>
   *       <li class="my-tab"></li>
   *       <li class="my-tab ignore-me"></li>
   *     </ul>
   *     <!-- button added by scrollTabs -->
   *     <span class="scroll-tabs-button scroll-tabs-right"></span>
   *   </div>
   * );
   *
   *
   * (2) initialize scrollTabs:
   *
   *  var scroller = scrollTabs(tabBarNode, {
   *    selectors: {
   *      tabsContainer: '.my-tabs-container',
   *      tab: '.my-tab',
   *      ignore: '.ignore-me',
   *      active: '.i-am-active'
   *    }
   *  });
   *
   *
   * (3) listen to the scroll event:
   *
   * scroller.on('scroll', function(newActiveNode, oldActiveNode, direction) {
   *   // direction is any of (-1: left, 1: right)
   *   // activate the new active tab
   * });
   *
   *
   * (4) update the scroller if tabs change and or the tab container resizes:
   *
   * scroller.update();
   *
   *
   * @param  {DOMElement} el
   * @param  {Object} options
   * @param  {Object} options.selectors
   * @param  {String} options.selectors.tabsContainer the container all tabs are contained in
   * @param  {String} options.selectors.tab a single tab inside the tab container
   * @param  {String} options.selectors.ignore tabs that should be ignored during scroll left/right
   * @param  {String} options.selectors.active selector for the current active tab
   * @param  {String} [options.scrollSymbolLeft]
   * @param  {String} [options.scrollSymbolRight]
   */
  function ScrollTabs($el, options) {

    // we are an event emitter
    EventEmitter.call(this);

    this.options = options = assign_1({}, DEFAULT_OPTIONS, options);
    this.container = $el;

    this._createScrollButtons($el, options);

    this._bindEvents($el);
  }


  inherits_browser(ScrollTabs, EventEmitter);


  /**
   * Create a clickable scroll button
   *
   * @param {Object} options
   * @param {String} options.className
   * @param {String} options.label
   * @param {Number} options.direction
   *
   * @return {DOMElement} The created scroll button node
   */
  ScrollTabs.prototype._createButton = function (parentNode, options) {

    var className = options.className,
      direction = options.direction;


    var button = query$3('.' + className, parentNode);

    if (!button) {
      button = domify$2('<span class="scroll-tabs-button ' + className + '">' +
        options.label +
        '</span>');

      parentNode.insertBefore(button, parentNode.childNodes[0]);
    }

    attr$1(button, 'data-direction', direction);

    return button;
  };

  /**
   * Create both scroll buttons
   *
   * @param  {DOMElement} parentNode
   * @param  {Object} options
   * @param  {String} options.scrollSymbolLeft
   * @param  {String} options.scrollSymbolRight
   */
  ScrollTabs.prototype._createScrollButtons = function (parentNode, options) {

    // Create a button that scrolls to the tab left to the currently active tab
    this._createButton(parentNode, {
      className: 'scroll-tabs-left',
      label: options.scrollSymbolLeft,
      direction: -1
    });

    // Create a button that scrolls to the tab right to the currently active tab
    this._createButton(parentNode, {
      className: 'scroll-tabs-right',
      label: options.scrollSymbolRight,
      direction: 1
    });
  };

  /**
   * Get the current active tab
   *
   * @return {DOMElement}
   */
  ScrollTabs.prototype.getActiveTabNode = function () {
    return query$3(this.options.selectors.active, this.container);
  };


  /**
   * Get the container all tabs are contained in
   *
   * @return {DOMElement}
   */
  ScrollTabs.prototype.getTabsContainerNode = function () {
    return query$3(this.options.selectors.tabsContainer, this.container);
  };


  /**
   * Get all tabs (visible and invisible ones)
   *
   * @return {Array<DOMElement>}
   */
  ScrollTabs.prototype.getAllTabNodes = function () {
    return query$3.all(this.options.selectors.tab, this.container);
  };


  /**
   * Gets all tabs that don't have the ignore class set
   *
   * @return {Array<DOMElement>}
   */
  ScrollTabs.prototype.getVisibleTabs = function () {
    var allTabs = this.getAllTabNodes();

    var ignore = this.options.selectors.ignore;

    return filter_1(allTabs, function (tabNode) {
      return !matches(tabNode, ignore);
    });
  };


  /**
   * Get a tab relative to a reference tab.
   *
   * @param  {DOMElement} referenceTabNode
   * @param  {Number} n gets the nth tab next or previous to the reference tab
   *
   * @return {DOMElement}
   *
   * @example:
   * Visible tabs: [ A | B | C | D | E ]
   * Assume tab 'C' is the reference tab:
   * If direction === -1, it returns tab 'B',
   * if direction ===  2, it returns tab 'E'
   */
  ScrollTabs.prototype.getAdjacentTab = function (referenceTabNode, n) {
    var visibleTabs = this.getVisibleTabs();

    var index = visibleTabs.indexOf(referenceTabNode);

    return visibleTabs[index + n];
  };

  ScrollTabs.prototype._bindEvents = function (node) {
    this._bindWheelEvent(node);
    this._bindTabClickEvents(node);
    this._bindScrollButtonEvents(node);
  };

  /**
   *  Bind a click listener to a DOM node.
   *  Make sure a tab link is entirely visible after onClick.
   *
   * @param {DOMElement} node
   */
  ScrollTabs.prototype._bindTabClickEvents = function (node) {
    var selector = this.options.selectors.tab;

    var self = this;

    delegate.bind(node, selector, 'click', function onClick(event$$1) {
      self.scrollToTabNode(event$$1.delegateTarget);
    });
  };


  /**
   * Bind the wheel event listener to a DOM node
   *
   * @param {DOMElement} node
   */
  ScrollTabs.prototype._bindWheelEvent = function (node) {
    var self = this;

    event$2.bind(node, 'wheel', function (e) {

      // scroll direction (-1: left, 1: right)
      var direction = Math.sign(e.deltaY);

      var oldActiveTab = self.getActiveTabNode();

      var newActiveTab = self.getAdjacentTab(oldActiveTab, direction);

      if (newActiveTab) {
        self.scrollToTabNode(newActiveTab);
        self.emit('scroll', newActiveTab, oldActiveTab, direction);
      }

      e.preventDefault();
    });
  };

  /**
   * Bind scroll button events to a DOM node
   *
   * @param  {DOMElement} node
   */
  ScrollTabs.prototype._bindScrollButtonEvents = function (node) {

    var self = this;

    delegate.bind(node, '.scroll-tabs-button', 'click', function (event$$1) {

      var target = event$$1.delegateTarget;

      // data-direction is either -1 or 1
      var direction = parseInt(attr$1(target, 'data-direction'), 10);

      var oldActiveTabNode = self.getActiveTabNode();

      var newActiveTabNode = self.getAdjacentTab(oldActiveTabNode, direction);

      if (newActiveTabNode) {
        self.scrollToTabNode(newActiveTabNode);
        self.emit('scroll', newActiveTabNode, oldActiveTabNode, direction);
      }

      event$$1.preventDefault();
    });
  };


  /**
  * Scroll to a tab if it is not entirely visible
  *
  * @param  {DOMElement} tabNode tab node to scroll to
  */
  ScrollTabs.prototype.scrollToTabNode = function (tabNode) {
    if (!tabNode) {
      return;
    }

    var tabsContainerNode = tabNode.parentNode;

    var tabWidth = tabNode.offsetWidth,
      tabOffsetLeft = tabNode.offsetLeft,
      tabOffsetRight = tabOffsetLeft + tabWidth,
      containerWidth = tabsContainerNode.offsetWidth,
      containerScrollLeft = tabsContainerNode.scrollLeft;

    if (containerScrollLeft > tabOffsetLeft) {
      // scroll to the left, if the tab is overflowing on the left side
      tabsContainerNode.scrollLeft = 0;
    } else if (tabOffsetRight > containerWidth) {
      // scroll to the right, if the tab is overflowing on the right side
      tabsContainerNode.scrollLeft = tabOffsetRight - containerWidth;
    }
  };


  /**
   * React on tab changes from outside (resize/show/hide/add/remove),
   * update scroll button visibility.
   */
  ScrollTabs.prototype.update = function () {

    var tabsContainerNode = this.getTabsContainerNode();

    // check if tabs fit in container
    var overflow = tabsContainerNode.scrollWidth > tabsContainerNode.offsetWidth;

    // TODO(nikku): distinguish overflow left / overflow right?
    var overflowClass = 'scroll-tabs-overflow';

    classes$1(this.container).toggle(overflowClass, overflow);

    if (overflow) {
      // make sure the current active tab is always visible
      this.scrollToTabNode(this.getActiveTabNode());
    }
  };


  ////// module exports /////////////////////////////////////////

  /**
   * Create a scrollTabs instance on the given element.
   *
   * @param {DOMElement} $el
   * @param {Object} options
   *
   * @return {ScrollTabs}
   */
  function create($el, options) {

    var scrollTabs = get$1($el);

    if (!scrollTabs) {
      scrollTabs = new ScrollTabs($el, options);

      $el.__scrollTabs = scrollTabs;
    }

    return scrollTabs;
  }

  /**
   * Factory function to get or create a new scroll tabs instance.
   */
  var scrollTabs = create;


  /**
   * Return the scrollTabs instance that has been previously
   * initialized on the element.
   *
   * @param {DOMElement} $el
   * @return {ScrollTabs}
   */
  function get$1($el) {
    return $el.__scrollTabs;
  }

  /**
   * Getter to retrieve an already initialized scroll tabs instance.
   */
  var get_1$1 = get$1;
  scrollTabs.get = get_1$1;

  /**
   * Is an element of the given BPMN type?
   *
   * @param  {djs.model.Base|ModdleElement} element
   * @param  {String} type
   *
   * @return {Boolean}
   */
  function is(element, type) {
    var bo = getBusinessObject(element);

    return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
  }


  /**
   * Return the business object for a given element.
   *
   * @param  {djs.model.Base|ModdleElement} element
   *
   * @return {ModdleElement}
   */
  function getBusinessObject(element) {
    return (element && element.businessObject) || element;
  }

  var ModelUtil = /*#__PURE__*/Object.freeze({
    is: is,
    getBusinessObject: getBusinessObject
  });
  window.ModelUtil = ModelUtil;
  /**
   * The base implementation of `_.flatten` with added support for restricting
   * flattening and specifying the start index.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {boolean} [isDeep] Specify a deep flatten.
   * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, isDeep, isStrict, result) {
    result || (result = []);

    var index = -1,
      length = array.length;

    while (++index < length) {
      var value = array[index];
      if (isObjectLike_1(value) && isArrayLike_1(value) &&
        (isStrict || isArray_1(value) || isArguments_1(value))) {
        if (isDeep) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, isDeep, isStrict, result);
        } else {
          arrayPush_1(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  var baseFlatten_1 = baseFlatten;

  /**
   * Recursively flattens a nested array.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to recursively flatten.
   * @returns {Array} Returns the new flattened array.
   * @example
   *
   * _.flattenDeep([1, [2, 3, [4]]]);
   * // => [1, 2, 3, 4]
   */
  function flattenDeep(array) {
    var length = array ? array.length : 0;
    return length ? baseFlatten_1(array, true) : [];
  }

  var flattenDeep_1 = flattenDeep;

  /**
   * Creates a `_.countBy`, `_.groupBy`, `_.indexBy`, or `_.partition` function.
   *
   * @private
   * @param {Function} setter The function to set keys and values of the accumulator object.
   * @param {Function} [initializer] The function to initialize the accumulator object.
   * @returns {Function} Returns the new aggregator function.
   */
  function createAggregator(setter, initializer) {
    return function (collection, iteratee, thisArg) {
      var result = initializer ? initializer() : {};
      iteratee = baseCallback_1(iteratee, thisArg, 3);

      if (isArray_1(collection)) {
        var index = -1,
          length = collection.length;

        while (++index < length) {
          var value = collection[index];
          setter(result, value, iteratee(value, index, collection), collection);
        }
      } else {
        baseEach_1(collection, function (value, key, collection) {
          setter(result, value, iteratee(value, key, collection), collection);
        });
      }
      return result;
    };
  }

  var createAggregator_1 = createAggregator;

  /**
   * Creates an object composed of keys generated from the results of running
   * each element of `collection` through `iteratee`. The corresponding value
   * of each key is the last element responsible for generating the key. The
   * iteratee function is bound to `thisArg` and invoked with three arguments:
   * (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Object} Returns the composed aggregate object.
   * @example
   *
   * var keyData = [
   *   { 'dir': 'left', 'code': 97 },
   *   { 'dir': 'right', 'code': 100 }
   * ];
   *
   * _.indexBy(keyData, 'dir');
   * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
   *
   * _.indexBy(keyData, function(object) {
   *   return String.fromCharCode(object.code);
   * });
   * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
   *
   * _.indexBy(keyData, function(object) {
   *   return this.fromCharCode(object.code);
   * }, String);
   * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
   */
  var indexBy = createAggregator_1(function (result, value, key) {
    result[key] = value;
  });

  var indexBy_1 = indexBy;

  /**
   * A specialized version of `_.map` for arrays without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
      length = array.length,
      result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var arrayMap_1 = arrayMap;

  /**
   * The base implementation of `_.map` without support for callback shorthands
   * and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var index = -1,
      result = isArrayLike_1(collection) ? Array(collection.length) : [];

    baseEach_1(collection, function (value, key, collection) {
      result[++index] = iteratee(value, key, collection);
    });
    return result;
  }

  var baseMap_1 = baseMap;

  /**
   * Creates an array of values by running each element in `collection` through
   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments: (value, index|key, collection).
   *
   * If a property name is provided for `iteratee` the created `_.property`
   * style callback returns the property value of the given element.
   *
   * If a value is also provided for `thisArg` the created `_.matchesProperty`
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `iteratee` the created `_.matches` style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`,
   * `drop`, `dropRight`, `every`, `fill`, `flatten`, `invert`, `max`, `min`,
   * `parseInt`, `slice`, `sortBy`, `take`, `takeRight`, `template`, `trim`,
   * `trimLeft`, `trimRight`, `trunc`, `random`, `range`, `sample`, `some`,
   * `sum`, `uniq`, and `words`
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * function timesThree(n) {
   *   return n * 3;
   * }
   *
   * _.map([1, 2], timesThree);
   * // => [3, 6]
   *
   * _.map({ 'a': 1, 'b': 2 }, timesThree);
   * // => [3, 6] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // using the `_.property` callback shorthand
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map$2(collection, iteratee, thisArg) {
    var func = isArray_1(collection) ? arrayMap_1 : baseMap_1;
    iteratee = baseCallback_1(iteratee, thisArg, 3);
    return func(collection, iteratee);
  }

  var map_1 = map$2;

  var domify$3 = index_esm.domify,
    domQuery = index_esm.query,
    domQueryAll = index_esm.queryAll,
    domRemove = index_esm.remove,
    domClasses = index_esm.classes,
    domClosest = index_esm.closest,
    domAttr = index_esm.attr,
    domDelegate = index_esm.delegate,
    domMatches = index_esm.matches;







  var getBusinessObject$1 = ModelUtil.getBusinessObject;

  var HIDE_CLASS = 'bpp-hidden';
  var DEBOUNCE_DELAY = 300;


  function isToggle(node) {
    return node.type === 'checkbox' || node.type === 'radio';
  }

  function isSelect(node) {
    return node.type === 'select-one';
  }

  function isContentEditable(node) {
    return domAttr(node, 'contenteditable');
  }

  function getPropertyPlaceholders(node) {
    var selector = 'input[name], textarea[name], [data-value], [contenteditable]';
    var placeholders = domQueryAll(selector, node);
    if ((!placeholders || !placeholders.length) && domMatches(node, selector)) {
      placeholders = [node];
    }
    return placeholders;
  }

  /**
   * Return all active form controls.
   * This excludes the invisible controls unless all is true
   *
   * @param {Element} node
   * @param {Boolean} [all=false]
   */
  function getFormControls(node, all) {
    var controls = domQueryAll('input[name], textarea[name], select[name], [contenteditable]', node);

    if (!controls || !controls.length) {
      controls = domMatches(node, 'option') ? [node] : controls;
    }

    if (!all) {
      controls = filter_1(controls, function (node) {
        return !domClosest(node, '.' + HIDE_CLASS);
      });
    }

    return controls;
  }

  function getFormControlValuesInScope(entryNode) {
    var values = {};

    var controlNodes = getFormControls(entryNode);

    forEach_1(controlNodes, function (controlNode) {
      var value = controlNode.value;

      var name = domAttr(controlNode, 'name') || domAttr(controlNode, 'data-name');

      // take toggle state into account for radio / checkboxes
      if (isToggle(controlNode)) {
        if (controlNode.checked) {
          if (!domAttr(controlNode, 'value')) {
            value = true;
          } else {
            value = controlNode.value;
          }
        } else {
          value = null;
        }
      } else
        if (isContentEditable(controlNode)) {
          value = controlNode.innerText;
        }

      if (value !== null) {
        // return the actual value
        // handle serialization in entry provider
        // (ie. if empty string should be serialized or not)
        values[name] = value;
      }
    });

    return values;

  }

  /**
   * Extract input values from entry node
   *
   * @param  {DOMElement} entryNode
   * @returns {Object}
   */
  function getFormControlValues(entryNode) {

    var values;

    var listContainer = domQuery('[data-list-entry-container]', entryNode);
    if (listContainer) {
      values = [];
      var listNodes = listContainer.children || [];
      forEach_1(listNodes, function (listNode) {
        values.push(getFormControlValuesInScope(listNode));
      });
    } else {
      values = getFormControlValuesInScope(entryNode);
    }

    return values;
  }

  /**
   * Return true if the given form extracted value equals
   * to an old cached version.
   *
   * @param {Object} value
   * @param {Object} oldValue
   * @return {Boolean}
   */
  function valueEqual(value, oldValue) {

    if (value && !oldValue) {
      return false;
    }

    var allKeys = keys_1(value).concat(keys_1(oldValue));

    return allKeys.every(function (key) {
      return value[key] === oldValue[key];
    });
  }

  /**
   * Return true if the given form extracted value(s)
   * equal an old cached version.
   *
   * @param {Array<Object>|Object} values
   * @param {Array<Object>|Object} oldValues
   * @return {Boolean}
   */
  function valuesEqual(values, oldValues) {

    if (isArray_1(values)) {

      if (values.length !== oldValues.length) {
        return false;
      }

      return values.every(function (v, idx) {
        return valueEqual(v, oldValues[idx]);
      });
    }

    return valueEqual(values, oldValues);
  }

  /**
   * Return a mapping of { id: entry } for all entries in the given groups in the given tabs.
   *
   * @param {Object} tabs
   * @return {Object}
   */
  function extractEntries(tabs) {
    return indexBy_1(flattenDeep_1(map_1(flattenDeep_1(map_1(tabs, 'groups')), 'entries')), 'id');
  }

  /**
   * Return a mapping of { id: group } for all groups in the given tabs.
   *
   * @param {Object} tabs
   * @return {Object}
   */
  function extractGroups(tabs) {
    return indexBy_1(flattenDeep_1(map_1(tabs, 'groups')), 'id');
  }

  /**
   * A properties panel implementation.
   *
   * To use it provide a `propertiesProvider` component that knows
   * about which properties to display.
   *
   * Properties edit state / visibility can be intercepted
   * via a custom {@link PropertiesActivator}.
   *
   * @class
   * @constructor
   *
   * @param {Object} config
   * @param {EventBus} eventBus
   * @param {Modeling} modeling
   * @param {PropertiesProvider} propertiesProvider
   * @param {Canvas} canvas
   * @param {CommandStack} commandStack
   */
  function PropertiesPanel(config, eventBus, modeling, propertiesProvider, commandStack, canvas) {



    this._eventBus = eventBus;
    this._modeling = modeling;
    this._commandStack = commandStack;
    this._canvas = canvas;
    this._propertiesProvider = propertiesProvider;

    this._init(config);
  }
  //window.PropertiesPanel = PropertiesPanel;
  PropertiesPanel.$inject = [
    'config.propertiesPanel',
    'eventBus',
    'modeling',
    'propertiesProvider',
    'commandStack',
    'canvas'
  ];

  var PropertiesPanel_1 = PropertiesPanel;


  PropertiesPanel.prototype._init = function (config) {

    var canvas = this._canvas,
      eventBus = this._eventBus;

    var self = this;

    /**
     * Select the root element once it is added to the canvas
     */
    eventBus.on('root.added', function (e) {
      var element = e.element;

      if (isImplicitRoot(element)) {
        return;
      }

      self.update(element);
    });

    eventBus.on('selection.changed', function (e) {
      var newElement = e.newSelection[0];

      var rootElement = canvas.getRootElement();

      if (isImplicitRoot(rootElement)) {
        return;
      }

      self.update(newElement);
    });

    // add / update tab-bar scrolling
    eventBus.on([
      'propertiesPanel.changed',
      'propertiesPanel.resized'
    ], function (event$$1) {

      var tabBarNode = domQuery('.bpp-properties-tab-bar', self._container);

      if (!tabBarNode) {
        return;
      }

      var scroller = scrollTabs.get(tabBarNode);

      if (!scroller) {

        // we did not initialize yet, do that
        // now and make sure we select the active
        // tab on scroll update
        scroller = scrollTabs(tabBarNode, {
          selectors: {
            tabsContainer: '.bpp-properties-tabs-links',
            tab: '.bpp-properties-tabs-links li',
            ignore: '.bpp-hidden',
            active: '.bpp-active'
          }
        });


        scroller.on('scroll', function (newActiveNode, oldActiveNode, direction) {

          var linkNode = domQuery('[data-tab-target]', newActiveNode);

          var tabId = domAttr(linkNode, 'data-tab-target');

          self.activateTab(tabId);
        });
      }

      // react on tab changes and or tabContainer resize
      // and make sure the active tab is shown completely
      scroller.update();
    });

    eventBus.on('elements.changed', function (e) {

      var current = self._current;
      var element = current && current.element;

      if (element) {
        if (e.elements.indexOf(element) !== -1) {
          self.update(element);
        }
      }
    });

    eventBus.on('elementTemplates.changed', function () {
      var current = self._current;
      var element = current && current.element;

      if (element) {
        self.update(element);
      }
    });

    eventBus.on('diagram.destroy', function () {
      self.detach();
    });

    this._container = domify$3('<div class="bpp-properties-panel"></div>');

    this._bindListeners(this._container);

    if (config && config.parent) {
      this.attachTo(config.parent);
    }
  };


  PropertiesPanel.prototype.attachTo = function (parentNode) {

    if (!parentNode) {
      throw new Error('parentNode required');
    }

    // ensure we detach from the
    // previous, old parent
    this.detach();

    // unwrap jQuery if provided
    if (parentNode.get && parentNode.constructor.prototype.jquery) {
      parentNode = parentNode.get(0);
    }

    if (typeof parentNode === 'string') {
      parentNode = domQuery(parentNode);
    }

    var container = this._container;

    parentNode.appendChild(container);

    this._emit('attach');
  };

  PropertiesPanel.prototype.detach = function () {

    var container = this._container,
      parentNode = container.parentNode;

    if (!parentNode) {
      return;
    }

    this._emit('detach');

    parentNode.removeChild(container);
  };


  /**
   * Select the given tab within the properties panel.
   *
   * @param {Object|String} tab
   */
  PropertiesPanel.prototype.activateTab = function (tab) {

    var tabId = typeof tab === 'string' ? tab : tab.id;

    var current = this._current;

    var panelNode = current.panel;

    var allTabNodes = domQueryAll('.bpp-properties-tab', panelNode),
      allTabLinkNodes = domQueryAll('.bpp-properties-tab-link', panelNode);

    forEach_1(allTabNodes, function (tabNode) {

      var currentTabId = domAttr(tabNode, 'data-tab');

      domClasses(tabNode).toggle('bpp-active', tabId === currentTabId);
    });

    forEach_1(allTabLinkNodes, function (tabLinkNode) {

      var tabLink = domQuery('[data-tab-target]', tabLinkNode),
        currentTabId = domAttr(tabLink, 'data-tab-target');

      domClasses(tabLinkNode).toggle('bpp-active', tabId === currentTabId);
    });
  };

  /**
   * Update the DOM representation of the properties panel
   */
  PropertiesPanel.prototype.update = function (element) {
    var panel = this;
    var current = this._current;

    // no actual selection change
    var needsCreate = true;
    if (typeof element === 'undefined') {

      // use RootElement of BPMN diagram to generate properties panel if no element is selected
      element = this._canvas.getRootElement();
    }
    console.log(element);

    var bo = element.businessObject;
    var type = element.type;

    function setProperties(businessObject, properties) {
      forEach(properties, function (value, key) {
        businessObject.set(key, value);
      });

      for (var property in properties) {
        businessObject.set(property, properties[property]);
      }
    }



    var idField = {
      controlType: "t1",
      fieldType: "string",
      id: "id_ID_1_string_t1_$$A",
      name: "ID",
      readable: true,
      writable: true,
      required: true,
      seq: 1,
      type: "string",
      value: ko.observable(bo.id || ""),
      property: "id"
    };

    var nameField = {
      controlType: "t1",
      fieldType: "string",
      id: "name_name_2_string_t1_$$A",
      name: "name",
      readable: true,
      writable: true,
      required: false,
      seq: 2,
      type: "string",
      value: ko.observable(bo.name || ""),
      property: "name"
    };

    var executableField = {
      controlType: "rbh",
      enumValues: [{ id: "yes", name: "是" },
      { id: "no", name: "否" }],
      fieldType: "enum",
      id: "isExecutable_executable_3_enum_rbh_$$A",
      name: "executable",
      readable: true,
      writable: true,
      required: false,
      seq: 3,
      type: "enum",
      value: ko.observable(bo.isExecutable ? "yes" : "no"),
      property: "isExecutable"
    };


    var candidateStarterGroupsField = {
      controlType: "t1",
      fieldType: "string",
      id: "candidateStarterGroups_candidate starter groups_4_string_t1_$$A",
      name: "candidate starter groups",
      readable: true,
      writable: true,
      required: false,
      seq: 4,
      type: "string",
      value: ko.observable(bo.get('activiti:candidateStarterGroups') || ""),
      property: "activiti:candidateStarterGroups"

    };

    var candidateStarterUsersField = {
      controlType: "t1",
      fieldType: "string",
      id: "candidateStarterUsers_candidate starter users_5_string_t1_$$A",
      name: "candidate starter users",
      readable: true,
      writable: true,
      required: false,
      seq: 5,
      type: "string",
      value: ko.observable(bo.get('activiti:candidateStarterUsers') || ""),
      property: "activiti:candidateStarterUsers"
    };

    var initiatorField = {
      controlType: "t1",
      fieldType: "string",
      id: "initiator_initiator_3_string_t1_$$A",
      name: "initiator",
      readable: true,
      writable: true,
      required: false,
      seq: 3,
      type: "string",
      value: ko.observable(bo.get('activiti:initiator') || ""),
      property: "activiti:initiator"
    };

    var assigneeField = {
      controlType: "t1",
      fieldType: "string",
      id: "assignee_assignee_3_string_t1_$$A",
      name: "assignee",
      readable: true,
      writable: true,
      required: false,
      seq: 3,
      type: "string",
      value: ko.observable(bo.get('activiti:assignee') || ""),
      property: "activiti:assignee"
    };

    var candidateGroupsField = {
      controlType: "t1",
      fieldType: "string",
      id: "candidateGroups_candidate groups_5_string_t1_$$A",
      name: "candidate groups",
      readable: true,
      writable: true,
      required: false,
      seq: 5,
      type: "string",
      value: ko.observable(bo.get('activiti:candidateGroups') || ""),
      property: "activiti:candidateGroups"
    };

    var candidateUsersField = {
      controlType: "t1",
      fieldType: "string",
      id: "candidateUsers_candidate users_4_string_t1_$$A",
      name: "candidate users",
      readable: true,
      writable: true,
      required: false,
      seq: 4,
      type: "string",
      value: ko.observable(bo.get('activiti:candidateUsers') || ""),
      property: "activiti:candidateUsers"
    };

    var dueDateField = {
      controlType: "t1",
      fieldType: "string",
      id: "dueDate_due date_6_string_t6_$$A",
      name: "due date",
      readable: true,
      writable: true,
      required: false,
      seq: 6,
      type: "string",
      value: ko.observable(bo.get('activiti:dueDate') || ""),
      property: "activiti:dueDate"
    };

    var priorityField = {
      controlType: "t6",
      fieldType: "string",
      id: "priority_priority_7_string_t6_$$A",
      name: "priority",
      readable: true,
      writable: true,
      required: false,
      seq: 7,
      type: "string",
      value: ko.observable(bo.get('activiti:priority') || null),
      property: "activiti:priority"
    };
    var expression = bo.get("bpmn:conditionExpression");
    var expressionValue = expression && expression.body || "";
    var expressionField = {
      controlType: "t2",
      fieldType: "string",
      id: "expression_expression_3_string_t2_$$A",
      name: "expression",
      readable: true,
      writable: true,
      required: false,
      seq: 7,
      type: "string",
      value: ko.observable(expressionValue),
      property: "bpmn:conditionExpression"
    };

    var typedFields = {
      "bpmn:UserTask": [idField, nameField, assigneeField, candidateGroupsField, candidateUsersField, dueDateField, priorityField],
      "bpmn:StartEvent": [idField, nameField, initiatorField],
      "bpmn:EndEvent": [idField, nameField],
      "bpmn:Process": [idField, nameField, executableField, candidateStarterGroupsField, candidateStarterUsersField],
      "bpmn:ExclusiveGateway": [idField, nameField],
      "bpmn:SequenceFlow": [idField, nameField, expressionField]
    };
    vm.editingProcess.properties.removeAll();
    vm.editingProcess.form.removeAll();

    if (type === "bpmn:SequenceFlow") {
      if (!expression) {
        var newElement = bpmnFactory.create('bpmn:FormalExpression', { body: expressionValue });
        newElement.$parent = element.businessObject;
        setProperties(element.businessObject, {
          conditionExpression: newElement
        });
      }
    }
    var fields = typedFields[type];
    if (fields) {
      fields.forEach(function (field) {

        field.value.subscribe(function (value) {
          var property = this.property || this.id.split("_")[0];
          if (panel && panel._current) {

            if (property == "bpmn:conditionExpression") {
              var expression = bo.get("bpmn:conditionExpression");
              expression.set("body", value);
            } else {
              if (property === "isExecutable") {
                value = (value === "yes" ? true : false).toString();
              }
              var properties = {};
              properties[property] = value;
              setProperties(panel._current.element.businessObject, properties);
            }

          }
        }, field);

      });

      vm.editingProcess.properties.push.apply(vm.editingProcess.properties, fields);
      vm.settingTab("processsetting");
      var getAccessibility = function (field) {
        var id = field.id;
        var matches = /\$\$(.*)/i.exec(id);
        var block = matches && matches[1];
        if (block && block[0] === "V") {
          return "read";
        }
        if (block && block[0] === "H") {
          return "hide";
        }
        return "write";
      };
      var setAccessibility = function (field, accessibility) {
        var id = field.get("id");
        var parts = id.split("$$");
        var block = (parts[1] || "").replace(/^[VH]/, "");
        var map = {
          "read": "V",
          "hide": "H",
          "write": ""
        };
        block = (map[accessibility] || "") + block;
        var newId = parts[0];
        if (block) {
          newId += "$$" + block;
        } else {
          newId = newId.replace(/_$/, "");
        }
        field.set("id", newId);
      };

      if (type !== "bpmn:Process" && type !== "bpmn:SequenceFlow") {
        var elements = element.businessObject.get("bpmn:extensionElements");
        var currentProperties = elements && elements.values || [];

        if (vm.templateForm) {

          var formFields = BPMS.Services.Utils.formatFormData(vm.templateForm.formData);
          var existingProperties = currentProperties;

          setTimeout(function () {
            existingProperties.forEach(function (existingProperty) {
              var formField = vm.editingProcess.form().filter(function (field) {
                return field.name === existingProperty.name;
              })[0];
              if (formField) {
                formField.value(getAccessibility(existingProperty));
              }
            });
          }, 0);
          currentProperties = formFields.map(
            function (field) {
              var enumValues = (field.enumValues || []).map(function (option) {
                return bpmnFactory.create('activiti:value',
                  {
                    id: option.id,
                    name: option.name
                  });
              });

              return bpmnFactory.create('activiti:formProperty',
                {
                  id: field.id,
                  name: field.name,
                  type: field.type,
                  variable: field.variable,
                  writable: field.writable,
                  required: field.required,
                  values: enumValues
                });
            }
          );
          //         content += "\t\t\t\t\t<activiti:value id=\"" + option.id + "\" name=\"" + option.name + "\"/>\r\n";

          var newElement = bpmnFactory.create('bpmn:ExtensionElements', {
            values: currentProperties
          });
          newElement.$parent = element.businessObject;
          setProperties(element.businessObject, {
            extensionElements: newElement
          });

        } else if (currentProperties.length === 0) {
          var formFields = BPMS.Services.Utils.formatFormData(vm.formData());

          currentProperties = formFields.map(
            function (field) {
              var enumValues = (field.enumValues || []).map(function (option) {
                return bpmnFactory.create('activiti:value',
                  {
                    id: option.id,
                    name: option.name
                  });
              });

              return bpmnFactory.create('activiti:formProperty',
                {
                  id: field.id,
                  name: field.name,
                  type: field.type,
                  variable: field.variable,
                  writable: field.writable,
                  required: field.required,
                  values: enumValues
                });
            }
          );
          //         content += "\t\t\t\t\t<activiti:value id=\"" + option.id + "\" name=\"" + option.name + "\"/>\r\n";

          var newElement = bpmnFactory.create('bpmn:ExtensionElements', {
            values: currentProperties
          });
          newElement.$parent = element.businessObject;
          setProperties(element.businessObject, {
            extensionElements: newElement
          });
        }

        var settingFormFields = currentProperties.map(function (field, index) {
          var accessibility = getAccessibility(field);
          // var newId = field.id.split("")
          return {
            controlType: "rbh",
            enumValues: [{ id: "hide", name: "隐藏" },
            { id: "read", name: "只读" },
            { id: "write", name: "编辑" }],
            fieldType: "enum",
            id: field.id,//"setting" + (index + 1) + "_" + field.name + "_" + (index + 1) + "_enum_rbh_$$A",
            name: field.name,
            readable: true,
            writable: true,
            required: true,
            ignoreLabel: true,
            seq: 1,
            type: "enum",
            value: ko.observable(accessibility)
          }
        });

        vm.editingProcess.form.push.apply(vm.editingProcess.form, settingFormFields);

        settingFormFields.forEach(function (field, index) {
          field.value.subscribe(function (value) {
            var currentField = panel._current.element.businessObject.get("bpmn:extensionElements").values[index];
            setAccessibility(currentField, value);
          }, field);
        });
      }
    }

    var newTabs = this._propertiesProvider.getTabs(element);
    if (current && current.element === element) {
      // see if we can reuse the existing panel

      needsCreate = this._entriesChanged(current, newTabs);
    }

    if (needsCreate) {

      if (current) {

        // get active tab from the existing panel before remove it
        var activeTabNode = domQuery('.bpp-properties-tab.bpp-active', current.panel);

        var activeTabId;
        if (activeTabNode) {
          activeTabId = domAttr(activeTabNode, 'data-tab');
        }

        // remove old panel
        domRemove(current.panel);
      }

      this._current = this._create(element, newTabs);

      // activate the saved active tab from the remove panel or the first tab
      (activeTabId) ? this.activateTab(activeTabId) : this.activateTab(this._current.tabs[0]);

    }

    if (this._current) {
      // make sure correct tab contents are visible
      this._updateActivation(this._current);

    }

    this._emit('changed');
  };


  /**
   * Returns true if one of two groups has different entries than the other.
   *
   * @param  {Object} current
   * @param  {Object} newTabs
   * @return {Booelan}
   */
  PropertiesPanel.prototype._entriesChanged = function (current, newTabs) {

    var oldEntryIds = keys_1(current.entries),
      newEntryIds = keys_1(extractEntries(newTabs));

    return !isEmpty_1(xor_1(oldEntryIds, newEntryIds));
  };

  PropertiesPanel.prototype._emit = function (event$$1) {
    this._eventBus.fire('propertiesPanel.' + event$$1, { panel: this, current: this._current });
  };

  PropertiesPanel.prototype._bindListeners = function (container) {

    var self = this;

    // handles a change for a given event
    var handleChange = function handleChange(event$$1) {

      // see if we handle a change inside a [data-entry] element.
      // if not, drop out
      var node = domClosest(event$$1.delegateTarget, '[data-entry]'),
        entryId, entry;

      // change from outside a [data-entry] element, simply ignore
      if (!node) {
        return;
      }

      entryId = domAttr(node, 'data-entry');
      entry = self.getEntry(entryId);

      var values = getFormControlValues(node);

      if (event$$1.type === 'change') {

        // - if the "data-on-change" attribute is present and a value is changed,
        //   then the associated action is performed.
        // - if the associated action returns "true" then an update to the business
        //   object is done
        // - if it does not return "true", then only the DOM content is updated
        var onChangeAction = event$$1.delegateTarget.getAttribute('data-on-change');

        if (onChangeAction) {
          var isEntryDirty = self.executeAction(entry, node, onChangeAction, event$$1);

          if (!isEntryDirty) {
            return self.update(self._current.element);
          }
        }
      }
      self.applyChanges(entry, values, node);
      self.updateState(entry, node);
    };

    // debounce update only elements that are target of key events,
    // i.e. INPUT and TEXTAREA. SELECTs will trigger an immediate update anyway.
    domDelegate.bind(container, 'input, textarea, [contenteditable]', 'input', debounce_1(handleChange, DEBOUNCE_DELAY));
    domDelegate.bind(container, 'input, textarea, select, [contenteditable]', 'change', handleChange);

    domDelegate.bind(container, '[data-action]', 'click', function onClick(event$$1) {

      // triggers on all inputs
      var inputNode = event$$1.delegateTarget;
      var entryNode = domClosest(inputNode, '[data-entry]');

      var actionId = domAttr(inputNode, 'data-action'),
        entryId = domAttr(entryNode, 'data-entry');

      var entry = self.getEntry(entryId);

      var isEntryDirty = self.executeAction(entry, entryNode, actionId, event$$1);

      if (isEntryDirty) {
        var values = getFormControlValues(entryNode);

        self.applyChanges(entry, values, entryNode);
      }

      self.updateState(entry, entryNode);
    });

    function handleInput(event$$1, element) {
      // triggers on all inputs
      var inputNode = event$$1.delegateTarget;

      var entryNode = domClosest(inputNode, '[data-entry]');

      // only work on data entries
      if (!entryNode) {
        return;
      }

      var eventHandlerId = domAttr(inputNode, 'data-blur'),
        entryId = domAttr(entryNode, 'data-entry');

      var entry = self.getEntry(entryId);

      var isEntryDirty = self.executeAction(entry, entryNode, eventHandlerId, event$$1);

      if (isEntryDirty) {
        var values = getFormControlValues(entryNode);

        self.applyChanges(entry, values, entryNode);
      }

      self.updateState(entry, entryNode);
    }

    domDelegate.bind(container, '[data-blur]', 'blur', handleInput, true);

    // make tab links interactive
    domDelegate.bind(container, '.bpp-properties-tabs-links [data-tab-target]', 'click', function (event$$1) {
      event$$1.preventDefault();

      var delegateTarget = event$$1.delegateTarget;

      var tabId = domAttr(delegateTarget, 'data-tab-target');

      // activate tab on link click
      self.activateTab(tabId);
    });

  };

  PropertiesPanel.prototype.updateState = function (entry, entryNode) {
    this.updateShow(entry, entryNode);
    this.updateDisable(entry, entryNode);
  };

  /**
   * Update the visibility of the entry node in the DOM
   */
  PropertiesPanel.prototype.updateShow = function (entry, node) {

    var current = this._current;

    if (!current) {
      return;
    }

    var showNodes = domQueryAll('[data-show]', node) || [];

    forEach_1(showNodes, function (showNode) {

      var expr = domAttr(showNode, 'data-show');
      var fn = get_1(entry, expr);
      if (fn) {
        var scope = domClosest(showNode, '[data-scope]') || node;
        var shouldShow = fn(current.element, node, showNode, scope) || false;
        if (shouldShow) {
          domClasses(showNode).remove(HIDE_CLASS);
        } else {
          domClasses(showNode).add(HIDE_CLASS);
        }
      }
    });
  };

  /**
   * Evaluates a given function. If it returns true, then the
   * node is marked as "disabled".
   */
  PropertiesPanel.prototype.updateDisable = function (entry, node) {
    var current = this._current;

    if (!current) {
      return;
    }

    var nodes = domQueryAll('[data-disable]', node) || [];

    forEach_1(nodes, function (currentNode) {
      var expr = domAttr(currentNode, 'data-disable');
      var fn = get_1(entry, expr);
      if (fn) {
        var scope = domClosest(currentNode, '[data-scope]') || node;
        var shouldDisable = fn(current.element, node, currentNode, scope) || false;
        domAttr(currentNode, 'disabled', shouldDisable ? '' : null);
      }
    });
  };

  PropertiesPanel.prototype.executeAction = function (entry, entryNode, actionId, event$$1) {
    var current = this._current;

    if (!current) {
      return;
    }

    var fn = get_1(entry, actionId);
    if (fn) {
      var scopeNode = domClosest(event$$1.target, '[data-scope]') || entryNode;
      return fn.apply(entry, [current.element, entryNode, event$$1, scopeNode]);
    }
  };

  /**
   * Apply changes to the business object by executing a command
   */
  PropertiesPanel.prototype.applyChanges = function (entry, values, containerElement) {

    var element = this._current.element;

    // ensure we only update the model if we got dirty changes
    if (valuesEqual(values, entry.oldValues)) {
      return;
    }

    var command = entry.set(element, values, containerElement);

    var commandToExecute;

    if (isArray_1(command)) {
      if (command.length) {
        commandToExecute = {
          cmd: 'properties-panel.multi-command-executor',
          context: flattenDeep_1(command)
        };
      }
    } else {
      commandToExecute = command;
    }

    if (commandToExecute) {
      this._commandStack.execute(commandToExecute.cmd, commandToExecute.context || { element: element });
    } else {
      this.update(element);
    }
  };


  /**
   * apply validation errors in the DOM and show or remove an error message near the entry node.
   */
  PropertiesPanel.prototype.applyValidationErrors = function (validationErrors, entryNode) {

    var valid = true;

    var controlNodes = getFormControls(entryNode, true);

    forEach_1(controlNodes, function (controlNode) {

      var name = domAttr(controlNode, 'name') || domAttr(controlNode, 'data-name');

      var error = validationErrors && validationErrors[name];

      var errorMessageNode = domQuery('.bpp-error-message', controlNode.parentNode);

      if (error) {
        valid = false;

        if (!errorMessageNode) {
          errorMessageNode = domify$3('<div></div>');

          domClasses(errorMessageNode).add('bpp-error-message');

          // insert errorMessageNode after controlNode
          controlNode.parentNode.insertBefore(errorMessageNode, controlNode.nextSibling);
        }

        errorMessageNode.innerHTML = error;

        domClasses(controlNode).add('invalid');
      } else {
        domClasses(controlNode).remove('invalid');

        if (errorMessageNode) {
          controlNode.parentNode.removeChild(errorMessageNode);
        }
      }
    });

    return valid;
  };


  /**
   * Check if the entry contains valid input
   */
  PropertiesPanel.prototype.validate = function (entry, values, entryNode) {
    var self = this;

    var current = this._current;

    var valid = true;

    entryNode = entryNode || domQuery('[data-entry="' + entry.id + '"]', current.panel);

    if (values instanceof Array) {
      var listContainer = domQuery('[data-list-entry-container]', entryNode),
        listEntryNodes = listContainer.children || [];

      // create new elements
      for (var i = 0; i < values.length; i++) {
        var listValue = values[i];

        if (entry.validateListItem) {

          var validationErrors = entry.validateListItem(current.element, listValue, entryNode, i),
            listEntryNode = listEntryNodes[i];

          valid = self.applyValidationErrors(validationErrors, listEntryNode) && valid;
        }
      }
    } else {
      if (entry.validate) {
        this.validationErrors = entry.validate(current.element, values, entryNode);

        valid = self.applyValidationErrors(this.validationErrors, entryNode) && valid;
      }
    }

    return valid;
  };

  PropertiesPanel.prototype.getEntry = function (id) {
    return this._current && this._current.entries[id];
  };



  PropertiesPanel.prototype._create = function (element, tabs) {

    if (!element) {
      return null;
    }

    var containerNode = this._container;

    var panelNode = this._createPanel(element, tabs);

    containerNode.appendChild(panelNode);

    var entries = extractEntries(tabs);
    var groups = extractGroups(tabs);

    return {
      tabs: tabs,
      groups: groups,
      entries: entries,
      element: element,
      panel: panelNode
    };
  };

  /**
   * Update variable parts of the entry node on element changes.
   *
   * @param {djs.model.Base} element
   * @param {EntryDescriptor} entry
   * @param {Object} values
   * @param {HTMLElement} entryNode
   * @param {Number} idx
   */
  PropertiesPanel.prototype._bindTemplate = function (element, entry, values, entryNode, idx) {

    var eventBus = this._eventBus;

    function isPropertyEditable(entry, propertyName) {
      return eventBus.fire('propertiesPanel.isPropertyEditable', {
        entry: entry,
        propertyName: propertyName,
        element: element
      });
    }

    var inputNodes = getPropertyPlaceholders(entryNode);

    forEach_1(inputNodes, function (node) {

      var name,
        newValue,
        editable;

      // we deal with an input element
      if ('value' in node || isContentEditable(node) === 'true') {
        name = domAttr(node, 'name') || domAttr(node, 'data-name');
        newValue = values[name];

        editable = isPropertyEditable(entry, name);
        if (editable && entry.editable) {
          editable = entry.editable(element, entryNode, node, name, newValue, idx);
        }

        domAttr(node, 'readonly', editable ? null : '');
        domAttr(node, 'disabled', editable ? null : '');

        // take full control over setting the value
        // and possibly updating the input in entry#setControlValue
        if (entry.setControlValue) {
          entry.setControlValue(element, entryNode, node, name, newValue, idx);
        } else if (isToggle(node)) {
          setToggleValue(node, newValue);
        } else if (isSelect(node)) {
          setSelectValue(node, newValue);
        } else {
          setInputValue(node, newValue);
        }
      }

      // we deal with some non-editable html element
      else {
        name = domAttr(node, 'data-value');
        newValue = values[name];
        if (entry.setControlValue) {
          entry.setControlValue(element, entryNode, node, name, newValue, idx);
        } else {
          setTextValue(node, newValue);
        }
      }
    });
  };

  // TODO(nikku): WTF freaking name? Change / clarify.
  PropertiesPanel.prototype._updateActivation = function (current) {
    var self = this;

    var eventBus = this._eventBus;

    var element = current.element;

    function isEntryVisible(entry) {
      return eventBus.fire('propertiesPanel.isEntryVisible', {
        entry: entry,
        element: element
      });
    }

    function isGroupVisible(group, element, groupNode) {
      if (typeof group.enabled === 'function') {
        return group.enabled(element, groupNode);
      } else {
        return true;
      }
    }

    function isTabVisible(tab, element) {
      if (typeof tab.enabled === 'function') {
        return tab.enabled(element);
      } else {
        return true;
      }
    }

    function toggleVisible(node, visible) {
      domClasses(node).toggle(HIDE_CLASS, !visible);
    }

    // check whether the active tab is visible
    // if not: set the first tab as active tab
    function checkActiveTabVisibility(node, visible) {
      var isActive = domClasses(node).has('bpp-active');
      if (!visible && isActive) {
        self.activateTab(current.tabs[0]);
      }
    }

    function updateLabel(element, selector, text) {
      var labelNode = domQuery(selector, element);

      if (!labelNode) {
        return;
      }

      labelNode.textContent = text;
    }

    var panelNode = current.panel;

    forEach_1(current.tabs, function (tab) {

      var tabNode = domQuery('[data-tab=' + tab.id + ']', panelNode);
      var tabLinkNode = domQuery('[data-tab-target=' + tab.id + ']', panelNode).parentNode;

      var tabVisible = false;

      forEach_1(tab.groups, function (group) {

        var groupVisible = false;

        var groupNode = domQuery('[data-group=' + group.id + ']', tabNode);

        forEach_1(group.entries, function (entry) {

          var entryNode = domQuery('[data-entry="' + entry.id + '"]', groupNode);

          var entryVisible = isEntryVisible(entry);

          groupVisible = groupVisible || entryVisible;

          toggleVisible(entryNode, entryVisible);

          var values = 'get' in entry ? entry.get(element, entryNode) : {};

          if (values instanceof Array) {
            var listEntryContainer = domQuery('[data-list-entry-container]', entryNode);
            var existingElements = listEntryContainer.children || [];

            for (var i = 0; i < values.length; i++) {
              var listValue = values[i];
              var listItemNode = existingElements[i];
              if (!listItemNode) {
                listItemNode = domify$3(entry.createListEntryTemplate(listValue, i, listEntryContainer));
                listEntryContainer.appendChild(listItemNode);
              }
              domAttr(listItemNode, 'data-index', i);

              self._bindTemplate(element, entry, listValue, listItemNode, i);
            }

            var entriesToRemove = existingElements.length - values.length;

            for (var j = 0; j < entriesToRemove; j++) {
              // remove orphaned element
              listEntryContainer.removeChild(listEntryContainer.lastChild);
            }

          } else {
            self._bindTemplate(element, entry, values, entryNode);
          }

          // update conditionally visible elements
          self.updateState(entry, entryNode);
          self.validate(entry, values, entryNode);

          // remember initial state for later dirty checking
          entry.oldValues = getFormControlValues(entryNode);
        });

        if (typeof group.label === 'function') {
          updateLabel(groupNode, '.group-label', group.label(element, groupNode));
        }

        groupVisible = groupVisible && isGroupVisible(group, element, groupNode);

        tabVisible = tabVisible || groupVisible;

        toggleVisible(groupNode, groupVisible);
      });

      tabVisible = tabVisible && isTabVisible(tab, element);

      toggleVisible(tabNode, tabVisible);
      toggleVisible(tabLinkNode, tabVisible);

      checkActiveTabVisibility(tabNode, tabVisible);
    });

    // inject elements id into header
    updateLabel(panelNode, '[data-label-id]', getBusinessObject$1(element).id || '');
  };

  PropertiesPanel.prototype._createPanel = function (element, tabs) {
    var self = this;

    var panelNode = domify$3('<div class="bpp-properties"></div>'),
      headerNode = domify$3('<div class="bpp-properties-header">' +
        '<div class="label" data-label-id></div>' +
        '<div class="search">' +
        '<input type="search" placeholder="Search for property" />' +
        '<button><span>Search</span></button>' +
        '</div>' +
        '</div>'),
      tabBarNode = domify$3('<div class="bpp-properties-tab-bar"></div>'),
      tabLinksNode = domify$3('<ul class="bpp-properties-tabs-links"></ul>'),
      tabContainerNode = domify$3('<div class="bpp-properties-tabs-container"></div>');

    panelNode.appendChild(headerNode);

    forEach_1(tabs, function (tab, tabIndex) {

      if (!tab.id) {
        throw new Error('tab must have an id');
      }

      var tabNode = domify$3('<div class="bpp-properties-tab" data-tab="' + tab.id + '"></div>'),
        tabLinkNode = domify$3('<li class="bpp-properties-tab-link">' +
          '<a href data-tab-target="' + tab.id + '">' + tab.label + '</a>' +
          '</li>');

      var groups = tab.groups;

      forEach_1(groups, function (group) {

        if (!group.id) {
          throw new Error('group must have an id');
        }

        var groupNode = domify$3('<div class="bpp-properties-group" data-group="' + group.id + '">' +
          '<span class="group-toggle"></span>' +
          '<span class="group-label">' + group.label + '</span>' +
          '</div>');

        // TODO(nre): use event delegation to handle that...
        groupNode.querySelector('.group-toggle').addEventListener('click', function (evt) {
          domClasses(groupNode).toggle('group-closed');
          evt.preventDefault();
          evt.stopPropagation();
        });
        groupNode.addEventListener('click', function (evt) {
          if (!evt.defaultPrevented && domClasses(groupNode).has('group-closed')) {
            domClasses(groupNode).remove('group-closed');
          }
        });

        forEach_1(group.entries, function (entry) {

          if (!entry.id) {
            throw new Error('entry must have an id');
          }

          var html = entry.html;

          if (typeof html === 'string') {
            html = domify$3(html);
          }

          // unwrap jquery
          if (html.get && html.constructor.prototype.jquery) {
            html = html.get(0);
          }

          var entryNode = domify$3('<div class="bpp-properties-entry" data-entry="' + entry.id + '"></div>');

          forEach_1(entry.cssClasses || [], function (cssClass) {
            domClasses(entryNode).add(cssClass);
          });

          entryNode.appendChild(html);

          groupNode.appendChild(entryNode);

          // update conditionally visible elements
          self.updateState(entry, entryNode);
        });

        tabNode.appendChild(groupNode);
      });

      tabLinksNode.appendChild(tabLinkNode);
      tabContainerNode.appendChild(tabNode);
    });

    tabBarNode.appendChild(tabLinksNode);

    panelNode.appendChild(tabBarNode);
    panelNode.appendChild(tabContainerNode);

    return panelNode;
  };



  function setInputValue(node, value) {

    var contentEditable = isContentEditable(node);

    var oldValue = contentEditable ? node.innerText : node.value;

    var selection;

    // prevents input fields from having the value 'undefined'
    if (value === undefined) {
      value = '';
    }

    if (oldValue === value) {
      return;
    }

    // update selection on undo/redo
    if (document.activeElement === node) {
      selection = selectionUpdate(getSelection(node), oldValue, value);
    }

    if (contentEditable) {
      node.innerText = value;
    } else {
      node.value = value;
    }

    if (selection) {
      setSelection(node, selection);
    }
  }

  function setSelectValue(node, value) {
    if (value !== undefined) {
      node.value = value;
    }
  }

  function setToggleValue(node, value) {
    var nodeValue = node.value;

    node.checked = (value === nodeValue) || (!domAttr(node, 'value') && value);
  }

  function setTextValue(node, value) {
    node.textContent = value;
  }

  function getSelection(node) {

    return isContentEditable(node) ? getContentEditableSelection(node) : {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  }

  function getContentEditableSelection(node) {

    var selection = window.getSelection();

    var focusNode = selection.focusNode,
      focusOffset = selection.focusOffset,
      anchorOffset = selection.anchorOffset;

    if (!focusNode) {
      throw new Error('not selected');
    }

    // verify we have selection on the current element
    if (!node.contains(focusNode)) {
      throw new Error('not selected');
    }

    return {
      start: Math.min(focusOffset, anchorOffset),
      end: Math.max(focusOffset, anchorOffset)
    };
  }

  function setSelection(node, selection) {

    if (isContentEditable(node)) {
      setContentEditableSelection(node, selection);
    } else {
      node.selectionStart = selection.start;
      node.selectionEnd = selection.end;
    }
  }

  function setContentEditableSelection(node, selection) {

    var focusNode,
      domRange,
      domSelection;

    focusNode = node.firstChild || node, domRange = document.createRange();
    domRange.setStart(focusNode, selection.start);
    domRange.setEnd(focusNode, selection.end);

    domSelection = window.getSelection();
    domSelection.removeAllRanges();
    domSelection.addRange(domRange);
  }

  function isImplicitRoot(element) {
    return element.id === '__implicitroot';
  }

  return PropertiesPanel_1;

})));
