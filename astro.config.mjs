import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel/serverless'
import { defineConfig, sharpImageService } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'

const site = process.env.PUBLIC_VERCEL_URL
  ? `https://${process.env.PUBLIC_VERCEL_URL}/`
  : 'http://localhost:3000/'

const content = Object.keys(
  import.meta.glob('./src/content/!(authors)/**/*.mdx')
).map(file => file.split('./src/content/').pop().split('.mdx').shift())
const pages = Object.keys(import.meta.glob('./src/pages/**/*.astro'))
  .map(file =>
    file
      // Remove first part of path
      .split('./src/pages/')
      .pop()
      // Remove extension
      .split('.astro')
      .shift()
      // Remove "/index" suffix
      .split('/index')
      .shift()
  )
  // Remove dynamic pages
  .filter(page => !page.includes('['))

const customPages = [...pages, ...content].map(slug => `${site}${slug}`)

/** @type {import('vite').Plugin} */
const hexLoader = {
  name: 'hex-loader',
  transform(code, id) {
    const [path, query] = id.split('?')
    if (query != 'raw-hex') return null

    const data = fs.readFileSync(path)
    const hex = data.toString('hex')

    return `export default '${hex}';`
  },
}

// https://astro.build/config
export default defineConfig({
  site,
  compressHTML: true,
  output: 'server',
  experimental: {
    assets: true,
  },
  adapter: vercel({
    analytics: true,
    imagesConfig: {
      sizes: [640, 1280],
      formats: ['image/webp', 'image/avif'],
    },
    imageService: true,
  }),
  // image: {
  //   service: sharpImageService(),
  // },
  markdown: {
    syntaxHighlight: 'prism',
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: 'noopener',
        },
      ],
    ],
  },
  integrations: [
    tailwind(),
    sitemap({
      customPages,
    }),
    mdx({
      optimize: true,
    }),
    preact({ compat: true }),
  ],
  vite: {
    plugins: [hexLoader],
  },
})
