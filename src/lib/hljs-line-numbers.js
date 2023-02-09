export default class HljsLineWrapper {

  constructor(options) {
    this.className = options.className
  }

  'after:highlight'(result) {

    // check to see if result is cached.. 
    //console.log('result from hijs plugin', result)
    //console.log(Object.keys(result))

    const tokens = []

    const safelyTagged = result.value.replace(
      /(<span [^>]+>)|(<\/span>)|(\n)/,
      (match) => {
        // console.log('got match', match)
        if (match === '\n') {
          return `${'</span>'.repeat(tokens.length)}\n${tokens.join('')}`
        }

        if (match === '</span>') {
          tokens.pop()
        } else {
          tokens.push(match)
        }

        return match
      }
    )

    // console.log('safelyTagged', safelyTagged.split('\n'))

    result.value = safelyTagged
      .split('\n')
      .reduce((result, line, index, lines) => {
        const lastLine = index + 1 === lines.length
        if (!(lastLine && line.length === 0)) {
          result.push(
            `<span class="${this.className || 'hljs-line'}">${line}</span>`
          )
        }
        return result
      }, []).join('\n')
  }
}
