import test from 'tape'
import { Arcdown } from '../src/index.js'

const FENCE = '```'

test('renderer advanced hljs options and syntax', async (t) => {
  const MARCO = 'POLO'
  const file = /* md */ `
## Advanced code things

${FENCE}ruby -1,14:42
// this should render without highlighting
${FENCE}

${FENCE}javascript
html\`
  <h1>Giddyup!</h1>
\`

css\`
  h1 {
    color: red;
  }
\`
${FENCE}

${FENCE}\`markdown

${FENCE}javascript
// this should render without highlighting
${FENCE}

${FENCE}\`
`.trim()

  const options = {
    hljs: {
      sublanguages: {
        javascript: [ 'xml', 'css' ],
      },
      plugins: [
        {
          'after:highlight': (result) => {
            result.value = result.value + MARCO
          },
        },
      ],
      // TODO: test a custom syntax
    },
  }
  const renderer = new Arcdown(options)
  const { html } = await renderer.render(file)

  t.ok(
    html.indexOf(`<pre class="hljs"><code data-language="markdown">`) >= 0,
    '4-tick blocks get highlighted',
  )
  t.ok(
    html.indexOf('html`<span class="language-xml">') >= 0,
    'html string template highlighted as xml'
  )
  t.ok(
    html.indexOf('css`<span class="language-css">') >= 0,
    'css string template highlighted as css'
  )
  t.ok(
    html.indexOf(
      `
${FENCE}javascript
// this should render without highlighting
${FENCE}
      `.trim(),
    ) >= 0,
    'do not highlight 3-tick fences inside 4-tick fences',
  )
  t.ok(html.indexOf(`${MARCO}</code`) >= 0, 'hljs plugins are properly added')
})
