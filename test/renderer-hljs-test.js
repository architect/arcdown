import test from "tape";
import render from "../src/index.js";

const FENCE = "```";

test("renderer hljs options", async (t) => {
	const CLASS_STRING = "hljs my-special-class";
	const file = /* md */ `
## Code things

${FENCE}arc
# Architect isn't in hljs but it is in arcdown
${FENCE}

${FENCE}javascript
// JavaScript things just work
${FENCE}

${FENCE}html
<!-- HTML things are XML things -->
${FENCE}

${FENCE}perl
# perl is built into hljs but should be unregistered
${FENCE}

${FENCE}
plain text
${FENCE}

${FENCE}foobar
* "foobar" isn't in hljs or arcdown or provided by the user
${FENCE}
`.trim();

	const options = {
		hljs: {
			classString: CLASS_STRING,
			languages: { perl: false },
		},
	};

	const { html } = await render(file, options);

	t.ok(
		html.indexOf(`<pre class="${CLASS_STRING}`) >= 0,
		"highlight.js is working",
	);
	t.ok(
		html.indexOf(`<pre class="${CLASS_STRING}"><code data-language="arc">`) >= 0,
		"arc syntax is added and registered",
	);
	t.ok(
		html.indexOf(
			`<pre class="${CLASS_STRING}"><code data-language="javascript">`,
		) >= 0,
		"js syntax is hljs-builtin",
	);
	t.ok(
		html.indexOf(`<pre class="${CLASS_STRING}"><code data-language="html">`) >= 0,
		"html is registered via xml",
	);
	t.ok(
		html.indexOf(
			`<pre class="${CLASS_STRING} hljs-unregistered"><code data-language="perl">`,
		) >= 0,
		"hljs-builtin syntax unregistered",
	);
	t.ok(
		html.indexOf(
			`<pre class="${CLASS_STRING} hljs-unregistered"><code data-language="">`,
		) >= 0,
		"hljs-builtin syntax unregistered but no language specified",
	);
	t.ok(
		html.indexOf(
			`<pre class="${CLASS_STRING} hljs-unregistered"><code data-language="foobar">`,
		) >= 0,
		"unsupported hljs lang is still rendered without error",
	);

	t.end();
});
