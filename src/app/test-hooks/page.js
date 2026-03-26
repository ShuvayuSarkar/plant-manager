'use client';

import { useState, useEffect } from 'react';

function TestHooksPage() {
    console.log("TestHooksPage component loaded!");
    
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        console.log("=== useEffect is working! ===");
        console.log("Count:", count);
    }, [count]);
    
    return (
        <div className="p-8">
            <h1>Hook Test Page</h1>
            <p>Count: {count}</p>
            <button 
                onClick={() => setCount(c => c + 1)}
                className="bg-blue-500 text-white p-2 rounded"
            >
                Increment
            </button>
        </div>
    );
}

export default TestHooksPage;
