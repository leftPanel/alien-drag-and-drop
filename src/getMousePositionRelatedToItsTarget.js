import getMousePositionRelatingToBoudingBox from './getMousePositionRelatingToBoudingBox'

function getMousePositionRelatedToItsTarget(e) {
  return getMousePositionRelatingToBoudingBox(e.clientX, e.clientY, e.target || e.srcElement)
}

export default getMousePositionRelatedToItsTarget;