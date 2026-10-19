import { afterEach, describe, expect, test } from "bun:test"

import { isLoopbackHostHeader } from "./host-guard.ts"

const PORT = 31337
afterEach(() => {
  delete process.env.LIFEOS_PULSE_EXTRA_HOSTS
})

describe("isLoopbackHostHeader", () => {
  test("allows loopback and header-less requests", () => {
    expect(isLoopbackHostHeader(null, PORT)).toBe(true)
    expect(isLoopbackHostHeader("127.0.0.1:31337", PORT)).toBe(true)
    expect(isLoopbackHostHeader("localhost", PORT)).toBe(true)
  })

  test("refuses rebinding shapes and foreign ports", () => {
    expect(isLoopbackHostHeader("evil.test", PORT)).toBe(false)
    expect(isLoopbackHostHeader("127.0.0.1.evil.com", PORT)).toBe(false)
    expect(isLoopbackHostHeader("127.0.0.1:8443", PORT)).toBe(false)
  })

  test("a bare extra host must still match Pulse's own port", () => {
    process.env.LIFEOS_PULSE_EXTRA_HOSTS = "pai"
    expect(isLoopbackHostHeader("pai:31337", PORT)).toBe(true)
    expect(isLoopbackHostHeader("pai:8443", PORT)).toBe(false)
  })

  // A box router in front of code-server rewrites Host to the box's internal
  // name and code-server's port (dev-matt:8443), never the public hostname.
  test("an extra host given as name:port allows exactly that pair", () => {
    process.env.LIFEOS_PULSE_EXTRA_HOSTS = "dev-matt:8443"
    expect(isLoopbackHostHeader("dev-matt:8443", PORT)).toBe(true)
    expect(isLoopbackHostHeader("DEV-MATT:8443", PORT)).toBe(true)
    expect(isLoopbackHostHeader("dev-matt:9999", PORT)).toBe(false)
    expect(isLoopbackHostHeader("dev-matt", PORT)).toBe(false)
    expect(isLoopbackHostHeader("evil.test:8443", PORT)).toBe(false)
  })
})
