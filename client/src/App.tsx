import React, { useState, useEffect } from 'react';
import { ApolloProvider } from '@apollo/client';
import Navigation, { TabType } from './components/Navigation';
import Dashboard from './components/Dashboard';
import EventsList from './components/EventsList';
import UsersList from './components/UsersList';
import EventManager from './components/EventManager';
import client from './apollo-client';
import Login from './components/Login';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setToken(t);
  }, []);
  
  // TODO: Le client Apollo est importé depuis apollo-client.ts
  // TODO: Assurez-vous que la configuration Apollo est correcte avant d'utiliser l'application

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'events':
        return <EventsList />;
      case 'users':
        return <UsersList />;
      case 'management':
        return <EventManager />;
      default:
        return <Dashboard />;
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    // Optional: reset Apollo cache
    try {
      client.clearStore();
    } catch (e) {
      // ignore
    }
  };

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <h1>🚀 GraphQL Course - Event Platform</h1>
          <p>Apprenez GraphQL avec React et Apollo Client !</p>
          {token && (
            <div style={{ position: 'absolute', right: 20, top: 12 }}>
              <button onClick={handleLogout}>Déconnexion</button>
            </div>
          )}
        </header>

        <main className="App-main">
          {!token ? (
            <Login onLogin={handleLogin} />
          ) : (
            <>
              <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="main-content">{renderContent()}</div>

            </>
          )}
        </main>

        <footer className="App-footer">
          <p>🎓 Othila Academy - GraphQL Course</p>
        </footer>
      </div>
    </ApolloProvider>
  );

}

export default App;
    