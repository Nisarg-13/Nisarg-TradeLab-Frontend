import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";

describe("Home page", () => {
  it("renders the application title and tagline", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Nisarg's TradeLab" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Track. Analyze. Improve.")).toBeInTheDocument();
  });
});
