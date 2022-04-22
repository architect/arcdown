---
title: Hello World
category: Loremus Categorous
description: Ipsumi descriptionor.
---

lorem ipsum _dolor_ sit **amet** https://arc.codes  
foo bar baz

```javascript
import { escape } from 'querystring'

export function slugify (s) {
  return escape(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/\(\)/g, ''))
}
```

## Foo Bar

```arc
# a custom language definition
@app
markdown-app

@http
get /docs/*
```

### Baz things

```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLOWRD.

PROCEDURE DIVISION.
DISPLAY "HELLO WORLD".
STOP RUN.
```

> Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.
