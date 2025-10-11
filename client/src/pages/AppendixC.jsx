import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AppendixC() {
  const navigate = useNavigate();

  const contacts = [
    {
      category: 'Compliance Questions',
      contact: '[Extension/Email]',
      description: 'For any questions about FDCPA, TCPA, or compliance procedures',
      icon: '⚖️'
    },
    {
      category: 'Supervisor',
      contact: '[Extension/Email]',
      description: 'For escalations, difficult situations, or guidance',
      icon: '👔'
    },
    {
      category: 'IT Support',
      contact: '[Extension/Email]',
      description: 'For technical issues, system problems, or login assistance',
      icon: '💻'
    },
    {
      category: 'Payment Processing Issues',
      contact: '[Extension/Email]',
      description: 'For problems with payment systems or transaction errors',
      icon: '💳'
    },
    {
      category: 'HR/Employee Assistance',
      contact: '[Extension/Email]',
      description: 'For personal support, benefits questions, or workplace concerns',
      icon: '🤝'
    },
    {
      category: 'After-Hours Emergency',
      contact: '[Number]',
      description: 'For urgent compliance issues or critical situations outside business hours',
      icon: '🚨',
      urgent: true
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
            📞 Appendix C: Emergency Contact Information
          </h1>
          <p className="text-xl text-slate-400">
            Quick reference for when you need help
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {contacts.map((item, index) => (
            <div
              key={index}
              className={`bg-slate-900/50 border rounded-xl p-6 hover:border-emerald-500/30 transition-all ${
                item.urgent 
                  ? 'border-red-500/50 bg-red-500/5' 
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    item.urgent ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {item.category}
                  </h3>
                  <p className="text-slate-400 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white font-mono text-lg">
                      {item.contact}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-400 mb-3">
              💡 When to Reach Out
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li>• <strong>Legal threats or attorney mentions</strong> - Contact supervisor immediately</li>
              <li>• <strong>Consumer becomes hostile or threatening</strong> - End call professionally, document, notify supervisor</li>
              <li>• <strong>Bankruptcy mentioned</strong> - Stop collection activity, contact compliance</li>
              <li>• <strong>Cease & desist request</strong> - Document immediately, contact supervisor</li>
              <li>• <strong>System errors during payment</strong> - Contact IT support right away</li>
              <li>• <strong>Unclear compliance situation</strong> - Always ask rather than guess</li>
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex justify-center gap-4">
          <button
            onClick={() => navigate('/appendix/b')}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            ← Previous: Appendix B
          </button>
          <button
            onClick={() => navigate('/appendix/d')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            Next: Appendix D →
          </button>
        </div>
      </div>
    </div>
  );
}
