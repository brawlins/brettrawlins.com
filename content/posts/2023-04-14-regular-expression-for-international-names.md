---
title:  "Regular expression for international names"
date:   2023-04-14
tags:
    - regex
---

Today I learned something new about regular expressions. Credit goes to [Matt Montgomery](https://github.com/mattmontgomery) for sharing this with me!

## Problem:

I was using a regular expression to validate some form data by pattern matching the name fields. It looked something like this:

```
/^[A-Za-z\s\-.']+$/
```

This allows for letters and basic punctuation that you might find in a name (space, hyphen, period, apostrophe). So it could handle names like "A.J. O'Reilley", or "Catherine Zeta-Jones".

However, as Matt pointed out, it did not account for diacritics. Those are the funny marks that you sometimes see added to a letter that change its pronunciation or emphasis (like the "ï" in "naïve"). English doesn't use these marks, but they are not uncommon in names from other languages, like "Pérez" or "Schröder".

So how do you handle all the possibilities without having a very long and complex regular expression?

## Solution:

The answer was surprisingly simple. The regular expression he offered looks like this:

```
/^[\p{Letter}\s\-.']+$/u
```

I'd never seen `\p{Letter}` or the `u` modifier before. The `\p{Letter}` part is called a [Unicode property escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Unicode_property_escapes). It's similar to a character class, but it tells the regex to include any Unicode character with the _given property_ that _matches the given value_. In this case, `\p{Letter}` is a shorthand for `\p{General_Category=Letter}`, which essentially says "match any character that is classified as a letter". A Unicode property escape must also be used with the `u` modifier, which tells your regex to match characters based on their [Unicode properties](https://www.unicode.org/reports/tr44/#Properties).

This new regex can handle names with diacritics like these:

- Jörg Müller
- François Côté
- Lucía Muñoz
- Søren Kjærgaard

You can even use characters from non-Latin alphabets like Greek or Cyrillic:

- Ιωάννης (Ioannis)
- Σόφια (Sofia)
- Даша (Dasha)
- Олексій (Oleksii)

So, if you ever need to "internationalize" a regular expression to match letters from other languages, `\p{Letter}` should do the job nicely!
