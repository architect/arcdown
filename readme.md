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

> A small stack of Markdown tools (built on `markdown-it`) configured using the Architect team's preferred conventions for creating documentation and articles rendered and served from a cloud function.

# `arcdown`: [Architect](https://arc.codes)'s Markdown Renderer

`arcdown` is an opinionated toolchain to create technical content from Markdown source files as quickly as possible to enable on-the-fly rendering in a Lambda (or any server) runtime.

Included are three `markdown-it` plugins (to provide a table of contents, map CSS classes to elements, and handle external links), a syntax highlighter, frontmatter parsing, and some convenient return values.

These built-ins are configurable and the chain of plugins can be extended by the user.

## Contents

1. [Usage](#usage)
  1. [Installation](#installation)
  1. [Example](#example)
  1. [Render Result](#render-result)
1. [Configuration](#configuration)
  1. [MarkdownIt Renderer](#markdown-it-config-markdownit)
  1. [Plugin Overrides](#plugin-overrides-pluginoverrides)
  1. [User-Provided Plugins](#user-provided-plugins-plugins)
  1. [Highlight.js Config](#highlightjs-hljs-config-hljs)
1. [Development & Contributing](#development--contributing)

# Usage

## Installation

```
npm install arcdown
```

_ESM only, requires Node.js v14+_

## Example

The simplest usage is to just pass `arcdown` a string of Markdown:

```javascript
import { readFileSync } from 'node:fs'
import render from 'arcdown'

const mdString = `
---
title: Hello World
category: Examples
---

## Foo Bar

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

const fromFile = await render(readFileSync('../docs/some-markdown.md', 'utf-8'))
```

> ⚙️  See [below for configuration options](#configuration).

## Render Result

`arcdown` returns a `RenderResult` object with 4 strings plus any document "frontmatter".

<table>
<tr>
<td width="400px" valign="top">

### `html: string`

The Markdown document contents as HTML, unmodified, rendered by `markdown-it`.

</td>
<td width="600px"><br>

```javascript
const { html } = await render(mdString)

const document = `
<html>
<body>
  <main>${html}</main>
</body>
</html>
`
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `tocHtml: string`

The document's table of contents as HTML (nested unordered lists).

</td>
<td width="600px"><br>

```javascript
const { tocHtml, html } = await render(mdString)

const document = `
<html>
<body>
  <article>${html}</article>
  <aside>${tocHtml}</aside>
</body>
</html>
`
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `title: string`

The document title, lifted from the document's frontmatter.

</td>
<td width="600px"><br>

```javascript
const { title } = await render(mdString)

console.log(`Rendered "${title}"`)
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `slug: string`

A URL-friendly slug of the title. (possibly empty) Synonymous with links in the table of contents.

</td>
<td width="600px"><br>

```javascript
const { slug } = await render(mdString)

const docLink = `http://my-site.com/docs/${slug}`
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `frontmatter: object`

All remaining frontmatter. (possibly empty)

The document's frontmatter is parsed by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and directly returned here.

</td>
<td width="600px"><br>

```javascript
const { frontmatter } = await render(file, options)

const sortedTags = frontmatter.tags.sort()
```

</td>
</tr>
</table>

# Configuration

`arcdown` is set up to be used without any configuration. Out-of-the-box it uses defaults and conventions preferred by the Architect team (Architect project not required).

However, the renderer is customizable and extensible with a `RendererOptions` object.

> 🪧  See ./example/ for a kitchen sink demo.

## `markdown-it` Config: `markdownIt`

<table>
<tr>
<td width="400px" valign="top">

### `markdownIt`

Configure the core [`markdown-it` renderer](https://github.com/markdown-it/markdown-it).  
This config is passed directly to `new MarkdownIt()`

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  markdownIt: { linkify: false },
})
```

By default, `html`, `linkify`, and `typographer` are enabled.

</td>
</tr>
</table>

## Plugin Overrides: `pluginOverrides`

Three plugins are provided out-of-the-box and applied in a specific order.

Set configuration for each plugin by passing a keyed `RendererOptions.pluginOverrides` object.

> ⛔️  Disable a plugin by setting its key in `pluginOverrides` to `false`.

<table>
<tr>
<td width="400px" valign="top">

### `markdownItClass`

Apply class names to each generated element based on its tag name. Provide a map of element names to an array of classes to be applied.

This plugin is disabled unless configuration is provided.

[`markdown-it-class` docs ](https://github.com/HiroshiOkada/markdown-it-class)

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  pluginOverrides: {
    markdownItClass: {
      // an element => class map
      h2: [ 'title' ],
      p: [ 'prose' ],
    }
  },
})
```

For performance reasons, this plugin was modified and bundled to `./src/vendor/`

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `markdownItExternalAnchor`

Mark all external links (links starting with "http[s]://") with `target=_blank` and an optional class.

Plugin defaults are used in `arcdown`.

[`markdown-it-external-anchor` docs](https://github.com/binyamin/markdown-it-external-anchor)

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  pluginOverrides: {
    markdownItExternalAnchor: {
      domain: 'arc.codes',
      class:'external',
    },
  },
})
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `markdownItTocAndAnchor`

Modify all document headings with anchor tags and generate an HTML table of contents utilizing those heading anchors.

[`markdown-it-toc-and-anchor` docs](https://github.com/medfreeman/markdown-it-toc-and-anchor)

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  pluginOverrides: {
    markdownItTocAndAnchor: {
      tocClassName: 'pageToC',
    },
  },
})
```

`markdown-it-toc-and-anchor` is pre-configured with:

```javascript
{
  anchorLink: false,
  tocFirstLevel: 2,
  tocLastLevel: 6,
  tocClassName: 'docToc',
}
```

</td>
</tr>
</table>

## User-Provided Plugins: `plugins`

It is possible to pass additional `markdown-it` plugins to `arcdown`'s renderer by populating `RendererOptions.plugins`.  
Plugins can be provided in two ways and will be applied after the default plugins bundled with `arcdown`.

<table>
<tr>
<td width="400px" valign="top">

### `plugins`

The simplest method for extending `markdown-it` is to import a plugin function and provide it directly.

</td>
<td width="600px"><br>

```javascript
import markdownItAttrs from 'markdown-it-attrs'

await render(mdString, {
  plugins: { markdownItAttrs },
})
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `plugins` with options

If a plugin requires options, provide the `markdown-it` plugin as a tuple where the first item is the function and the second is the plugin options.

Here the key name provided does not matter.

</td>
<td width="600px"><br>

```javascript
import markdownItEmoji from 'markdown-it-emoji'

await render(mdString, {
  plugins: {
    mdMoji: [
      markdownItEmoji, // the plugin function
      { shortcuts: { laughing: ':D' } }, // options
    ],
  },
})
```

</td>
</tr>
</table>

## Highlight.js (hljs) Config: `hljs`

A custom `highlight()` method backed by [Highlight.js](https://highlightjs.org/) is provided to the `markdown-it` renderer. `arcdown` will detect languages used in fenced code blocks in the provided Markdown string and attempt to register _just_ those languages in hljs.

> ⚠️  Currently, shorthand aliases for languages are not supported.  
Full language names should be used with Markdown code fences. Instead of `js`, use `javascript`

Set Highlight.js configuration by passing a keyed `RendererOptions.hljs` object.

<table>
<tr>
<td width="400px" valign="top">

### `classString: string`

A string that will be added to each `<pre class="">` wrapper tag for highlighted code blocks.

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  hljs: {
    classString: 'hljs relative mb-2',
  },
})
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `ignoreIllegals: boolean`

Passed directly to `hljs.highlight()`. [The docs](https://highlightjs.readthedocs.io/en/latest/api.html#highlight) say:

> when true forces highlighting to finish even in case of detecting illegal syntax for the language[...]

</td>
<td width="600px"><br>

```javascript
await render(mdString, {
  hljs: {
    ignoreIllegals: false,
  },
})
```

`ignoreIllegals: true` is the default, but can be set by the user.

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `languages: object`

Additional language syntaxes can be added from third party libraries.  
If needed, Highlight.js built-in languages can be disabled by setting their key to `false`.

</td>
<td width="600px"><br>

```javascript
import leanSyntax from 'highlightjs-lean'

await render(mdString, {
  hljs: {
    languages: {
      lean: leanSyntax, // add lean
      powershell: false, // disallow powershell
    },
  },
})
```

</td>
</tr>
</table>

<table>
<tr>
<td width="400px" valign="top">

### `plugins: object[]`

Highlight.js plugins can be passed to `arcdown`'s highlighter as an array of objects or class instances with functions keyed as hljs callbacks.

See [the hljs plugin docs](https://highlightjs.readthedocs.io/en/latest/plugin-api.html) for more info.

</td>
<td width="600px"><br>

```javascript
class CodeFlipper {
  constructor(options) {
    this.token = options.token
  }

  'after:highlight'(result) {
    result.value = result.value
      .split(this.token)
      .reverse()
      .join(this.token)
  }
}

await render(mdString, {
  hljs: {
    plugins: [new HljsLineWrapper({ token: '\n' })],
  },
})
```

</td>
</tr>
</table>

# Development & Contributing

A couple plugins have been forked and/or vendored locally to this package. This has been done to increase performance and render speed.

We are not married to any single component package or even to the core rendering engine, so long as the resulting features are maintained. Suggestions and PRs welcome 🙏

## Todo

- [x] additional testing
- [x] type defs -- can be expanded
- [x] benchmarks (try against remark)
- [x] look for hljs perf increases
- [ ] web component enhancements 😏
