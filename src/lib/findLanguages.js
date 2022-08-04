/**
  * @param {string} mdContent Markdown content with fenced code blocks
  * @returns {Set<string>} Set of language names used in fenced code blocks
  */
export default function findLanguages(mdContent) {
	const foundLangs = new Set();
	// TODO: handle trailing whitespace after language name
	const fenceR = /`{3,4}(?:(.*$))?[\s\S]*?`{3,4}/gm;
	let match;
	do {
		match = fenceR.exec(mdContent);
		if (match) {
			foundLangs.add(match[1]);
		}
	} while (match);

	return foundLangs;
}
