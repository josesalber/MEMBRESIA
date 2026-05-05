import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const variantConfig = {
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
  },
  warning: {
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
  },
  info: {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    buttonBg: 'bg-orange-600 hover:bg-orange-700',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center`}>
              <AlertTriangle className={config.iconColor} size={24} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors ${config.buttonBg}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
