import hljs from 'highlight.js/lib/core'
import Markdown from 'markdown-it'

const DEFAULT_LANGUAGES = new Set([
  'bash',
  'css',
  'javascript',
  'json',
  'powershell',
  'python',
  'ruby',
  'yaml',
  'xml', // for html
  { 'arc': '@architect/syntaxes/arc-hljs-grammar.js' }
])
const escapeHtml = Markdown().utils.escapeHtml // ? instantiation performance cost?

export default async function ({ languages = [], classString = 'hljs', ignoreIllegals = true } = {}) {
  let allLanguages = new Set(DEFAULT_LANGUAGES)

  // ? add option to reset hljs languages
  // ! this would have performance implications

  for (const lang of languages) {
    if (lang.constructor.name === 'Object') {
      const name = Object.keys(lang)[0]
      if (lang[name] === false) {
        allLanguages.delete(name)
        hljs.unregisterLanguage(name)
      }
      else allLanguages.add(lang)
    }
    else allLanguages.add(lang)
  }

  for (const languageSpec of allLanguages) {
    let lang, languageName

    if (typeof languageSpec === 'string') {
      languageName = languageSpec
      lang = await import(`highlight.js/lib/languages/${languageSpec}`)
    }
    else if (languageSpec.constructor.name === 'Object') {
      languageName = Object.keys(languageSpec)[0]
      lang = await import(languageSpec[languageName])
    }

    hljs.registerLanguage(languageName, lang.default)
  }

  return function (code, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        const highlighted = hljs.highlight(code, { ignoreIllegals, language })
        return `<pre class="${classString}"><code data-language="${language}">${highlighted.value}</code></pre>`
      }
      catch (error) {
        return `<pre class="${classString} hljs-failed"><code data-language="${language}">${escapeHtml(code)}</code></pre>`
      }
    }

    return `<pre class="${classString} hljs-unregistered"><code data-language="${language}">${escapeHtml(code)}</code></pre>`
  }
}
