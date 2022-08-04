/**
  * @param {string} mdContent Markdown content with fenced code blocks
  * @returns {Set<string>} Set of language names used in fenced code blocks
  */
export default function findLanguages (mdContent) {
  const foundLangs = new Set()
  const fenceR = /`{3,4}(?:(.*$))?[\s\S]*?`{3,4}/gm
  let match
  do {
    match = fenceR.exec(mdContent)
    if (match) {
      const matched = match[1]
      if (matched) {
        const langString = matched.split(' ')
        foundLangs.add(langString[0])
      }
    }
  } while (match)

  return foundLangs
}
