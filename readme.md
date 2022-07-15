<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-light-500b%402x.png">
  <img alt="Architect Logo" src="https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-500b%402x.png">
</picture>

<p align="center">
  <a href="https://github.com/architect/arcdown/actions?query=workflow%3A%22Node+CI%22"><img src=https://github.com/architect/arcdown/workflows/Node%20CI/badge.svg alt="GitHub CI status"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache-2.0 License"></a>
</p>

> A small stack of Markdown tools (built on `markdown-it`) configured using the Architect's team preferred conventions for creating documentation and articles rendered and served from an AWS Lambda.

## [Architect](https://arc.codes)'s Markdown Renderer

This is an opinionated toolchain to create technical content from Markdown source files as quickly as possible to enable on-the-fly rendering in a Lambda runtime.

Included are three `markdown-it` plugins (to provide a table of contents, map CSS classes to elements, and handle external links), a syntax highlighter, frontmatter parsing, and some convenient return values.

These built-ins are configurable and the chain of plugins can be extended by the user.

### Requirements

Node.js v14+

### Installation

```
npm i arcdown
```

### Usage

```javascript
import render from 'arcdown'

const doc = `
---
title: Hello World
category: Examples
---

## Foo bar

lorem ipsum _dolor_ sit **amet**

### Baz

[Architect](https://arc.codes/)
`

const {
  frontmatter, // attributes from frontmatter
  html,        // the good stuff: HTML!
  slug,        // a URL-friendly slug
  title,       // document title from the frontmatter
  tocHtml,     // an HTML table of contents
} = await render(doc)
```

See ./example/ for a kitchen sink demo.

### Result

`arcdown` returns an object with 4 strings plus any frontmatter:

- `html` the Markdown document contents as HTML
  - the unmodified result from `markdown-it`
- `tocHtml` the document's table of contents as HTML (nested unordered lists)
- `title` the document title, lifted from the document's frontmatter. possibly empty
- `slug` a slug of the title. possibly empty
  - created in the same way as links in the table of contents.
- `frontmatter` all remaining frontmatter. possibly empty
  - passed straight from the [`tiny-frontmatter` parser](https://github.com/rjreed/tiny-frontmatter)

```javascript
import render from 'arcdown'

const {
  frontmatter, // attributes from frontmatter
  html,        // the good stuff: HTML!
  slug,        // a URL-friendly slug
  title,       // document title from the frontmatter
  tocHtml,     // an HTML table of contents
} = await render(file, options)
```

### Configuration

`arcdown` is set up to be used without any configuration. Out-of-the-box it uses defaults and conventions preferred by the Architect team (Architect project not required).

However, the renderer is customizable and extensible.

#### `markdown-it` config

Set config for [the `markdown-it` renderer](https://github.com/markdown-it/markdown-it):

```javascript
const options = {
  // set options for Markdown renderer
  markdownIt: { linkify: false },
}
```

By default, these options are enabled:

```json
{
  "html": true,
  "linkify": true,
  "typographer": true
}
```

#### Plugin overrides

Three plugins are provided out-of-the-box and applied in the following order:

1. [`markdown-it-class`](https://github.com/HiroshiOkada/markdown-it-class) as "markdownItClass" (modified and bundled to /lib)
2. [`markdown-it-external-anchor`](https://github.com/binyamin/markdown-it-external-anchor) as "markdownItExternalAnchor"
3. [`markdown-it-toc-and-anchor`](https://github.com/medfreeman/markdown-it-toc-and-anchor) as "markdownItTocAndAnchor"

Set configuration for each plugin by adding a keyed object to `options.pluginOverrides`.  
Disable a plugin by setting its key in `pluginOverrides` to `false`.

```javascript
const options = {
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
  }
}
```

#### Plugin defaults

`markdown-it-toc-and-anchor` is pre-configured with:

```json
{
  "anchorLink": false,
  "tocFirstLevel": 2,
  "tocLastLevel": 6,
  "tocClassName": "docToc"
}
```

`markdown-it-class` has no default class mapping configuration and will be skipped if a config object is not provided.

`markdown-it-external-anchor` is not specifically configured here and maintains the package defaults.

#### highlight.js config

A custom `highlight()` method supported by [highlight.js](https://highlightjs.org/) is provided to the `markdown-it`  renderer. `arcdown` will detect languages in the provided Markdown string and attempt to register just those languages in hljs.

> ℹ️  Currently, shorthand aliases for languages are not supported. Full language names should be used with Markdown code fences. Instead of `js`, use `javascript`

`ignoreIllegals: true` is the default, but can be set by the user.

Additionally, a language syntax can be added from third party libraries. And, if needed, highlight.js built-in languages can be disabled:

```javascript
import leanSyntax from 'highlightjs-lean'

const options = {
  hljs: {
    classString: 'hljs relative mb-2',
    languages: {
      // external languages can be added:
      lean: leanSyntax,
      // disable a hljs built-in language
      powershell: false,
    },
    ignoreIllegals: false,
  },
}
```

Default registered languages include `bash`, `javascript`, `json`, `powershell`, `python`, `ruby`, `yaml`, and `arc`.

#### User-provided plugins

```javascript
import markdownItAttrs from 'markdown-it-attrs'
import markdownItEmoji from 'markdown-it-emoji'
import render from 'arcdown'

const options = {
  plugins: {
    // add bare custom plugins
    markdownItAttrs,
    // verbose definition
    mdMoji: [ // key name doesn't matter
      // the plugin function:
      markdownItEmoji,
      // with options:
      { shortcuts: { laughing: ':D' } },
    ],
  },
}
```

### Vendored Code and Future Development

A couple plugins have been forked and/or vendored locally to this package. This has been done to increase performance and render speed.

We are not married to any single component package or even to the core rendering engine, so long as the resulting features are maintained. Suggestions and PRs welcome 🙏

### Todo

- [x] additional testing
- [x] type defs -- can be expanded
- [x] benchmarks (try against remark)
- [x] look for hljs perf increases
- [ ] web component enhancements 😏
