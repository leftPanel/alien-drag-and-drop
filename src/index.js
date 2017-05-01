import listen from './listen';
import tomato from './tomato';
import Subscribable from './Subscribable'
import getMousePositionRelatedToItsTarget from './getMousePositionRelatedToItsTarget'
import DragLayer from './DragLayer';
import setStyle from './setStyle';
import getMousePositionRelatingToBoudingBox from './getMousePositionRelatingToBoudingBox'

class AlienDragAndDrop extends Subscribable {
  constructor(mountPoint) {
    super();

    let gDragSource = null
      , gDragLayer = null
      , gDragStarted = false
      , gAutoScrollHandler = null
      , gCanDropTarget = null
      , gTransferData = null
      , gStartPoint = {}
      , gListeners = []

      , handleMouseDown = e => {
        if (gDragStarted) {
          // when hold the left button and press the right button?
          handleMouseUp(e);
          return;
        }
        let target = e.target
          , canDrag = false
          , ghostNode = null
          , ghostOffsetX = null
          , ghostOffsetY = null;

        this.broadcast("dragstart", {
          target,
          canDrag: () => canDrag = true,
          setDragGhost: (ghost, x, y) => (ghostNode = ghost, ghostOffsetX = x, ghostOffsetY = y),
          setTransferData: data => gTransferData = data
        });

        if (canDrag) {
          gListeners = [
            listen(document, "selectstart", handleSelectStart),
            listen(document, "mousemove", handleMouseMove),
            listen(document, "dragstart", handleDragStart),
            listen(document, "mouseup", handleMouseUp),
            listen(document, "mousewheel", handleMouseWheel),
          ]
          gDragSource = target;

          let [ofx, ofy] = getMousePositionRelatedToItsTarget(e);

          ghostNode = ghostNode || target.cloneNode(true);
          setStyle(ghostNode, {
            width: `${target.offsetWidth}px`,
            height: `${target.offsetHeight}px`,
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
          }

        }
      }
      , handleMouseMove = e => {
        e.preventDefault();
        let { clientX: x, clientY: y } = e
          , canDrop = false
          , elementUnderMouse = null;

        clearTimeout(gAutoScrollHandler);

        if (Math.max(
          Math.abs(x - gStartPoint.x),
          Math.abs(y - gStartPoint.y)
        ) < 5) {
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
        this.broadcast("drag", {
          target: gDragSource,
          clientX: e.clientX,
          clientY: e.clientY
        });

        // fire alien-dragover event on the element under mouse 
        gDragLayer.unsetCursor();
        gCanDropTarget = null;
        gDragLayer.hide();
        elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY)
        gDragLayer.show();
        if (elementUnderMouse) {
          this.broadcast("dragover", {
            target: elementUnderMouse,
            canDrop: () => canDrop = true,
            dragSource: this.dragSource,
            transferData: this.transferData
          })

          if (canDrop) {
            gCanDropTarget = elementUnderMouse;
            gDragLayer.setCursor()
          }
        }
        // if (elementUnderMouse) {
        //   // auto scroll when the mouse is under the edge of scrollable element 
        //   let scrollable = getClosestScrollableElement(elementUnderMouse);
        //   // 从左边拖进来的时候经过左边缘不要滚动，通过延迟来过滤掉这种情况
        //   this.autoScrollHandler = setTimeout(() => {
        //     this.checkScroll(scrollable, this.getPointRelatingToVisibleBoudingBox(x, y, scrollable))
        //   }, 100)
        // }
      }
      , handleMouseWheel = function (e) {
        clearTimeout(gAutoScrollHandler);
      }
      , handleMouseUp = e => {
        tomato.consume(gListeners, fn => fn());

        clearTimeout(gAutoScrollHandler);
        gDragLayer.destroy();
        gDragLayer = null;

        // fire drop event 
        let elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY)
          , offset = elementUnderMouse && getMousePositionRelatingToBoudingBox(e.clientX, e.clientY, elementUnderMouse) || {};

        if (elementUnderMouse === gCanDropTarget && gCanDropTarget !== null) {
          this.broadcast("drop", {
            target: gCanDropTarget,
            dragSource: gDragSource,
            transferData: gTransferData,
            offsetX: offset.left,
            offsetY: offset.top
          });
        }

        // fire dragend event 
        this.broadcast("dragend", {
          target: gDragSource
        })

        // clear source
        gDragSource = null;
        gDragStarted = false;
        gTransferData = null;
        gStartPoint = {};
      }
      , handleDragStart = function (e) {
        e.preventDefault();
      }
      , handleSelectStart = function (e) {
        e.preventDefault();
      };

    this.listeners = [listen(mountPoint, "mousedown", handleMouseDown)];

  }


  destroy() {
    tomato.consume(this.listeners, fn => fn());
    this.unSubscribeAll();
  }


  checkScroll(element, { left, right, top, bottom, vsbw, hsbw }) {
    const gate = 20
      , F = gate
      , timeout = 10
      , f = .3;
    let dx = 0
      , dy = 0
      , rb = bottom - hsbw
      , rr = right - vsbw;
    if (rb < gate) {
      dy += (F - rb) * f;
    } else if (top < gate) {
      dy -= (F - top) * f;
    }
    if (rr < gate) {
      dx += (F - rr) * f;
    } else if (left < gate) {
      dx -= (F - left) * f;
    }
    if (dx || dy) {
      element.scrollLeft += dx;
      element.scrollTop += dy;
      // console.log("yes , im scrolling")

      clearTimeout(this.autoScrollHandler);
      this.autoScrollHandler = setTimeout(() => {
        this.checkScroll(element, {
          left: left,
          right: right,
          top: top,
          bottom: bottom,
          vsbw,
          hsbw
        })
      }, timeout)
    }
  }
}

export default AlienDragAndDrop;
