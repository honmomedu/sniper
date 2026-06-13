import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Wheel from './Wheel';
import { Gift } from 'lucide-react';

function UserView() {
  const [prizes, setPrizes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [targetPrizeIndex, setTargetPrizeIndex] = useState(null);

  const loadData = () => {
    const savedPrizes = JSON.parse(localStorage.getItem('prizes') || '[]');
    setPrizes(savedPrizes);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const handleSpin = () => {
    if (spinning || prizes.length === 0) return;
    
    setResult(null);
    
    const adminWinningId = localStorage.getItem('winningPrizeId');
    let targetIndex = -1;

    // Filter available prizes (quantity > 0)
    const availableIndices = prizes.map((p, i) => p.quantity > 0 ? i : -1).filter(i => i !== -1);

    if (availableIndices.length === 0) {
      alert("អស់រង្វាន់សម្រាប់ចាប់ហើយ!");
      return;
    }

    if (adminWinningId && adminWinningId !== 'none') {
      const idx = prizes.findIndex(p => p.id === Number(adminWinningId));
      if (idx !== -1 && prizes[idx].quantity > 0) {
        targetIndex = idx;
      }
    }

    // Fallback to random if no valid admin setting
    if (targetIndex === -1) {
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      targetIndex = availableIndices[randomIdx];
    }

    setTargetPrizeIndex(targetIndex);
    setSpinning(true);
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    
    // Decrement quantity
    const wonPrize = prizes[targetPrizeIndex];
    if (!wonPrize) return;

    const updatedPrizes = prizes.map((p, index) => {
      if (index === targetPrizeIndex) {
        return { ...p, quantity: Math.max(0, p.quantity - 1) };
      }
      return p;
    });

    // Save to state and localStorage
    setPrizes(updatedPrizes);
    localStorage.setItem('prizes', JSON.stringify(updatedPrizes));
    window.dispatchEvent(new Event('storage')); // Notify admin tab

    setResult(wonPrize);

    if (wonPrize && wonPrize.name !== 'គ្មានរង្វាន់' && wonPrize.name !== 'ព្យាយាមម្ដងទៀត') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        <div style={{ position: 'relative', marginBottom: '3rem', marginTop: '1rem' }}>
          {prizes.length > 0 ? (
            <Wheel
              prizes={prizes}
              spinning={spinning}
              targetPrizeIndex={targetPrizeIndex}
              onSpinEnd={handleSpinEnd}
            />
          ) : (
            <div style={{ width: '350px', height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              កំពុងរៀបចំរង្វាន់...
            </div>
          )}

          <button
            className="btn-spin"
            onClick={handleSpin}
            disabled={spinning || prizes.length === 0 || prizes.every(p => p.quantity <= 0)}
          >
            SPIN
          </button>
        </div>

        {/* Result Area */}
        <div style={{ minHeight: '80px', textAlign: 'center' }}>
          {result && (
            <div className="animate-fade-in glass" style={{ padding: '1rem 2rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.2)' }}>
              <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Gift /> អបអរសាទរ!
              </h3>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>អ្នកទទួលបាន៖ {result.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserView;
