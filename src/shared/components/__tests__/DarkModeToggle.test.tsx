import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import DarkModeToggle from "../DarkModeToggle";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("DarkModeToggle", () => {
  it("renders the toggle button", () => {
    render(<DarkModeToggle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("toggles dark mode on click", async () => {
    const user = userEvent.setup();
    render(<DarkModeToggle />);
    const button = screen.getByRole("button");
    await user.click(button);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
  });
});
