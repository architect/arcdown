# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed
- each instance of Arcdown will use a new instance of `hljs`
  - this is more performant in single-execution cloud functions and was the intended design

### Changed
- upgrade dependencies
- replace tap (50MB+) with tape
- remove tsd and .d.ts in favor of JSDoc

## [2.1.1] 2023-03-26

### Changed
- upgraded dependencies
- swapped `dtslint` for `tsd` for type testing

## [2.1.0] 2022-08-19

### Added
- hljs options now accepts `sublaunguages` dictionary to register languages that may be used inside a parent grammar.

Example:

```js
{
  hljs: {
    sublanguages: {
      javascript: [ 'xml', 'css' ]
    }
  }
}
```

````
```javascript
html`
  <h1>Welcome</h1>
  <p>Hello, world</p>
`
css`
  h1 {
    color: red;
    margin-bottom: 2rem;
  }
`
```
````

hljs highlighting will be applied to the HTML (as "xml") and CSS strings.

## [2.0.0] 2022-08-03

Large-ish refactor to use a named `class` export.

```javascript
import { Arcdown } from 'arcdown'
```

### Added
- `Arcdown` class interface
- `markdownItAnchor` and `markdownItToc` *see "Changed" below

### Removed
- `default` function as render interface
- `markdown-it-toc-and-anchor` *see "Changed" below

### Changed
- class-based interfaces
- new table of contents plugin
  - `markdownItTocAndAnchor` retired
  - use `markdown-it-anchor` as `markdownItAnchor` for heading anchor creation
  - use `markdown-it-toc-done-right` as `markdownItToc` for table of contents
- lowercase `arcdown` changed to Arcdown

### Fixed
- hljs plugin application in subsequent render calls
  - caused by instantiating hljs options on each render, solved with class structures
- handle codefence language specifiers with trailing spaces and meta info
  - this correctly loads the `javascript` language for syntax highlighting:
````
```javascript 12:42;foo-bar 
````

## [1.0.1] 2022-07-22

### Changed
- readme formatting fix for npmjs.org

## [1.0.0] 2022-07-22

### Changed
- move hljs plugin config to `options.hljs.plugins`
- overhaul readme

## [0.6.0] 2022-07-21

### Added
- Pass hljs plugins through to built-in hljs highlighter.

---

## [0.5.0] 2022-07-15

### Added
- Support for 4-tick fence syntax highlighting with automatic language loading.

---

## [0.4.0] 2022-07-09

### Changed
- Swapped in `gray-matter` for `tiny-frontmatter` for improved YAML parsing of document front matter.

---

## [0.3.2] - 2022-05-16

### Added
- `arcdown`

---

Types of changes:
- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security
