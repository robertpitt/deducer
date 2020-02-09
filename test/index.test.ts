import { deduce } from '../src'

/**
 * Dummy test
 */
describe('Deducer', () => {
  it('Should always return an object', () => {
    expect(deduce([], [])).toMatchObject({})
    expect(deduce({}, [])).toMatchObject({})
  })

  describe('Object > Object', () => {
    it('destination should be default to the source location if not present', () => {
      expect(
        deduce({ one: 'one', two: 'two' }, [
          { source: 'one' },
          { source: 'two', destination: 'renamed' }
        ])
      ).toMatchObject({ one: 'one', renamed: 'two' })
    })

    it('Should be able to perform a simple key/value switch', () => {
      expect(
        deduce({ one: 'one', two: 'two' }, [
          { source: 'one', destination: 'two' },
          { source: 'two', destination: 'one' }
        ])
      ).toMatchObject({ two: 'one', one: 'two' })
    })

    it('Should be able to perform mutations on the value via a pipeline', () => {
      expect(
        deduce({ one: 'one', two: 'two' }, [
          { source: 'one', destination: 'two', reducers: [ (v: string) => v.toUpperCase() ] },
          { source: 'two', destination: 'one', reducers: [ (v: string) => v.toUpperCase() ] }
        ])
      ).toMatchObject({ two: 'ONE', one: 'TWO' })
    })

    it('Should be able to use nested objects', () => {
      expect(
        deduce({ a: { a: 'c' }, b: { b: 'c' } }, [
          { source: 'a.a', destination: 'a.b' },
          { source: 'b.b', destination: 'b.a' }
        ])
      ).toMatchObject({ a: { b: 'c' }, b: { a: 'c' } })
    })

    it('Should be able Pick multiple values into the transformer', () => {
      expect(
        deduce({ a: 1, b: 1 }, [
          { source: ['a', 'b'], destination: 'result', reducers: [([a, b]: [number, number]) => a + b, (sum: number) => sum * 2]},
        ])
      ).toMatchObject({ result: 4 })

      expect(
        deduce({ date: '2020-01-01', time: '00:00:00' }, [
          {
            source: ['date', 'time'],
            destination: 'dateTime',
            reducers: [ ([date, time]: [string, string]) => new Date(date + `T` + time + `.000Z`).toISOString() ]
          }
        ])
      ).toMatchObject({ dateTime: '2020-01-01T00:00:00.000Z' })
    })
  })

  describe('Array > Object', () => {
    it('Should accept an empty array as input without any transforms.', () => {
      expect(deduce([], [])).toBeTruthy()
    })

    it('Should trasnform Array into Object', () => {
      expect(deduce([], [])).toMatchObject({})
    })

    it('Should be able to pick root values', () => {
      expect(
        deduce(
          ['val1', 'val2'],
          [
            { source: 0, destination: 'val1' },
            { source: 1, destination: 'val2' }
          ]
        )
      ).toMatchObject({ val1: 'val1', val2: 'val2' })
    })

    it('Should be able to pick nested values', () => {
      expect(
        deduce(
          [[[['some value']]], [[['some other value']]]],
          [
            { source: '0.0.0.0', destination: 'val1' },
            { source: '1.0.0.0', destination: 'val2' }
          ]
        )
      ).toMatchObject({ val1: 'some value', val2: 'some other value' })
    })
  })

  describe('Examples', () => {
    it('should fully convert an array into a strucuture object with nested properties', () => {
      // Helper for test
      const trim = (s: any) => (typeof s === 'string' ? s.trim() : s)
      const toUpper = (s: any) => (typeof s === 'string' ? s.toUpperCase() : s)
      const toDate = ([d, t]: [string, string]) => {
        return new Date(2018, 1, 1, 0, 0, 0)
      }

      // Input
      const input = [
        'N',
        'PRD001',
        'ABCDE',
        'JONES   ',
        'MR  ',
        'J',
        '  1',
        '07:08',
        '13/05/2018',
        '001',
        'CONFIRMED  ',
        '  7.97 ',
        '10.99',
        '16/05/2018',
        '18:00',
        ' ABc123   ',
        'QI',
        'BLuE      ',
        'VOLkSwAGeN',
        'TIhuaN SE ',
        '  ',
        '01234567890',
        '01234567890',
        '07/00',
        '',
        '     ',
        'u2192     ',
        '-                   ',
        '              ',
        'Ax246 ',
        '',
        'Y',
        ''
      ]

      // Transform
      const result = deduce(input, [
        { source: 1, destination: 'booking.products', reducers: [ trim, toUpper ] },
        { source: 2, destination: 'booking.reference', reducers: [ trim, toUpper ] },
        { source: 6, destination: 'booking.noPassengers', reducers: [Number] },
        { source: [8, 7], destination: 'booking.startDateTime', reducers: [ toDate ] },
        { source: [13, 14], destination: 'booking.endDateTime', reducers: [ toDate ] },
        { source: 10, destination: 'booking.statusCode', reducers: [ trim, toUpper ] },
        { source: 11, destination: 'booking.priceExclTax', reducers: [ trim, Number] },
        { source: 12, destination: 'booking.price', reducers: [ trim, Number ] },
        { source: 3, destination: 'customer.surname', reducers: [ trim, toUpper ] },
        { source: 4, destination: 'customer.title', reducers: [ trim, toUpper ] },
        { source: 5, destination: 'customer.initial', reducers: [ trim, toUpper ] },
        { source: 15, destination: 'customer.vehicle.model', reducers: [ trim, toUpper ] },
        { source: 16, destination: 'customer.vehicle.registration', reducers: [ trim, toUpper ] },
        { source: 17, destination: 'customer.vehicle.color', reducers: [ trim, toUpper ] },
        { source: 18, destination: 'customer.vehicle.make', reducers: [ trim, toUpper ] },
        { source: 21, destination: 'customer.contact.primary', reducers: [ trim] },
        { source: 22, destination: 'customer.contact.secondary', reducers: [ trim] },
        { source: 26, destination: 'flight.inboundCode', reducers: [ trim, toUpper ] },
        { source: 29, destination: 'flight.outboundCode', reducers: [ trim, toUpper] }
      ])

      //Ouput
      expect(result).toMatchObject({
        booking: {
          products: 'PRD001',
          reference: 'ABCDE',
          noPassengers: 1,
          startDateTime: new Date('2018-02-01T00:00:00.000Z'),
          endDateTime: new Date('2018-02-01T00:00:00.000Z'),
          statusCode: 'CONFIRMED',
          priceExclTax: 7.97,
          price: 10.99
        },
        customer: {
          surname: 'JONES',
          title: 'MR',
          initial: 'J',
          vehicle: {
            model: 'ABC123',
            registration: 'QI',
            color: 'BLUE',
            make: 'VOLKSWAGEN'
          },
          contact: {
            primary: '01234567890',
            secondary: '01234567890'
          }
        },
        flight: {
          inboundCode: 'U2192',
          outboundCode: 'AX246'
        }
      })
    })
  })
})
