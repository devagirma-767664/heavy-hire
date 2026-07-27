import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useTaskForm';
import { registerUser } from '../features/auth/authThunks';
import type { RootState } from '../app/store';
import { Link, useNavigate } from 'react-router-dom';
import Toast from './Toast';
import { clearMessage } from '../features/auth/authSlice';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useAppSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateName = (value: string) => value.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (!validateName(name)) {
      setNameError('Please enter your full name (min 2 characters).');
      valid = false;
    } else setNameError('');

    if (!role) {
      setRoleError('Please select a role before registering.');
      valid = false;
    } else setRoleError('');

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else setEmailError('');

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else setPasswordError('');

    if (!valid) return;

    dispatch(registerUser({ name, email, role, password }) as any)
      .unwrap()
      .then(() => navigate('/login'))
      .catch(() => {});
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/themePic/themepic2.jpg')" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{ backgroundImage: "url('/themePic/themepic2.jpg')" }}
      ></div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-96 border border-yellow-500"
      >
        <h2 className="text-3xl font-extrabold text-center text-yellow-400 mb-6 tracking-widest uppercase">
          Abyssinia Heavy Hire
        </h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full px-4 py-2 mb-3 border border-gray-700 rounded-lg bg-gray-800 text-white focus:border-yellow-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {nameError && <p className="text-red-500 text-sm mb-2">{nameError}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 mb-1 border border-gray-700 rounded-lg bg-gray-800 text-white focus:border-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}
        <select
          className="w-full px-4 py-2 mb-1 border border-gray-700 rounded-lg bg-gray-800 text-white focus:border-yellow-400"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="" disabled hidden>
            Please select your role
          </option>
          <option value="staff">Staff</option>
          <option value="supervisor">Supervisor</option>
          <option value="logistics">Logistics</option>
          <option value="operator">Operator</option>
          <option value="mechanic">Mechanic</option>
        </select>
        {roleError && <p className="text-red-500 text-sm mb-2">{roleError}</p>}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 mb-1 border border-gray-700 rounded-lg bg-gray-800 text-white focus:border-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-sm text-center mt-4 text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Login here
          </Link>
        </p>
      </form>

      {/* Toast notifications */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearMessage())}
        />
      )}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => dispatch(clearMessage())}
        />
      )}
    </div>
  );
};

export default Register;
