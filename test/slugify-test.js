import test from 'tape'
import { slugify } from '../src/index.js'

test('slugify', (t) => {
  t.equal(slugify('Test-Doc'), 'test-doc', 'uppercase')
  t.equal(slugify('Test Doc'), 'test-doc', 'space')
  t.equal(slugify('Test & Doc'), 'test-%26-doc', 'ampersand')
  t.equal(slugify('@TestDoc'), '%40testdoc', 'at')
  t.end()
})
