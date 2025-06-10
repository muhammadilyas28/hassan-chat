// src/pages/login.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import API from '../services/api';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken();

    await API.post('/auth/verify-token', { token });
    router.push('/home');
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
