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
    var DROP_NO = "data:image/png;base64,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ZgknZBfR/0AAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDktMTdUMTU6MjE6NTcrMDg6MDDT6TM7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTE1VDIzOjAwOjE1KzA4OjAw37eSFQAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1NTbsjFKcAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADU1OJjFL8YAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ0NDkyMTIxNdN6CWEAAAAQdEVYdFRodW1iOjpTaXplADE4S0LT4PL2AAAAX3RFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy8xMTk1Mi8xMTk1MjMxLnBuZ5BNDWAAAAAASUVORK5CYII=";

    return DROP_NO;
  }();

  //module X:\alien-drag-and-drop\src\DROP_NO.js end

  //module X:\alien-drag-and-drop\src\DROP_YES.js start: 


  var DROP_YES = function () {
    var DROP_YES = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABmCAYAAAADI5lUAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3woPFi02ylQcGQAAEQVJREFUeNrtnXeUVsUZxn/Lt4BYAogIQrKoQBQFxIJokEWJSYwnGmM5niMxibHE2AsJxJIQa4xYYgE0WFI0xmNNjHoQREGKgCACiiKKoBSlCYLAsrv547mze5m9u3tn7v3Kwvf8w2Hgmzt33mfeeectc0sooiDRv/zE8F+/DQwF/gy8DzB54oupPCeT7xctoi4s4XcD7gdOByqAV4Dqsi7dWfrJwsTPKhKgwGAJ/xhgJDAw+HsvYD0wk5RIUCRAASFC+P9AQjdoEbR/DMwDSEqCZvl+6SIES/hHIbW/b8R//QZwC9AvjecWNUABwBL+QGAMcHADP2kL9ED2wPokWqBIgDzDEv73gQeR1d8YyoA9gZeASl8SFAmQR1jCPwu4h2i1Xx8OAD4H3gI/e6BIgDzBEv6ZwH1AR8dumgP9gQ+ABeBOgqIRmAdYwv8ZEn47z+7aArcBh/r8uKgBcoyQ8JsB5wN3oL08Cdohu2Es8JWLFigSIIcICT8DXAr8CWidUvf7BX2NA7bFJUGRADlCSPjNgXOR8PdI+TG9gS+BqRDPHigSIAcICX8X4FrgBmC3LDyqGXAYMB9YCI2ToGgEZhkh4e+GBP87oFUWH7kXcDvQM85/LmqALCIkfOO+vQwozcGj2wP7I6NwU0NaoEiALKB/+YmUdelu/toSHdMuwV/jfgbcC3RFZIqDbsCuwHga8BQWCZAyrDN+W7TnX4L/yn8PuBwYjbaRgUBJzN8eAmwEpgNVUSQoEiBFWMLvhGL55+Mv/DeAXwR/AsxGruJeMX9fCnwHmEuQSWSToEiAlGAJvwswCjiF+KvVxkwk/PdCbVuBOcAAYJ+Y/bRAkcPXgNVAkQBpwxL+viice0KCLucAvwbeifi3tcDioP9dY/bXEUUPxwJfh7VAkQAJYQl/b+Bu4EcJupyBHEVvmYbJE19k6ScLw4blouDP44hvWB6AtoQJhOwBX/UUZzJSy1wtVESs/BHAaQm6nIBcxPNNgz2Hll9hJAomxcXXwBC0PVVDyhogxNAS8/e0slcLDZbw+wGPAscn6PJvSO1/bBqiFlBIE1QAs4BBxA8jN0c5hZ8RbC+peQJDE9ITuAk5I6Imq8nDep9y4BHgiARd/hcYBqwwDTG15xJgOLDO4VmtkTeyG6SkASxf903I49UJeB2pnR1GE1jC74OE3yNBl08DFwPLoXa/bwiWPfA+svTLib+g2wMdgFcTE8CakEuBqxCxegOd2YFIYL3roSh/75AEXT6GFkvNyo87PxYJZqNtaH+HZx8MlCTaAqwJ+QnyerUItQ0G/kIo26WpbgcROfuPAH09u9uGyHMZyukD3IxmK7GkHOUDuGAhMN1bA0Rksz6A1IqNJq8JQu9aApyN3LLdPburRMmfQ1GVD+At/FJk1d9JfMcQyAAcDEzwJkBI/fQA/kpgVNQDQ4KJwCbz+6ZAAovoZyONtrdndxVIWMPNPMTZ8+sZTwa4ENlcLokl76PTxnTTSZJJ2QNVsJTH+FmTI4El/JORk8dX+FtQFtCNBJrQ1U8SGk8L4GrcE0vmodjEZNPg7AiyJuVi4C50voyLx4ArgFWmoRAdRtZ7noFWvouaDWMTWql3IH++r8oHCfxaZGy3dBjD28AFyNOIGYOTBrAGcgJaEXHj0wa9kVE4HqnEgtMEloFl1H4Hz+62IJU/Ahl/SYTfFrgVhYddFt0M4DzkOCI8htgEiHB+PAB8y3NSeqPVNIUC2w5C79kKuB74I/5p22uBa5DLtgISCX8flBRyDm4OvClI+HNNQ3gMPsfAbsiQ6eo5KSDr9VykQfaq54Vzjoi07WG4aziDVWiruxdpgSTC3w8Z2mc6juF14Jc0EFuIlagQGoypQjncc1JsDA7+vIKQTZAPWGnbV6PV76Jmw1iB1PSTpiGB8A9GGiSOoR3GOHRKMJHDyDE0agRag7kOWZ6pRhGBf6IVt85nwpLAer9d0KofhpuBFcYy4CLgeZ93scZzJBK+64J7CR31PmlsDA1uAdZgjgteLG3hgzTBUELp0nnYDvZA+/01+At/DQq0pCH8I5C30VX4ryBrv1HhQwNGYMSNFWNwK112QQnyZXcmh4Zh6B3bIO/chfjn7y0AfgU8YxoSCP8U5F9xDTI9jdzLS+KOoV4ChDx9XZDw+3hOTFxkUFVL1p1FVtp2W1RI4Wpdh/EOsrRfMw2ewi9BeYD3oHl3wWNoG/3MZQyRL2x5+m5FGiAuPkSG4lrHFzAYjHU6SBPWSmuPJvs8kidvTjMNCfz6lwbv3j52B8rseQSt/C9cx1CHANZRaAhuR49q5B8whtSXrrMZYDBym7ayxpQmTNr2TxP0sQC5VmebhgQRvSG4VwtXo+PhVcj+cB7DdqyPiPA96TigZ9G5c13Q9/nodkufEuiKYEJuJjhHu75cA+/WERH1ZK/OhPeQzTDRdWzWWDLIYr8V2N1xDM+iOV7tOzfb2QChffFQ5MDY16GvyeiUsDzUNhvluB3j8XIZ4GikDqeTwCawJrwrUrOnOM9WLcYG7/pmzcv7Cb89Cg4Nwy2oU4EIPJRA7fsujBqLNzSwzsEEuVw5sgQ5TxZZ7VXAE8HL3Ym7V60FmujWeDqLrAk/CMXyB3jNlvAM2quXmQZP4X8TzbNrFvFWFFe4Edic4D2AQANYqcYjgB879PE1YuIL4QmxUpbeRmqqHDlbXLFdUklcLRCRvzcGlUr54mlESNfkzSjhjwFOcnz+ZrRV1GyLrvkENjLWEeRq5MJ0OQ6NRseoKntCLBLMQoZKEhKUIhI0ei+eNeF9gYdI5sIeh8cxK2IsnVB00VX41Wieb8QjpFwfMiEBnY4MtrjlRgDvosrXNfUNKGUSHI7IOYWABFFEiLhq/WHkY/DF/5DBF8u71sBYuuJnfFahYo4b8EwmqQ+GAL3QSu7s8NsV6Ow5o7EBRZBgJSpzdiVBo4ZhhPt6FP7JmxXBvPwG+NQ0egr/e8FYXIM665HgbwE2uDw/DpohoY9AtWNxsQVluLwQ9wehQVejKpqh+PkJjGF4N5azyJrwk4Ln+Ap/KzqGDiF0svEU/hmo8se1eGQdtf6Br1yeHxeZsi7d78XdEn0GhUsrXQaVBZugI9qbt4b6BW1nI5Gx5QPj0LqewNJ2MbYiMqfux027ghbHlWj7wowhbWTKunTviAIxLufQKiTApeB2Nk+ZBOYipMkEZEQnmPpS1OOgEpHnWnS7RpKgzhn4EXEzMvZGmoZshcczZV26z0Qq7rvEF0IHJLQFwEeQmARrgWPZvqgkDpqhOIUxDAchB5bvyt+Gklyvx0PlWieqc4O+XO//3QT8AW1xThrWB8YInIvY3o/4V5i1Qw6VD4l5J10YEX6CiuD5rrH4TPC7A5Gl7lIeFcZqtOpuI5SzHxch4bdG9s1wFGl0wTKUTzAKjwRSH4SPgdODAQwk/lGwDbJuVxKUG3uSoBqtYF9nUSnaDlwn3OAr5GkcSbLM3VbU3gXoSuTFKJHj30T4VLKFjLUS30GODhcS7IZU7wakzp0+ZpSyTeCDDUjljyG4NMHF0g+NvTU6ql2Me17BKpRMUvPgXKXEZaCOEOYiEpQTnwS7INJUIk3i9AWLPJJgHVLXo3BcdRFXw9yFInOu1VZfoHDuU6Yhl4UyNYONIMEaFBKOmyJlatS3EpQeJSTBRmSYZuseo1Vo4h/GY+WHUIaOeWfinlSyErmX/2Uacl0ltd3kWkKYj/bGvsQ3DDMok7UU3XS1xeWamIjtaBtynvgmadaHJciF/YRp8BR+D1Tm/UOPMcxDntTnXMeQJuqsrpAQKtG1467bQUt0pOuENIFTHD/0/G3AJJJFESMfgfZp58zdiKzdh9AnW1zxLio5c04mSRuR6jViO1iGGwlKUPh1f0SCDeBFAkjXJvgIGVsvmQZP4R+LUrF8bgdZhAg4xXUM2UC9+2s9JDgWt6vOD6L2lso0SDAQ/+3A5O+9aho8hX8S8jT6XBDxATrqTXAdQ7bQoIEVQYJtKMLmYph1R37wSQSu1QQkyCASuB6z5qLM35q6eE/hn4aigz6exvmIgJNcx5BNNCrICCFsRvufizruiaKNcwhy2DxJMBNZ7IcT3208H3kIp5oGD+GXAqeitDbXoA4oZfxCPFPHs4lYK9kyDCej2LiLTQAiwHEom3YxeJGgAhlOXxDPJngDFXxsd+1qHISE3xL4LQqZu+TrG0wHfk7o3t9CET44qPKII5qrYQiawIEoduAUP7DcxnEMw/Fov11gGjyEvzuqF9yubtEBU5Har7nxu5CED45OlgibYCWKBbhE8dqgCN4sghq2BDbBl8gNbZdxv4hU7kemwUP430A5eL4fe5iIhP+u6xhyCWcvmyWEecGf/XGbpD1RJNE5nGw9fw5amUdTaxiORQbfUvOf4ky85dffFUXzfD/zYrTPBy5jyAe83KyWOn4TpYi5Gobt0LFyBbq6rMqDBFXUnqcPQRb2FTiu/IiU7VtQ2pmP8F9GvgZn7ZMPePvZUzIMWyM3ajNkIccOIlkewzcQER4kMDDBS/i9UGzgVPyE/zwq84pdnp1vJAq0pGQYNkfFGuuRxRw7nGxpgsUEfgbwEv5RyLXbz3M6nkJbhnPFUD6Rym0f1kRehM7Lrh67jSjT+E5SLHyIOeZewN/xvwPhcZTA6XXvbz6RSqg1wjCrQqvaxTBsgQzDFmg7qMjWByci7uEZg+fn11G695UU+MWX9SG1WLtlE0xDe/ORuB0RS5FF3wYVnKR+S4iVuPkD5NeP+xk2G/9BId0mKXxIOdnCIsEUdBQbgJtN0AztwwegoIlT/KAhWK7dy1HmbZlHVyZ1vGblJy3SzBdSz7axjohzUMr5INxDuQeiCxKnEFyrnoQE1sq/AGX/+lxcsQ0Vd15HqLKpKQofspRuFeExBGkCV4/aQeiixKkEdw4lvCDC3MNzM25XrBuY2vzheF73XmjI2ncDLRJMx88wBF1Ne1jQh1Mk0fLumUsgh+N+W4nBXahoo6ZcrKkjqx+OTMkwBO3T/ZD/fxk0TgLL0m+HgjpD8EsoqUA+gt/jUS5WyMj6l0NTMgxBOYYDUHBlMdRPAkv4HZCH8BzP992IBH8DWarQzSdy8unYCMNwDYoiul7GbMLJiwgCLTYJIvz696EPWvlgA7o69h5y4JzKB3L27eCIKGI17lFEkI9gEMpWnge1JIi4GeQB/L/juwElgowmh6VauUZOPx5t+e6n4W8Y7o5IsJrgkkbrfoA+KGt3oOdQzeUQd7MDCx/y8PXwCMOwEnn/XLeDVuj+wY8JJV2gQpYkn3LdhI6Jt5OjCt18Ii+fj48oPlmOX95/K1Q+1hzl/R2PPHQ9HfsxWI7yCUbj8YmXpoi8EADqbAezkIfOx1lkNEEf5OHz/ZTNp6hg40l2cLUfRt4IAJHOokr8DMMMih34ft9nLRL+s6ZhZxA+5JkAUK9N4EMCX6xF18A9bhp2FuFDARAAUjUMXfE5KhF/1DTsTMKHAiEARHoM16BCkmyRYB6yGZ4zDTub8KGACAB1DMPZ+DuLGsNC9JWPgqrTywcKigAQ6SxK2yZYgkLCr5mGnVX4UIAEgKwahuZ+gJdNw84sfChQAkBWSGBq88ebhp1d+FDABIBUSfA6qhUsiFs5CgkFTQBIhQRvo2tb55iGovBrUfAEgEQkeAtV6BZkbX4hoEkQALxIMA1VCRdXfgNoMgSAyCgiKIBkF3JOQit/vmkoCj8aTYoAUMdPMCN4h77UaoIX0FGvJk+sKPz60eQIAHXuDJpEbexgHIrqLTb/tyj8hpFKdXC+YF3TfhY67n0IRcHHxf8BxfB9iO3/+LUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDktMTdUMTU6MjE6NTcrMDg6MDDT6TM7AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE1LTEwLTE1VDIyOjQ1OjU0KzA4OjAwduz2GAAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAGHRFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA1MzBTtVAvAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OldpZHRoADY2OLGuwlwAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTQ0NDkyMDM1NHlv8aEAAAASdEVYdFRodW1iOjpTaXplADE4LjRLQodXsbUAAABfdEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL3d3d3Jvb3Qvc2l0ZS93d3cuZWFzeWljb24ubmV0L2Nkbi1pbWcuZWFzeWljb24uY24vc3JjLzExOTUxLzExOTUxOTAucG5ngJRx5QAAAABJRU5ErkJggg==";

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

        var CursorOffsetX = 13,
            CursorOffsetY = 18,
            CursorWidth = 20;

        var wrapper = document.createElement("div"),
            cursorDomNode = document.createElement("img"),
            clonedNode = node.cloneNode(true);

        wrapper.style.cssText = "position:fixed;z-index:9999;width:" + node.offsetWidth + "px;height:" + node.offsetHeight + "px;display:none;";

        setStyle(clonedNode, {
          position: "absolute",
          top: 0,
          left: 0
        });

        cursorDomNode.width = CursorWidth;
        cursorDomNode.style.cssText = "position:absolute;top:" + (CursorOffsetY + offsetY) + "px;left:" + (CursorOffsetX + offsetX) + "px;opacity:.8;";
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
        var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
        var delay = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

        _classCallCheck(this, Hyperscope);

        this.step = step;
        this.interval = interval;
        this.delay = delay;
        this.timeoutHanler = null;
      }

      Hyperscope.prototype.request = function request(x, y, element) {
        var _this2 = this;

        this.cancel();
        this.timeoutHanler = setTimeout(function () {
          scroll(x, y, element, _this2.step, _this2.interval, function (handler) {
            _this2.timeoutHanler = handler;
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
            gHyperscope = new Hyperscope(),
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
            gListeners = [listen(document, "selectstart", handleSelectStart), listen(document, "mousemove", handleMouseMove), listen(document, "dragstart", handleDragStart), listen(document, "mouseup", handleMouseUp), listen(document, "mousewheel", handleMouseWheel), listen(document, "DOMMouseScroll", handleMouseWheel)];
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


          gHyperscope.cancel();

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
            gHyperscope.request(e.clientX, e.clientY, elementUnderMouse);
          }
        },
            handleMouseWheel = function handleMouseWheel(e) {
          gHyperscope.cancel();
        },
            handleMouseUp = function handleMouseUp(e) {
          tomato.consume(gListeners, function (fn) {
            return fn();
          });

          gHyperscope.cancel();
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