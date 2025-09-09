import React from "react";
import "./Fire.css";

const Fire: React.FC = () => {
  const generateSparks = (count: number) => {
    const sparks = [];
    for (let i = 0; i < count; i++) {
      sparks.push(<div key={i} className={`spark spark${i + 1}`}></div>);
    }
    return sparks;
  };

  return (
    <div
      className="fire-container"
    >
      {/* Core Flames */}

      <div className="outer-flame outer-flame1"></div>
      
      
      <div className="flame flame2"></div>
      <div className="flame flame6"></div>
      <div className="flame flame3"></div>
      <div className="flame flame5"></div>{generateSparks(20)}
      <div className="flame flame4"></div>
      <div className="flame flame1"></div>
      <div className="flame flame7"></div>
      
      
      

      {/* Outer Flames */}
      <div className="outer-flame outer-flame3"></div>
      
      <div className="outer-flame outer-flame2"></div>

      {/* Sparks and Embers */}
      {generateSparks(20)}
      

      {/* Halo Glow */}
      <div className="fire-halo" ></div>
      
    </div>
  );
};

export default Fire;
