import tap from 'tap'
import { Arcdown } from '../src/index.js'

tap.test('renderer without frontmatter', async (t) => {
  const file = /* md */ `
## Hello, World
lorem ipsum dolor sit amet
`.trim()
  const expected = '<h2 id="hello%2C-world">Hello, World</h2>\n<p>lorem ipsum dolor sit amet</p>\n'

  const renderer = new Arcdown()
  const { html, title, slug } = await renderer.render(file)

  t.equal(html, expected, 'just plain markdown')
  t.notOk(title, 'title is not present')
  t.notOk(slug, 'slug is not present')

  t.end()
})

tap.test('renderer markdown-it options', async (t) => {
  const LINK = 'https://arc.codes'
  const file = /* md */ `
> Architect is a simple tool to build and deliver powerful functional web apps and APIs

Visit ${LINK} for more info.
`.trim()

  const options = { markdownIt: { linkify: false } }

  const renderer = new Arcdown(options)
  const { html } = await renderer.render(file)

  t.ok(html.indexOf(LINK) >= 0, 'link is present')
  t.ok(html.indexOf(`>${LINK}</a`) < 0, 'anchor tag is not present')

  t.end()
})

tap.test('renderer baseline with frontmatter', async (t) => {
  const TITLE = 'Test Doc'
  const TITLE_SLUG = 'test-doc'
  const CATEGORY = 'Testing'
  const DESCRIPTION = 'Make sure we get Markdown'
  const LINK = 'https://arc.codes'
  const file = /* md */ `
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

  const renderer = new Arcdown()
  const { frontmatter, html, tocHtml, slug, title } = await renderer.render(file)

  t.equal(title, TITLE, 'title attribute is present')
  t.equal(typeof frontmatter, 'object', 'frontmatter is an object')
  t.equal(frontmatter.title, TITLE, 'title attribute is present')
  t.equal(frontmatter.category, CATEGORY, 'category attribute is present')
  t.equal(frontmatter.description, DESCRIPTION, 'description attribute is present')
  t.equal(slug, TITLE_SLUG, 'slug attribute is generated')
  t.ok(typeof tocHtml === 'string', 'ToC is a string of HTML')
  t.ok(typeof html === 'string', 'html is a string of HTML')
  t.ok(html.indexOf('id="deploy-to-aws"') >= 0, 'Headings are linkified')
  t.ok(html.indexOf('id="%24ubsection-2.1%3F"') >= 0, 'Complex headings are linkified')
  t.ok(html.indexOf(`>${LINK}</a`) >= 0, 'link linkified')
  t.ok(html.indexOf('target="_blank">AWS</a>') >= 0, 'External link targets = blank')

  t.end()
})

tap.test('verbose frontmatter', async (t) => {
  const file = /* md */ `
---
title: "Using GitHub Actions with Architect"
author: 'Simon MacDonald'
tags:
  - foo
  - bar
category: [ci, cd]
image: post-assets/gh-actions.png
description: 'GitHub Actions is a "continuous integration" and continuous delivery (CI/CD) platform.'
---

## Mmmm... YAML...

`.trim()
  const expected = {
    title: 'Using GitHub Actions with Architect',
    author: 'Simon MacDonald',
    image: 'post-assets/gh-actions.png',
    tags: [ 'foo', 'bar' ],
    category: [ 'ci', 'cd' ],
    description:
      'GitHub Actions is a "continuous integration" and continuous delivery (CI/CD) platform.',
  }

  const renderer = new Arcdown()
  const { frontmatter, slug } = await renderer.render(file)

  t.same(frontmatter, expected, 'frontmatter is parsed correctly')
  t.equal(slug, 'using-github-actions-with-architect', 'slug is generated correctly')

  t.end()
})

tap.test('renderer custom slug', async (t) => {
  const TITLE = 'Test Doc'
  const CUSTOM_SLUG = 'custom-slug'
  const file = /* md */ `
---
title: ${TITLE}
slug: ${CUSTOM_SLUG}
---
## Hello, World
lorem ipsum dolor sit amet
`.trim()

  const renderer = new Arcdown()
  const { frontmatter, slug, title } = await renderer.render(file)

  t.equal(title, TITLE, 'title attribute is present')
  t.equal(slug, CUSTOM_SLUG, 'slug is customized')
  t.equal(frontmatter.slug, CUSTOM_SLUG, 'slug is also on frontmatter')

  t.end()
})
