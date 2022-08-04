import test from "tape";
import render from "../src/index.js";

const FENCE = "```";

test("renderer advanced hljs options and syntax", async (t) => {
	const MARCO = "POLO";
	const file = /* md */ `
## Advanced code things

${FENCE}ruby -1,14:42
// this should render without highlighting
${FENCE}

${FENCE}\`markdown

${FENCE}javascript
// this should render without highlighting
${FENCE}

${FENCE}\`
`.trim();

	const options = {
		hljs: {
			plugins: [
				{
					"after:highlight": (result) => {
						result.value = result.value + MARCO;
					},
				},
			],
			// TODO: test a custom syntax
		},
	};
	const { html } = await render(file, options);

	t.ok(
		html.indexOf(`<pre class="hljs"><code data-language="markdown">`) >= 0,
		"4-tick blocks get highlighted",
	);
	t.ok(
		html.indexOf(
			`
${FENCE}javascript
// this should render without highlighting
${FENCE}
      `.trim(),
		) >= 0,
		"do not highlight 3-tick fences inside 4-tick fences",
	);
	t.ok(html.indexOf(`${MARCO}</code`) >= 0, "hljs plugins are properly added");
});
