// Suggested code may be subject to a license. Learn more: ~LicenseLog:714948847.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:335752083.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2970762527.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1909936553.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3874261068.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2217443878.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3112179126.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3471585254.
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <button onClick={toggleForm} className="toggle-button">
        {isLogin ? 'Need an account? Signup' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default AuthForm;
