/// <reference types="node" />

// import MarkdownIt from "markdown-it/lib";
import MarkdownIt = require("markdown-it/lib");

// TODO: types for each default plugin config
export interface DefaultPlugins {
	markdownItClass?: object | boolean;
	markdownItExternalAnchor?: object | boolean;
	markdownItAnchor?: object | boolean;
	markdownItToc?: object | boolean;
}

export interface HljsOptions {
	classString?: string;
	ignoreIllegals?: boolean;
	languages?: object;
	sublanguages?: object;
	plugins?: object[];
}

export interface RendererOptions {
	markdownIt?: object;
	hljs?: HljsOptions;
	pluginOverrides?: DefaultPlugins;
	plugins?: object;
	renderer?: MarkdownIt;
}

export interface RenderResult {
	html: string;
	tocHtml: string;
	title?: string;
	slug?: string;
	frontmatter?: Record<string, unknown>;
}

export class Arcdown {
	constructor(options: RendererOptions);
	static slugify(s: string): string;
	static findLanguages(mdContent: string): Set<string>;
	render(mdFile: Buffer | string): Promise<RenderResult>;
}
