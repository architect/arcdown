// some Architect-preferred defaults
const MARKDOWN_DEFAULTS = {
  linkify: true,
  html: true,
  typographer: true,
}
const TOC_DEFAULTS = {
  anchorLink: false,
  tocFirstLevel: 2,
  tocLastLevel: 6,
  tocClassName: 'docToc',
}

import MarkdownIt from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItExternalAnchor from 'markdown-it-external-anchor'
import tinyFrontmatter from 'tiny-frontmatter'

import createHighlight from './lib/highlight.js'
import markdownItClass from './vendor/markdown-it-class.cjs'

let tocHtml

const defaultPlugins = {
  markdownItClass,
  markdownItExternalAnchor,
  markdownItTocAndAnchor: [
    // @ts-ignore
    markdownItTocAndAnchor.default,
    {
      slugify,
      tocCallback: (_tocMarkdown, _tocArray, _tocHtml) => { tocHtml = _tocHtml },
      ...TOC_DEFAULTS,
    }
  ],
}

function slugify (s) {
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
}

export default async function (mdFile, rendererOptions = {}) {
  const {
    hljs = {},                       // highlight.js languages and classes
    markdownIt = {},                 // override markdown-it options
    pluginOverrides = {},            // override default plugins options
    plugins: addedPlugins = {},      // add custom plugins
    renderer: customRenderer = null, // override renderer
  } = rendererOptions

  const { attributes, body } = tinyFrontmatter(mdFile)

  const foundLangs = new Set()
  const fenceR = /`{3}(?:(.*$))?[\s\S]*?`{3}/gm
  let match
  do {
    match = fenceR.exec(body)
    if (match) foundLangs.add(match[1])
  } while (match)

  const renderer = customRenderer || new MarkdownIt({
    highlight: await createHighlight(hljs, foundLangs),
    ...MARKDOWN_DEFAULTS,
    ...markdownIt,
  })

  // don't apply classes if missing mapping
  if (!pluginOverrides.markdownItClass)
    pluginOverrides.markdownItClass = false

  if (typeof renderer.use === 'function') {
    const allPlugins = { ...defaultPlugins, ...addedPlugins }
    for (const mdPlugin in allPlugins) {
    // skip disabled plugins
      if (
        mdPlugin in pluginOverrides
      && pluginOverrides[mdPlugin] === false
      ) continue

      const plugin = allPlugins[mdPlugin]
      let pluginFn = plugin
      let pluginOptions = {}

      if (Array.isArray(plugin))
        [ pluginFn, pluginOptions ] = plugin

      renderer.use(pluginFn, { ...pluginOptions, ...pluginOverrides[mdPlugin] })
    }
  }

  const html = renderer.render(body)
  const title = attributes.title || null

  return {
    slug: title ? slugify(title) : null,
    ...attributes,
    title,
    html,
    tocHtml,
  }
}

export { createHighlight, defaultPlugins, slugify }
