import hljs from 'highlight.js/lib/core';
import { escapeHtml } from 'markdown-it/lib/common/utils.js';
import arcSyntax from '@architect/syntaxes/arc-hljs-grammar.js';

const KNOWN_LANGUAGES = {
  arc: arcSyntax,
  html: 'highlight.js/lib/languages/xml',
};

export class Highlighter {
  constructor(
    {
      classString = 'hljs',
      ignoreIllegals = true,
      languages: providedLanguages = {},
      plugins = [],
    } = {},
  ) {
    this.options = {
      classString,
      ignoreIllegals,
      providedLanguages,
    };

    this.hljs = hljs;

    for (const plugin of plugins) {
      this.hljs.addPlugin(plugin);
    }
  }

  async #registerLanguages() {
    const languageDefinitions = new Set();
    const allLanguages = { ...KNOWN_LANGUAGES, ...this.options.providedLanguages };

    if (this.foundLanguages) {
      for (const langName of this.foundLanguages) {
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

      if (typeof langDef === 'string') {
        languageName = langDef;
        try {
          definitionFn = (await import(`highlight.js/lib/languages/${langDef}`)).default;
        } catch (error) {
          console.info(`arcdown unable to import "${languageName}" from hljs`);
        }
      } else if (langDef?.constructor.name === 'Object') {
        languageName = Object.keys(langDef)[0];

        if (typeof langDef[languageName] === 'string') {
          try {
            definitionFn = (await import(langDef[languageName])).default;
          } catch (error) {
            console.info(
              `arcdown unable to import "${languageName}" from "${langDef[languageName]}"`,
            );
          }
        } else {
          definitionFn = langDef[languageName];
        }
      }

      if (languageName && definitionFn) {
        this.hljs.registerLanguage(languageName, definitionFn);
      }
    }
  }

  async createHighlightFn(foundLanguages = new Set()) {
    this.foundLanguages = foundLanguages;
    await this.#registerLanguages();

    return (code, language) => {
      const result = [];

      if (language && this.hljs?.getLanguage(language)) {
        try {
          const highlighted = this.hljs.highlight(code, {
            ignoreIllegals: this.options.ignoreIllegals,
            language,
          });

          result.push(
            `<pre class="${this.options.classString}">`,
            `<code data-language="${language}">${highlighted.value}</code>`,
          );
        } catch (error) {
          console.info(`Arcdown's Highlight.js unable to highlight ${language}`);

          result.push(
            `<pre class="${this.options.classString} hljs-failed">`,
            `<code data-language="${language}">${escapeHtml(code)}</code>`,
          );
        }
      } else {
        result.push(
          `<pre class="${this.options.classString} hljs-unregistered">`,
          `<code data-language="${language}">${escapeHtml(code)}</code>`,
        );
      }

      result.push('</pre>');
      return result.join('');
    };
  }
}
