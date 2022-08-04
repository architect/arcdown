import test from 'tape';
import { Arcdown } from '../src/index.js';

test('renderer plugin overrides', async (t) => {
  const TOC_CLASS = 'pageToC';
  const file = /* md */ `
## Deploy to AWS

[AWS](https://aws.amazon.com/) is a cloud computing platform that makes it easy to build, deploy, and manage applications and services.
`.trim();

  const options = {
    pluginOverrides: {
      markdownItAnchor: { tabIndex: 42 },
      markdownItToc: { containerClass: TOC_CLASS },
      markdownItClass: {
        h2: ['title'],
        p: ['prose'],
      },
      markdownItExternalAnchor: false,
    },
  };

  const renderer = new Arcdown(options);
  const { html, tocHtml } = await renderer.render(file);

  t.ok(tocHtml.indexOf(`class="${TOC_CLASS}`) >= 0, 'ToC class is present');
  t.ok(html.indexOf('target="_blank"') < 0, 'External link targets != blank');
  t.ok(html.indexOf('tabindex="42"') > 0, 'Heading anchor has tabindex');
  t.ok(html.indexOf('<h2 class="title"') >= 0, 'h2.title');
  t.ok(html.indexOf('<p class="prose"') >= 0, 'p.prose');

  t.end();
});
