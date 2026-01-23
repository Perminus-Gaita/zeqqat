"use client";
import React, { useState, useRef, useCallback, useEffect } from 'react';

const BellCurve = ({ totalGames: initialGames = 17 }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [lockedPoint, setLockedPoint] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(null);
  const [totalGames, setTotalGames] = useState(initialGames);
  const svgRef = useRef(null);

  const width = 1200;
  const height = 500;
  const padding = 60;

  const calculateOddsData = useCallback((n) => {
    const data = [];
    
    const choose = (n, k) => {
      if (k > n) return 0;
      if (k === 0 || k === n) return 1;
      let result = 1;
      for (let i = 1; i <= k; i++) {
        result *= (n - i + 1) / i;
      }
      return result;
    };

    for (let k = 0; k <= n; k++) {
      const combinations = choose(n, k) * Math.pow(2, n - k);
      const totalCombinations = Math.pow(3, n);
      const percentage = (combinations / totalCombinations) * 100;
      const odds = Math.round(totalCombinations / combinations);
      
      let status = 'NO PRIZE';
      if (k === n) {
        status = 'MEGA JACKPOT';
      } else if (k >= Math.max(n - 5, Math.ceil(n * 0.7))) {
        status = 'BONUS';
      }
      
      data.push({
        score: k,
        percentage: percentage,
        odds: odds,
        combinations: combinations,
        status: status
      });
    }
    
    return data;
  }, []);

  const oddsData = calculateOddsData(totalGames);
  const maxPercentage = Math.max(...oddsData.map(d => d.percentage));

  useEffect(() => {
    if (!lockedPoint && !hoveredPoint) {
      const peakPoint = oddsData.reduce((max, d) => d.percentage > max.percentage ? d : max);
      const peakIndex = oddsData.findIndex(d => d.score === peakPoint.score);
      const x = padding + (peakIndex / (oddsData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (peakPoint.percentage / maxPercentage) * (height - 2 * padding);
      setHoveredPoint({ x, y, data: peakPoint });
    }
  }, [totalGames, oddsData, lockedPoint, hoveredPoint, maxPercentage]);

  const createCurvePath = () => {
    const points = oddsData.map((d, i) => {
      const x = padding + (i / (oddsData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (d.percentage / maxPercentage) * (height - 2 * padding);
      return { x, y, data: d };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;
      path += ` Q ${controlX} ${current.y}, ${controlX} ${controlY}`;
      path += ` Q ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }

    return { path, points };
  };

  const { path: curvePath, points } = createCurvePath();

  const createAreaPath = () => {
    const baseY = height - padding;
    return `${curvePath} L ${width - padding} ${baseY} L ${padding} ${baseY} Z`;
  };

  const handleMouseMove = (e) => {
    if (lockedPoint) return;
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    
    const scaleX = width / svgRect.width;
    const scaleY = height / svgRect.height;
    const mouseX = (e.clientX - svgRect.left) * scaleX;
    const mouseY = (e.clientY - svgRect.top) * scaleY;
    
    if (mouseX < padding || mouseX > width - padding || mouseY < 0 || mouseY > height) {
      setCursorPosition(null);
      return;
    }

    setCursorPosition({ x: mouseX, y: mouseY });
    
    let closestPoint = null;
    let minDistance = Infinity;
    
    points.forEach(point => {
      const distance = Math.abs(point.x - mouseX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    if (closestPoint && minDistance < 50) {
      setHoveredPoint(closestPoint);
    }
  };

  const handleClick = (e) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = width / svgRect.width;
    const mouseX = (e.clientX - svgRect.left) * scaleX;
    
    let closestPoint = null;
    let minDistance = Infinity;
    
    points.forEach(point => {
      const distance = Math.abs(point.x - mouseX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    if (closestPoint && minDistance < 50) {
      if (lockedPoint?.data.score === closestPoint.data.score) {
        setLockedPoint(null);
      } else {
        setLockedPoint(closestPoint);
        setHoveredPoint(closestPoint);
      }
    } else {
      setLockedPoint(null);
    }
  };

  const handleMouseLeave = () => {
    if (!lockedPoint) {
      setCursorPosition(null);
      const peakPoint = oddsData.reduce((max, d) => d.percentage > max.percentage ? d : max);
      const peakIndex = oddsData.findIndex(d => d.score === peakPoint.score);
      const x = padding + (peakIndex / (oddsData.length - 1)) * (width - 2 * padding);
      const y = height - padding - (peakPoint.percentage / maxPercentage) * (height - 2 * padding);
      setHoveredPoint({ x, y, data: peakPoint });
    }
  };

  const getColorForScore = (score) => {
    if (score === totalGames) return '#fbbf24';
    if (score >= Math.max(totalGames - 5, Math.ceil(totalGames * 0.7))) return '#a855f7';
    if (score >= Math.ceil(totalGames * 0.5)) return '#3b82f6';
    return '#10b981';
  };

  const activePoint = lockedPoint || hoveredPoint;

  const formatPercentage = (percentage) => {
    if (percentage === 0) return "0.00";
    
    if (percentage >= 1) {
      return percentage.toFixed(2);
    }
    
    let str = percentage.toFixed(20);
    let dotIndex = str.indexOf('.');
    let nonZeroCount = 0;
    let lastNonZeroIndex = dotIndex;
    
    for (let i = dotIndex + 1; i < str.length; i++) {
      if (str[i] !== '0') {
        nonZeroCount++;
        lastNonZeroIndex = i;
        if (nonZeroCount >= 2) break;
      }
    }
    
    let decimalPlaces = lastNonZeroIndex - dotIndex;
    return percentage.toFixed(decimalPlaces);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-foreground text-center">Probability Distribution</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">
          Tap any point to see odds for that score
        </p>
      </div>

      {/* Compact Stats Panel */}
      {activePoint && (
        <div 
          className="px-4 py-3 border-b-2"
          style={{ borderColor: getColorForScore(activePoint.data.score) }}
        >
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {/* Score */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Score</div>
              <div className="text-sm font-bold" 
                style={{ color: getColorForScore(activePoint.data.score) }}>
                {activePoint.data.score}/{totalGames}
              </div>
            </div>

            {/* Odds */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Odds</div>
              <div className="text-sm font-bold text-purple-400">
                1 in {activePoint.data.odds.toLocaleString()}
              </div>
            </div>

            {/* Probability */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Probability</div>
              <div className="text-sm font-bold text-foreground">
                {formatPercentage(activePoint.data.percentage)}%
              </div>
            </div>

            {/* Prize */}
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Prize</div>
              <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                activePoint.data.status === 'MEGA JACKPOT' ? 'bg-yellow-500 text-black' :
                activePoint.data.status === 'BONUS' ? 'bg-purple-500 text-white' :
                'bg-muted text-foreground'
              }`}>
                {activePoint.data.status}
                {lockedPoint && ' 🔒'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The Bell Curve */}
      <div className="p-2">
        <svg
          ref={svgRef}
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="cursor-pointer"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines - Y axis labels */}
          {[0, 25, 50, 75, 100].map((percent) => {
            const y = height - padding - (percent / 100) * (height - 2 * padding);
            return (
              <g key={percent}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text
                  x={padding - 15}
                  y={y + 5}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="14"
                  textAnchor="end"
                >
                  {percent}%
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {oddsData.map((d, i) => {
            const x = padding + (i / (oddsData.length - 1)) * (width - 2 * padding);
            const isActive = activePoint?.data.score === d.score;
            const showLabel = totalGames <= 13 || i % 2 === 0;
            
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={height - padding}
                  x2={x}
                  y2={height - padding + 6}
                  stroke={isActive ? getColorForScore(d.score) : "hsl(var(--muted-foreground))"}
                  strokeWidth={isActive ? "2" : "1"}
                />
                {showLabel && (
                  <text
                    x={x}
                    y={height - padding + 22}
                    fill={isActive ? getColorForScore(d.score) : "hsl(var(--muted-foreground))"}
                    fontSize="14"
                    fontWeight={isActive ? "bold" : "normal"}
                    textAnchor="middle"
                  >
                    {d.score}
                  </text>
                )}
              </g>
            );
          })}

          <path d={createAreaPath()} fill="url(#curveGradient)" />
          <path
            d={curvePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />

          {cursorPosition && !lockedPoint && (
            <line
              x1={cursorPosition.x}
              y1={0}
              x2={cursorPosition.x}
              y2={height - padding}
              stroke="hsl(var(--foreground))"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.3"
              pointerEvents="none"
            />
          )}

          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={activePoint.y}
                x2={activePoint.x}
                y2={height - padding}
                stroke={getColorForScore(activePoint.data.score)}
                strokeWidth="6"
                opacity="0.3"
                filter="url(#glow)"
              />
              <line
                x1={activePoint.x}
                y1={activePoint.y}
                x2={activePoint.x}
                y2={height - padding}
                stroke={getColorForScore(activePoint.data.score)}
                strokeWidth="2.5"
                strokeDasharray="6 3"
                opacity="0.9"
              >
                {!lockedPoint && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="18"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </line>
              <line
                x1={padding}
                y1={activePoint.y}
                x2={activePoint.x}
                y2={activePoint.y}
                stroke={getColorForScore(activePoint.data.score)}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.5"
              />
            </g>
          )}

          {points.map((point, i) => {
            const isActive = activePoint?.data.score === point.data.score;
            const isLocked = lockedPoint?.data.score === point.data.score;
            const color = getColorForScore(point.data.score);
            
            return (
              <g key={i}>
                {isActive && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={18}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.3"
                  >
                    <animate attributeName="r" from="18" to="24" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 9 : 5}
                  fill={color}
                  stroke="hsl(var(--background))"
                  strokeWidth={isActive ? "2.5" : "1.5"}
                  style={{ 
                    filter: isActive ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-out'
                  }}
                />
                
                {isLocked && (
                  <text x={point.x} y={point.y - 14} fontSize="12" textAnchor="middle">🔒</text>
                )}
                
                {(point.data.status === 'MEGA JACKPOT' || point.data.status === 'BONUS') && (
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 14 : 10}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.4"
                    style={{ transition: 'all 0.2s ease-out' }}
                  />
                )}
              </g>
            );
          })}

          {/* Axis titles */}
          <text x={width / 2} y={height - 5} fill="hsl(var(--muted-foreground))" fontSize="14" textAnchor="middle" fontWeight="600">
            Number of Correct Predictions
          </text>
          <text x={20} y={height / 2} fill="hsl(var(--muted-foreground))" fontSize="14" textAnchor="middle" fontWeight="600" transform={`rotate(-90, 20, ${height / 2})`}>
            Probability (%)
          </text>
        </svg>
      </div>

      {/* Slider */}
      <div className="px-4 pb-4" style={{ marginTop: '-10px' }}>
        <input
          type="range"
          min="5"
          max="20"
          value={totalGames}
          onChange={(e) => {
            setTotalGames(parseInt(e.target.value));
            setLockedPoint(null);
          }}
          className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-500"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((totalGames - 5) / 15) * 100}%, hsl(var(--muted)) ${((totalGames - 5) / 15) * 100}%, hsl(var(--muted)) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>5</span>
          <span className="text-foreground font-semibold">{totalGames}</span>
          <span>20</span>
        </div>
      </div>
    </div>
  );
};

export default BellCurve;