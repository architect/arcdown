/// <reference types="node" />

import MarkdownIt = require("markdown-it/lib");

// TODO: types for each default plugin config
export interface DefaultPlugins {
	markdownItClass?: object | boolean;
	markdownItExternalAnchor?: object | boolean;
	markdownItTocAndAnchor?: object | boolean;
}

export interface HljsOptions {
	classString?: string;
	ignoreIllegals?: boolean;
	languages?: object;
	plugins?: object[];
}

export interface RendererOptions {
	markdownIt?: object;
	hljs?: HljsOptions;
	pluginOverrides?: DefaultPlugins;
	plugins?: object;
	renderer?: MarkdownIt;
}

export const defaultPlugins: DefaultPlugins;

export function slugify(s: string): string;

export function createHighlight(
	options: object,
	foundLanguages: string[] | null,
): Promise<(code: any, language: any) => string>;

export interface RenderResult {
	html: string;
	tocHtml: string;
	title?: string;
	slug?: string;
	frontmatter?: Record<string, any>;
}

export default function render(
	mdFile: Buffer | string,
	rendererOptions?: RendererOptions,
): Promise<RenderResult>;
