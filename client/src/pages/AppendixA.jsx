import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppendixA() {
  const navigate = useNavigate();

  const glossaryTerms = [
    { term: 'Account Number', definition: 'Unique identifier for a consumer\'s debt file' },
    { term: 'ATDS (Automatic Telephone Dialing System)', definition: 'Technology that automatically dials phone numbers' },
    { term: 'Cease Communication', definition: 'Consumer\'s request to stop being contacted' },
    { term: 'CFPB (Consumer Financial Protection Bureau)', definition: 'Federal agency overseeing consumer financial services' },
    { term: 'Contingency', definition: 'Payment structure where collector earns percentage of collected amount' },
    { term: 'Creditor', definition: 'Entity to whom money is owed (our clients)' },
    { term: 'Debtor/Consumer', definition: 'Person who owes the debt' },
    { term: 'Default', definition: 'Failure to pay debt according to agreement' },
    { term: 'Discharge', definition: 'Legal elimination of debt (usually through bankruptcy)' },
    { term: 'Dispute', definition: 'Consumer\'s challenge to validity or amount of debt' },
    { term: 'E-ZPass', definition: 'Electronic toll collection system' },
    { term: 'FDCPA (Fair Debt Collection Practices Act)', definition: 'Primary federal law governing debt collection' },
    { term: 'FTC (Federal Trade Commission)', definition: 'Federal agency enforcing consumer protection laws' },
    { term: 'Garnishment', definition: 'Legal process to collect debt from wages or bank accounts' },
    { term: 'Judgment', definition: 'Court ruling that consumer owes debt' },
    { term: 'Mini-Miranda', definition: 'Required disclosure identifying yourself as debt collector (given AFTER verifying you\'re speaking with the consumer)' },
    { term: 'Payment Plan', definition: 'Agreement to pay debt in installments' },
    { term: 'Principal', definition: 'Original debt amount before fees and interest' },
    { term: 'Reg F (Regulation F)', definition: 'CFPB rules modernizing debt collection' },
    { term: 'Settlement', definition: 'Agreement to accept less than full amount owed' },
    { term: 'Skip Tracing', definition: 'Process of locating consumer with outdated contact information' },
    { term: 'Statute of Limitations', definition: 'Time period during which legal action can be taken' },
    { term: 'TCPA (Telephone Consumer Protection Act)', definition: 'Federal law regulating telemarketing and automated calls' },
    { term: 'Third-Party Debt Collector', definition: 'Collection agency collecting on behalf of creditor' },
    { term: 'Time-Barred Debt', definition: 'Debt past statute of limitations for legal action' },
    { term: 'Toll-by-Plate', definition: 'System that bills vehicle owner for tolls based on license plate' },
    { term: 'UDAAP', definition: 'Unfair, Deceptive, or Abusive Acts or Practices' },
    { term: 'Validation Notice', definition: 'Written notice explaining debt and consumer rights' }
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
            📖 Appendix A: Glossary of Terms
          </h1>
          <p className="text-xl text-slate-400">
            Essential terminology for debt collection professionals
          </p>
        </div>

        {/* Glossary Grid */}
        <div className="grid gap-4 max-w-5xl mx-auto">
          {glossaryTerms.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
            >
              <h3 className="text-xl font-bold text-emerald-400 mb-2">
                {item.term}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex justify-center gap-4">
          <button
            onClick={() => navigate('/appendix/b')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Next: Appendix B →
          </button>
        </div>
      </div>
    </div>
  );
}
