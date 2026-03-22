import { screen } from "@testing-library/react";
import NotFoundPage from "./NotFoundPage";
import { renderWithProviders } from "../test/test-utils";

describe("NotFoundPage", () => {
  it("renders 404 text", () => {
    renderWithProviders(<NotFoundPage />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page not found")).toBeInTheDocument();
  });
});
