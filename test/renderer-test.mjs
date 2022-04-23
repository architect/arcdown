import test from 'tape'
import render from '../index.mjs'

const TITLE = 'Test Doc'
const TITLE_SLUG = 'test-doc'
const CATEGORY = 'Testing'
const DESCRIPTION = 'Make sure we get Markdown'
const HLJS_CLASS = 'hljs'
const TOC_CLASS = 'pageToC'
const file = /* md */`
---
title: ${TITLE}
category: ${CATEGORY}
description: ${DESCRIPTION}
---

> Architect is a simple tool to build and deliver powerful cloud function-based web apps and APIs

## Create a new project

\`\`\`arc
@app

@http
get /
\`\`\`

## Deploy to AWS

[AWS is great](https://aws.amazon.com/)

### $ubsection 2.1?

## Section 3
`.trim()

test('custom Markdown renderer', async (t) => {
  const options = {
    hljs: {
      classString: HLJS_CLASS,
    },
    pluginOverrides: {
      markdownItTocAndAnchor: { tocClassName: TOC_CLASS },
    },
  }
  const result = await render(file, options)

  const {
    category,
    description,
    html,
    tocHtml,
    slug,
    title,
  } = result

  t.equal(title, TITLE, 'title attribute is present')
  t.equal(category, CATEGORY, 'category attribute is present')
  t.equal(description, DESCRIPTION, 'description attribute is present')
  t.equal(slug, TITLE_SLUG, 'slug attribute is generated')
  t.ok(typeof tocHtml === 'string', 'ToC is a string of HTML')
  t.ok(tocHtml.indexOf(`class="${TOC_CLASS}`) > 0, 'ToC class is present')
  t.ok(typeof html === 'string', 'html is a string of HTML')
  t.ok(html.indexOf('id="create-a-new-project"') > 0, 'Headings are linkified')
  t.ok(html.indexOf('id="%24ubsection-2.1%3F"') > 0, 'Complex headings are linkified')
  t.ok(html.indexOf('target="_blank">AWS is great</a>') > 0, 'External link targets = blank')
  t.ok(html.indexOf(`<pre class="${HLJS_CLASS}`) > 0, 'highlight.js is working')

  t.end()
})
