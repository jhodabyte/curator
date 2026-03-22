import { render, screen } from "@testing-library/react";
import { CardBrandMark } from "./card-brand-mark";

describe("CardBrandMark", () => {
  it("renders Visa label", () => {
    render(<CardBrandMark brand="VISA" />);
    expect(screen.getByLabelText("Visa")).toBeInTheDocument();
  });

  it("renders Mastercard label", () => {
    render(<CardBrandMark brand="MASTERCARD" />);
    expect(screen.getByLabelText("Mastercard")).toBeInTheDocument();
  });

  it("renders Amex label", () => {
    render(<CardBrandMark brand="AMEX" />);
    expect(screen.getByLabelText("American Express")).toBeInTheDocument();
  });

  it("renders fallback text", () => {
    render(<CardBrandMark brand={null} />);
    expect(screen.getByText("CARD")).toBeInTheDocument();
  });
});
