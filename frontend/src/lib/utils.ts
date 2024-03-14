
export function getHashParams() {
  var hashParams: any = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g, q = window.location.hash.substring(1);
  while (true) {
    e = r.exec(q);
    if (!e) break;
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
