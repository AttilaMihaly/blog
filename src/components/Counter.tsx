import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4 my-4 p-4 border rounded-lg w-fit">
      <button
        onClick={() => setCount((c) => c - 1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        −
      </button>
      <span className="text-lg font-semibold w-8 text-center">{count}</span>
      <button
        onClick={() => setCount((c) => c + 1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
    </div>
  );
}
