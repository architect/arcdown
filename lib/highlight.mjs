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

export default async function ({ languages = [], classString = 'hljs', ignoreIllegals = true } = {}) {
  const allLanguages = [ ...DEFAULT_LANGUAGES, ...languages ]

  for (const languageSpec of allLanguages) {
    let lang, languageName

    if (typeof languageSpec === 'string') {
      languageName = languageSpec
      lang = await import(`highlight.js/lib/languages/${languageSpec}`)
    }
    else if (languageSpec.constructor.name === 'Array') {
      languageName = languageSpec[0]
      lang = await import(languageSpec[1])
    }
    else if (languageSpec.constructor.name === 'Object') {
      languageName = Object.keys(languageSpec)[0]

      // skip disabled languages
      if (languageSpec[languageName] === false) continue

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
