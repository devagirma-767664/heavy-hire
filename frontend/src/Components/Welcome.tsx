import { Link } from 'react-router-dom';
import themePic from '../assets/theme_pics/themepic2.jpg';

const Welcome = () => {
  return (
    <div
  className="relative flex min-h-screen items-center justify-center bg-cover bg-center animate-fadeIn"
  style={{ backgroundImage: `url(${themePic})` }}
>
  {/* Background layer stays clear for 2s, then blurs */}
  <div
    className="absolute inset-0 bg-cover bg-center animate-blurOut"
    style={{ backgroundImage: `url(${themePic})` }}
  ></div>

  {/* Card waits until blur finishes, then slides up */}
  <div className="relative z-10 bg-gray-900 bg-opacity-50 backdrop-blur-md p-12 rounded-xl shadow-2xl max-w-2xl text-center border border-yellow-500 transform animate-slideUp">
    <h1 className="text-5xl font-extrabold text-yellow-400 mb-6 tracking-widest uppercase">
      Abyssinia Heavy Hire
    </h1>
    <p className="text-lg text-gray-200 mb-4">
      Heavy machinery and industrial equipment services across Ethiopia.
    </p>
    <p className="text-md text-gray-300 mb-8">
      This system is designed to manage and track the company’s property —
      ensuring efficiency, accountability, and smooth operations.
    </p>
    <Link
      to="/login"
      className="inline-block bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105 animate-pulse"
    >
      Get Started
    </Link>
  </div>
</div>


  );
};

export default Welcome;
