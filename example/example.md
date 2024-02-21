---
title: Example
category: Loremus Categorous
description: Ipsumi descriptionor.
---

## Defaults

lorem ipsum _dolor_ sit **amet**  
https://arc.codes <-- this won't be linkified because the `linkify` option was overridden.  
Here's a link, just in case: [Architect](https://arc.codes). It won't have `target="_blank"` because the "markdown-it-external-anchor" plugin is disabled.

Oh, look! "Smart quotes", because `typographer` is set to true by default.

## "Fenced" Code Blocks

### A highlight.js built-in language

TypeScript is included in in the hljs library and can be automatically registered by `arcdown`.

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

const point = { x: 12, y: 26 };
logPoint(point);
```

### User-provided custom syntax

[Lean](https://leanprover.github.io/) is rendered with a provided syntax definition:

```lean
universe u v

def f (α : Type u) (β : α → Type v) (a : α) (b : β a) : (a : α) × β a :=
  ⟨a, b⟩

def g (α : Type u) (β : α → Type v) (a : α) (b : β a) : Σ a : α, β a :=
  Sigma.mk a b

def h1 (x : Nat) : Nat :=
  (f Type (fun α => α) Nat x).2

#eval h1 5 -- 5

def h2 (x : Nat) : Nat :=
  (g Type (fun α => α) Nat x).2

#eval h2 5 -- 5
```

### Another custom syntax

[Razor](https://docs.microsoft.com/en-us/aspnet/core/mvc/views/razor) for ASP.NET Core

```cshtml-razor
@if (value % 2 == 0)
{
    <p>The value was even.</p>
}
else if (value >= 1337)
{
    <p>The value is large.</p>
}
else
{
    <p>The value is odd and small.</p>
}
```

### Unknown languages

#### Built into `arcdown`

```arc
@app
my-app

@http
get /foo
post /foo
```

#### Completely unknown

Foobar's definition isn't built into hljs and wasn't added by the user, so this block is printed as-is.

```foobar
IDENTIFICATION DIVISION.
PROGRAM-ID. HELLOWRD.

PROCEDURE DIVISION.
DISPLAY "HELLO WORLD".
STOP RUN.
```

### No language

```
This is a code fence without a language.
```

## User-provided plugins

### Block `attrs`

> Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. {.abe #Gettysburg}

Check out that added class and id attribute!

### emoji

:sparkles:

This emoji will be replaced with the manually added plugin. There's even a shortcut for "`:D`". It becomes :D as specified in the options.
