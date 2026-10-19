/**
 * Path-prefix support for Pulse behind a reverse proxy (e.g. code-server's
 * /proxy/31337). Next's basePath covers assets and <Link>; this covers the
 * rest: fetch(), EventSource and WebSocket calls written as "/api/...".
 */
export const PULSE_BASEPATH = process.env.NEXT_PUBLIC_PULSE_BASEPATH ?? ""

/** Prefix a root-relative URL once; leave absolute and already-prefixed URLs alone. */
export function withBasePath(url: string, base: string = PULSE_BASEPATH): string {
  if (!base || !url.startsWith("/") || url.startsWith("//")) return url
  if (url === base || url.startsWith(base + "/")) return url
  return base + url
}

/** Inline, pre-hydration script that applies withBasePath to the browser's network APIs. */
export function basePathShimScript(base: string = PULSE_BASEPATH): string {
  if (!base) return ""
  const b = JSON.stringify(base)
  return `(function(){var B=${b};function p(u){return typeof u==="string"&&u.charAt(0)==="/"&&u.charAt(1)!=="/"&&u!==B&&u.indexOf(B+"/")!==0?B+u:u}
var f=window.fetch;window.fetch=function(i,o){return f.call(this,typeof i==="string"?p(i):i,o)};
var E=window.EventSource;if(E){window.EventSource=function(u,c){return new E(p(u),c)};window.EventSource.prototype=E.prototype}
var W=window.WebSocket;if(W){window.WebSocket=function(u,pr){if(typeof u==="string"&&u.charAt(0)==="/"){u=(location.protocol==="https:"?"wss://":"ws://")+location.host+p(u)}return pr===undefined?new W(u):new W(u,pr)};window.WebSocket.prototype=W.prototype;window.WebSocket.OPEN=W.OPEN;window.WebSocket.CLOSED=W.CLOSED;window.WebSocket.CONNECTING=W.CONNECTING;window.WebSocket.CLOSING=W.CLOSING}})();`
}
