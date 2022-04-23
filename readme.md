![Architect logo](https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-light-500b%402x.png#gh-dark-mode-only)
![Architect logo](https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-500b%402x.png#gh-light-mode-only)

## [Architect](https://arc.codes)'s Markdown Renderer

> ⚠️  Very much a work in progress!

<!-- [![GitHub CI status](https://github.com/architect/arc-render-md/workflows/Node%20CI/badge.svg)](https://github.com/architect/arc-render-md/actions?query=workflow%3A%22Node+CI%22) -->

## Usage

Kitchen sink example with user-provided plugins:

```js
import markdownItAttrs from 'markdown-it-attrs'
import markdownitEmoji from 'markdown-it-emoji'
import render from 'arc-render-md'

const options = {
  // register hljs built-in languages with a string
  // or a custom language as a tuple
  hljs: {
    classString: 'hljs mb0 mb1-lg relative',
    languages: [
      'javascript',
      { 'arc': '@architect/syntaxes/arc-hljs-grammar.js' },
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

// render markdown to html
const {
  html,     // the good stuff: HTML!
  tocHtml,  // an HTML table of contents
  slug,     // a URL-friendly slug
  title,    // document title from the frontmatter
  // ... any other attributes from frontmatter
} = await render(file, options)
```
