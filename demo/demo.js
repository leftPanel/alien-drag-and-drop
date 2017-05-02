if (window.AlienDragAndDrop) {
  window.alienDragAndDrop = new AlienDragAndDrop(document.body);

  alienDragAndDrop.subscribe("dragstart", function (payload) {
    var target = payload.target
      , canDrag = payload.canDrag
      , setDragGhost = payload.setDragGhost
      , setTransferData = payload.setTransferData;
    if (target === a) {
      canDrag();
      setTransferData("data?");
      setDragGhost(null)
    }
  });

  alienDragAndDrop.subscribe("dragover", function (payload) {
    var target = payload.target
      , canDrop = payload.canDrop


    if (target === window.b) {
      canDrop();
    }
  });


  alienDragAndDrop.subscribe("drop", function (payload) {
    var target = payload.target
      , dragSource = payload.dragSource
      , transferData = payload.transferData
      , offsetX = payload.offsetX
      , offsetY = payload.offsetY;

    console.log(transferData)

  });
}

function getGhost() {
  var div = document.createElement("div");

  div.innerHTML = "THIS IS A GHOST."

  return div;
}