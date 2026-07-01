import RiskGauge from "./RiskGauge";

export default function Results({ result, onRestart }) {
  const { risk_score, risk_bucket, triggered_flags, summary } = result;

  return (
    <div className="max-w-md w-full mx-auto text-center">
      <p className="font-mono text-xs tracking-[0.25em] uppercase text-amber mb-4">
        Diagnostic Result
      </p>

      <RiskGauge score={risk_score} bucket={risk_bucket} />

      <p className="font-body text-[15px] text-paper/90 leading-relaxed mt-6">
        {summary}
      </p>

      {triggered_flags.length > 0 && (
        <div className="mt-8 text-left">
          <p className="font-mono text-xs uppercase tracking-wider text-slate mb-3">
            Flagged signals ({triggered_flags.length})
          </p>
          <div className="flex flex-col gap-2.5">
            {triggered_flags.map((flag) => (
              <div
                key={flag.id}
                className="bg-paper/[0.06] border border-papermute/15 rounded-md px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-body text-sm text-paper leading-snug">
                    {flag.question}
                  </p>
                  <span className="font-mono text-xs text-amber shrink-0 mt-0.5">
                    +{flag.weight}
                  </span>
                </div>
                <p className="font-body text-xs text-slate mt-1.5 leading-relaxed">
                  {flag.advice}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onRestart}
        className="mt-8 w-full bg-transparent border border-slate/40 hover:border-amber text-paper font-display font-semibold tracking-wide text-sm uppercase py-4 rounded-md transition-colors"
      >
        Check another offer
      </button>
    </div>
  );
}