var hljs = require('highlight.js/lib/core')

// Shells
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
hljs.registerLanguage('powershell', require('highlight.js/lib/languages/powershell'))

// Languages
hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'))

// Formats
hljs.registerLanguage('arc', require('@architect/syntaxes/arc-hljs-grammar.js'))
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'))
hljs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))

hljs.HighlightJS = hljs
hljs.default = hljs
module.exports = hljs
