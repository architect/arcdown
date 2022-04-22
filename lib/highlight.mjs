import hljs from 'highlight.js/lib/core'
import Markdown from 'markdown-it'

const escapeHtml = Markdown().utils.escapeHtml

export default async function ({ languages = [], classString = 'hljs' }) {
  for (const languageSpec of languages) {
    let language, languageName

    if (Array.isArray(languageSpec)) {
      languageName = languageSpec[0]
      language = await import(languageSpec[1])
    }
    else {
      languageName = languageSpec
      language = await import(`highlight.js/lib/languages/${languageSpec}`)
    }

    hljs.registerLanguage(languageName, language.default)
  }

  return function (str, lang) {
    const classes = classString

    if (lang && hljs.getLanguage(lang)) {
      try {
        return `
<pre class="${classes}">
  <code data-language="${lang}">
    ${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}
  </code>
</pre>
          `.trim()
      }
      catch (error) {
        console.log(`Highlighter unsupported language: ${lang}`)
        return ''
      }
    }

    return `
<pre class="${classes}">
  <code data-language="${lang}">
    ${escapeHtml(str)}
  </code>
</pre>
      `.trim()
  }
}
