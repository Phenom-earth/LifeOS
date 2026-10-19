/**
 * Server half of PULSE_BASEPATH (see Observability/src/lib/basepath.ts). Removes
 * the prefix from an incoming path so one build serves both a prefix-stripping
 * proxy and a direct local visit. Only an exact segment match is stripped.
 */
export function stripBasePath(pathname: string, basePath: string | undefined): string {
  const base = (basePath ?? "").replace(/\/+$/, "")
  if (!base) return pathname
  if (pathname === base) return "/"
  if (pathname.startsWith(base + "/")) return pathname.slice(base.length)
  return pathname
}
