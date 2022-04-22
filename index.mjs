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

import markdownItClass from './lib/markdown-it-class.js'

let docOutline = ''

export const defaultPlugins = {
  markdownItClass: [ markdownItClass, {} ],
  markdownItExternalAnchor: [ markdownItExternalAnchor, {} ],
  markdownItTocAndAnchor: [
    // @ts-ignore
    markdownItTocAndAnchor.default, {
      slugify,
      tocCallback: (_, __, tocHtml) => { docOutline = tocHtml },
      ...TOC_DEFAULTS,
    }
  ],
}

// const { escapeHtml } = Markdown().utils

// const hljs = require('./highlight')
// const highlight = require('./highlighter').bind(null, hljs, escapeHtml)

export function slugify (s) {
  return escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))
}

export default function (rawMd, options = {}) {
  const {
    markdownIt = {},
    plugins: addedPlugins = {},
  } = options

  const renderer = new Markdown({
    ...MARKDOWN_DEFAULTS,
    ...markdownIt,
  })

  const allPlugins = { ...defaultPlugins, ...addedPlugins }
  for (const mdPlugin in allPlugins) {
    let [ plugin, pluginOptions ] = allPlugins[mdPlugin]
    renderer.use(plugin, { ...pluginOptions, ...options[mdPlugin] })
  }

  const { attributes, body } = tinyFrontmatter(rawMd)
  const children = renderer.render(body)

  return {
    ...attributes,
    children,
    docOutline,
    titleSlug: slugify(attributes.title),
  }
}
