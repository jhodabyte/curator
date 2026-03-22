export const detectCardBrand = (cardNumber: string) => {
  const normalizedCardNumber = cardNumber.replace(/\s+/g, "");
  if (/^3[47]\d{0,13}$/.test(normalizedCardNumber)) {
    return "AMEX";
  }
  if (/^4\d{0,15}$/.test(normalizedCardNumber)) {
    return "VISA";
  }
  if (
    /^(5[1-5]\d{0,14}|2(2[2-9]|[3-6]\d|7[01]|720)\d{0,12})$/.test(
      normalizedCardNumber,
    )
  ) {
    return "MASTERCARD";
  }
  return "";
};

export const formatCardNumberInput = (digitsOnly: string) => {
  if (/^3[47]/.test(digitsOnly.slice(0, 2))) {
    const amexDigits = digitsOnly.slice(0, 15);
    const amexFirstBlock = amexDigits.slice(0, 4);
    const amexMiddleBlock = amexDigits.slice(4, 10);
    const amexLastBlock = amexDigits.slice(10, 15);
    return [amexFirstBlock, amexMiddleBlock, amexLastBlock]
      .filter(Boolean)
      .join(" ");
  }
  const standardCardDigits = digitsOnly.slice(0, 16);
  return standardCardDigits.replace(/(\d{4})(?=\d)/g, "$1 ");
};

export const getMaxCardDigits = (digitsOnly: string) => {
  if (/^3[47]/.test(digitsOnly.slice(0, 2))) {
    return 15;
  }
  return 16;
};
