import test from 'tape';
import MarkdownIt from 'markdown-it';
import { Arcdown } from '../src/index.js';
import { Highlighter } from '../src/lib/Highlighter.js';

const FENCE = '```';

test.skip('custom renderer with defaults', async (t) => {
  const OUTPUT = 'Not the droids you are looking for';
  const file = /* md */ `
---
title: Hello world
---
## Hello, World
lorem ipsum dolor sit amet
`.trim();

  const myRenderer = { render: () => OUTPUT };
  const options = { renderer: myRenderer };
  const renderer = new Arcdown(options);
  const { html, tocHtml, title, slug } = await renderer.render(file);

  t.equal(html, OUTPUT, 'render function is used');
  t.notOk(tocHtml, 'tocHtml is not generated');
  t.ok(title && slug, 'frontmatter is parsed and returned');

  t.end();
});

test('custom markdown-it renderer + highlighter with default config', async (t) => {
  const CLASS = 'sjlh';
  const file = /* md */ `
---
title: Hello world
---
## Hello, World

https://arc.codes

${FENCE}javascript
async function () {
  console.log('Hello, world')
}
${FENCE}

${FENCE}ruby
def handler
  puts 'Hello, world'
end
${FENCE}
`.trim();

  const foundLanguages = new Set();
  foundLanguages.add('ruby');
  const myHighlighter = new Highlighter({ classString: CLASS });
  const myRenderer = new MarkdownIt({
    highlight: await myHighlighter.createHighlightFn(foundLanguages),
  });
  const options = { renderer: myRenderer };
  const renderer = new Arcdown(options);
  const { html, slug, title, tocHtml } = await renderer.render(file);

  t.ok(html.indexOf('href="https://arc.codes"') === -1, 'linkify is disabled');
  t.ok(
    html.indexOf(`<pre class="${CLASS}"><code data-language="ruby">`) >= 0,
    'highlight is enaCLASSvided languages',
  );
  t.ok(
    html.indexOf(`<pre class="${CLASS} hljs-unregistered"><code data-language="javascript">`) >= 0,
    'unprovided languCLASS highlighted',
  );
  t.ok(title && slug, 'frontmatter is parsed and returned');
  t.ok(typeof tocHtml === 'string', 'ToC is a string of HTML');

  t.end();
});
