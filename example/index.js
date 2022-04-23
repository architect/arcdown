import { URL } from 'url'
import { readFileSync, writeFileSync } from 'fs'
import markdownItAttrs from 'markdown-it-attrs'
import markdownItEmoji from 'markdown-it-emoji'
import render from '../src/index.js'

// read the sample markdown file
const file = readFileSync(`${new URL('.', import.meta.url).pathname}/example.md`, 'utf8')

const options = {
  hljs: {
    classString: 'hljs mb0 mb1-lg relative',
    languages: [
      // register hljs built-in languages with a string
      'typescript',
      // or a custom language as an object
      { lean: 'highlightjs-lean' },
      // array tuple also supported
      // [ 'cshtml-razor', 'highlightjs-cshtml-razor' ],
      // disable a default language
      { powershell: false },
    ],
    ignoreIllegals: false,
  },
  // set options for Markdown renderer
  markdownIt: { linkify: false },
  // override default plugins default options
  pluginOverrides: {
    // set options for toc plugin
    markdownItTocAndAnchor: { tocClassName: 'pageToC' },
    // set options for markdown-it-class plugin
    markdownItClass: {
      // in this case, that's an element => class map
      h2: [ 'title' ],
      p: [ 'prose' ],
    },
    // disable markdown-it-external-anchor plugin
    markdownItExternalAnchor: false,
  },
  plugins: {
    // add custom plugins
    markdownItAttrs,
    // verbose definition -- key name doesn't matter
    mdMoji: [
      // the plugin function:
      markdownItEmoji,
      // with options:
      {
        shortcuts: { laughing: ':D' }
      },
    ],
  },
}

// create an async function
async function main () {
  // render markdown to html
  const result = await render(file, options)
  const {
    html,
    tocHtml,
    slug,
    title,
  } = result

  const doc = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="https://unpkg.com/highlight.js@11.5.1/styles/night-owl.css">
    <style>
      body {
        font-family: system-ui;
        padding: 1rem 3rem;
        display: grid;
        grid-template-columns: 1fr minmax(150px, 25%);
        gap: 2rem;
      }
      .hljs {
        padding: 1rem;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${title}</h1>
      ${html}
    </main>
    <nav>
      <h3>Navigation</h3>
      ${tocHtml}
    </nav>
  </body>
</html>`

  writeFileSync(`${new URL('.', import.meta.url).pathname}/${slug}.html`, doc)

  console.log(`Rendered "${title}" to ${slug}.html`)
}

// run the main function
main()
