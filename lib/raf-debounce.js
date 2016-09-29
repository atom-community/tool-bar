'use babel';

export default function rafDebounce (fn) {
  let args;
  let context;
  let requestID;

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
    if (requestID) {
      window.cancelAnimationFrame(requestID);
    }
    requestID = window.requestAnimationFrame(later);
  }

  debounced.dispose = () => {
    if (fn != null) {
      if (requestID) {
        window.cancelAnimationFrame(requestID);
      }
      args = context = requestID = fn = null;
    }
  };

  return debounced;
}
