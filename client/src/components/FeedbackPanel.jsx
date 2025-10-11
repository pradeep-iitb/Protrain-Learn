import React from 'react';

export default function FeedbackPanel({ feedback }) {
  if (!feedback) return null;
  const { empathy, tone, compliance, summary, suggestions = [] } = feedback;
  return (
    <div className="p-4 bg-white rounded border space-y-2">
      <h3 className="font-bold">Feedback</h3>
      <div className="grid grid-cols-3 gap-3">
        <Metric label="Empathy" value={empathy} />
        <Metric label="Tone" value={tone} />
        <Metric label="Compliance" value={compliance} />
      </div>
      <p className="text-sm text-slate-700">{summary}</p>
      <ul className="list-disc list-inside text-sm">
        {suggestions.map((s, i) => (<li key={i}>{s}</li>))}
      </ul>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-2 rounded bg-slate-50 border">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold">{value ?? '-'} / 10</div>
    </div>
  );
}
