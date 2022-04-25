/// <reference types="node" />

// TODO: types for each default plugin config
export interface DefaultPlugins {
  markdownItClass?: object | false;
  markdownItExternalAnchor?: object | false;
  markdownItTocAndAnchor?: object | false;
}

export interface RendererOptions {
  markdownIt?: object;
  hljs?: object;
  pluginOverrides?: DefaultPlugins;
  plugins?: object;
}

export const defaultPlugins: DefaultPlugins;

export function slugify(s: string): string;

export interface RenderResult {
  html: string;
  tocHtml: string;
  title?: string;
  slug?: string;
}

export interface RenderResult {
  [prop: string]: any;
}

export default function render(
  mdFile: Buffer | string,
  rendererOptions?: RendererOptions
): Promise<RenderResult>;
