import test from 'tape'
import render from '../src/index.js'

test('renderer baseline with frontmatter', async (t) => {
  const TITLE = 'Test Doc'
  const TITLE_SLUG = 'test-doc'
  const CATEGORY = 'Testing'
  const DESCRIPTION = 'Make sure we get Markdown'
  const LINK = 'https://arc.codes'
  const file = /* md */`
---
title: ${TITLE}
category: ${CATEGORY}
description: ${DESCRIPTION}
---

> Architect is a simple tool to build and deliver powerful functional web apps and APIs

Visit ${LINK} for more info.

## Deploy to AWS

[AWS](https://aws.amazon.com/) is a cloud computing platform that makes it easy to build, deploy, and manage applications and services.

### $ubsection 2.1?

## Section 3

lorem ipsum dolor sit amet
`.trim()

  const {
    category,
    description,
    html,
    tocHtml,
    slug,
    title,
  } = await render(file)

  t.equal(title, TITLE, 'title attribute is present')
  t.equal(category, CATEGORY, 'category attribute is present')
  t.equal(description, DESCRIPTION, 'description attribute is present')
  t.equal(slug, TITLE_SLUG, 'slug attribute is generated')
  t.ok(typeof tocHtml === 'string', 'ToC is a string of HTML')
  t.ok(typeof html === 'string', 'html is a string of HTML')
  t.ok(html.indexOf('id="deploy-to-aws"') >= 0, 'Headings are linkified')
  t.ok(html.indexOf('id="%24ubsection-2.1%3F"') >= 0, 'Complex headings are linkified')
  t.ok(html.indexOf(`>${LINK}</a`) >= 0, 'link linkified')
  t.ok(html.indexOf('target="_blank">AWS</a>') >= 0, 'External link targets = blank')

  t.end()
})

test('renderer without frontmatter', async (t) => {
  const file = /* md */`
## Hello, World
lorem ipsum dolor sit amet
`.trim()
  const expected = '<h2 id="hello%2C-world">Hello, World</h2>\n<p>lorem ipsum dolor sit amet</p>\n'

  const { html, title, slug } = await render(file)

  t.equal(html, expected, 'just plain markdown')
  t.notOk(title, 'title is not present')
  t.notOk(slug, 'slug is not present')

  t.end()
})

test('renderer markdown-it options', async (t) => {
  const LINK = 'https://arc.codes'
  const file = /* md */`
> Architect is a simple tool to build and deliver powerful functional web apps and APIs

Visit ${LINK} for more info.
`.trim()

  const options = { markdownIt: { linkify: false } }

  const { html } = await render(file, options)

  t.ok(html.indexOf(LINK) >= 0, 'link is present')
  t.ok(html.indexOf(`>${LINK}</a`) < 0, 'anchor tag is not present')

  t.end()
})

test('renderer plugin overrides', async (t) => {
  const TOC_CLASS = 'pageToC'
  const file = /* md */`
## Deploy to AWS

[AWS](https://aws.amazon.com/) is a cloud computing platform that makes it easy to build, deploy, and manage applications and services.
`.trim()

  const options = {
    pluginOverrides: {
      markdownItTocAndAnchor: { tocClassName: TOC_CLASS },
      markdownItClass: {
        h2: [ 'title' ],
        p: [ 'prose' ],
      },
      markdownItExternalAnchor: false,
    },
  }

  const {
    html,
    tocHtml,
  } = await render(file, options)

  t.ok(tocHtml.indexOf(`class="${TOC_CLASS}`) >= 0, 'ToC class is present')
  t.ok(html.indexOf('target="_blank">AWS</a>') < 0, 'External link targets = blank')
  t.ok(html.indexOf('<h2 class="title"') >= 0, 'h2.title')
  t.ok(html.indexOf('<p class="prose"') >= 0, 'p.prose')

  t.end()
})

test('renderer custom slug', async (t) => {
  const TITLE = 'Test Doc'
  const CUSTOM_SLUG = 'custom-slug'
  const file = /* md */`
---
title: ${TITLE}
slug: ${CUSTOM_SLUG}
---
## Hello, World
lorem ipsum dolor sit amet
`.trim()

  const { title, slug } = await render(file)

  t.equal(title, TITLE, 'title attribute is present')
  t.equal(slug, CUSTOM_SLUG, 'slug is customized')

  t.end()
})
