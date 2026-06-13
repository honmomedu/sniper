import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Wheel from './Wheel';
import { Gift } from 'lucide-react';

function UserView() {
  const [prizes, setPrizes] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [targetPrizeIndex, setTargetPrizeIndex] = useState(null);

  // Sync state from localStorage
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
    
    // Determine the winning prize based on Admin setting
    const adminWinningId = localStorage.getItem('winningPrizeId');
    let targetIndex = -1;

    if (adminWinningId && adminWinningId !== 'none') {
      targetIndex = prizes.findIndex(p => p.id === Number(adminWinningId));
    }

    // Fallback to random if no admin setting or setting is invalid
    if (targetIndex === -1) {
      targetIndex = Math.floor(Math.random() * prizes.length);
    }

    setTargetPrizeIndex(targetIndex);
    setSpinning(true);
  };

  const handleSpinEnd = () => {
    setSpinning(false);
    const wonPrize = prizes[targetPrizeIndex];
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
            disabled={spinning || prizes.length === 0}
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
