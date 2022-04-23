import hljs from 'highlight.js/lib/core'
import Markdown from 'markdown-it'

const DEFAULT_LANGUAGES = [
  'bash',
  'javascript',
  'json',
  'powershell',
  'python',
  'ruby',
  'yaml',
  { 'arc': '@architect/syntaxes/arc-hljs-grammar.js' }
]
const escapeHtml = Markdown().utils.escapeHtml // ? performance cost?

export default async function ({ languages = [], classString = 'hljs' }) {
  const allLanguages = [ ...DEFAULT_LANGUAGES, ...languages ]

  for (const languageSpec of allLanguages) {
    let language, languageName

    if (typeof languageSpec === 'string') {
      languageName = languageSpec
      language = await import(`highlight.js/lib/languages/${languageSpec}`)
    }
    else if (languageSpec.constructor.name === 'Array') {
      languageName = languageSpec[0]
      language = await import(languageSpec[1])
    }
    else if (languageSpec.constructor.name === 'Object') {
      languageName = Object.keys(languageSpec)[0]

      // skip disabled languages
      if (languageSpec[languageName] === false) continue

      language = await import(languageSpec[languageName])
    }

    hljs.registerLanguage(languageName, language.default)
  }

  return function (str, lang) {
    const classes = classString

    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="${classes}"><code data-language="${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`
      }
      catch (error) {
        return `<pre class="${classes} hljs-failed"><code data-language="${lang}">${escapeHtml(str)}</code></pre>`
      }
    }

    return `<pre class="${classes} hljs-unregistered"><code data-language="${lang}">${escapeHtml(str)}</code></pre>`
  }
}
