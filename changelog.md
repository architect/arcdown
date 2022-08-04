# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Fixed
- hljs plugin application in long running processes
- handle codefence language specifiers with trailing spaces

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
