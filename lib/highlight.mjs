import hljs from 'highlight.js/lib/core'
import Markdown from 'markdown-it'

const escapeHtml = Markdown().utils.escapeHtml

export default async function ({ languages = [], classString = 'hljs' }) {
  for (const languageSpec of languages) {
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
        console.log(`Highlighter unsupported language: ${lang}`)
        return ''
      }
    }

    return `<pre class="${classes}"><code data-language="${lang}">${escapeHtml(str)}</code></pre>`
  }
}
