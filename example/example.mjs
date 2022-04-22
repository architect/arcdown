import { URL } from 'url'
import { readFileSync } from 'fs'
import render from '../index.mjs'

const file = readFileSync(`${new URL('.', import.meta.url).pathname}/example.md`, 'utf8')

const options = {
  markdownIt: {
    // set options for base Markdown renderer
    linkify: false,
  },
  markdownItTocAndAnchor: {
    // set options for toc and anchor plugin
    tocClassName: 'pageToC',
  },
  markdownItClass: {
    // set options for markdown-it-class plugin
    // in this case, that's an element => class map
    h2: [ 'title' ],
    p: [ 'prose' ],
  },
}

const doc = render(file, options)
console.log(doc)
