import React, { useState } from 'react';

// --- THEME COLORS ---
const GREEN_DEEP = '#04471C';
const GOLD_RICH = '#FFC300';

export default function App() {
  const [pin, setPin] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('login');

  const handlePinInput = (digit) => {
    const stringDigit = String(digit);
    if (pin.length < 4) {
      const newPin = pin + stringDigit;
      setPin(newPin);
      if (newPin.length === 4) handleLogin(newPin);
    }
  };

  const clearPin = () => setPin('');

  const handleLogin = async (finalPin) => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: finalPin }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        setView('dashboard');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Network wahala.');
      setTimeout(clearPin, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPin('');
    setView('login');
  };

  const PinKeypad = () => (
    <div className="w-full max-w-sm">
      {[
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['C', '0', 'DEL'],
      ].map((row, i) => (
        <div key={i} className="flex justify-around mb-4">
          {row.map((key) => (
            <button
              key={key}
              disabled={loading}
              onClick={() => key === 'C' ? clearPin() : key === 'DEL' ? setPin(p => p.slice(0, -1)) : handlePinInput(key)}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl border-b-4
                ${key === 'C' ? 'bg-red-600 text-white border-red-800' :
                  key === 'DEL' ? 'bg-gray-700 text-white border-gray-900' :
                  key === '0' ? 'bg-green-900 text-yellow-400 border-green-950' :
                  'bg-yellow-400 text-green-900 border-yellow-600'}
                 ${loading ? 'opacity-50' : ''}`}
            >
              {key === 'DEL' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="font-sans min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center py-10">
      <header className="w-full bg-green-900 px-4 py-3 shadow-lg flex justify-between items-center fixed top-0 z-10">
        <h1 className="text-2xl font-extrabold text-yellow-400">💰 Oga Account</h1>
        {user && <button onClick={handleLogout} className="px-3 py-1 bg-yellow-400 text-green-900 font-bold rounded">Logout</button>}
      </header>

      <div className="mt-20 w-full max-w-md px-4">
        {view === 'login' ? (
          <div className="flex flex-col items-center">
             <div className="w-full bg-white rounded-xl p-6 mb-6 shadow-lg border-t-4 border-yellow-400 text-center">
                <h2 className="text-xl font-bold text-green-900">Welcome Back!</h2>
                <p className="text-gray-500 mb-4">Enter your Secret Code</p>
                <div className="w-full py-4 bg-green-900 rounded-lg flex justify-center shadow-inner">
                  <div className="text-4xl font-extrabold tracking-[0.6em] text-yellow-400">
                    {pin.padEnd(4, '•').split('').map((c, i) => <span key={i} className={c === '•' ? 'text-yellow-400/30' : ''}>{c}</span>)}
                  </div>
                </div>
                {error && <p className="text-red-600 font-bold mt-2 bg-red-50 p-2 rounded">{error}</p>}
             </div>
             <PinKeypad />
          </div>
        ) : (
          <div className="bg-yellow-100 border-b-4 border-yellow-400 p-6 rounded-lg text-center shadow-lg">
             <h2 className="text-2xl font-bold text-green-900">Hello, {user.name}!</h2>
             <p className="font-bold uppercase tracking-widest text-green-800 mt-2">{user.role}</p>
             <div className="mt-8 p-4 bg-white rounded shadow">
                <p className="text-gray-500">Dashboard functionality loading...</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
