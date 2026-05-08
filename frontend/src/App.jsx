import UrlForm from "./components/UrlForm";

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm">
            Fast • Clean • Simple
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Shorten Your URLs
            <span className="block text-blue-500">Instantly</span>
          </h1>
        </div>

        <UrlForm />
      </div>
    </main>
  );
}

export default App;
