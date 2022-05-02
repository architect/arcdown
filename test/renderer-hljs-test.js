import test from 'tape'
import render from '../src/index.js'

test('renderer hljs options', async (t) => {
  const HLJS_CLASS = 'hljs'
  const file = /* md */`
## Code things

\`\`\`arc
# Architect isn't in hljs but it is in arcdown
\`\`\`

\`\`\`javascript
// JavaScript things just work
\`\`\`

\`\`\`html
<!-- HTML things are XML things -->
\`\`\`

\`\`\`perl
# perl is built into hljs but should be unregistered
\`\`\`

\`\`\`
plain text
\`\`\`

\`\`\`cobol
* COBOL things aren't in hljs or arcdown or provided by the user
\`\`\`
`.trim()
  const options = {
    hljs: {
      classString: HLJS_CLASS,
      languages: { perl: false },
      // TODO: test a custom syntax
    },
  }

  const { html } = await render(file, options)
  console.log(html)

  t.ok(html.indexOf(`<pre class="${HLJS_CLASS}`) >= 0, 'highlight.js is working')
  t.ok(html.indexOf('<pre class="hljs"><code data-language="arc">') >= 0, 'arc syntax is added and registered')
  t.ok(html.indexOf('<pre class="hljs"><code data-language="javascript">') >= 0, 'js syntax is hljs-builtin')
  t.ok(html.indexOf('<pre class="hljs"><code data-language="html">') >= 0, 'html is registered via xml')
  t.ok(html.indexOf('<pre class="hljs hljs-unregistered"><code data-language="perl">') >= 0, 'hljs-builtin syntax unregistered')
  t.ok(html.indexOf('<pre class="hljs hljs-unregistered"><code data-language="">') >= 0, 'hljs-builtin syntax unregistered but no language specified')
  t.ok(html.indexOf('<pre class="hljs hljs-unregistered"><code data-language="cobol">') >= 0, 'unsupported hljs lang is still rendered without error')

  t.end()
})
