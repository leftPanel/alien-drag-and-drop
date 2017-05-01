  import DROP_NO from './DROP_NO';
  import DROP_YES from './DROP_YES';
  import listen from './listen';
  import setStyle from './setStyle';
  
  class DragLayer {
    constructor(node, offsetX, offsetY) {
      const CursorOffset = 20;

      let wrapper = document.createElement("div")
        , cursorDomNode = document.createElement("img")
        , clonedNode = node.cloneNode(true);

      // wrapper.style.position = "fixed";
      // wrapper.style.zIndex = 9999;
      // wrapper.style.width = node.offsetWidth + "px";
      // wrapper.style.height = node.offsetHeight + "px";
      wrapper.style.cssText = `position:fixed;z-index:9999;width:${node.offsetWidth}px;height:${node.offsetHeight}px;display:none;`

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
      cursorDomNode.style.cssText = `position:absolute;top:${-CursorOffset / 3}px;left:${-CursorOffset / 3}px;opacity:.8;`
      cursorDomNode.src = DROP_NO

      wrapper.appendChild(clonedNode);
      wrapper.appendChild(cursorDomNode);

      document.body.appendChild(wrapper);

      this.wrapper = wrapper;
      this.cursorDomNode = cursorDomNode;
      this.offsetX = offsetX;
      this.offsetY = offsetY;

      this.listener = listen(this.wrapper, "selectstart dragstart mousemove", function(e) {
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