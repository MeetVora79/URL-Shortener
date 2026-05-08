import toast from "react-hot-toast";

function ResultCard({ shortUrl }) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy");
    }
  };
  return (
    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 p-6 rounded-2xl mt-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 px-6">Short URL</h2>
      <div className="flex flex-col sm:flex-row gap-4 px-6">
        <input
          type="text"
          value={shortUrl}
          readOnly
          className="flex-1 p-3 rounded-lg bg-slate-700 outline-none text-white"
        />
        <button
          onClick={copyToClipboard}
          className="bg-[#293e89] hover:bg-[#1e327b] transition-all p-3 rounded-lg font-semibold cursor-pointer"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default ResultCard;
