import test from "tape";
import MarkdownIt from "markdown-it";
import render, { createHighlight } from "../src/index.js";

const FENCE = "```";

test("custom renderer with defaults", async (t) => {
	const OUTPUT = "Not the droids you are looking for";
	const file = /* md */ `
---
title: Hello world
---
## Hello, World
lorem ipsum dolor sit amet
`.trim();

	const renderer = { render: () => OUTPUT };
	const { html, tocHtml, title, slug } = await render(file, { renderer });

	t.equal(html, OUTPUT, "render function is used");
	t.notOk(tocHtml, "tocHtml is not generated");
	t.ok(title && slug, "frontmatter is parsed and returned");

	t.end();
});

test("custom markdown-it renderer + highlighter with default config", async (
	t,
) => {
	const CLASS_STRING = "sjlh";
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
	foundLanguages.add("ruby");
	const renderer = new MarkdownIt({
		highlight: await createHighlight(
			{ classString: CLASS_STRING },
			foundLanguages,
		),
	});
	const { html, slug, title, tocHtml } = await render(file, { renderer });

	t.ok(html.indexOf('href="https://arc.codes"') === -1, "linkify is disabled");
	t.ok(
		html.indexOf(`<pre class="${CLASS_STRING}"><code data-language="ruby">`) >= 0,
		"highlight is enabled for provided languages",
	);
	t.ok(
		html.indexOf(
			`<pre class="${CLASS_STRING} hljs-unregistered"><code data-language="javascript">`,
		) >= 0,
		"not provided languages are not highlighted",
	);
	t.ok(title && slug, "frontmatter is parsed and returned");
	t.ok(typeof tocHtml === "string", "ToC is a string of HTML");

	t.end();
});
