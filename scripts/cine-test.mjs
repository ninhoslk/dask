// Drives a headless Chrome over CDP: scrolls the cinematic opening to fixed
// progress points (forwards, then back) and screenshots each one.
import { spawn } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const [, , url, outDir, mode = "desktop", reduced = ""] = process.argv
mkdirSync(outDir, { recursive: true })
const port = 9300 + Math.floor(Math.random() * 500)
const chrome = spawn(process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", `--remote-debugging-port=${port}`, "--no-first-run",
  `--user-data-dir=${join(outDir, ".profile")}`, "--hide-scrollbars", "about:blank",
])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let ws
for (let i = 0; i < 40; i++) {
  try {
    const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
    const page = list.find((t) => t.type === "page")
    if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break }
  } catch {}
  await sleep(250)
}
await new Promise((r) => ws.addEventListener("open", r))
let id = 0
const pending = new Map()
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id) }
})
const send = (method, params = {}) =>
  new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const evalJs = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value

const phone = mode === "phone"
await send("Emulation.setDeviceMetricsOverride", phone
  ? { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }
  : { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
// always set it: otherwise Chrome inherits the OS setting (Windows with
// animation effects off reports "reduce" and the opening stays static)
await send("Emulation.setEmulatedMedia", {
  features: [{ name: "prefers-reduced-motion", value: reduced ? "reduce" : "no-preference" }],
})
await send("Page.enable")
await send("Runtime.enable")
const errors = []
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data)
  if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map((a) => a.value || a.description).join(" "))
})
await send("Page.navigate", { url })
await sleep(5000)

const points = reduced ? [0] : [0, 0.15, 0.3, 0.45, 0.6, 0.8, 1, 0.45, 0]
const report = []
for (const [n, p] of points.entries()) {
  const info = await evalJs(`(async () => {
    document.documentElement.style.scrollBehavior = "auto"
    const s = document.querySelector(".cine")
    const run = s.offsetHeight - innerHeight
    scrollTo(0, s.offsetTop + run * ${p})
    await new Promise(r => setTimeout(r, 900))
    const blocos = [...document.querySelectorAll(".cine-bloco")].map(b => (+getComputedStyle(b).opacity).toFixed(2) + (b.inert ? "i" : ""))
    const imgs = performance.getEntriesByType("resource").filter(e => e.name.includes("/hero/"))
    return { blocos: blocos.join(" "), altura: s.style.height, frames: imgs.length, kb: Math.round(imgs.reduce((a, e) => a + (e.transferSize || 0), 0) / 1024) }
  })()`)
  const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 })
  const file = join(outDir, `${mode}${reduced ? "-reduzido" : ""}-${String(n).padStart(2, "0")}-p${p}.jpg`)
  writeFileSync(file, Buffer.from(shot.result.data, "base64"))
  report.push({ p, ...info, file })
}
// after the sequence: the page must scroll on normally
const depois = await evalJs(`(async () => {
  const s = document.querySelector(".cine"); scrollTo(0, s.offsetTop + s.offsetHeight + 40)
  await new Promise(r => setTimeout(r, 600))
  return { palcoTop: Math.round(document.querySelector(".cine-palco").getBoundingClientRect().top), apresentacaoTop: Math.round(document.getElementById("apresentacao-title").getBoundingClientRect().top), overflowX: document.documentElement.scrollWidth > innerWidth }
})()`)
console.log(JSON.stringify({ mode, reduced: !!reduced, report, depois, errors }, null, 1))
ws.close()
chrome.kill()
