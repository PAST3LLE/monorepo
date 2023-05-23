import { Address } from '@past3lle/types'

/**
 * @name formatCurrency
 * @param amount number amount to format e.g 1234
 * @param options @type { Intl.NumberFormat } - defaults to { currency: 'pt-PT' }
 * @returns
 */
export function formatCurrency(
  amount: number,
  options: Omit<Intl.NumberFormatOptions, 'style'> & { locales: string | string[]; currency: CurrencyCode } = {
    locales: 'pt-PT',
    currency: 'EUR'
  }
) {
  return new Intl.NumberFormat(options.locales, {
    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    ...options,
    style: 'currency'
  }).format(amount)
}

// use the function form of strict
const ROMAN_NUMERALS_LIST = [
  {
    numeral: 'M',
    value: 1000
  },
  {
    numeral: 'CM',
    value: 900
  },
  {
    numeral: 'D',
    value: 500
  },
  {
    numeral: 'CD',
    value: 400
  },
  {
    numeral: 'C',
    value: 100
  },
  {
    numeral: 'XC',
    value: 90
  },
  {
    numeral: 'L',
    value: 50
  },
  {
    numeral: 'XL',
    value: 40
  },
  {
    numeral: 'X',
    value: 10
  },
  {
    numeral: 'IX',
    value: 9
  },
  {
    numeral: 'V',
    value: 5
  },
  {
    numeral: 'IV',
    value: 4
  },
  {
    numeral: 'I',
    value: 1
  }
]
export function convertToRomanNumerals(num: number): string {
  let remainingValue = num
  let newRomanNumeral = ''

  for (let i = 0; i < 13; i++) {
    const j = Math.floor(remainingValue / ROMAN_NUMERALS_LIST[i].value) // j represents the number of times each character is needed
    while (remainingValue >= ROMAN_NUMERALS_LIST[i].value) {
      newRomanNumeral += ROMAN_NUMERALS_LIST[i].numeral.repeat(j) // Add 'x' Numerals to the string
      remainingValue -= ROMAN_NUMERALS_LIST[i].value * j // decrement the remaining value
    }
  }

  return newRomanNumeral
}

export type CurrencyCode =
  | 'AED'
  | 'AFN'
  | 'ALL'
  | 'AMD'
  | 'ANG'
  | 'AOA'
  | 'ARS'
  | 'AUD'
  | 'AWG'
  | 'AZN'
  | 'BAM'
  | 'BBD'
  | 'BDT'
  | 'BGN'
  | 'BHD'
  | 'BIF'
  | 'BMD'
  | 'BND'
  | 'BOB'
  | 'BRL'
  | 'BSD'
  | 'BTN'
  | 'BWP'
  | 'BYN'
  | 'BZD'
  | 'CAD'
  | 'CDF'
  | 'CHF'
  | 'CLP'
  | 'CNY'
  | 'COP'
  | 'CRC'
  | 'CUC'
  | 'CUP'
  | 'CVE'
  | 'CZK'
  | 'DJF'
  | 'DKK'
  | 'DOP'
  | 'DZD'
  | 'EGP'
  | 'ERN'
  | 'ETB'
  | 'EUR'
  | 'FJD'
  | 'FKP'
  | 'GBP'
  | 'GEL'
  | 'GHS'
  | 'GIP'
  | 'GMD'
  | 'GNF'
  | 'GTQ'
  | 'GYD'
  | 'HKD'
  | 'HNL'
  | 'HRK'
  | 'HTG'
  | 'HUF'
  | 'IDR'
  | 'ILS'
  | 'INR'
  | 'IQD'
  | 'IRR'
  | 'ISK'
  | 'JMD'
  | 'JOD'
  | 'JPY'
  | 'KES'
  | 'KGS'
  | 'KHR'
  | 'KMF'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KYD'
  | 'KZT'
  | 'LAK'
  | 'LBP'
  | 'LKR'
  | 'LRD'
  | 'LSL'
  | 'LYD'
  | 'MAD'
  | 'MDL'
  | 'MGA'
  | 'MKD'
  | 'MMK'
  | 'MNT'
  | 'MOP'
  | 'MRU'
  | 'MUR'
  | 'MVR'
  | 'MWK'
  | 'MXN'
  | 'MYR'
  | 'MZN'
  | 'NAD'
  | 'NGN'
  | 'NIO'
  | 'NOK'
  | 'NPR'
  | 'NZD'
  | 'OMR'
  | 'PAB'
  | 'PEN'
  | 'PGK'
  | 'PHP'
  | 'PKR'
  | 'PLN'
  | 'PYG'
  | 'QAR'
  | 'RON'
  | 'RSD'
  | 'RUB'
  | 'RWF'
  | 'SAR'
  | 'SBD'
  | 'SCR'
  | 'SDG'
  | 'SEK'
  | 'SGD'
  | 'SHP'
  | 'SLL'
  | 'SOS'
  | 'SRD'
  | 'SSP'
  | 'STN'
  | 'SVC'
  | 'SYP'
  | 'SZL'
  | 'THB'
  | 'TJS'
  | 'TMT'
  | 'TND'
  | 'TOP'
  | 'TRY'
  | 'TTD'
  | 'TWD'
  | 'TZS'
  | 'UAH'
  | 'UGX'
  | 'USD'
  | 'UYU'
  | 'UZS'
  | 'VES'
  | 'VND'
  | 'VUV'
  | 'WST'
  | 'XAF'
  | 'XCD'
  | 'XDR'
  | 'XOF'
  | 'XPF'
  | 'XSU'
  | 'YER'
  | 'ZAR'
  | 'ZMW'
  | 'ZWL'

export function truncateAddress(address: Address, opt?: { type: 'long' | 'short' }) {
  const options = opt || { type: 'short' }
  const numbers = options.type === 'short' ? [6, 38] : [10, 32]
  const firstPart = address.slice(0, numbers[0])
  const lastPart = address.slice(numbers[1])

  return firstPart + '...' + lastPart
}
