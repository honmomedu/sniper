import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';

function AdminView() {
  const [prizes, setPrizes] = useState([]);
  const [winningPrizeId, setWinningPrizeId] = useState('none');
  const [newPrizeName, setNewPrizeName] = useState('');
  const [newPrizeColor, setNewPrizeColor] = useState('#6366f1');
  const [newPrizeQty, setNewPrizeQty] = useState(1);

  useEffect(() => {
    const savedPrizes = JSON.parse(localStorage.getItem('prizes') || '[]');
    const savedWinningId = localStorage.getItem('winningPrizeId') || 'none';
    setPrizes(savedPrizes);
    setWinningPrizeId(savedWinningId);
    
    // Add event listener to update admin view if user spins and reduces quantity
    const handleStorage = () => {
      setPrizes(JSON.parse(localStorage.getItem('prizes') || '[]'));
      setWinningPrizeId(localStorage.getItem('winningPrizeId') || 'none');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveToStorage = (newPrizes, newWinningId) => {
    localStorage.setItem('prizes', JSON.stringify(newPrizes));
    localStorage.setItem('winningPrizeId', newWinningId);
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
      color: newPrizeColor,
      quantity: parseInt(newPrizeQty, 10) || 0
    };
    const updatedPrizes = [...prizes, newPrize];
    setPrizes(updatedPrizes);
    saveToStorage(updatedPrizes, winningPrizeId);
    setNewPrizeName('');
    setNewPrizeQty(1);
  };

  const removePrize = (id) => {
    const updatedPrizes = prizes.filter(p => p.id !== id);
    setPrizes(updatedPrizes);
    
    let newWinningId = winningPrizeId;
    if (winningPrizeId === id.toString()) {
      newWinningId = 'none';
      setWinningPrizeId(newWinningId);
    }
    
    saveToStorage(updatedPrizes, newWinningId);
  };

  const updateQuantity = (id, newQty) => {
    const updatedPrizes = prizes.map(p => p.id === id ? { ...p, quantity: parseInt(newQty, 10) || 0 } : p);
    setPrizes(updatedPrizes);
    saveToStorage(updatedPrizes, winningPrizeId);
  }

  return (
    <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '650px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <Settings style={{ color: 'var(--primary)' }} />
        <h2>កំណត់ការចាប់រង្វាន់ (Admin)</h2>
      </div>

      <div style={{ marginBottom: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--primary)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>កំណត់រង្វាន់ត្រូវចេញជានិច្ច (Force Win)</h3>
        <select 
          className="input-field" 
          value={winningPrizeId} 
          onChange={handleWinningChange}
          style={{ cursor: 'pointer' }}
        >
          <option value="none">Random - វិលដោយចៃដន្យ (យកតែរង្វាន់ដែលមានចំនួន &gt; 0)</option>
          {prizes.map(prize => (
            <option key={prize.id} value={prize.id} disabled={prize.quantity <= 0}>
              {prize.name} {prize.quantity <= 0 ? '(អស់)' : ''}
            </option>
          ))}
        </select>
        <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          * បើកំណត់រង្វាន់ណាមួយ កងវិលនឹងធ្លាក់ចំរង្វាន់នោះ (ត្រូវប្រាកដថាចំនួនរង្វាន់ &gt; 0)។
        </p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>បញ្ជីរង្វាន់ និងចំនួន</h3>
        
        {/* Add new prize */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="ឈ្មោះរង្វាន់ថ្មី" 
            value={newPrizeName}
            onChange={(e) => setNewPrizeName(e.target.value)}
            style={{ flex: 2 }}
          />
          <input 
            type="number" 
            className="input-field" 
            placeholder="ចំនួន" 
            value={newPrizeQty}
            onChange={(e) => setNewPrizeQty(e.target.value)}
            min="0"
            style={{ flex: 1 }}
          />
          <input 
            type="color" 
            className="input-field" 
            style={{ width: '50px', padding: '0.25rem' }} 
            value={newPrizeColor}
            onChange={(e) => setNewPrizeColor(e.target.value)}
          />
          <button className="btn btn-primary" onClick={addPrize} style={{ padding: '0.75rem' }}>
            <Plus size={20} />
          </button>
        </div>

        {/* List of prizes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {prizes.map(prize => (
            <div key={prize.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: prize.color }}></div>
                <span style={{ fontWeight: prize.quantity > 0 ? 'bold' : 'normal', color: prize.quantity > 0 ? 'white' : 'var(--text-muted)' }}>
                  {prize.name}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ចំនួន៖</span>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={prize.quantity}
                    onChange={(e) => updateQuantity(prize.id, e.target.value)}
                    style={{ width: '80px', padding: '0.25rem 0.5rem' }}
                    min="0"
                  />
                </div>
                <button className="btn" style={{ background: 'transparent', color: 'var(--danger)', padding: '0.5rem' }} onClick={() => removePrize(prize.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          {prizes.length === 0 && <p style={{ color: 'var(--text-muted)' }}>មិនទាន់មានរង្វាន់ទេ</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminView;
