
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast = ({ message, type = 'success', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // auto close after 5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white 
        ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
    >
      {message}
    </div>
  );
};

export default Toast;
