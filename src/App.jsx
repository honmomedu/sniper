import { useState, useEffect } from 'react';
import Login from './components/Login';
import UserView from './components/UserView';
import AdminView from './components/AdminView';

// Default prizes
const DEFAULT_PRIZES = [
  { id: 1, name: '$10', color: '#f87171' }, // red
  { id: 2, name: '$50', color: '#60a5fa' }, // blue
  { id: 3, name: 'គ្មានរង្វាន់', color: '#9ca3af' }, // gray
  { id: 4, name: 'iPhone 15', color: '#fbbf24' }, // yellow
  { id: 5, name: '$5', color: '#34d399' }, // green
  { id: 6, name: 'ព្យាយាមម្ដងទៀត', color: '#a78bfa' }, // purple
];

function App() {
  const [role, setRole] = useState(null); // 'user', 'admin', null

  // Initialize data on first load if empty
  useEffect(() => {
    if (!localStorage.getItem('prizes')) {
      localStorage.setItem('prizes', JSON.stringify(DEFAULT_PRIZES));
    }
    if (!localStorage.getItem('winningPrizeId')) {
      localStorage.setItem('winningPrizeId', 'none'); // 'none' means random
    }
  }, []);

  const handleLogin = (userRole) => {
    setRole(userRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  return (
    <div className="app-container">
      {role && (
        <header className="top-bar glass">
          <h2 className="text-gradient">
            {role === 'admin' ? 'គ្រប់គ្រងរង្វាន់ (Admin)' : 'កងវិលសំណាង (Spin & Win)'}
          </h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            ចាកចេញ
          </button>
        </header>
      )}

      <main className="main-content">
        {!role && <Login onLogin={handleLogin} />}
        {role === 'user' && <UserView />}
        {role === 'admin' && <AdminView />}
      </main>
    </div>
  );
}

export default App;
