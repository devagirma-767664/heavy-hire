import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useTaskForm';
import { loginUser } from '../features/auth/authThunks';
import type { RootState } from '../app/store';
import { useNavigate, Link } from 'react-router-dom';
import Toast from './Toast';
import { clearMessage } from '../features/auth/authSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // ✅ eye icons

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token, successMessage, user } = useAppSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }) as any);
  };

  useEffect(() => {
    if (token && user?.role) {
      switch (user.role) {
        case 'supervisor':
          navigate('/supervisor');
          break;
        case 'staff':
          navigate('/staff');
          break;
        case 'operator':
          navigate('/operator');
          break;
        case 'mechanic':
          navigate('/mechanic');
          break;
        case 'logistics':
          navigate('/deliveries');
          break;
        default:
          navigate('/'); // fallback
      }
    }
  }, [token, user?.role, navigate]);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/themePic/themepic2.jpg')" }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm"
        style={{
          backgroundImage: "url('/themePic/themepic2.jpg')",
        }}
      ></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-gray-900 bg-opacity-50 backdrop-blur-md p-8 rounded-lg shadow-lg w-96 border border-yellow-500"
      >
        <h2 className="text-3xl font-extrabold text-center text-yellow-400 mb-6 tracking-widest uppercase">
          Abyssinia Heavy Hire
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-40 text-white focus:border-yellow-400"
        />

        {/* ✅ Password input with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 border border-gray-700 rounded-lg bg-gray-800 bg-opacity-40 text-white focus:border-yellow-400 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-yellow-400 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-sm text-center mt-4 text-gray-300">
          New here?{' '}
          <Link to="/register" className="text-yellow-400 hover:underline">
            Create an account
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

export default Login;
