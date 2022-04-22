import { URL } from 'url'
import { readFileSync } from 'fs'
import render from '../index.mjs'

const file = readFileSync(`${new URL('.', import.meta.url).pathname}/example.md`, 'utf8')

const options = {
  // register hljs built-in languages with a string
  // or a custom language as a tuple
  hljs: {
    classString: 'hljs mb0 mb1-lg relative',
    languages: [
      'javascript',
      [ 'arc', '@architect/syntaxes/arc-hljs-grammar.js' ],
    ],
  },
  // set options for Markdown renderer
  markdownIt: { linkify: false },
  // override default plugins default options
  options: {
    // set options for toc plugin
    markdownItTocAndAnchor: { tocClassName: 'pageToC' },
    // set options for markdown-it-class plugin
    markdownItClass: {
      // in this case, that's an element => class map
      h2: [ 'title' ],
      p: [ 'prose' ],
    },
  },
  plugins: [
    // add custom plugins
    [],
  ]
}

async function main () {
  const doc = await render(file, options)
  console.log(doc)
}

main()
