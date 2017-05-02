var AlienDragAndDrop = (function() {
        "use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AlienDragAndDrop = function () {

  //module X:\alien-drag-and-drop\src\listen.js start: 


  var listen = function () {
    function listenOne(node, eventType, listener) {
      if (window.jQuery) {
        var $node = $(node);
        $node.on(eventType, listener);
        return function () {
          $node.off(eventType, listener);
          $node = null;
          node = null;
        };
      }

      if (document.addEventListener) {
        var shouldCapture = eventType === "focus";
        node.addEventListener(eventType, listener, shouldCapture);
        return function () {
          node.removeEventListener(eventType, listener, shouldCapture);
          node = null;
        };
      }

      if (document.attachEvent) {
        var fn = compatible(listener, node);
        node.attachEvent("on" + eventType, fn);
        return function () {
          node.detachEvent("on" + eventType, fn);
          node = null;
        };
      }
    }

    function listen(node, eventTypes, listener) {
      var types = eventTypes.split(/\s+/g),
          i = void 0,
          unlisteners = [];
      for (i = 0; i < types.length; i++) {
        unlisteners.push(listenOne(node, types[i], listener));
      }
      return function () {
        var i = void 0;
        for (i = 0; i < unlisteners.length; i++) {
          unlisteners[i]();
        }
      };
    }

    function compatible(fn, node) {
      return function (e) {
        e = e || window.event;

        e.target = e.target || e.srcElement || node;

        e.preventDefault = function () {
          e.returnValue = false;
        };

        e.stopPropagation = function () {
          e.cancelBubble = true;
        };

        e.which = e.keyCode ? e.keyCode : isNaN(e.button) ? undefined : e.button + 1;

        e.relatedTarget = e.type === "mouseover" ? e.fromElement : e.type === "mouseout" ? e.toElement : null;

        return fn(e);
      };
    }

    return listen;
  }();

  //module X:\alien-drag-and-drop\src\listen.js end

  //module X:\alien-drag-and-drop\src\tomato.js start: 


  var tomato = function () {
    var Tomato = function () {
      function Tomato() {
        _classCallCheck(this, Tomato);
      }

      Tomato.prototype.map = function map(list, fn) {
        var l, i, res;
        for (l = list.length, i = 0, res = []; i < l; i++) {
          res.push(fn(list[i], i, list));
        }

        return res;
      };

      Tomato.prototype.each = function each(list, fn) {
        var l,
            i,
            li = list;
        for (l = li.length, i = 0; i < l; i++) {
          fn(li[i], i, li);
        }
      };

      Tomato.prototype.consume = function consume(list, fn) {
        while (list.length) {
          fn(list.shift());
        }
      };

      Tomato.prototype.findRight = function findRight(list, fn) {
        var i = void 0;
        for (i = list.length - 1; i >= 0; i--) {
          if (fn(list[i], i, list)) {
            return list[i];
          }
        }
        return null;
      };

      Tomato.prototype.closest = function closest(el, sel) {
        if (el.closest) {
          return el.closest(sel);
        }
        var e = void 0;
        for (e = el; e; e = e.parentNode) {
          if (this.matches(e, sel)) {
            return e;
          }
        }
        return null;
      };

      Tomato.prototype.matches = function matches(el, sel) {
        var useRaw = void 0,
            res = void 0;
        this.each(["matches", "matchesSelector", "msMatchesSelector", "oMatchesSelector", "webkitMatchesSelector"], function (fn) {
          if (el[fn]) {
            useRaw = true;
            res = el[fn](sel);
          }
        });

        if (useRaw) {
          return res;
        }

        var els = (el.parentNode || el.ownerDocument || document).querySelectorAll(sel),
            i = els.length;
        while (--i >= 0 && els.item(i) !== el) {}
        return i > -1;
      };

      Tomato.prototype.prev = function prev(el, sel) {
        var e = void 0;
        for (e = el.previousSibling; e; e = e.previousSibling) {
          if (e.nodeType === 1 && sel(e)) {
            return e;
          }
        }
        return null;
      };

      Tomato.prototype.next = function next(el, sel) {
        var e = void 0;
        for (e = el.nextSibling; e; e = e.nextSibling) {
          if (e.nodeType === 1 && sel(e)) {
            return e;
          }
        }
        return null;
      };

      Tomato.prototype.lastChild = function lastChild(el, sel) {
        var e = void 0;

        for (e = el.lastChild; e; e = e.previousSibling) {
          if (e.nodeType === 1 && sel(e)) {
            return e;
          }
        }
        return null;
      };

      Tomato.prototype.firstChild = function firstChild(el, sel) {
        var e = void 0;

        for (e = el.firstChild; e; e = e.nextSibling) {
          if (e.nodeType === 1 && sel(e)) {
            return e;
          }
        }
        return null;
      };

      return Tomato;
    }();

    var tomato = new Tomato();

    return tomato;
  }();

  //module X:\alien-drag-and-drop\src\tomato.js end

  //module X:\alien-drag-and-drop\src\Subscribable.js start: 


  var Subscribable = function () {
    var Subscribable = function () {
      function Subscribable() {
        _classCallCheck(this, Subscribable);

        this.store = {};
      }

      Subscribable.prototype.subscribe = function subscribe(type, callback) {
        var _this = this;

        if (!this.store[type]) {
          this.store[type] = [];
        }
        this.store[type].push(callback);
        return function () {
          if (!_this.store[type]) {
            return;
          }
          for (var i = 0; i < _this.store[type].length; i++) {
            if (_this.store[type][i] === callback) {
              _this.store[type].splice(i, 1);
              i--;
            }
          }
        };
      };

      Subscribable.prototype.broadcast = function broadcast(type) {
        var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (this.store[type]) {
          for (var i = 0; i < this.store[type].length; i++) {
            if (this.radioFilter(type, payload)) {
              this.store[type][i](payload);
            }
          }
        }
      };

      Subscribable.prototype.unSubscribeAll = function unSubscribeAll() {
        this.store = {};
      };

      Subscribable.prototype.radioFilter = function radioFilter(type, payload) {
        return true;
      };

      return Subscribable;
    }();

    return Subscribable;
  }();

  //module X:\alien-drag-and-drop\src\Subscribable.js end

  //module X:\alien-drag-and-drop\src\getMousePositionRelatedToItsTarget.js start: 

  //module X:\alien-drag-and-drop\src\getMousePositionRelatingToBoudingBox.js start: 


  var getMousePositionRelatingToBoudingBox = function () {
    function getMousePositionRelatingToBoudingBox(x, y, el) {
      var target = el,
          style = target.currentStyle || window.getComputedStyle(target, null),
          borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
          borderTopWidth = parseInt(style['borderTopWidth'], 10),
          rect = target.getBoundingClientRect(),
          offsetX = x - borderLeftWidth - rect.left,
          offsetY = y - borderTopWidth - rect.top;

      return [offsetX, offsetY];
    }

    return getMousePositionRelatingToBoudingBox;
  }();

  //module X:\alien-drag-and-drop\src\getMousePositionRelatingToBoudingBox.js end

  var getMousePositionRelatedToItsTarget = function () {

    function getMousePositionRelatedToItsTarget(e) {
      return getMousePositionRelatingToBoudingBox(e.clientX, e.clientY, e.target || e.srcElement);
    }

    return getMousePositionRelatedToItsTarget;
  }();

  //module X:\alien-drag-and-drop\src\getMousePositionRelatedToItsTarget.js end

  //module X:\alien-drag-and-drop\src\DragLayer.js start: 

  //module X:\alien-drag-and-drop\src\DROP_NO.js start: 


  var DROP_NO = function () {
    var DROP_NO = "data:image/gif;base64,R0lGODlhEAAQAIcAAMAAAMEEBMQQEMUUFMccHMkkJM00NM88PNRQUNVUVNlkZNpoaNxwcN10dOSQkOecnOmkpOuwsO24uO68vO/AwPDExPHIyPLMzPXY2Pfg4Pjk5Pno6Pvw8Pz09P34+P///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAB8ALAAAAAAQABAAAAiSAD8IHNiBAoUOAxMOjGAAgMMAByoo/LABAQACDSA8YCAAgAKEAy0u4JBQg0MGCwE0mOgQQIALAg0UADmwpYYBCT50AOBAYUuBDAZ8oABgQsKfAh8AyCChaE2HCZVi4MBTINKBQWPOvCrwZs4PEVoCmJjgZUiHJAdqSAAA5cCKFzNu7PhxIsOWECVOJCjBgoeJAQEAOw==";

    return DROP_NO;
  }();

  //module X:\alien-drag-and-drop\src\DROP_NO.js end

  //module X:\alien-drag-and-drop\src\DROP_YES.js start: 


  var DROP_YES = function () {
    var DROP_YES = "data:image/gif;base64,R0lGODlhEAAQAIcAACdyJCZ/Iyl3JSl6JTR8MDV/MSaEIyqPJTWPMT+FOz+LOz+NOz+ZPDuhJ0yXPUKhM0ShM0mwJ1G3LlWzNV21P1q+N06bQVKgQl6pSGSwTGy2Vm23V261WG+1WG+1WWq5UHS3W3S3XHC/V3C4WXG5W3K5W3O6XHG+X3e8YH23Zny6ZH28Zn2+Z3+4aVzAO1zDPWbFSWrDSWzFS2nISnTCWXLLVW/CYW/DYW7EYW7EYm7FY2/GZHDBY3HEY3DHZXPHZnTDZHLIaHTIaHXIaHbJaXbKannBZH7BaX7Hb3nJa3rMbX/KcIO+bYfCcoXFdYDKc4DMcoPOd4fJeYnEdovIeJDOf5G5j5C8jpbHg5HAj5bLhpfMhZTIj5bNiJrHh5jLhprKh5jMh5nNip3Oi5nRi5nQjJrUjZvXkZ/SkJ/SkZ3YkqHWlaHXlaPXlqvSm6vTm6rcl63fm67Xoa/XoK7cpa/cprPZpbHdp7TZpbTaprLbqLXbqLTdqrTfrLXfrLbQtbbRtbfZtbrbtb7ftbDjn7Xhrrfhr7fhsL7jtr/juMHjtsDkucvsv8DAwMvtwNbu0tns1Ob04+336/H58PT68vz9+/3+/f///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAMAAI0ALAAAAAAQABAAAAjVABsJHEiwoEFCNVxUiAHHoEBHM2i0oUNnzYcJigoyelHFkJooUdQUotJgEEEYVQopKRJEyJAkfaY8GBhHhCElQXzoyNEDERI/GLgIlMHmDJEdOG7YWHQpEpkxDARKuAPlx6FHPBJdqlTmiBwDAiPUWfJk0iVJW7uQYDEngEAKacwAkULpkiUtG0ps8aJAIJoMfIyccAJJjAYOIfJYuDIQQhM9KEyM8NABhJ0WBQgKOsBkT5gVKr7gSQEAUMFACC6AeeMGiwMCfxw2yrJggIAEVmTrJhgQADs=";

    return DROP_YES;
  }();

  //module X:\alien-drag-and-drop\src\DROP_YES.js end


  //module X:\alien-drag-and-drop\src\setStyle.js start: 


  var setStyle = function () {
    function setStyle(el, style) {
      var text = el.style.cssText,
          rcss = parse(text),
          mcss = _extends({}, rcss, style);

      el.style.cssText = stringify(mcss);
    }

    function parse(text) {
      var css = {},
          list = text.split(/\s*;\s*/g),
          i = void 0;

      for (i = 0; i < list.length; i++) {
        var _list$i$split = list[i].split(/\s*:\s*/g),
            name = _list$i$split[0],
            value = _list$i$split[1];

        css[name] = value;
      }
      return css;
    }

    function stringify(css) {
      var text = "",
          name = void 0;
      for (name in css) {
        if (css.hasOwnProperty(name)) {
          text += name + ":" + css[name] + ";";
        }
      }
      return text;
    }

    return setStyle;
  }();

  //module X:\alien-drag-and-drop\src\setStyle.js end

  var DragLayer = function () {
    var DragLayer = function () {
      function DragLayer(node, offsetX, offsetY) {
        _classCallCheck(this, DragLayer);

        var CursorOffset = 20;

        var wrapper = document.createElement("div"),
            cursorDomNode = document.createElement("img"),
            clonedNode = node.cloneNode(true);

        // wrapper.style.position = "fixed";
        // wrapper.style.zIndex = 9999;
        // wrapper.style.width = node.offsetWidth + "px";
        // wrapper.style.height = node.offsetHeight + "px";
        wrapper.style.cssText = "position:fixed;z-index:9999;width:" + node.offsetWidth + "px;height:" + node.offsetHeight + "px;display:none;";

        // clonedNode.style.position = "absolute";
        // clonedNode.style.top = 0;
        // clonedNode.style.left = 0;
        setStyle(clonedNode, {
          position: "absolute",
          top: 0,
          left: 0
        });

        cursorDomNode.width = CursorOffset;
        cursorDomNode.height = CursorOffset;
        // cursorDomNode.style.position = "absolute";
        // cursorDomNode.style.top = `${-CursorOffset / 3}px`;
        // cursorDomNode.style.left = `${-CursorOffset / 3}px`;
        // cursorDomNode.style.opacity = 0.8;
        cursorDomNode.style.cssText = "position:absolute;top:" + -CursorOffset / 3 + "px;left:" + -CursorOffset / 3 + "px;opacity:.8;";
        cursorDomNode.src = DROP_NO;

        wrapper.appendChild(clonedNode);
        wrapper.appendChild(cursorDomNode);

        document.body.appendChild(wrapper);

        this.wrapper = wrapper;
        this.cursorDomNode = cursorDomNode;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.listener = listen(this.wrapper, "selectstart dragstart mousemove", function (e) {
          e.preventDefault();
        });
      }

      DragLayer.prototype.setPosition = function setPosition(x, y) {
        this.wrapper.style.top = y - this.offsetY + "px";
        this.wrapper.style.left = x - this.offsetX + "px";
      };

      DragLayer.prototype.hide = function hide() {
        this.wrapper.style.display = "none";
      };

      DragLayer.prototype.show = function show() {
        this.wrapper.style.display = "block";
      };

      DragLayer.prototype.destroy = function destroy() {
        this.listener();
        this.wrapper.parentNode.removeChild(this.wrapper);
      };

      DragLayer.prototype.setCursor = function setCursor() {
        this.cursorDomNode.src = DROP_YES;
      };

      DragLayer.prototype.unsetCursor = function unsetCursor() {
        this.cursorDomNode.src = DROP_NO;
      };

      return DragLayer;
    }();

    return DragLayer;
  }();

  //module X:\alien-drag-and-drop\src\DragLayer.js end


  //module X:\alien-drag-and-drop\src\Hyperscope\index.js start: 

  //module X:\alien-drag-and-drop\src\Hyperscope\checkShouldScroll.js start: 

  //module X:\alien-drag-and-drop\src\Hyperscope\getNodePath.js start: 


  var getNodePath = function () {
    function getNodePath(el) {
      var node = void 0,
          path = [];

      for (node = el; node; node = node.parentNode) {
        if (node.nodeType === 1) {
          path.push(node);
        }
      }
      return path;
    }

    return getNodePath;
  }();

  //module X:\alien-drag-and-drop\src\Hyperscope\getNodePath.js end

  //module X:\alien-drag-and-drop\src\Hyperscope\isScrollable.js start: 


  var isScrollable = function () {
    var overflowRegex = /(auto|scroll|hidden)/;

    function needScroll(el, dir) {
      var scrollTop = el.scrollTop,
          scrollLeft = el.scrollLeft,
          scrollHeight = el.scrollHeight,
          scrollWidth = el.scrollWidth,
          clientHeight = el.clientHeight,
          clientWidth = el.clientWidth;

      switch (dir) {
        case "left":
          return scrollLeft > 0;
          break;
        case "right":
          return scrollLeft + clientWidth < scrollWidth;
          break;
        case "up":
          return scrollTop > 0;
          break;
        case "down":
          return scrollTop + clientHeight < scrollHeight;
          break;
      }
      return false;
    }

    function canScroll(el) {
      var style = el.currentStyle || window.getComputedStyle(el, null);
      if (el === document.scrollingElement) {
        return true;
      }
      if (el === document.body) {
        return true;
      }
      if (el === document.documentElement) {
        return true;
      }
      return overflowRegex.test(style.overflow + style.overflowY + style.overflowX);
    }

    function isScrollable(el, dir) {
      // dir: left, right, up, down
      return canScroll(el) && needScroll(el, dir);
    }

    return isScrollable;
  }();

  //module X:\alien-drag-and-drop\src\Hyperscope\isScrollable.js end

  var checkShouldScroll = function () {

    var ERROR = 20;

    function between(x, a, b) {
      return x > a && x < b;
    }

    function getRect(el) {
      if (el === document.documentElement) {
        return {
          top: 0,
          left: 0,
          right: el.clientWidth,
          bottom: el.clientHeight,
          width: el.clientWidth,
          height: el.clientHeight
        };
      }

      return el.getBoundingClientRect();
    }

    function checkShouldScroll(x, y, element) {
      var path = getNodePath(element),
          res = { x: 0, y: 0 },
          rect = void 0,
          i = void 0;

      for (i = path.length - 1; i >= 0; i--) {
        rect = getRect(path[i]);
        if (between(x - rect.left, 0, ERROR) && isScrollable(path[i], "left")) {
          res.x = -1;
        }
        if (between(x - rect.right, -ERROR, 0) && isScrollable(path[i], "right")) {
          res.x = 1;
        }

        if (between(y - rect.top, 0, ERROR) && isScrollable(path[i], "up")) {
          res.y = -1;
        }
        if (between(y - rect.bottom, -ERROR, 0) && isScrollable(path[i], "down")) {
          res.y = 1;
        }

        if (res.x || res.y) {
          return res;
        }
      }

      return res;
    }

    return checkShouldScroll;
  }();

  //module X:\alien-drag-and-drop\src\Hyperscope\checkShouldScroll.js end

  //module X:\alien-drag-and-drop\src\Hyperscope\getCloestScrollableElement.js start: 


  var getCloestScrollableElement = function () {

    function getCloestScrollableElement(element, direction) {
      var path = getNodePath(element),
          i = void 0;

      for (i = 0; i < path.length; i++) {
        if (isScrollable(path[i], direction)) {
          return path[i];
        }
      }
      return null;
    }

    return getCloestScrollableElement;
  }();

  //module X:\alien-drag-and-drop\src\Hyperscope\getCloestScrollableElement.js end

  var Hyperscope = function () {
    var Hyperscope = function () {
      function Hyperscope() {
        var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
        var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

        _classCallCheck(this, Hyperscope);

        this.step = step;
        this.interval = interval;
        this.delay = delay;
        this.timeoutHanler = null;
      }

      Hyperscope.prototype.request = function request(x, y, element) {
        var _this2 = this;

        setTimeout(function () {
          scroll(x, y, element, _this2.step, _this2.interval, function (handler) {
            return _this2.timeoutHanler = handler;
          });
        }, this.delay);
      };

      Hyperscope.prototype.cancel = function cancel() {
        clearTimeout(this.timeoutHanler);
      };

      return Hyperscope;
    }();

    function scroll(x, y, element, step, interval, setHandler) {
      //0. 判断是否需要滚动
      var _checkShouldScroll = checkShouldScroll(x, y, element),
          dx = _checkShouldScroll.x,
          dy = _checkShouldScroll.y,
          direction = dx < 0 ? "left" : dx > 0 ? "right" : dy < 0 ? "up" : dy > 0 ? "down" : "";

      if (dx || dy) {
        var scrollableElement = getCloestScrollableElement(element, direction);

        if (scrollableElement) {
          scrollableElement.scrollLeft += dx * step;
          scrollableElement.scrollTop += dy * step;

          setHandler(setTimeout(function () {
            scroll(x, y, element, step, interval, setHandler);
          }, interval));
        }
      }
    }

    return Hyperscope;
  }();

  //module X:\alien-drag-and-drop\src\Hyperscope\index.js end

  return function () {
    var AlienDragAndDrop = function (_Subscribable) {
      _inherits(AlienDragAndDrop, _Subscribable);

      function AlienDragAndDrop(mountPoint) {
        _classCallCheck(this, AlienDragAndDrop);

        var _this3 = _possibleConstructorReturn(this, _Subscribable.call(this));

        var gDragSource = null,
            gDragLayer = null,
            gDragStarted = false,
            gAutoScrollHandler = new Hyperscope(),
            gCanDropTarget = null,
            gTransferData = null,
            gStartPoint = {},
            gListeners = [],
            handleMouseDown = function handleMouseDown(e) {
          if (gDragStarted) {
            // when hold the left button and press the right button?
            handleMouseUp(e);
            return;
          }
          var target = e.target,
              _canDrag = false,
              ghostNode = null,
              ghostOffsetX = null,
              ghostOffsetY = null;

          _this3.broadcast("dragstart", {
            target: target,
            canDrag: function canDrag() {
              return _canDrag = true;
            },
            setDragGhost: function setDragGhost(ghost, x, y) {
              return ghostNode = ghost, ghostOffsetX = x, ghostOffsetY = y;
            },
            setTransferData: function setTransferData(data) {
              return gTransferData = data;
            }
          });

          if (_canDrag) {
            gListeners = [listen(document, "selectstart", handleSelectStart), listen(document, "mousemove", handleMouseMove), listen(document, "dragstart", handleDragStart), listen(document, "mouseup", handleMouseUp), listen(document, "mousewheel", handleMouseWheel)];
            gDragSource = target;

            var _getMousePositionRela = getMousePositionRelatedToItsTarget(e),
                ofx = _getMousePositionRela[0],
                ofy = _getMousePositionRela[1];

            ghostNode = ghostNode || target.cloneNode(true);
            setStyle(ghostNode, {
              width: target.offsetWidth + "px",
              height: target.offsetHeight + "px",
              display: "block"
            });
            ghostNode.id = "";
            ghostOffsetX = ghostOffsetX == null ? ofx : ghostOffsetX;
            ghostOffsetY = ghostOffsetY == null ? ofy : ghostOffsetY;

            gDragLayer = new DragLayer(ghostNode, ghostOffsetX, ghostOffsetY);
            gDragLayer.hide();
            gStartPoint = {
              x: e.clientX,
              y: e.clientY
            };
          }
        },
            handleMouseMove = function handleMouseMove(e) {
          e.preventDefault();
          var x = e.clientX,
              y = e.clientY,
              _canDrop = false,
              elementUnderMouse = null;


          gAutoScrollHandler.cancel();

          if (Math.max(Math.abs(x - gStartPoint.x), Math.abs(y - gStartPoint.y)) < 5) {
            // 手抖的不算!!!!!
            return;
          }

          gDragLayer.setPosition(x, y); // relative to current view

          // show the ghost  only after the mouse first moves 
          if (!gDragStarted) {
            gDragLayer.show();
            gDragStarted = true;
          }

          // fire alien-drag event on the source node
          _this3.broadcast("drag", {
            target: gDragSource,
            clientX: e.clientX,
            clientY: e.clientY
          });

          // fire alien-dragover event on the element under mouse 
          gDragLayer.unsetCursor();
          gCanDropTarget = null;
          gDragLayer.hide();
          elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
          gDragLayer.show();
          if (elementUnderMouse) {
            _this3.broadcast("dragover", {
              target: elementUnderMouse,
              canDrop: function canDrop() {
                return _canDrop = true;
              },
              dragSource: _this3.dragSource,
              transferData: _this3.transferData
            });

            if (_canDrop) {
              gCanDropTarget = elementUnderMouse;
              gDragLayer.setCursor();
            }
          }
          if (elementUnderMouse) {
            // auto scroll when the mouse is under the edge of scrollable element 
            gAutoScrollHandler.request(e.clientX, e.clientY, elementUnderMouse);
          }
        },
            handleMouseWheel = function handleMouseWheel(e) {
          gAutoScrollHandler.cancel();
        },
            handleMouseUp = function handleMouseUp(e) {
          tomato.consume(gListeners, function (fn) {
            return fn();
          });

          gAutoScrollHandler.cancel();
          gDragLayer.destroy();
          gDragLayer = null;

          // fire drop event 
          var elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY),
              offset = elementUnderMouse && getMousePositionRelatingToBoudingBox(e.clientX, e.clientY, elementUnderMouse) || {};

          if (elementUnderMouse === gCanDropTarget && gCanDropTarget !== null) {
            _this3.broadcast("drop", {
              target: gCanDropTarget,
              dragSource: gDragSource,
              transferData: gTransferData,
              offsetX: offset.left,
              offsetY: offset.top
            });
          }

          // fire dragend event 
          _this3.broadcast("dragend", {
            target: gDragSource
          });

          // clear source
          gDragSource = null;
          gDragStarted = false;
          gTransferData = null;
          gStartPoint = {};
        },
            handleDragStart = function handleDragStart(e) {
          e.preventDefault();
        },
            handleSelectStart = function handleSelectStart(e) {
          e.preventDefault();
        };

        _this3.listeners = [listen(mountPoint, "mousedown", handleMouseDown)];

        return _this3;
      }

      AlienDragAndDrop.prototype.destroy = function destroy() {
        tomato.consume(this.listeners, function (fn) {
          return fn();
        });
        this.unSubscribeAll();
      };

      return AlienDragAndDrop;
    }(Subscribable);

    return AlienDragAndDrop;
  }();
}(); 
        return AlienDragAndDrop
      } ());