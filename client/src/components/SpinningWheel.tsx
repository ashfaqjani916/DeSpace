import axios from 'axios';
import React, { useState, useRef } from 'react';

// Define a type for the wheel options
interface WheelOption {
  name: string;
  color: string;
}

const WheelSpinner: React.FC = () => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<WheelOption | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Options with colors
  const options: WheelOption[] = [
    { name: 'Option A', color: '#FF6B6B' },
    { name: 'Option B', color: '#4ECDC4' },
    { name: 'Option C', color: '#45B7D1' },
    { name: 'Option D', color: '#FDCB6E' }
  ];

  const spinWheel = async () => {
    if (spinning) return;
    const auth_token = localStorage.getItem("okto_auth_token");
    setSpinning(true);
    setResult(null);

    const baseRotation = 1800;
    const randomOffset = Math.floor(Math.random() * 360);
    const totalRotation = baseRotation + randomOffset;

    const randomIndex = Math.floor(Math.random() * options.length);

    if (wheelRef.current) {
      // Type-safe style modification
      const wheelElement = wheelRef.current;
      wheelElement.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wheelElement.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      if (wheelRef.current) {
        const wheelElement = wheelRef.current;
        wheelElement.style.transition = 'none';
        wheelElement.style.transform = `rotate(${randomOffset}deg)`;
      }
      setSpinning(false);
      setResult(options[randomIndex]);


    }, 4000);
    const response = await axios.post(
      "http://localhost:3000/okto-sandbox/join-room",
      {
        auth_token: auth_token,
      }
    );
    console.log(response);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div className="relative w-64 h-64">
        <svg
          ref={wheelRef}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          onClick={!spinning ? spinWheel : undefined}
        >
          {/* Wheel segments */}
          {options.map((option, index) => (
            <path
              key={index}
              d="M100,100 L100,10 A90,90 0 0,1 190,100 Z"
              transform={`rotate(${index * (360 / options.length)} 100 100)`}
              fill={option.color}
            />
          ))}

          {/* Center pivot */}
          <circle cx="100" cy="100" r="10" fill="#333" />
        </svg>

        {/* Pointer pointing downwards */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 200 200"
        >
          <polygon
            points="100,200 90,180 110,180"
            fill="#FF0000"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`px-4 py-2 rounded ${spinning
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
      >
        {spinning ? 'Spinning...' : 'Spin Wheel'}
      </button>

      {result && (
        <div className="mt-4 text-xl font-bold text-green-600">
          Result: {result.name}
        </div>
      )}
    </div>
  );
};

export default WheelSpinner;
