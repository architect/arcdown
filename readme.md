<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-light-500b%402x.png">
  <img alt="Architect Logo" width="500px" src="https://github.com/architect/assets.arc.codes/raw/main/public/architect-logo-500b%402x.png">
</picture>
</p>

<p align="center">
  <a href="https://github.com/architect/arcdown/actions?query=workflow%3A%22Node+CI%22"><img src=https://github.com/architect/arcdown/workflows/Node%20CI/badge.svg alt="GitHub CI status"></a>
  <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="Apache-2.0 License"></a>
</p>

> A small stack of Markdown tools (built on `markdown-it`) configured using the Architect's team preferred conventions for creating documentation and articles rendered and served from an AWS Lambda.

## `arcdown`: [Architect](https://arc.codes)'s Markdown Renderer

This is an opinionated toolchain to create technical content from Markdown source files as quickly as possible to enable on-the-fly rendering in a Lambda runtime.

Included are three `markdown-it` plugins (to provide a table of contents, map CSS classes to elements, and handle external links), a syntax highlighter, frontmatter parsing, and some convenient return values.

These built-ins are configurable and the chain of plugins can be extended by the user.

## Usage

<table>
<tr>
<td width="400px" valign="top">

### Installation

```
npm install arcdown
```

<small>ESM only, requires Node.js v14+</small>

Import the module's default export.

Provide a string of Markdown optionally with "frontmatter" as YAML.

Await the response.

</td>
<td width="600px"><br>

```javascript
import render from 'arcdown'

const mdString = `
---
title: Hello World
category: Examples
---

## Foo bar

lorem ipsum _dolor_ sit **amet**

[Architect](https://arc.codes/)
`.trim()

const {
  frontmatter, // attributes from frontmatter
  html,        // the good stuff: HTML!
  slug,        // a URL-friendly slug
  title,       // document title from the frontmatter
  tocHtml,     // an HTML table of contents
} = await render(mdString)
```

</td>
</tr>
</table>

## Render Result

`arcdown` returns an object with 4 strings plus any document "frontmatter".

<table>
<tr>
<td width="400px" valign="top">

### `html`

The Markdown document contents as HTML, unmodified, rendered by `markdown-it`.

</td>
<td width="600px"><br>

```javascript
const { html } = await render(file, options)
```

</td>
</tr>

<tr>
<td width="400px" valign="top">

### `tocHtml`

The document's table of contents as HTML (nested unordered lists).

</td>
<td width="600px"><br>

```javascript
const { tocHtml } = await render(file, options)
```

</td>
</tr>

<tr>
<td width="400px" valign="top">

### `title`

The document title, lifted from the document's frontmatter.

</td>
<td width="600px"><br>

```javascript
const { title } = await render(file, options)
```

</td>
</tr>

<tr>
<td width="400px" valign="top">

### `slug`

A URL-friendly slug of the title. (possibly empty) Synonymous with links in the table of contents.

</td>
<td width="600px"><br>

```javascript
const { slug } = await render(file, options)
```

</td>
</tr>

<tr>
<td width="400px" valign="top">

### `frontmatter`

All remaining frontmatter. (possibly empty)

</td>
<td width="600px"><br>

```javascript
const { frontmatter } = await render(file, options)
```

</td>
</tr>
</table>

## Configuration

`arcdown` is set up to be used without any configuration. Out-of-the-box it uses defaults and conventions preferred by the Architect team (Architect project not required).

However, the renderer is customizable and extensible.

See ./example/ for a kitchen sink demo.

<table>
<tr>
<td width="400px" valign="top">

### Core `markdown-it` config

#### `RendererOptions.markdownIt`

Set config for [the `markdown-it` renderer](https://github.com/markdown-it/markdown-it).

</td>
<td width="600px"><br>

```javascript
const options = {
  // set options for Markdown renderer
  markdownIt: { linkify: false },
}
```

By default, the "html", "linkify", "typographer" markdown-it options are enabled.

</td>
</tr>
</table>

### Plugin overrides

#### `RendererOptions.pluginOverrides`

Three plugins are provided out-of-the-box and applied in a specific order.

Set configuration for each plugin by adding a keyed object to `options.pluginOverrides`.  
Disable a plugin by setting its key in `pluginOverrides` to `false`.

<table>
<tr>
<td width="400px" valign="top">


#### `pluginOverrides.markdownItClass`

1. [`markdown-it-class`](https://github.com/HiroshiOkada/markdown-it-class) as "markdownItClass" (modified and bundled to /lib)

`markdown-it-class` has no default class mapping configuration and will be skipped if a config object is not provided.

#### `pluginOverrides.markdownItExternalAnchor`

2. [`markdown-it-external-anchor`](https://github.com/binyamin/markdown-it-external-anchor) as "markdownItExternalAnchor"

`markdown-it-external-anchor` is not specifically configured here and maintains the package defaults.

#### `pluginOverrides.markdownItTocAndAnchor`

3. [`markdown-it-toc-and-anchor`](https://github.com/medfreeman/markdown-it-toc-and-anchor) as "markdownItTocAndAnchor"

`markdown-it-toc-and-anchor` is pre-configured with:

```json
{
  "anchorLink": false,
  "tocFirstLevel": 2,
  "tocLastLevel": 6,
  "tocClassName": "docToc"
}
```

</td>
<td width="600px"><br>

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

</td>
</tr>
</table>

### User-provided plugins

<table>
<tr>
<td width="400px" valign="top">

add external plugins

break into 2 tables

</td>
<td width="600px"><br>

```javascript
import markdownItAttrs from 'markdown-it-attrs'
import markdownItEmoji from 'markdown-it-emoji'

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

</td>
</tr>
</table>


## highlight.js config

A custom `highlight()` method backed by [highlight.js](https://highlightjs.org/) is provided to the `markdown-it` renderer. `arcdown` will detect languages in the provided Markdown string and attempt to register _just_ those languages in hljs.

> ℹ️  Currently, shorthand aliases for languages are not supported. Full language names should be used with Markdown code fences. Instead of `js`, use `javascript`

`ignoreIllegals: true` is the default, but can be set by the user.

### 

<table>
<tr>
<td width="400px" valign="top">

Additionally, a language syntax can be added from third party libraries. And, if needed, highlight.js built-in languages can be disabled:

</td>
<td width="600px"><br>

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

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

add hljs plugin

</td>
<td width="600px"><br>

```javascript
import leanSyntax from 'highlightjs-lean'

const options = {
  hljs: {
    plugins: [{
      'after:highlight'(result) {
        result.value = result.value
          .split('\n')
          .reverse()
          .join('\n')
      }
    }]
  },
}
```

</td>
</tr>
</table>

### Vendored Code and Future Development

A couple plugins have been forked and/or vendored locally to this package. This has been done to increase performance and render speed.

We are not married to any single component package or even to the core rendering engine, so long as the resulting features are maintained. Suggestions and PRs welcome 🙏

### Todo

- [x] additional testing
- [x] type defs -- can be expanded
- [x] benchmarks (try against remark)
- [x] look for hljs perf increases
- [ ] web component enhancements 😏
