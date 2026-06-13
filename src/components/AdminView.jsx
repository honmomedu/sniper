import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Save } from 'lucide-react';

function AdminView() {
  const [prizes, setPrizes] = useState([]);
  const [winningPrizeId, setWinningPrizeId] = useState('none');
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeColor, setNewPrizeColor] = useState('#6366f1');

  useEffect(() => {
    const savedPrizes = JSON.parse(localStorage.getItem('prizes') || '[]');
    const savedWinningId = localStorage.getItem('winningPrizeId') || 'none';
    setPrizes(savedPrizes);
    setWinningPrizeId(savedWinningId);
  }, []);

  const saveToStorage = (newPrizes, newWinningId) => {
    localStorage.setItem('prizes', JSON.stringify(newPrizes));
    localStorage.setItem('winningPrizeId', newWinningId);
    // Dispatch storage event so other tabs can update
    window.dispatchEvent(new Event('storage'));
  };

  const handleWinningChange = (e) => {
    const val = e.target.value;
    setWinningPrizeId(val);
    saveToStorage(prizes, val);
  };

  const addPrize = () => {
    if (!newPrizeName.trim()) return;
    const newPrize = {
      id: Date.now(),
      name: newPrizeName,
      color: newPrizeColor
    };
    const updatedPrizes = [...prizes, newPrize];
    setPrizes(updatedPrizes);
    saveToStorage(updatedPrizes, winningPrizeId);
    setNewPrizeName('');
  };

  const removePrize = (id) => {
    const updatedPrizes = prizes.filter(p => p.id !== id);
    setPrizes(updatedPrizes);
    
    // If the removed prize was the winning one, reset to 'none'
    let newWinningId = winningPrizeId;
    if (winningPrizeId === id.toString()) {
      newWinningId = 'none';
      setWinningPrizeId(newWinningId);
    }
    
    saveToStorage(updatedPrizes, newWinningId);
  };

  return (
    <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Settings style={{ color: 'var(--primary)' }} />
        <h2>កំណត់ការចាប់រង្វាន់</h2>
      </div>

      <div style={{ marginBottom: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>កំណត់រង្វាន់ត្រូវចេញ (Target Winner)</h3>
        <select 
          className="input-field" 
          value={winningPrizeId} 
          onChange={handleWinningChange}
          style={{ cursor: 'pointer' }}
        >
          <option value="none">ចុចដើម្បីជ្រើសរើស (Random - គ្មានកំណត់)</option>
          {prizes.map(prize => (
            <option key={prize.id} value={prize.id}>
              {prize.name}
            </option>
          ))}
        </select>
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          * បើជ្រើសរើសរង្វាន់ណាមួយ នោះកងវិលនឹងធ្លាក់ចំរង្វាន់នោះជានិច្ចនៅពេលបង្វិល។
        </p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>បញ្ជីរង្វាន់នៅលើកងវិល</h3>
        
        {/* Add new prize */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="ឈ្មោះរង្វាន់ថ្មី" 
            value={newPrizeName}
            onChange={(e) => setNewPrizeName(e.target.value)}
          />
          <input 
            type="color" 
            className="input-field" 
            style={{ width: '60px', padding: '0.25rem' }} 
            value={newPrizeColor}
            onChange={(e) => setNewPrizeColor(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addPrize}>
            <Plus size={20} />
          </button>
        </div>

        {/* List of prizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prizes.map(prize => (
            <div key={prize.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: prize.color }}></div>
                <span>{prize.name}</span>
              </div>
              <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', padding: '0.5rem' }} onClick={() => removePrize(prize.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          {prizes.length === 0 && <p style={{ color: 'var(--text-muted)' }}>មិនទាន់មានរង្វាន់ទេ</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminView;
