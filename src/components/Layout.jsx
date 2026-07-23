import Sidebar from "./Sidebar";

export default function Layout({ title, eyebrow, children }) {
  return (
    <div className="flex min-h-screen bg-[#F4F6F9]">
      <Sidebar />
      <main className="flex-1 px-8 py-7 max-w-[1400px]">
        <header className="mb-7">
          {eyebrow && (
            <p className="font-mono text-xs tracking-widest text-gold-600 uppercase mb-1">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-2xl font-bold text-navy-800">{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
}
