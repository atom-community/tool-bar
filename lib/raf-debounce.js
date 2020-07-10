export function rafDebounce (fn) {
  let args, context, requestID;

  function later () {
    fn.apply(context, args);
    args = context = requestID = null;
  }

  function debounced () {
    if (fn == null) {
      throw new Error('raf debounced function is already disposed.');
    }
    args = arguments;
    context = this;
    window.cancelAnimationFrame(requestID);
    requestID = window.requestAnimationFrame(later);
  }

  debounced.dispose = () => {
    window.cancelAnimationFrame(requestID);
    fn = args = context = requestID = null;
  };

  return debounced;
}
