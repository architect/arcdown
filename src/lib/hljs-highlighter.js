import { escapeHtml } from 'markdown-it/lib/common/utils.mjs'
import arcSyntax from '@architect/syntaxes/arc-hljs-grammar.js'
import hljs from '../vendor/highlight.js/core.cjs'
import xmlSyntax from '../vendor/highlight.js/languages/xml.js'

const KNOWN_LANGUAGES = {
  arc: arcSyntax,
  html: xmlSyntax,
}

export class Highlighter {
  constructor (
    {
      classString = 'hljs',
      ignoreIllegals = true,
      languages: providedLanguages = {},
      sublanguages = {},
      plugins = [],
    } = {},
  ) {
    this.options = {
      classString,
      ignoreIllegals,
      providedLanguages,
      sublanguages,
    }

    this.hljs = hljs.newInstance() // hljs is a singleton, always create a new instance

    this.hljs.registerAliases('html', { languageName: 'xml' })

    for (const plugin of plugins) this.hljs.addPlugin(plugin)
  }

  /** @param {Set<string>} foundLanguages */
  async #registerLanguages (foundLanguages) {
    /** @type {Map<string, function>} */
    const knownLangs = new Map(
      Object.entries({
        ...KNOWN_LANGUAGES,
        ...this.options.providedLanguages,
      })
    )

    // build languages we need in order to render
    /** @type {Map<string, function>} */
    const requiredLangs = new Map()
    if (foundLanguages) {
      for (const langName of foundLanguages) {
        const knownLang = knownLangs.get(langName)

        if (knownLang) {
          // we have the definition
          requiredLangs.set(langName, knownLang)
        }
        else if (knownLang === false) {
          // explicit false means don't load
          continue
        }
        else {
          // try to load the lang definition
          try {
            const defFn = (await import(`../vendor/highlight.js/languages/${langName}.js`)).default
            requiredLangs.set(langName, defFn)
          }
          catch (error) {
            console.info(`arcdown unable to import "${langName}" from hljs`)
          }
        }

        // register sub-languages
        if (this.options.sublanguages[langName]) {
          for (const sublangName of this.options.sublanguages[langName]) {
            try {
              const sublangDef = (await import(`../vendor/highlight.js/languages/${sublangName}.js`)).default
              requiredLangs.set(sublangName, sublangDef)
            }
            catch (error) {
              console.info(`arcdown unable to import "${sublangName}" for "${langName} from hljs`)
            }
          }
        }
      }
    }

    // register languages with hljs
    for (const [ langName, defFn ] of requiredLangs) {
      // @ts-ignore defFn is an HLJSApi fn
      this.hljs.registerLanguage(langName, defFn)
    }
  }

  async createHighlightFn (foundLanguages = new Set()) {
    await this.#registerLanguages(foundLanguages)

    return (code, language) => {
      const result = []

      if (language && this.hljs?.getLanguage(language)) {
        try {
          const highlighted = this.hljs.highlight(code, {
            ignoreIllegals: this.options.ignoreIllegals,
            language,
          })

          result.push(
            `<pre class="${this.options.classString}">`,
            `<code data-language="${language}">${highlighted.value}</code>`,
          )
        }
        catch (error) {
          console.info(`Arcdown's Highlight.js unable to highlight ${language}`)

          result.push(
            `<pre class="${this.options.classString} hljs-failed">`,
            `<code data-language="${language}">${escapeHtml(code)}</code>`,
          )
        }
      }
      else {
        result.push(
          `<pre class="${this.options.classString} hljs-unregistered">`,
          `<code data-language="${language}">${escapeHtml(code)}</code>`,
        )
      }

      result.push('</pre>')
      return result.join('')
    }
  }
}
