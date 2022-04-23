// this file isn't necessarily executed
// it is used to exercise the types and checked with dtslint

import { readFileSync } from 'fs';
import render, {
  defaultPlugins,
  slugify,
  DefaultPlugins,
  RenderResult,
  RendererOptions
} from 'arc-render-md';
import MarkdownIt from 'markdown-it';
// import markdownItAttrs from 'markdown-it-attrs' // no valid types
// import markdownItEmoji from 'markdown-it-emoji' // no valid types

// stubs
const markdownItAttrs = (md: MarkdownIt) => md;
const markdownItEmoji = (md: MarkdownIt) => md;

const title = 'Hello World';
const slug: string = slugify(title);

const defaultPluginsCopy: DefaultPlugins = { ...defaultPlugins };

async function test() {
  const options: RendererOptions = {
    hljs: {
      classString: 'hljs mb0 mb1-lg relative',
      languages: [
        'typescript',
        { lean: 'highlightjs-lean' },
        { powershell: false },
      ],
      ignoreIllegals: false,
    },
    markdownIt: { linkify: false },
    pluginOverrides: {
      markdownItTocAndAnchor: { tocClassName: 'pageToC' },
      markdownItClass: {
        h2: [ 'title' ],
        p: [ 'prose' ],
      },
      markdownItExternalAnchor: false,
    },
    plugins: {
      markdownItAttrs,
      mdMoji: [
        markdownItEmoji,
        { shortcuts: { laughing: ':D' } },
      ],
    },
  };

  const file = readFileSync('./test.md', 'utf8');

  const extendedResult: RenderResult = await render(file, options);
  const { html, tocHtml, slug, title, foo } = extendedResult;

  foo?.bar;
}

test();
