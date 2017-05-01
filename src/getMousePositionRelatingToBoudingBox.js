function getMousePositionRelatingToBoudingBox(x, y, el) {
  var target = el
    , style = target.currentStyle || window.getComputedStyle(target, null)
    , borderLeftWidth = parseInt(style['borderLeftWidth'], 10)
    , borderTopWidth = parseInt(style['borderTopWidth'], 10)
    , rect = target.getBoundingClientRect()
    , offsetX = x - borderLeftWidth - rect.left
    , offsetY = y - borderTopWidth - rect.top;

  return [offsetX, offsetY];
}

export default getMousePositionRelatingToBoudingBox;