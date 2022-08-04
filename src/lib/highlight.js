import hljs from "highlight.js/lib/core";
import Markdown from "markdown-it";
import arcSyntax from "@architect/syntaxes/arc-hljs-grammar.js";

const KNOWN_LANGUAGES = {
	arc: arcSyntax,
	html: "highlight.js/lib/languages/xml",
};

const escapeHtml = Markdown().utils.escapeHtml; // ? instantiation performance cost?

export default async function (
	{
		languages: providedLanguages = {},
		classString = "hljs",
		ignoreIllegals = true,
		plugins: hljsPlugins = [],
	} = {},
	foundLanguages = new Set(),
) {
	// const { default: hljs } = await import("highlight.js/lib/core");
	const languageDefinitions = new Set();
	const allLanguages = { ...KNOWN_LANGUAGES, ...providedLanguages };

	if (foundLanguages) {
		for (const langName of foundLanguages) {
			const isProvided = Object.keys(allLanguages).includes(langName);
			const excluded = isProvided && !allLanguages[langName];

			if (isProvided) {
				languageDefinitions.add({ [langName]: allLanguages[langName] });
			} else if (!excluded) {
				languageDefinitions.add(langName);
			}
		}
	}

	for (const langDef of languageDefinitions) {
		let languageName;
		let definitionFn;

		if (typeof langDef === "string") {
			languageName = langDef;
			try {
				definitionFn = (await import(`highlight.js/lib/languages/${langDef}`))
					.default;
			} catch (error) {
				console.info(`arcdown unable to import "${languageName}" from hljs`);
			}
		} else if (langDef?.constructor.name === "Object") {
			languageName = Object.keys(langDef)[0];

			if (typeof langDef[languageName] === "string") {
				try {
					definitionFn = (await import(langDef[languageName])).default;
				} catch (error) {
					console.info(
						`arcdown unable to import "${languageName}" from "${langDef[
							languageName
						]}"`,
					);
				}
			} else {
				definitionFn = langDef[languageName];
			}
		}

		if (languageName && definitionFn) {
			hljs.registerLanguage(languageName, definitionFn);
		}
	}

	for (const plugin of hljsPlugins) {
		console.log("ADDING A PLUGIN");
		hljs.addPlugin(plugin);
	}

	return function (code, language) {
		if (language && hljs.getLanguage(language)) {
			try {
				const highlighted = hljs.highlight(code, { ignoreIllegals, language });
				return `<pre class="${classString}"><code data-language="${language}">${highlighted.value}</code></pre>`;
			} catch (error) {
				return `<pre class="${classString} hljs-failed"><code data-language="${language}">${escapeHtml(
					code,
				)}</code></pre>`;
			}
		}

		return `<pre class="${classString} hljs-unregistered"><code data-language="${language}">${escapeHtml(
			code,
		)}</code></pre>`;
	};
}
