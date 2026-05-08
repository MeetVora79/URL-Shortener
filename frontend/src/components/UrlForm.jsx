import { useState } from "react";
import api from "../services/api";
import ResultCard from "./ResultCard";

function UrlForm() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");

    if (!url.trim()) {
      return setError("Please enter a URL.");
    }
    try {
      setLoading(true);
      const response = await api.post("/url/shorten", { originalUrl: url });
      setShortUrl(response.data.shortUrl);
      setUrl("");
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl shadow-lg"
      >
        <p className="text-white text-3xl text-center font-semibold mb-3">
          Paste the URL to be shortened
        </p>
        <div className="flex flex-col gap-5 p-4">
          <input
            className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 outline-none text-white focus:border-blue-500 transition-all"
            type="text"
            placeholder="Enter Your URL Here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></input>
          <button
            type="submit"
            className="bg-[#293e89] hover:bg-[#1e327b] transition-all p-3 rounded-lg font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </div>

        {error && <p className="text-red-400 mt-4 pl-5">{error}</p>}
      </form>
      {shortUrl && <ResultCard shortUrl={shortUrl} />}
    </>
  );
}

export default UrlForm;
