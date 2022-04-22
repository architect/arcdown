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
}

import { escape } from 'querystring'
import Markdown from 'markdown-it'
import markdownItTocAndAnchor from 'markdown-it-toc-and-anchor'
import markdownItExternalAnchor from 'markdown-it-external-anchor'
import tinyFrontmatter from 'tiny-frontmatter'

import createHighlight from './lib/highlight.mjs'
import markdownItClass from './lib/markdown-it-class.js'

let generatedOutline

export const defaultPlugins = {
  markdownItClass: [ markdownItClass, {} ],
  markdownItExternalAnchor: [ markdownItExternalAnchor, {} ],
  markdownItTocAndAnchor: [
    // @ts-ignore
    markdownItTocAndAnchor.default, {
      slugify,
      tocCallback: (_, __, tocHtml) => { generatedOutline = tocHtml },
      ...TOC_DEFAULTS,
    }
  ],
}

export function slugify (s) {
  return escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))
}

export default async function (mdFile, rendererOptions = {}) {
  const {
    hljs = {},                  // highlight.js languages and classes
    markdownIt = {},            // override mardown-it options
    options: addedOptions = {}, // override default plugins options
    plugins: addedPlugins = {}, // add custom plugins
  } = rendererOptions

  const renderer = new Markdown({
    highlight: await createHighlight({ languages: hljs.languages, classString: hljs.classString }),
    ...MARKDOWN_DEFAULTS,
    ...markdownIt,
  })

  const allPlugins = { ...defaultPlugins, ...addedPlugins }
  for (const mdPlugin in allPlugins) {
    let [ plugin, pluginOptions ] = allPlugins[mdPlugin]
    if (plugin) renderer.use(plugin, { ...pluginOptions, ...addedOptions[mdPlugin] })
  }

  const { attributes, body } = tinyFrontmatter(mdFile)
  const children = renderer.render(body)

  return {
    ...attributes,
    children,
    outline: generatedOutline,
    slug: slugify(attributes.title),
  }
}
