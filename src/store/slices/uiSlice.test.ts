import { describe, it, expect } from "vitest";
import reducer, {
  openBillingModal,
  closeBillingModal,
  setBillingOpen,
} from "./uiSlice";

describe("uiSlice", () => {
  it("should return the initial state", () => {
    const state = reducer(undefined, { type: "unknown" });
    expect(state.isBillingOpen).toBe(false);
  });

  it("should open billing modal", () => {
    const state = reducer(undefined, openBillingModal());
    expect(state.isBillingOpen).toBe(true);
  });

  it("should close billing modal", () => {
    let state = reducer(undefined, openBillingModal());
    state = reducer(state, closeBillingModal());
    expect(state.isBillingOpen).toBe(false);
  });

  it("should set billing open to a specific value", () => {
    const state = reducer(undefined, setBillingOpen(true));
    expect(state.isBillingOpen).toBe(true);
    const state2 = reducer(state, setBillingOpen(false));
    expect(state2.isBillingOpen).toBe(false);
  });
});
