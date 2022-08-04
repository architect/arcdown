import MarkdownIt from "markdown-it";
import markdownItExternalAnchor from "markdown-it-external-anchor";
import markdownItAnchor from "markdown-it-anchor";
import markdownItToc from "markdown-it-toc-done-right";
import matter from "gray-matter";

import markdownItClass from "./vendor/markdown-it-class.cjs";

import createHighlight from "./lib/highlight.js";
import findLanguages from "./lib/findLanguages.js";
import slugify from "./lib/slugify.js";

// ? maybe just extend MarkdownIt class
export class Renderer {
	static slugify = slugify;
	static findLanguages = findLanguages;

	#tocHtml = "";
	#defaultPlugins = {
		markdownItClass,
		markdownItExternalAnchor,
		markdownItAnchor: [
			markdownItAnchor,
			{
				slugify,
				tabIndex: false,
				callback(token, info) {
					console.log(token.markup, info.title);
				},
			},
		],
		markdownItToc: [
			markdownItToc,
			{
				slugify,
				listType: "ul",
				containerClass: "",
				containerId: "",
				listClass: "",
				itemClass: "",
				linkClass: "",
				callback: (html) => {
					this.#tocHtml = html;
				},
			},
		],
	};

	/**
   * @param {import('../types').RendererOptions} [options] - arcdown options
   */
	constructor(options = {}) {
		const {
			hljs = {},
			markdownIt = {},
			pluginOverrides = {},
			plugins = {},
			renderer = null,
		} = options;

		// don't apply classes if missing mapping
		if (!pluginOverrides.markdownItClass) {
			pluginOverrides.markdownItClass = false;
		}

		this.hljsOptions = hljs;
		this.mditOptions = markdownIt;
		this.mditPluginOverrides = pluginOverrides;
		this.mditAddedPlugins = plugins;
		this.customRenderer = renderer;

		this.#createRenderer();
	}

	#createRenderer() {
		// create a mdit renderer
		const renderer =
			this.customRenderer || new MarkdownIt({
				linkify: true,
				html: true,
				typographer: true,
				...this.mditOptions,
			});

		if (typeof renderer.use === "function") {
			const allPlugins = { ...this.#defaultPlugins, ...this.mditAddedPlugins };
			for (const mdPlugin in allPlugins) {
				// skip disabled plugins
				if (
					(mdPlugin in this.mditPluginOverrides) && this.mditPluginOverrides[
						mdPlugin
					] === false
				) {
					continue;
				}

				const plugin = allPlugins[mdPlugin];
				let pluginFn = plugin;
				let pluginOptions = {};

				if (Array.isArray(plugin)) {
					[pluginFn, pluginOptions] = plugin;
				}

				renderer.use(pluginFn, {
					...pluginOptions,
					...this.mditPluginOverrides[mdPlugin],
				});
			}
		}

		this.renderer = renderer;
	}

	async render(mdContent) {
		if (!this.renderer?.render) {
			throw new Error("Renderer not ready");
		}

		const { content, data: frontmatter } = matter(mdContent);
		// find langs and then create highlighter and add it to renderer
		const foundLanguages = Renderer.findLanguages(content);
		const highlighter = await createHighlight(this.hljsOptions, foundLanguages);

		if (!this.customRenderer && typeof this.renderer.set === "function") {
			this.renderer.set({ highlight: highlighter });
		}

		const html = this.renderer.render(content);

		let { slug, title } = frontmatter;
		if (!slug && title) {
			slug = Renderer.slugify(title);
		}

		return {
			title,
			slug,
			frontmatter,
			html,
			tocHtml: this.#tocHtml, // janky
		};
	}
}
