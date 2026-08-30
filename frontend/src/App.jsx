import { useState, useEffect } from 'react';
import { AlertCircle, Bot, MessageSquare, Activity, DollarSign, Clock, CheckCircle } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);

  // Fetch data from your working backend
  useEffect(() => {
    fetch('http://localhost:5000/api/transactions')
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Navigation */}
      <header className="bg-[#02042b] text-white p-4 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="text-[#2b84ea]" size={28} />
          <h1 className="text-xl font-bold tracking-wide">Razorpay AI <span className="font-light text-gray-300">| Revenue Recovery</span></h1>
        </div>
        <div className="text-sm bg-blue-900/50 px-4 py-2 rounded-full border border-blue-800">
          Agentic Mode: <span className="text-green-400 font-semibold">Active</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Transaction Feed */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle className="text-red-500" size={20} /> Failed Payments Queue
          </h2>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[80vh] overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No failed transactions detected.</p>
            ) : (
              transactions.map((tx) => (
                <div 
                  key={tx._id} 
                  onClick={() => setSelectedTx(tx)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${selectedTx?._id === tx._id ? 'border-l-4 border-l-[#2b84ea] bg-blue-50/30' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{tx.customerName}</span>
                    <span className="text-red-600 font-bold">₹{tx.amount / 100}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2 font-mono">{tx.razorpayPaymentId}</div>
                  <div className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-red-100 text-red-700 rounded-md">
                    {tx.failureReason}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Brain Diagnosis */}
        <div className="lg:col-span-2">
          {selectedTx ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 h-full">
              <div className="flex items-center gap-3 mb-8 border-b pb-4">
                <Bot className="text-[#2b84ea]" size={32} />
                <div>
                  <h2 className="text-2xl font-bold">AI Recovery Strategy</h2>
                  <p className="text-gray-500">Autonomous diagnosis for {selectedTx.razorpayPaymentId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">AI Root Cause Analysis</span>
                  <p className="mt-2 text-lg text-gray-800">{selectedTx.rootCause}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-500 uppercase tracking-wider font-bold">Recommended Action</span>
                  <p className="mt-2 text-lg text-[#2b84ea] font-semibold">{selectedTx.actionType}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                  <Clock size={16} /> Strategic Execution Plan
                </h3>
                <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border border-blue-100 leading-relaxed">
                  {selectedTx.recoveryStrategy}
                </p>
              </div>

              {selectedTx.customerMessage && (
                <div>
                  <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-3 flex items-center gap-2">
                    <MessageSquare size={16} /> Auto-Generated Outreach (WhatsApp/SMS)
                  </h3>
                  <div className="bg-[#e1f5fe] p-5 rounded-lg border border-[#b3e5fc] relative">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedTx.customerMessage}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-4">
                <button className="flex-1 bg-[#2b84ea] hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 transition-colors">
                  <CheckCircle size={20} /> Approve & Execute Recovery
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[80vh] flex flex-col items-center justify-center text-gray-400">
              <Bot size={64} className="mb-4 opacity-20" />
              <p className="text-xl">Select a failed transaction to view AI analysis</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}