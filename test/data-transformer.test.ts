import { transform, ElementMap } from '../src'
import { pipe } from '../src/utilities'

/**
 * Dummy test
 */
describe('Transformer', () => {
  describe('Object Input', () => {
    it('Should be able to perform a simple key/value switch', () => {
      expect(
        transform({ one: 'one', two: 'two' }, [
          ['one', 'two'],
          ['two', 'one']
        ])
      ).toMatchObject({ two: 'one', one: 'two' })
    })

    it('Should be able to perform mutations on the value via a pipeline', () => {
      expect(
        transform({ one: 'one', two: 'two' }, [
          ['one', 'two', (v: string) => v.toUpperCase()],
          ['two', 'one', (v: string) => v.toUpperCase()]
        ])
      ).toMatchObject({ two: 'ONE', one: 'TWO' })
    })

    it('Should be able to use nested objects', () => {
      expect(
        transform({ a: { a: 'c' }, b: { b: 'c' } }, [
          ['a.a', 'a.b'],
          ['b.b', 'b.a']
        ])
      ).toMatchObject({ a: { b: 'c' }, b: { a: 'c' } })
    })

    it('Should be able Pick multiple values into the transformer', () => {
      expect(
        transform({ a: 1, b: 1 }, [
          [['a', 'b'], 'result', ([a, b]: [number, number]) => a + b, (sum: number) => sum * 2]
        ])
      ).toMatchObject({ result: 4 })

      expect(
        transform({ date: '2020-01-01', time: '00:00:00' }, [
          [
            ['date', 'time'],
            'dateTime',
            ([date, time]: [string, string]) => new Date(date + `T` + time + `.000Z`).toISOString()
          ]
        ])
      ).toMatchObject({ dateTime: '2020-01-01T00:00:00.000Z' })
    })
  })

  describe('Array Input', () => {
    it('Should accept an empty array as input.', () => {
      expect(transform([], [])).toBeTruthy()
    })

    it('Should trasnform Array into Object', () => {
      expect(transform([], [])).toMatchObject({})
    })

    it('Should be able to pick root values', () => {
      expect(
        transform(
          ['val1', 'val2'],
          [
            [0, 'val1'],
            [1, 'val2']
          ]
        )
      ).toMatchObject({ val1: 'val1', val2: 'val2' })
    })

    it('Should be able to pick nested values', () => {
      expect(
        transform(
          [[[['some value']]], [[['some other value']]]],
          [
            ['0.0.0.0', 'val1'],
            ['1.0.0.0', 'val2']
          ]
        )
      ).toMatchObject({ val1: 'some value', val2: 'some other value' })
    })
  })

  describe('Mutations', () => {
    it('should be able to pipe many functions against a value', () => {})
  })
})
