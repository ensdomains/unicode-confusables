# unicode-confusables
Utility for finding confusing unicode, sourced from [unicode UTS39](http://www.unicode.org/reports/tr39/)'s [confusables.txt](https://www.unicode.org/Public/security/10.0.0/confusables.txt).  
[Compound emojis](https://unicode.org/reports/tr51/#ZWJ_Display) are supported.


### Installation

```sh
$ npm install unicode-confusables
```

### Usage

```javascript

const { isConfusing, confusables, rectifyConfusion } = require('unicode-confusables')

// check if a string is confusing
> isConfusing('fоо')
true
> isConfusing('foo')
false

// check if a compound emoji is confusing
> isConfusing('🧛🏾‍♂')
false

// get the confusing parts of the string and their similarities
> confusables('fоо')
[
  { point: 'f' },
  { point: 'о', similarTo: 'o' },
  { point: 'о', similarTo: 'o' }
]

// apply the similar parts to the original string
> rectifyConfusion('fоо')
'foo'

// also finds hidden zero-width unicode
> isConfusing('vitalik')
true
> confusables('vitalik')
[
  { point: 'v' },
  { point: 'i' },
  { point: 't' },
  { point: 'a‍', similarTo: 'a' }, // zero-width unicode hidden in point (segment)
  { point: 'l' },
  { point: 'i' },
  { point: 'k' }
]

// even works with japanese!
> confusables('半角カナ')
[
  { point: '半' },
  { point: '角' },
  { point: 'カ', similarTo: '力' },
  { point: 'ナ' }
]

// It also thinks some parts of ascii confusing
> confusables('mI01')
[
  { point: 'm', similarTo: 'rn' },
  { point: 'I', similarTo: 'l' },
  { point: '0', similarTo: 'O' },
  { point: '1', similarTo: 'l' }
]
```

### Updating

Fetch and parse a fresh copy of confusables.txt

```sh
$ npm run build
```

### License

MIT
