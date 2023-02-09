import tap from 'tap'
import { Arcdown } from '../src/index.js'
import Num from '../src/lib/hljs-line-numbers.js'

const ad = new Arcdown({
  hljs: {
    plugins: [new Num({ className: 'code-line' })],
  }
})

tap.test('arcdown is pure', async (t) => {
  const md = "# Code \nis fun\n\n```javascript\nlet one = 2\n```"
  const one = await ad.render(md)
  const two = await ad.render(md)
  t.ok(one.html === two.html, 'same input creates same output')
  console.log(one.html)
  t.end()
})

  /*
tap.test('double render results in same output', async (t) => {
  const md = `
## Code things
${FENCE}javascript
let one = 2
${FENCE}
`
  const options = {hljs: {}}
  const renderer = new Arcdown(options)
  const one = await renderer.render(md)
  const two = await renderer.render(md)
  t.ok(one.html === two.html, 'highlight.js is working')
  t.end()
})*/
