/**
 * 构建 vendor 产物到 public/vendor/
 * 从本地 node_modules 打包 react/react-dom/react-router-dom/axios 等 ESM 产物，
 * 消除对 esm.sh 等外部 CDN 的运行时依赖。
 *
 * 产物由 index.html 的 importmap 引用。升级依赖后需重跑本脚本。
 */
import { build } from 'esbuild'
import { mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '..', 'public', 'vendor')

/** @type {Array<{ entry: string; outfile: string; external?: string[] }>} */
const targets = [
  // react 无外部依赖
  { entry: 'react', outfile: 'react.js' },
  { entry: 'react/jsx-runtime', outfile: 'react/jsx-runtime.js', external: ['react'] },
  { entry: 'react/jsx-dev-runtime', outfile: 'react/jsx-dev-runtime.js', external: ['react'] },
  // react-dom 依赖 react
  { entry: 'react-dom', outfile: 'react-dom.js', external: ['react'] },
  { entry: 'react-dom/client', outfile: 'react-dom/client.js', external: ['react', 'react-dom'] },
  // react-router-dom 内联 react-router（用户代码不直接 import 'react-router'）
  {
    entry: 'react-router-dom',
    outfile: 'react-router-dom.js',
    external: ['react', 'react-dom'],
  },
  // axios 无外部依赖
  { entry: 'axios', outfile: 'axios.js' },
]

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true })
  await mkdir(OUT_DIR, { recursive: true })

  for (const t of targets) {
    const outfile = resolve(OUT_DIR, t.outfile)
    await mkdir(dirname(outfile), { recursive: true })
    await build({
      entryPoints: [t.entry],
      bundle: true,
      format: 'esm',
      platform: 'browser',
      target: 'es2020',
      minify: true,
      legalComments: 'none',
      external: t.external ?? [],
      outfile,
      absWorkingDir: resolve(__dirname, '..'),
      logLevel: 'error',
    })
    console.log(`  ✓ ${t.outfile}`)
  }

  console.log(`\nvendor built → ${OUT_DIR}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
