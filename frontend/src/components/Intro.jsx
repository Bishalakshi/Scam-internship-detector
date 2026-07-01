export default function Intro({ companyName, setCompanyName, onStart, loading, error }) {
  return (
    <div className="max-w-md w-full mx-auto text-center">
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-amber mb-4">
        OfferCheck · Risk Diagnostic
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-paper leading-tight">
        Before you pay for that
        <br />
        certificate, check first.
      </h1>
      <p className="font-body text-slate mt-4 text-[15px] leading-relaxed">
        Answer 11 quick questions about your internship offer. We'll score it
        against known scam patterns — no-interview hiring, pay-for-certificate
        schemes, and more — and tell you exactly what to watch for.
      </p>

      <div className="mt-8 text-left">
        <label className="block font-mono text-xs uppercase tracking-wider text-slate mb-2">
          Company name (optional)
        </label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. Brightwave Technologies"
          className="w-full bg-paper text-ink font-body px-4 py-3 rounded-md border border-papermute focus:outline-none focus:ring-2 focus:ring-amber placeholder:text-slate/70"
        />
        <p className="font-body text-xs text-slate mt-2">
          If provided, your anonymized score helps other freshers checking the same company.
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm font-body text-alert">{error}</p>
      )}

      <button
        onClick={onStart}
        disabled={loading}
        className="mt-8 w-full bg-amber hover:bg-amber/90 disabled:opacity-60 text-ink font-display font-semibold tracking-wide text-sm uppercase py-4 rounded-md transition-colors"
      >
        {loading ? "Loading questions…" : "Start the check"}
      </button>
    </div>
  );
}