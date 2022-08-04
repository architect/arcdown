// this file isn't necessarily executed
// it is used to exercise the types and checked with dtslint

import { readFileSync } from 'fs';
import { Arcdown, DefaultPlugins, HljsOptions, RenderResult, RendererOptions } from 'arcdown';
import MarkdownIt from 'markdown-it';

// stubs
const markdownItAttrs = (md: MarkdownIt) => md;
const markdownItEmoji = (md: MarkdownIt) => md;

const title = 'Hello World';
const slug: string = Arcdown.slugify(title);

const hljs: HljsOptions = {
  classString: 'hljs mb0 mb1-lg relative',
  languages: {
    lean: 'highlightjs-lean',
    powershell: false,
  },
  ignoreIllegals: false,
};

const pluginOverrides: DefaultPlugins = {
  markdownItAnchor: { tabIndex: 42 },
  markdownItToc: { containerClass: 'pageToC' },
  markdownItClass: {
    h2: ['title'],
    p: ['prose'],
  },
  markdownItExternalAnchor: false,
};

async function test() {
  const options: RendererOptions = {
    hljs,
    markdownIt: { linkify: false },
    pluginOverrides,
    plugins: {
      markdownItAttrs,
      mdMoji: [markdownItEmoji, { shortcuts: { laughing: ':D' } }],
    },
  };

  const file = readFileSync('./test.md', 'utf8');

  const renderer = new Arcdown(options);
  const result: RenderResult = await renderer.render(file);
  const { html, tocHtml, slug, title, frontmatter } = result;

  frontmatter?.foo === 'bar';

  const customRendererOptions = {
    renderer: new MarkdownIt(),
  };
  const customRenderer = new Arcdown(customRendererOptions);
  const customRendererResult: RenderResult = await customRenderer.render(file);
}

test();
