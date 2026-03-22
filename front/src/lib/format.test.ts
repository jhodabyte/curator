import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats with es-CO locale (dot thousands separator)", () => {
    expect(formatPrice(2500000)).toBe("$2.500.000");
  });

  it("formats smaller amounts", () => {
    expect(formatPrice(5000)).toBe("$5.000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0");
  });

  it("formats without decimals for integer amounts", () => {
    expect(formatPrice(10000)).toBe("$10.000");
  });
});
