
import React from 'react';

interface InputWithCounterProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  minLength: number;
  maxLength: number;
  isTextarea?: boolean;
}

const InputWithCounter: React.FC<InputWithCounterProps> = ({
  id,
  label,
  value,
  onChange,
  minLength,
  maxLength,
  isTextarea = false,
}) => {
  const length = value.length;
  const progress = (length / maxLength) * 100;

  const getStatusColor = () => {
    if (length === 0) return 'bg-gray-600';
    if (length > maxLength) return 'bg-red-500';
    if (length < minLength) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <InputComponent
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out ${isTextarea ? 'min-h-[120px] resize-y' : ''}`}
        />
        <div className="absolute bottom-2 right-2 text-xs font-mono" style={{ pointerEvents: 'none' }}>
            <span className={length > maxLength ? 'text-red-400' : 'text-gray-400'}>{length}</span>
            <span className="text-gray-500"> / {maxLength}</span>
        </div>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ease-out ${getStatusColor()}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InputWithCounter;
