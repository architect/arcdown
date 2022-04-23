---
title: Example
category: Loremus Categorous
description: Ipsumi descriptionor.
---

lorem ipsum _dolor_ sit **amet**  
https://arc.codes <-- this won't be linkified because the `linkify` option was overridden.  
Here's a link, just in case: [Architect](https://arc.codes). It should have `target="_blank"` because "markdown-it-external-anchor" is a default plugin.

Oh, look! "Smart quotes", because `typographer` is set to true by default.

## Code Blocks

### Some Jabbascript

```javascript
import { escape } from 'querystring'

export function slugify (s) {
  return escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))
}
```

### Custom syntax

Architect manifest files are rendered with a provided syntax definition:

```arc
@app
markdown-app

@http
get /docs/*
```

### Unknown languages

```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLOWRD.

PROCEDURE DIVISION.
DISPLAY "HELLO WORLD".
STOP RUN.
```

Cobol's definition wasn't added to this highlight.js instance, so this block is printed as-is.

## User-provided plugins

### Block `attrs`

> Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. {.abe #Gettysburg}

Check out that added class and id attribute!

### emoji

:sparkles:

This emoji will be replaced with the manually added plugin. There's even a shortcut for "`:D`". It becomes :D as specified in the options.
