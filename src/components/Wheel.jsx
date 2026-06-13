import { useState, useEffect } from 'react';

function Wheel({ prizes, spinning, targetPrizeIndex, onSpinEnd }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spinning && targetPrizeIndex !== null) {
      // Calculate how many degrees we need to spin to land on target
      const sliceAngle = 360 / prizes.length;
      
      // Calculate the angle required to land exactly on the center of the target slice
      // Because our pointer is at the top (0 degrees / 360 degrees),
      // and slices are drawn from 0 to 360, we need to bring the target slice's center to the top.
      
      // The starting angle of the slice in CSS conic-gradient logic:
      // index * sliceAngle
      const targetCenterAngle = (targetPrizeIndex * sliceAngle) + (sliceAngle / 2);
      
      // We want this targetCenterAngle to land at 0 (top).
      // Since it spins clockwise, the rotation needed is:
      // 360 - targetCenterAngle
      const landingAngle = 360 - targetCenterAngle;
      
      // Add multiple full spins (e.g., 5 spins = 1800 degrees)
      const fullSpins = 360 * 5; 
      
      // Extra random offset within the slice so it doesn't always land perfectly in the middle
      const randomOffset = (Math.random() - 0.5) * (sliceAngle * 0.6); 

      const newRotation = rotation + fullSpins + landingAngle - (rotation % 360) + randomOffset;
      
      setRotation(newRotation);

      // Wait for the transition to finish (5 seconds)
      setTimeout(() => {
        onSpinEnd();
      }, 5000);
    }
  }, [spinning, targetPrizeIndex, prizes.length]);

  // Create conic-gradient for the slices
  const conicGradient = prizes.map((prize, i) => {
    const startAngle = (i * 360) / prizes.length;
    const endAngle = ((i + 1) * 360) / prizes.length;
    return `${prize.color} ${startAngle}deg ${endAngle}deg`;
  }).join(', ');

  return (
    <div style={{ position: 'relative', width: '350px', height: '350px' }}>
      <div className="wheel-pointer"></div>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `conic-gradient(${conicGradient})`,
          transition: spinning ? 'transform 5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
          transform: `rotate(${rotation}deg)`,
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
          position: 'relative',
          overflow: 'hidden',
          border: '4px solid rgba(255,255,255,0.2)'
        }}
      >
        {prizes.map((prize, i) => {
          const rotationAngle = (i * 360) / prizes.length + (180 / prizes.length);
          return (
            <div
              key={prize.id}
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                width: '50%',
                height: '50%',
                transformOrigin: 'bottom left',
                transform: `rotate(${rotationAngle}deg)`,
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                fontWeight: 'bold',
                fontFamily: 'Kantumruy Pro',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '20px',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ transform: 'rotate(0deg)', display: 'inline-block' }}>
                {prize.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wheel;
