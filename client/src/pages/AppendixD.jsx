import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppendixD() {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (section, item) => {
    const key = `${section}-${item}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checklists = {
    beforeCall: [
      'Check time (8 AM - 9PM consumer local time)',
      'Review account notes',
      'Check for cease communication flag',
      'Check for bankruptcy flag',
      'Verify 7-in-7 compliance'
    ],
    duringCall: [
      'Recording notice given',
      'Identified self and company',
      'Verified correct party FIRST',
      'Mini-Miranda stated AFTER verification',
      'No third-party disclosure',
      'No harassment, threats, or abuse',
      'No false or misleading statements'
    ],
    afterCall: [
      'Documented conversation',
      'Updated account status',
      'Scheduled follow-up if needed',
      'Flagged any red flags',
      'Processed payment if taken'
    ],
    never: [
      'Call outside 8 AM - 9PM',
      'Exceed 7 calls in 7 days',
      'Discuss debt with third parties',
      'Make threats or use profanity',
      'Misrepresent debt or authority',
      'Continue collection during dispute',
      'Ignore cease communication',
      'Give Mini-Miranda before verification'
    ]
  };

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
            ✅ Appendix D: Quick Compliance Checklist
          </h1>
          <p className="text-xl text-slate-400 mb-4">
            Your reference card for every call
          </p>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-emerald-400 text-sm">
              💡 Tip: Bookmark this page or print it out for quick reference at your desk!
            </p>
          </div>
        </div>

        {/* Interactive Checklists */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Before Every Call */}
          <div className="bg-slate-900/50 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              🔵 Before Every Call
            </h3>
            <div className="space-y-3">
              {checklists.beforeCall.map((item, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[`before-${index}`] || false}
                    onChange={() => toggleCheck('before', index)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-slate-300 flex-1">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* During Every Call */}
          <div className="bg-slate-900/50 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
              🟢 During Every Call
            </h3>
            <div className="space-y-3">
              {checklists.duringCall.map((item, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[`during-${index}`] || false}
                    onChange={() => toggleCheck('during', index)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-slate-300 flex-1">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* After Every Call */}
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              🟣 After Every Call
            </h3>
            <div className="space-y-3">
              {checklists.afterCall.map((item, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 cursor-pointer hover:bg-slate-800/50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checkedItems[`after-${index}`] || false}
                    onChange={() => toggleCheck('after', index)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-slate-300 flex-1">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Never Do */}
          <div className="bg-slate-900/50 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              🔴 Never Do These
            </h3>
            <div className="space-y-3">
              {checklists.never.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2"
                >
                  <span className="text-red-500 text-xl mt-0.5">✖</span>
                  <span className="text-slate-300 flex-1">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Reminders */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
              ⚡ Critical Reminders
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Mini-Miranda comes AFTER</strong> you verify you're speaking with the consumer, never before</li>
              <li>• <strong>7-in-7 Rule:</strong> No more than 7 calls in 7 consecutive days</li>
              <li>• <strong>Time Zone Matters:</strong> Always use consumer's local time for 8 AM - 9 PM rule</li>
              <li>• <strong>When in Doubt:</strong> It's always better to ask compliance than to make a mistake</li>
              <li>• <strong>Document Everything:</strong> Your notes protect both you and the company</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => {
              setCheckedItems({});
              alert('Checklist reset! Ready for your next call.');
            }}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            🔄 Reset Checklist
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            🖨️ Print Reference Card
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex justify-center gap-4">
          <button
            onClick={() => navigate('/appendix/c')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ← Previous: Appendix C
          </button>
          <button
            onClick={() => navigate('/lessons')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Back to Lessons Hub
          </button>
        </div>
      </div>
    </div>
  );
}
