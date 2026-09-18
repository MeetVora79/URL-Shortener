import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Url from "../models/url.model.js";
import { shortenUrl, redirectUrl } from "./url.controller.js";

let mongoServer;

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn().mockReturnValue(res);
  return res;
}

beforeAll(async () => {
  process.env.BASE_URL = "http://localhost:5000";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Url.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
describe("shortenUrl", () => {
  it("rejects a request with no orginal url", async () => {
    const req = { body: {} };
    const res = createMockRes();

    await shortenUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "URL is required" }),
    );
  });

  it("rejects the invalid url format", async () => {
    const req = { body: { originalUrl: "not-a-valid-url" } };
    const res = createMockRes();

    await shortenUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "Invalid URL" }),
    );
  });

  it("creates and saves a new short URL", async () => {
    const req = { body: { originalUrl: "https://example.com/very/long/path" } };
    const res = createMockRes();

    await shortenUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(201);

    // To prove it actually hit the database and save short url, not just returned a nice-looking response
    const saved = await Url.findOne({
      originalUrl: "https://example.com/very/long/path",
    });
    expect(saved).not.toBeNull();
    expect(saved.shortCode).toHaveLength(8);
  });

  it("returns the exisiting short URL instead of creating a duplicate", async () => {
    const originalUrl = "https://example.com/already-shortened";
    await Url.create({ originalUrl, shortCode: "abc12345" });

    const req = { body: { originalUrl } };
    const res = createMockRes();

    await shortenUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(200); // 200, not 201 — reused, not created
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ shortUrl: "http://localhost:5000/abc12345" }),
    );

    const count = await Url.countDocuments({ originalUrl });
    expect(count).toBe(1);
  });
});

describe("redirectUrl", () => {
  it("returns 404 for an unknown short code", async () => {
    const req = { params: { shortCode: "doesnotexist" } };
    const res = createMockRes();

    await redirectUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: "URL not found" }),
    );
  });

  it("redirects to the original URL and increments the click count", async () => {
    const doc = await Url.create({
      originalUrl: "https://example.com/track-me",
      shortCode: "xyz98765",
      clicks: 0,
    });

    const req = { params: { shortCode: "xyz98765" } };
    const res = createMockRes();

    await redirectUrl(req, res);

    expect(res.redirect).toHaveBeenCalledWith("https://example.com/track-me");

    const updated = await Url.findById(doc._id);
    expect(updated.clicks).toBe(1);
  });
});
