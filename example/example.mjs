import { URL } from 'url'
import { readFileSync, writeFileSync } from 'fs'
import markdownItAttrs from 'markdown-it-attrs'
import markdownitEmoji from 'markdown-it-emoji'
import render from '../index.mjs'

// read the sample markdown file
const file = readFileSync(`${new URL('.', import.meta.url).pathname}/example.md`, 'utf8')

const options = {
  // register hljs built-in languages with a string
  // or a custom language as a tuple
  hljs: {
    classString: 'hljs mb0 mb1-lg relative',
    languages: [
      'javascript',
      { 'arc': '@architect/syntaxes/arc-hljs-grammar.js' },
      // array tuple also supported
      // [ 'arc', '@architect/syntaxes/arc-hljs-grammar.js' ]
    ],
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
      markdownitEmoji,
      // with options:
      {
        shortcuts: { 'laughing': ':D' }
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
        grid-template-columns: minmax(150px, 25%) 1fr;
      }
      .hljs {
        padding: 1rem;
      }
    </style>
  </head>
  <body>
    <nav>
      <h3>Navigation</h3>
      ${tocHtml}
    </nav>
    <main>
      <h1>${title}</h1>
      ${html}
    </main>
  </body>
</html>`

  writeFileSync(`${new URL('.', import.meta.url).pathname}/${slug}.html`, doc)

  console.log(`Rendered "${title}" to ${slug}.html`)
}

// run the main function
main()
