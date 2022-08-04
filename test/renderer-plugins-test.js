import test from "tape";
import render from "../src/index.js";

test("renderer plugin overrides", async (t) => {
	const TOC_CLASS = "pageToC";
	const file = /* md */ `
## Deploy to AWS

[AWS](https://aws.amazon.com/) is a cloud computing platform that makes it easy to build, deploy, and manage applications and services.
`.trim();

	const options = {
		pluginOverrides: {
			markdownItTocAndAnchor: { tocClassName: TOC_CLASS },
			markdownItClass: {
				h2: ["title"],
				p: ["prose"],
			},
			markdownItExternalAnchor: false,
		},
	};

	const { html, tocHtml } = await render(file, options);

	t.ok(tocHtml.indexOf(`class="${TOC_CLASS}`) >= 0, "ToC class is present");
	t.ok(
		html.indexOf('target="_blank">AWS</a>') < 0,
		"External link targets = blank",
	);
	t.ok(html.indexOf('<h2 class="title"') >= 0, "h2.title");
	t.ok(html.indexOf('<p class="prose"') >= 0, "p.prose");

	t.end();
});
