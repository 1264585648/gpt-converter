import { readdir, readFile, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const ASSET_ROOT = new URL('../dist/_astro/', import.meta.url)

const budgets = {
  largestJsGzip: 220 * 1024,
  totalJsGzip: 420 * 1024,
  largestCssGzip: 90 * 1024,
  totalCssGzip: 160 * 1024,
}

async function collectFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const child = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directoryUrl)
    if (entry.isDirectory()) files.push(...await collectFiles(child))
    else files.push(child)
  }

  return files
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KiB`
}

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

const files = await collectFiles(ASSET_ROOT)
const measured = []

for (const file of files) {
  if (!file.pathname.endsWith('.js') && !file.pathname.endsWith('.css')) continue

  const raw = await readFile(file)
  measured.push({
    name: file.pathname.split('/').at(-1),
    type: file.pathname.endsWith('.js') ? 'js' : 'css',
    rawBytes: (await stat(file)).size,
    gzipBytes: gzipSync(raw, { level: 9 }).length,
  })
}

expect(measured.length > 0, 'No Astro JS/CSS assets found in dist/_astro')

const js = measured.filter((asset) => asset.type === 'js')
const css = measured.filter((asset) => asset.type === 'css')
const largestJs = js.toSorted((a, b) => b.gzipBytes - a.gzipBytes)[0]
const largestCss = css.toSorted((a, b) => b.gzipBytes - a.gzipBytes)[0]
const totalJsGzip = js.reduce((sum, asset) => sum + asset.gzipBytes, 0)
const totalCssGzip = css.reduce((sum, asset) => sum + asset.gzipBytes, 0)

if (largestJs) {
  expect(
    largestJs.gzipBytes <= budgets.largestJsGzip,
    `Largest JS chunk ${largestJs.name} is ${formatBytes(largestJs.gzipBytes)} gzip; budget is ${formatBytes(budgets.largestJsGzip)}`,
  )
}

expect(
  totalJsGzip <= budgets.totalJsGzip,
  `Total generated JS is ${formatBytes(totalJsGzip)} gzip; budget is ${formatBytes(budgets.totalJsGzip)}`,
)

if (largestCss) {
  expect(
    largestCss.gzipBytes <= budgets.largestCssGzip,
    `Largest CSS asset ${largestCss.name} is ${formatBytes(largestCss.gzipBytes)} gzip; budget is ${formatBytes(budgets.largestCssGzip)}`,
  )
}

expect(
  totalCssGzip <= budgets.totalCssGzip,
  `Total generated CSS is ${formatBytes(totalCssGzip)} gzip; budget is ${formatBytes(budgets.totalCssGzip)}`,
)

console.table(
  measured
    .toSorted((a, b) => b.gzipBytes - a.gzipBytes)
    .map(({ name, type, rawBytes, gzipBytes }) => ({
      asset: name,
      type,
      raw: formatBytes(rawBytes),
      gzip: formatBytes(gzipBytes),
    })),
)

console.log(`Largest JS gzip: ${largestJs ? formatBytes(largestJs.gzipBytes) : 'n/a'} / ${formatBytes(budgets.largestJsGzip)}`)
console.log(`Total JS gzip: ${formatBytes(totalJsGzip)} / ${formatBytes(budgets.totalJsGzip)}`)
console.log(`Largest CSS gzip: ${largestCss ? formatBytes(largestCss.gzipBytes) : 'n/a'} / ${formatBytes(budgets.largestCssGzip)}`)
console.log(`Total CSS gzip: ${formatBytes(totalCssGzip)} / ${formatBytes(budgets.totalCssGzip)}`)
