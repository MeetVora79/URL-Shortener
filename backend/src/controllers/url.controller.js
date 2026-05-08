import Url from "../models/url.model.js";
import validator from "validator";
import { nanoid } from "nanoid";

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate the input
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    // Validate the URL format
    const isValidUrl = validator.isURL(originalUrl, {
      require_protocol: true,
    });
    if (!isValidUrl) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }

    // Check if the URL already exists in the database
    const existingUrl = await Url.findOne({ originalUrl }); 
    if (existingUrl) {
      return res.status(200).json({ 
        success: true,
        shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
      });
    }

    // Generate a unique short code
    const shortCode = nanoid(8);

    // Saved the new URL in the database
    const newUrl = await Url.create({
      originalUrl,
      shortCode,
    });

    return res.status(201).json({
      success: true,
      shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
    });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the original URL based on the short code
    const url = await Url.findOne({ shortCode });
    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    // Increment the click count
    url.clicks += 1;

    await url.save();

    // Redirect to the original URL
    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting URL:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

