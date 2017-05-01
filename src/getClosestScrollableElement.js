/*
* get cloest scrollable element, nested scrollable will not bubble
*/
function getClosestScrollableElement(element, includeHidden = false) {
  let elementStyle = getComputedStyle(element)
    , overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/
    , parentElement
    , parentStyle
    , isAbsoluted = elementStyle.position === "absolute"
    , isFixed = elementStyle.position === "fixed"
    , isTransformed = false
    , isOverflowed = false;


  for (parentElement = element; (parentElement = parentElement.parentElement);) {
    parentStyle = getComputedStyle(parentElement);

    isTransformed = (parentStyle.transform !== "none" && parentStyle.transform !== undefined)
      || (parentStyle.webkitTransform !== undefined && parentStyle.webkitTransform !== "none")
      || (parentStyle.MsTransform !== undefined && parentStyle.MsTransform !== "none");
    isOverflowed = overflowRegex.test(parentStyle.overflow + parentStyle.overflowY + parentStyle.overflowX);


    if (!(isAbsoluted && parentStyle.position === "static")) {
      if (isFixed && isTransformed) {
        return parentElement;
      }
      if (isOverflowed) {
        return parentElement;
      }
    }
  }

  return document.body;
}

export default getClosestScrollableElement;