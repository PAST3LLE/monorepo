import { convertToRomanNumerals, formatCurrency } from '../formatting'

describe('Roman numerals', () => {
  test('Converts 1 to I', () => {
    const roman = convertToRomanNumerals(1)

    expect(roman).toEqual('I')
  })
  test('Converts 2 to II', () => {
    const roman = convertToRomanNumerals(2)

    expect(roman).toEqual('II')
  })
  test('Converts 3 to III', () => {
    const roman = convertToRomanNumerals(3)

    expect(roman).toEqual('III')
  })
  test('Converts 4 to IV', () => {
    const roman = convertToRomanNumerals(4)

    expect(roman).toEqual('IV')
  })
  test('Converts 5 to V', () => {
    const roman = convertToRomanNumerals(5)

    expect(roman).toEqual('V')
  })
  test('Converts 10 to X', () => {
    const roman = convertToRomanNumerals(10)

    expect(roman).toEqual('X')
  })
})

describe('Format currency', () => {
  test('No options: 10 to 10,00 €', () => {
    const currency = formatCurrency(10)

    expect(currency).toEqual('10,00 €')
  })

  test('Currency = USD & locale: en-US: 10 to $10.00', () => {
    const currency = formatCurrency(10, { locales: 'en-US', currency: 'USD' })

    expect(currency).toEqual('$10.00')
  })

  test('Currency = JPY & locale: jp-JP: 10 to ¥10', () => {
    const currency = formatCurrency(10, { locales: 'jp-JP', currency: 'JPY' })

    expect(currency).toEqual('¥10')
  })
})
