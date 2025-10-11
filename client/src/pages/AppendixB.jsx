import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppendixB() {
  const navigate = useNavigate();

  const stateInfo = [
    {
      state: 'NEW YORK',
      recording: 'One-party consent',
      keyLaws: 'NY General Business Law Article 29-H',
      licensing: 'Required',
      statute: 'Generally 6 years'
    },
    {
      state: 'NEW JERSEY',
      recording: 'One-party consent',
      keyLaws: 'NJ Consumer Fraud Act',
      licensing: 'Required',
      statute: 'Generally 6 years'
    },
    {
      state: 'PENNSYLVANIA',
      recording: 'Two-party consent required ⚠️',
      keyLaws: 'PA Fair Credit Extension Uniformity Act',
      licensing: 'Required',
      statute: 'Generally 4 years'
    },
    {
      state: 'CONNECTICUT',
      recording: 'One-party consent',
      keyLaws: 'CT Collection Agency Act',
      licensing: 'Required',
      statute: 'Generally 6 years'
    },
    {
      state: 'MASSACHUSETTS',
      recording: 'Two-party consent required ⚠️',
      keyLaws: 'MA Debt Collection Regulations (940 CMR 7.00)',
      licensing: 'Required',
      statute: 'Generally 6 years'
    },
    {
      state: 'TEXAS',
      recording: 'One-party consent',
      keyLaws: 'TX Finance Code Chapter 392',
      licensing: 'Required',
      statute: 'Generally 4 years'
    },
    {
      state: 'CALIFORNIA',
      recording: 'Two-party consent required ⚠️',
      keyLaws: 'Rosenthal Fair Debt Collection Practices Act',
      licensing: 'Required',
      statute: 'Generally 4 years',
      note: 'Extremely strict consumer protections'
    },
    {
      state: 'OREGON',
      recording: 'One-party consent',
      keyLaws: 'OR Debt Collection Practices rules',
      licensing: 'Required',
      statute: 'Generally 6 years'
    },
    {
      state: 'NEVADA',
      recording: 'One-party consent',
      keyLaws: 'NV Fair Debt Collection Practices Act',
      licensing: 'Required',
      statute: 'Generally 4-6 years'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-6 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 mx-auto"
          >
            <span>←</span> Back to Lessons Hub
          </button>
          <h1 className="text-5xl font-bold text-white mb-4">
            📍 Appendix B: State-Specific Quick Reference
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Key compliance requirements by state
          </p>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-yellow-400 text-sm">
              ⚠️ This is a simplified reference. Always consult detailed state-specific training materials and your supervisor for complete requirements.
            </p>
          </div>
        </div>

        {/* States Grid */}
        <div className="grid gap-6 max-w-6xl mx-auto">
          {stateInfo.map((state, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <h3 className="text-2xl font-bold text-emerald-400 mb-4">
                {state.state}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-1">Recording Consent</h4>
                  <p className="text-white">{state.recording}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-1">Licensing</h4>
                  <p className="text-white">{state.licensing}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-1">Statute of Limitations</h4>
                  <p className="text-white">{state.statute}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 mb-1">Key Laws</h4>
                  <p className="text-white text-sm">{state.keyLaws}</p>
                </div>
              </div>
              
              {state.note && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">
                    ⚠️ Note: {state.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex justify-center gap-4">
          <button
            onClick={() => navigate('/appendix/a')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ← Previous: Appendix A
          </button>
          <button
            onClick={() => navigate('/appendix/c')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Next: Appendix C →
          </button>
        </div>
      </div>
    </div>
  );
}
