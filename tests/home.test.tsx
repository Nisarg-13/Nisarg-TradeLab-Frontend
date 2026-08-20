import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(async () => ({ userId: null })),
}));

vi.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
  SignUpButton: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/components/landing/landing-auth-buttons", () => ({
  LandingAuthButtons: () => (
    <div>
      <button type="button">Start Trading Journal</button>
      <button type="button">Sign In</button>
    </div>
  ),
  LandingDashboardLink: () => <a href="/dashboard">Open Dashboard</a>,
}));

import Home from "@/app/page";

describe("Home page", () => {
  it("renders landing hero and auth actions for visitors", async () => {
    const page = await Home();
    render(page);

    expect(
      screen.getByRole("heading", {
        name: /Turn Your Trading History Into Measurable Improvement/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Start Trading Journal" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("button", { name: "Sign In" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", {
        name: /Everything You Need to Review and Improve Your Trading/i,
      }),
    ).toBeInTheDocument();
  });
});
