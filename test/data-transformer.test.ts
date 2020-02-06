import { transform, ElementMap } from '../src'

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
      const result = transform(input, [
        [1, 'booking.products', trim, toUpper],
        [2, 'booking.reference', trim, toUpper],
        [6, 'booking.noPassengers', Number],
        [[8, 7], 'booking.startDateTime', toDate],
        [[13, 14], 'booking.endDateTime', toDate],
        [10, 'booking.statusCode', trim, toUpper],
        [11, 'booking.priceExclTax', trim, Number],
        [12, 'booking.price', trim, Number],
        [3, 'customer.surname', trim, toUpper],
        [4, 'customer.title', trim, toUpper],
        [5, 'customer.initial', trim, toUpper],
        [15, 'customer.vehicle.model', trim, toUpper],
        [16, 'customer.vehicle.registration', trim, toUpper],
        [17, 'customer.vehicle.color', trim, toUpper],
        [18, 'customer.vehicle.make', trim, toUpper],
        [21, 'customer.contact.primary', trim],
        [22, 'customer.contact.secondary', trim],
        [26, 'flight.inboundCode', trim, toUpper],
        [29, 'flight.outboundCode', trim, toUpper]
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
