import { describe, expect, test } from "bun:test"

import { basePathShimScript, withBasePath } from "./basepath"

describe("withBasePath", () => {
  const B = "/proxy/31337"
  test("prefixes root-relative URLs", () => {
    expect(withBasePath("/api/pulse/health", B)).toBe("/proxy/31337/api/pulse/health")
  })
  test("leaves absolute, protocol-relative and already-prefixed URLs alone", () => {
    expect(withBasePath("https://x.test/a", B)).toBe("https://x.test/a")
    expect(withBasePath("//cdn.test/a", B)).toBe("//cdn.test/a")
    expect(withBasePath("/proxy/31337/api/x", B)).toBe("/proxy/31337/api/x")
    expect(withBasePath("relative/path", B)).toBe("relative/path")
  })
  test("is a no-op without a base path", () => {
    expect(withBasePath("/api/x", "")).toBe("/api/x")
    expect(basePathShimScript("")).toBe("")
  })
  test("the inline shim prefixes fetch URLs the same way", () => {
    const seen: string[] = []
    const win: any = { fetch: (u: string) => seen.push(u), location: { protocol: "https:", host: "h" } }
    new Function("window", "location", basePathShimScript(B))(win, win.location)
    win.fetch("/api/a")
    win.fetch("/proxy/31337/api/b")
    win.fetch("https://x.test/c")
    expect(seen).toEqual(["/proxy/31337/api/a", "/proxy/31337/api/b", "https://x.test/c"])
  })
})
