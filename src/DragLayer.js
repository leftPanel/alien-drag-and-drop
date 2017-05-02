import DROP_NO from './DROP_NO';
import DROP_YES from './DROP_YES';
import listen from './listen';
import setStyle from './setStyle';

class DragLayer {
  constructor(node, offsetX, offsetY) {
    const CursorOffsetX = 13
      , CursorOffsetY = 18
      , CursorWidth = 20

    let wrapper = document.createElement("div")
      , cursorDomNode = document.createElement("img")
      , clonedNode = node.cloneNode(true);


    wrapper.style.cssText = `position:fixed;z-index:9999;width:${node.offsetWidth}px;height:${node.offsetHeight}px;display:none;`

    setStyle(clonedNode, {
      position: "absolute",
      top: 0,
      left: 0
    });

    cursorDomNode.width = CursorWidth;
    cursorDomNode.style.cssText = `position:absolute;top:${CursorOffsetY + offsetY}px;left:${CursorOffsetX + offsetX}px;opacity:.8;`
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

  setPosition(x, y) {
    this.wrapper.style.top = y - this.offsetY + "px";
    this.wrapper.style.left = x - this.offsetX + "px";
  }

  hide() {
    this.wrapper.style.display = "none";
  }

  show() {
    this.wrapper.style.display = "block";
  }

  destroy() {
    this.listener();
    this.wrapper.parentNode.removeChild(this.wrapper);
  }

  setCursor() {
    this.cursorDomNode.src = DROP_YES;
  }

  unsetCursor() {
    this.cursorDomNode.src = DROP_NO;
  }
}

export default DragLayer;