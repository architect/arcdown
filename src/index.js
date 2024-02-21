import MarkdownIt from 'markdown-it'
import markdownItExternalAnchor from 'markdown-it-external-anchor'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItClass from 'markdown-it-class'
import markdownItToc from 'markdown-it-toc-done-right'
import matter from 'gray-matter'

import { Highlighter } from './lib/hljs-highlighter.js'
import findLanguages from './lib/find-languages.js'
import slugify from './lib/slugify.js'

export class Arcdown {
  static slugify = slugify
  static findLanguages = findLanguages

  #tocHtml = ''
  #defaultPlugins = {
    markdownItClass,
    markdownItExternalAnchor,
    markdownItAnchor: [ markdownItAnchor, { slugify, tabIndex: false } ],
    markdownItToc: [
      markdownItToc,
      {
        slugify,
        callback: (html) => {
          this.#tocHtml = html
        },
      },
    ],
  }

  /**
   * @param {{
   *   markdownIt?: object,
   *   plugins?: object,
   *   renderer?: MarkdownIt,
   *   hljs?: {
   *     classString?: string,
   *     ignoreIllegals?: boolean,
   *     languages?: object,
   *     sublanguages?: object,
   *     plugins?: object[],
   *   },
   *   pluginOverrides?: {
   *     markdownItClass?: object | boolean,
   *     markdownItExternalAnchor?: object | boolean,
   *     markdownItAnchor?: object | boolean,
   *     markdownItToc?: object | boolean,
   *   },
   * }} options - renderer options
   */
  constructor (options = {}) {
    const {
      hljs = {},
      markdownIt = {},
      pluginOverrides = {},
      plugins = {},
      renderer = null,
    } = options

    // don't apply classes if missing mapping
    if (!pluginOverrides.markdownItClass) {
      pluginOverrides.markdownItClass = false
    }

    this.hljsOptions = hljs
    this.mditOptions = markdownIt
    this.mditPluginOverrides = pluginOverrides
    this.mditAddedPlugins = plugins
    this.customRenderer = !!renderer

    this.highlighter = new Highlighter(this.hljsOptions)

    const mdit =
      renderer || new MarkdownIt({
        linkify: true,
        html: true,
        typographer: true,
        ...this.mditOptions,
      })

    if (typeof mdit.use === 'function') {
      const allPlugins = { ...this.#defaultPlugins, ...this.mditAddedPlugins }
      for (const mdPlugin in allPlugins) {
        // skip disabled plugins
        if (
          (mdPlugin in this.mditPluginOverrides) && this.mditPluginOverrides[mdPlugin] === false
        ) {
          continue
        }

        const plugin = allPlugins[mdPlugin]
        let pluginFn = plugin
        let pluginOptions = {}

        if (Array.isArray(plugin)) {
          [ pluginFn, pluginOptions ] = plugin
        }

        mdit.use(pluginFn, {
          ...pluginOptions,
          ...this.mditPluginOverrides[mdPlugin],
        })
      }
    }

    this.renderer = mdit
  }

  /**
   * @param {Buffer | string} mdContent - markdown content
   * @returns {Promise<{
   *   html: string,
   *   tocHtml: string,
   *   title?: string,
   *   slug?: string,
   *   frontmatter?: Record<string, unknown>,
   * }>} - rendered result
   */
  async render (mdContent) {
    const { content, data: frontmatter } = matter(mdContent)

    if (!this.customRenderer) {
      const foundLanguages = findLanguages(content)
      const highlight = await this.highlighter.createHighlightFn(foundLanguages)
      this.renderer.set({ highlight })
    }

    const html = this.renderer.render(content)

    let { slug, title } = frontmatter
    if (!slug && title) {
      slug = slugify(title)
    }

    return {
      title,
      slug,
      frontmatter,
      html,
      tocHtml: this.#tocHtml,
    }
  }
}
