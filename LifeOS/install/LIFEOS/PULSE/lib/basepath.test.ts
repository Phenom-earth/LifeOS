import { describe, expect, test } from "bun:test"

import { stripBasePath } from "./basepath.ts"

describe("stripBasePath", () => {
  test("strips the prefix from a direct local request", () => {
    expect(stripBasePath("/proxy/31337/_next/a.js", "/proxy/31337")).toBe("/_next/a.js")
    expect(stripBasePath("/proxy/31337", "/proxy/31337")).toBe("/")
  })
  test("leaves already-stripped and unrelated paths alone", () => {
    expect(stripBasePath("/_next/a.js", "/proxy/31337")).toBe("/_next/a.js")
    expect(stripBasePath("/proxy/313370/x", "/proxy/31337")).toBe("/proxy/313370/x")
  })
  test("is a no-op without a base path", () => {
    expect(stripBasePath("/api/x", undefined)).toBe("/api/x")
    expect(stripBasePath("/api/x", "")).toBe("/api/x")
  })
})
