import listen from '../listen'
import Hyperscope from '../Hyperscope'

function hyperscopeTest () {
  let h = new Hyperscope();
  listen(document.body, "mousemove", function(e) {
    h.cancel();
    h.request(e.clientX, e.clientY, document.elementFromPoint(e.clientX, e.clientY));
  });
}

export default hyperscopeTest;