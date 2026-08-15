import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: null })),
}));

vi.mock("@/components/auth/landing-auth-actions", () => ({
  LandingAuthActions: () => (
    <div>
      <button type="button">Sign in</button>
      <button type="button">Create account</button>
    </div>
  ),
}));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders sign-in actions for visitors", async () => {
    const page = await Home();
    render(page);

    expect(
      screen.getByRole("heading", { name: "Nisarg's TradeLab" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sign in with Google, Apple, or email/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });
});
