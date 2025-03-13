import React, { useRef, useState } from 'react';

const DigitDrawer = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#FFFF00'; // Yellow stroke
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#4B006E'; // Purple background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');

    try {
      // const response = await fetch('http://127.0.0.1:8000/predict', { // Local
        const response = await fetch('http://107.21.66.51:8000/predict', {  // EC2 IP Address
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPrediction(data.predicted_digit);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch prediction');
    }
  };

  return (
    <div className="draw-container" style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#4B006E' }}>🎨 Draw a Digit 🎉</h1>
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{ border: '3px solid #4B006E', backgroundColor: '#4B006E', borderRadius: '20px' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleClear} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#FF6347', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Clear</button>
        <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#32CD32', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Predict</button>
      </div>
      {prediction !== null && <h2 style={{ color: '#32CD32', marginTop: '20px' }}>🧠 Predicted Digit: {prediction}</h2>}
      {error && <h2 style={{ color: 'red', marginTop: '20px' }}>❌ {error}</h2>}
    </div>
  );
};

export default DigitDrawer;
