import React, { useEffect, useRef, useState } from 'react';

const BallSimulation = ({ trajectory, polygons, teamName, success }) => {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (!trajectory || !polygons || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = Math.min(width, height) * 0.4;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Transform coordinate system
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, -scale); // Flip Y axis

    ctx.beginPath();
    ctx.strokeStyle = '#456dc4';
    ctx.lineWidth = 3 / scale;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';

    const pentagon = [
      { x: 0.0, y: -0.55*1.75 },
      { x: 0.5231*1.75, y: -0.1700*1.75 },
      { x: 0.3233*1.75, y: 0.4449*1.75 },
      { x: -0.3233*1.75, y: 0.4449*1.75 },
      { x: -0.5231*1.75, y: -0.1700*1.75 }
    ];

    pentagon.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw radial lines from center
    ctx.beginPath();
    ctx.strokeStyle = '#456dc4';
    ctx.lineWidth = 1 / scale;

    pentagon.forEach(point => {
      ctx.moveTo(0, 0);
      ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();

    // Draw mission polygon (outer boundary)
    ctx.beginPath();
    ctx.strokeStyle = '#DC143C';
    ctx.lineWidth = 3 / scale;
    ctx.fillStyle = 'rgba(220, 20, 60, 0.05)';
    
    polygons.mission.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw hero polygon (success zone)
    ctx.beginPath();
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 2 / scale;
    ctx.fillStyle = 'rgba(40, 167, 69, 0.1)';
    
    polygons.hero.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw stat labels
    ctx.restore();
    ctx.save();
    ctx.translate(centerX, centerY);
    
    const statLabels = ['SBR', 'AMN', 'CRG', 'WSD', 'TWN'];
    pentagon.forEach((point, i) => {
      const x = point.x * scale;
      const y = -point.y * scale;
      const angle = Math.atan2(-point.y, point.x);
      const labelDistance = 1.15;
      const labelX = x * labelDistance;
      const labelY = y * labelDistance;
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = '#2C2C2C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(statLabels[i].toUpperCase().slice(0, 3), labelX, labelY);
    });

    ctx.restore();
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(scale, -scale);

    // Draw trajectory path up to current frame
    if (currentFrame > 0) {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 1.5 / scale;
      
      for (let i = 0; i < Math.min(currentFrame, trajectory.length); i++) {
        const point = trajectory[i];
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
    }


    // Draw ball and velocity vector at current position
if (currentFrame < trajectory.length) {
  const currentPos = trajectory[currentFrame];
  
  // Draw velocity vector FIRST (behind the ball)
  if (currentPos.vx !== undefined && currentPos.vy !== undefined) {
    const velocityMagnitude = Math.sqrt(currentPos.vx * currentPos.vx + currentPos.vy * currentPos.vy);
    
    // Only draw if there's meaningful velocity
    if (velocityMagnitude > 0.001) {
      const vScale = 3; // Scale for visibility
      
      // Calculate end point of velocity vector
      const endX = currentPos.x + currentPos.vx * vScale;
      const endY = currentPos.y + currentPos.vy * vScale;
      
      // Draw velocity line (ORANGE ARROW)
      ctx.beginPath();
      ctx.moveTo(currentPos.x, currentPos.y); // ✅ START from ball center
      ctx.lineTo(endX, endY); // ✅ END at velocity direction
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
      ctx.lineWidth = 0.02;
      ctx.stroke();
      
      // Draw arrowhead at the end
      const arrowLength = 0.04;
      const angle = Math.atan2(currentPos.vy, currentPos.vx);
      
      ctx.beginPath();
      // Left wing of arrow
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - Math.PI / 6),
        endY - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      // Right wing of arrow
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + Math.PI / 6),
        endY - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)';
      ctx.lineWidth = 0.015;
      ctx.stroke();
    }
  }
  
  // Draw ball (on top of velocity vector)
  ctx.beginPath();
  ctx.arc(currentPos.x, currentPos.y, 0.03, 0, 2 * Math.PI);
  
  // Color based on whether ball is in success zone
  if (currentPos.in_hero_zone) {
    ctx.fillStyle = '#28a745';
  } else {
    ctx.fillStyle = '#FFD700';
  }
  ctx.fill();
  ctx.strokeStyle = '#2C2C2C';
  ctx.lineWidth = 0.01;
  ctx.stroke();
}

    ctx.restore();

    // Draw legend
    ctx.fillStyle = '#2C2C2C';
    ctx.font = '12px Arial';
    ctx.fillText('Mission Area (red)', 10, height - 40);
    ctx.fillText('Success Zone (green)', 10, height - 20);

  }, [trajectory, polygons, currentFrame]);

// BallSimulation.js

// Add a target duration for the animation (e.g., 3 seconds)
const ANIMATION_DURATION_MS = 3000; 

useEffect(() => {
  if (!isPlaying || !trajectory) return;
  
  let animationFrame;
  let startTime = null;
  const totalPoints = trajectory.length;

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
    
    // Calculate current frame based on time, not 1:1 with requestAnimationFrame
    const targetFrame = Math.floor(progress * (totalPoints - 1));
    
    setCurrentFrame(targetFrame);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
      setCurrentFrame(totalPoints - 1);
    }
  };

  animationFrame = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(animationFrame);
}, [isPlaying, trajectory]);

  const handlePlay = () => {
    if (currentFrame >= trajectory.length - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentFrame(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  if (!trajectory || !polygons) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No simulation data available</div>;
  }

  return (
    <div style={{ 
      background: '#96B5C9', 
      borderRadius: '10px', 
      padding: '20px',
    }}>
      <h3 style={{ 
        fontSize: '2.5rem',
        textAlign: 'center', 
        color: success ? 'var(--success)' : 'var(--failure)',
        marginBottom: '15px'
      }}>
        {teamName}: {success ? '✅ SUCCESS' : '❌ FAILED'}
      </h3>

      <canvas 
        ref={canvasRef} 
        width={500} 
        height={300}
        style={{ 
          border: '2px solid var(--dark-gray)',
          borderRadius: '8px',
          display: 'block',
          margin: '0 auto',
          background: '#d6e6f0'
        }}
      />

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          {!isPlaying ? (
            <button 
              onClick={handlePlay}
              style={{
                border: 'none',
                background: 'none',
                backgroundImage: 'url(/assets/simul/play-button.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                margin: 0
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          ) : (
            <button 
              onClick={handlePause}
              style={{
                border: 'none',
                background: 'none',
                backgroundImage: 'url(/assets/simul/pause-button.svg)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '60px',
                height: '60px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                padding: 0,
                margin: 0
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            />
          )}
          <button 
            onClick={handleReset}
            style={{
              border: 'none',
              background: 'none',
              backgroundImage: 'url(/assets/simul/reset-button.svg)',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: '60px',
              height: '60px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
              margin: 0
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
        </div>

        
      </div>
    </div>
  );
};

export default BallSimulation;
