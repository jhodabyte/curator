import reducer, {
  setBillingInfo,
  setCardInfo,
  type BillingInfo,
  type CardInfo,
} from "./checkoutSlice";

describe("checkoutSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.billingInfo.fullName).toBe("Julian Casablancas");
    expect(state.billingInfo.street).toBe("");
    expect(state.cardInfo.brand).toBe("");
    expect(state.cardInfo.last4).toBe("");
  });

  it("should set billing info", () => {
    const billing: BillingInfo = {
      fullName: "John Doe",
      street: "Calle 123",
      city: "Bogotá",
      postalCode: "110111",
    };
    const state = reducer(undefined, setBillingInfo(billing));
    expect(state.billingInfo).toEqual(billing);
  });

  it("should set card info", () => {
    const card: CardInfo = {
      cardholderName: "John Doe",
      brand: "VISA",
      last4: "4242",
      expMonth: "12",
      expYear: "2028",
    };
    const state = reducer(undefined, setCardInfo(card));
    expect(state.cardInfo).toEqual(card);
  });

  it("should not affect other state when setting billing", () => {
    const card: CardInfo = {
      cardholderName: "Jane",
      brand: "MASTERCARD",
      last4: "1234",
      expMonth: "06",
      expYear: "2027",
    };
    let state = reducer(undefined, setCardInfo(card));
    const billing: BillingInfo = {
      fullName: "Jane Doe",
      street: "Av 456",
      city: "Medellín",
      postalCode: "050001",
    };
    state = reducer(state, setBillingInfo(billing));
    expect(state.cardInfo).toEqual(card);
    expect(state.billingInfo).toEqual(billing);
  });
});
