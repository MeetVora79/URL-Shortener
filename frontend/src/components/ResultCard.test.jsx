import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ResultCard from "./ResultCard";
import toast from "react-hot-toast";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("ResultCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  afterEach(() => {
    // Restores original globals (like navigator) after each test runs
    vi.unstubAllGlobals();
  });

  it("displays the short URL in a read-only input", () => {
    render(<ResultCard shortUrl="http://localhost:5000/abc12345" />);

    expect(
      screen.getByDisplayValue("http://localhost:5000/abc12345"),
    ).toHaveAttribute("readonly");
  });

  it("copies the short URL to clipboard and shows a success toast", async () => {
    const user = userEvent.setup();
    render(<ResultCard shortUrl="http://localhost:5000/abc12345" />);

    await user.click(screen.getByRole("button", { name: /copy/i }));

    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost:5000/abc12345");
    expect(toast.success).toHaveBeenCalledWith("Copied to clipboard!");
  });

  it("shows an error toast if the clipboard write fails", async () => {
    navigator.clipboard.writeText = vi
      .fn()
      .mockRejectedValue(new Error("Clipboard permission denied"));

    const user = userEvent.setup();
    render(<ResultCard shortUrl="http://localhost:5000/abc12345" />);

    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(toast.error).toHaveBeenCalledWith("Failed to copy");
  });
});
