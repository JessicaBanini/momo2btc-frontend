// Loading.jsx
import { useEffect, useState } from "react";

const word = "ShheerahTrade"; // Correct spelling

const Loading = ({ onComplete }) => {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + word[current]);
      current++;
      if (current >= word.length) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="page_container" 
    style={{ display: 'flex', 
            flexDirection: 'column',
            height: '100dvh',
            // padding:'3rem 1.5rem 0rem 1.5rem',
            justifyContent: 'center',
            alignItems:'center',
            // overflowY:'hidden', 
            // border:'3px solid blue'
        }}>
    <div className="flex items-center justify-center h-screen bg-white">
      <h1 className="text-4xl font-bold">
        <span className="text-black">
          {displayed.substring(0,7)} 
        </span>
        <span className="text-blue-500">
          {displayed.substring(7,12)} 
        </span>
      </h1>
    </div>
    </div>
  );
};

export default Loading;