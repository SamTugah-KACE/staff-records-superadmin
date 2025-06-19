export function blockBackButton() {
  // push a dummy state
  window.history.pushState(null, '', window.location.href);
  // whenever popstate fires (Back button), push forward again
  window.onpopstate = () => {
    window.history.go(1);
  };
}
