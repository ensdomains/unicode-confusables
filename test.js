const { isConfusing, confusables, rectifyConfusion } = require('.')
const assert = require('assert')

const CONFUSING = {
  'vita‍lik': [
    { point: 'v' },
    { point: 'i' },
    { point: 't' },
    { point: 'a‍', similarTo: 'a' },
    { point: 'l' },
    { point: 'i' },
    { point: 'k' }
  ],
  '⌐◨‐◨.eth': [
    { point: '⌐' },
    { point: '◨' },
    { point: '‐', similarTo: '-' },
    { point: '◨' },
    { point: '.' },
    { point: 'e' },
    { point: 't' },
    { point: 'h' }
  ],
  'ǉeto': [
    { point: 'ǉ', similarTo: 'lj' },
    { point: 'e' },
    { point: 't' },
    { point: 'o' }
  ],
  'pаypаl': [
    { point: 'p' },
    { point: 'а', similarTo: 'a' },
    { point: 'y' },
    { point: 'p' },
    { point: 'а', similarTo: 'a' },
    { point: 'l' }
  ],
  'ѕсоре': [
    { point: 'ѕ', similarTo: 's' },
    { point: 'с', similarTo: 'c' },
    { point: 'о', similarTo: 'o' },
    { point: 'р', similarTo: 'p' },
    { point: 'е', similarTo: 'e' }
  ],
  'fоо': [
    { point: 'f' },
    { point: 'о', similarTo: 'o' },
    { point: 'о', similarTo: 'o' }
  ],
  'faceboоk.eth': [
    { point: 'f' },
    { point: 'a' },
    { point: 'c' },
    { point: 'e' },
    { point: 'b' },
    { point: 'o' },
    { point: 'о', similarTo: 'o' },
    { point: 'k' },
    { point: '.' },
    { point: 'e' },
    { point: 't' },
    { point: 'h' }
  ],
  '半角カナ': [ // half width
    { point: '半' },
    { point: '角' },
    { point: 'カ', similarTo: '力' },
    { point: 'ナ' }
  ],
  'ジャバスクリプト': [ // full width
    { point: 'ジ' },
    { point: 'ャ' },
    { point: 'バ' },
    { point: 'ス' },
    { point: 'ク' },
    { point: 'リ' },
    { point: 'プ' },
    { point: 'ト', similarTo: '卜' }
  ],
  'a.eth⁄b.eth': [
    { point: 'a' },
    { point: '.' },
    { point: 'e' },
    { point: 't' },
    { point: 'h' },
    { point: '⁄', similarTo: '/' },
    { point: 'b' },
    { point: '.' },
    { point: 'e' },
    { point: 't' },
    { point: 'h' }
  ]
}

const NOT_CONFUSING = [
  'vitalik',
  '👻', // ghost emoji
  '日本刀',
  '🧛🏾‍♂',
  '𓃵𓃵𓃵.eth',
  '🧛🏾‍♂🧛🏾‍♂🧛🏾‍♂.eth'
]

describe('isConfusing', () => {

  it('classifies confusable', () => {
    Object.keys(CONFUSING).forEach((string) => {
      assert(isConfusing(string), string)
    })
  })

  it('doesn\'t classify non confusable', () => {
    NOT_CONFUSING.forEach((string) => {
      assert.equal(isConfusing(string), false, string)
    })
  })

})

describe('confusables', () => {

  it('classifies confusable', () => {
    Object.keys(CONFUSING).forEach((string) => {
      assert.deepEqual(confusables(string), CONFUSING[string], string)
    })
  })

  it('doesn\'t classify non confusable', () => {
    NOT_CONFUSING.forEach((string) => {
      confusables(string).forEach((point) => {
        assert.equal(point.similarTo, null, string)
      })
    })
  })

})

describe('rectifyConfusion', () => {
  it('can convert confusable to non confusable', () => {
    assert.equal(rectifyConfusion('vita‍lik'), 'vitalik')
    assert.equal(rectifyConfusion('ǉeto'), 'ljeto')
    assert.equal(rectifyConfusion('pаypаl'), 'paypal')
    assert.equal(rectifyConfusion('ѕсоре'), 'scope')
    assert.equal(rectifyConfusion('fоо'), 'foo')
    assert.equal(rectifyConfusion('半角カナ'), '半角力ナ')
    assert.equal(rectifyConfusion('ジャバスクリプト'), 'ジャバスクリプ卜')
    assert.equal(rectifyConfusion('a.eth⁄b.eth'), 'a.eth/b.eth')
  })

  it('doesn\'t convert non confusable', () => {
    NOT_CONFUSING.forEach((string) => assert.equal(rectifyConfusion(string), string))
  })
})
