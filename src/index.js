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

import Markdown from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItExternalAnchor from 'markdown-it-external-anchor'
import tinyFrontmatter from 'tiny-frontmatter'

import createHighlight from './lib/highlight.js'
import markdownItClass from './vendor/markdown-it-class.cjs'

let tocHtml

export const defaultPlugins = {
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

export function slugify (s) {
  return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
}

export default async function (mdFile, rendererOptions = {}) {
  const {
    hljs = {},                   // highlight.js languages and classes
    markdownIt = {},             // override markdown-it options
    pluginOverrides = {},        // override default plugins options
    plugins: addedPlugins = {},  // add custom plugins
  } = rendererOptions

  const renderer = new Markdown({
    highlight: await createHighlight(hljs),
    ...MARKDOWN_DEFAULTS,
    ...markdownIt,
  })

  // don't apply classes if missing mapping
  if (!pluginOverrides.markdownItClass)
    delete defaultPlugins.markdownItClass

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

  const { attributes, body } = tinyFrontmatter(mdFile)
  const html = renderer.render(body)

  return {
    ...attributes,
    html,
    tocHtml,
    slug: slugify(attributes.title),
  }
}
