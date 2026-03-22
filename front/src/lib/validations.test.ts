import {
  detectCardBrand,
  formatCardNumberInput,
  getMaxCardDigits,
} from "./validations";

describe("detectCardBrand", () => {
  it("detects VISA cards starting with 4", () => {
    expect(detectCardBrand("4242424242424242")).toBe("VISA");
    expect(detectCardBrand("4111111111111111")).toBe("VISA");
  });

  it("detects MASTERCARD cards starting with 5[1-5]", () => {
    expect(detectCardBrand("5111111111111118")).toBe("MASTERCARD");
    expect(detectCardBrand("5500000000000004")).toBe("MASTERCARD");
  });

  it("detects partial MASTERCARD cards starting with 2xx range", () => {
    expect(detectCardBrand("522200000000")).toBe("MASTERCARD");
    expect(detectCardBrand("5300000000000000")).toBe("MASTERCARD");
  });

  it("detects AMEX cards starting with 3[47]", () => {
    expect(detectCardBrand("371449635398431")).toBe("AMEX");
    expect(detectCardBrand("340000000000009")).toBe("AMEX");
  });

  it("returns empty string for unknown brands", () => {
    expect(detectCardBrand("6011000000000004")).toBe("");
    expect(detectCardBrand("")).toBe("");
  });

  it("handles card numbers with spaces", () => {
    expect(detectCardBrand("4242 4242 4242 4242")).toBe("VISA");
  });
});

describe("formatCardNumberInput", () => {
  it("formats VISA/Mastercard as 4-4-4-4", () => {
    expect(formatCardNumberInput("4242424242424242")).toBe(
      "4242 4242 4242 4242",
    );
  });

  it("formats AMEX as 4-6-5", () => {
    expect(formatCardNumberInput("371449635398431")).toBe("3714 496353 98431");
  });

  it("handles partial numbers", () => {
    expect(formatCardNumberInput("4242")).toBe("4242");
    expect(formatCardNumberInput("42424242")).toBe("4242 4242");
  });

  it("handles empty input", () => {
    expect(formatCardNumberInput("")).toBe("");
  });
});

describe("getMaxCardDigits", () => {
  it("returns 15 for AMEX", () => {
    expect(getMaxCardDigits("37")).toBe(15);
    expect(getMaxCardDigits("34")).toBe(15);
  });

  it("returns 16 for other cards", () => {
    expect(getMaxCardDigits("42")).toBe(16);
    expect(getMaxCardDigits("51")).toBe(16);
    expect(getMaxCardDigits("")).toBe(16);
  });
});
