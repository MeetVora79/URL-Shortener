import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import api from "../services/api";
import UrlForm from "./UrlForm";

// UrlForm imports `api` directly — no way to pass in a fake instance like
// we did with dependency injection on the backend. So instead, replace the
// whole module before UrlForm ever sees it.
vi.mock("../services/api", () => ({
  default: { post: vi.fn() },
}));

// ResultCard (rendered by UrlForm on success) calls react-hot-toast
// internally — mock it so tests don't depend on real toast rendering.
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

describe("UrlForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows an error when submitting an empty URL", async () => {
    const user = userEvent.setup();
    render(<UrlForm />);

    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    expect(screen.getByText("Please enter a URL.")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it("submit the url and display the shortened result", async () => {
    api.post.mockResolvedValueOnce({
      data: { success: true, shortUrl: "http://localhost:5000/abc12345" },
    });
    const user = userEvent.setup();
    render(<UrlForm />);

    const input = screen.getByPlaceholderText("Enter Your URL Here");

    await user.type(input, "https://example.com/very/long/path");
    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    expect(api.post).toHaveBeenCalledWith("/url/shorten", {
      originalUrl: "https://example.com/very/long/path",
    });

    await waitFor(() => {
      expect(
        screen.getByDisplayValue("http://localhost:5000/abc12345"),
      ).toBeInTheDocument();
    });
    expect(input.value).toBe("");
  });

  it("shows the server's error message when the API call fails", async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid URL" } },
    });

    const user = userEvent.setup();
    render(<UrlForm />);

    await user.type(
      screen.getByPlaceholderText("Enter Your URL Here"),
      "bad-url",
    );
    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid URL")).toBeInTheDocument();
    });
  });

  it("falls back to a generic message when the error has no server response", async () => {
    api.post.mockRejectedValueOnce(new Error("Network Error")); // no .response at all

    const user = userEvent.setup();
    render(<UrlForm />);

    await user.type(
      screen.getByPlaceholderText("Enter Your URL Here"),
      "https://example.com",
    );
    await user.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });
});
