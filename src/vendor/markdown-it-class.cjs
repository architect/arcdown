// Copyright 2018 Hiroshi Okada
// https://github.com/HiroshiOkada/markdown-it-class/blob/19ab6f12ef78af7df15795ec4eb30c39e8653ea5/index.js

let mapping = {};

const splitWithSpace = (s) => (s ? s.split(' ') : []);

const toArray = (a) => (Array.isArray(a) ? a : [a]);

function parseTokens(tokens) {
  tokens.forEach((token) => {
    if ((mapping[token.tag] && /(_open$|image)/.test(token.type)) || token.type === 'hr') {
      const orig = splitWithSpace(token.attrGet('class'));
      const addition = toArray(mapping[token.tag]);
      token.attrSet('class', [...orig, ...addition].join(' '));
    }
    if (token.children) {
      parseTokens(token.children);
    }
  });
}

function parseState(state) {
  parseTokens(state.tokens);
}

function markdownitTagToClass(md, _mapping) {
  mapping = _mapping || {};
  md.core.ruler.push('markdownit-tag-to-class', parseState);
}

module.exports = markdownitTagToClass;
