export const assertThaiId = (thaiId: string): boolean => {
  const m = thaiId.match(/(\d{12})(\d)/);

  if (!m) {
    console.warn('Bad input from user, invalid thaiId=', thaiId)
    throw new Error('thai-id-must-be-13-digits')
  }

  const digits = m[1].split('');
  const sum = digits.reduce((total: number, digit: string, i: number) => (total + (13 - i) * +digit), 0)
  const lastDigit = `${(11 - sum % 11) % 10}`
  const inputLastDigit = m[2]
  if (lastDigit !== inputLastDigit) {
    console.warn('Bad input from user, invalid checksum thaiId=', thaiId)
    // throw new Error('thai-id-checksum-mismatched')
    return false;
  }
  return true
}