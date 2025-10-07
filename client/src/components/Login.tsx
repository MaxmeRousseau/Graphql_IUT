import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, CREATE_USER } from '../queries';

type Props = {
  onLogin: (token: string) => void;
};

export default function Login({ onLogin }: Props) {
  const [nom, setNom] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN);
  const [createUserMutation, { loading: createLoading }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        // create user then login
        await createUserMutation({ variables: { nom, age: age === '' ? null : Number(age), password } });
      }

      const { data } = await loginMutation({ variables: { nom, password } });
      if (data?.login?.token) {
        const token = data.login.token;
        localStorage.setItem('token', token);
        // also store a small user object
        localStorage.setItem('user', JSON.stringify(data.login.user || {}));
        onLogin(token);
      } else {
        setError('Login failed: no token returned');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="login-page" style={{ padding: 20 }}>
      <h2>{isRegister ? 'Créer un compte' : 'Se connecter'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>

        {isRegister && (
          <div>
            <label>Âge</label>
            <input
              type="number"
              value={age === '' ? '' : String(age)}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
            />
          </div>
        )}

        <div>
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div style={{ marginTop: 10 }}>
          <button type="submit" disabled={loginLoading || createLoading}>
            {isRegister ? 'Créer un compte & se connecter' : 'Se connecter'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => setIsRegister((s) => !s)}>
          {isRegister ? "J'ai déjà un compte" : 'Créer un compte'}
        </button>
      </div>
    </div>
  );
}
