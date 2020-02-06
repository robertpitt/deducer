import { transform, ElementMap } from "../src"
import { upper, lower } from "../src/utilities";

/**
 * Dummy test
 */
describe("Transformer Test", () => {

  describe('Object > Object transformation', () => {
    it("Should be able to perform a simple key/value switch", () => {
      expect(
        transform({ one: 'one', two: 'two' }, [
          ['one', 'two'],
          ['two', 'one']
        ])
      ).toMatchObject({ two: 'one', one: 'two' })
    })
  
    it("Should be able to perform mutations on the value via a pipeline", () => {
      expect(
        transform({ one: 'one', two: 'two' }, [
            ['one', 'two', upper],
            ['two', 'one', upper]
          ])
        ).toMatchObject({ two: 'ONE', one: 'TWO' })
    })
  
    it("Should be able to perform multiple mutations on the value via a pipeline", () => {
      expect(
        transform({ one: 'one', two: 'two' }, [
          ['one', 'two', upper, lower],
          ['two', 'one', upper, lower]
        ])
      ).toMatchObject({ two: 'one', one: 'two' })
    })
  
    it("Should be able to use nested objects", () => {
      expect(
        transform({ a: { a: 'c' }, b: { b: 'c' } }, [
          ['a.a', 'a.b', upper, lower],
          ['b.b', 'b.a', upper, lower]
        ])
      ).toMatchObject({ a: { b: 'c' }, b: { a: 'c' } })
    })
  })

  describe('Array > Object transformation', () => {
    it('Should accept an array as input.', () => {
      expect(transform([], [])).toBeTruthy()
    })

    it('Should trasnform Array into Object', () => {
      expect(transform([], [])).toMatchObject({})
    })

    it('Should be able to pick root values', () => {
      expect(transform(['val1', 'val2'], [
        [0, 'val1'],
        [1, 'val2'],
      ])).toMatchObject({ val1: 'val1', val2: 'val2'})
    })


    it('Should be able to pick nested values', () => {
      expect(
        transform([ [[['some value']]], [[['some other value']]] ], [
        ['0.0.0.0', 'val1'],
        ['1.0.0.0', 'val2'],
      ])).toMatchObject({ val1: 'some value', val2: 'some other value'})
    })
  });

  describe('Data Wranglers', () => {

  })
})