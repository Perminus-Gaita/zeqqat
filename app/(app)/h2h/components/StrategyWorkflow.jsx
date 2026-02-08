'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, RotateCcw, Zap } from 'lucide-react';

// ═══════════════════════════════════════════
// BRANCH CONFIGS
// ═══════════════════════════════════════════
const BRANCH_CONFIG = {
  home: {
    label: 'Home Win',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    textColor: '#fca5a5',
  },
  draw: {
    label: 'Draw',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.3)',
    textColor: '#fcd34d',
  },
  away: {
    label: 'Away Win',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.08)',
    border: 'rgba(20,184,166,0.3)',
    textColor: '#5eead4',
  },
};

// ═══════════════════════════════════════════
// STRATEGY STEPS PER BRANCH
// ═══════════════════════════════════════════
const BRANCH_STEPS = {
  home: [
    { id: 'h1', label: 'League Position', sub: 'Rank comparison' },
    { id: 'h2', label: 'xG Analysis', sub: 'Expected goals' },
    { id: 'h3', label: 'Home Form', sub: 'Last 5 at home' },
    { id: 'h4', label: 'Squad Health', sub: 'Key absences' },
    { id: 'h5', label: 'Verdict', sub: 'Final check', isTerminal: true },
  ],
  draw: [
    { id: 'd1', label: 'H2H History', sub: 'Past meetings' },
    { id: 'd2', label: 'Form Parity', sub: 'Similar form?' },
    { id: 'd3', label: 'Tactical Match', sub: 'Style clash' },
    { id: 'd4', label: 'Eliminated', sub: 'Low probability', isTerminal: true, eliminated: true },
  ],
  away: [
    { id: 'a1', label: 'Away Record', sub: 'Road performance' },
    { id: 'a2', label: 'Momentum', sub: 'Streak analysis' },
    { id: 'a3', label: 'Press Index', sub: 'Pressing intensity' },
    { id: 'a4', label: 'Set Pieces', sub: 'Dead-ball threat' },
    { id: 'a5', label: 'Verdict', sub: 'Final check', isTerminal: true },
  ],
};

// ═══════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════
const NODE_W = 160;
const H_GAP = 220;
const V_GAP = 130;
const BRANCH_START_X = 300;

function branchY(branchIdx) {
  return (branchIdx - 1) * V_GAP;
}
function stepX(stepIdx) {
  return BRANCH_START_X + stepIdx * H_GAP;
}

// ═══════════════════════════════════════════
// CUSTOM NODES
// ═══════════════════════════════════════════

// Root node
const RootNode = ({ data }) => {
  const { state } = data;
  const isActive = state === 'active';
  const isDone = state === 'done';
  return (
    <div
      className="px-6 py-4 rounded-2xl border-2 text-center transition-all duration-500"
      style={{
        background: isActive || isDone ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
        borderColor: isActive ? '#6366f1' : isDone ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)',
        boxShadow: isActive ? '0 0 24px rgba(99,102,241,0.3)' : 'none',
        minWidth: 150,
      }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Match Data
      </div>
      <div className="text-sm font-bold mt-1" style={{ color: isActive || isDone ? '#a5b4fc' : 'rgba(255,255,255,0.7)' }}>
        Ingestion
      </div>
      {isActive && (
        <div className="mt-2 flex justify-center">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: isDone ? '#6366f1' : 'rgba(255,255,255,0.15)', width: 8, height: 8, border: 'none' }} />
    </div>
  );
};

// Branch step node
const StepNode = ({ data }) => {
  const { label, sub, branch, state, isTerminal, eliminated } = data;
  const cfg = BRANCH_CONFIG[branch];
  const isActive = state === 'active';
  const isDone = state === 'done';
  const isEliminated = state === 'eliminated';

  let bg = 'rgba(255,255,255,0.02)';
  let borderColor = 'rgba(255,255,255,0.07)';
  let textColor = 'rgba(255,255,255,0.55)';
  let shadow = 'none';

  if (isActive) {
    bg = cfg.bg;
    borderColor = cfg.color;
    textColor = cfg.color;
    shadow = `0 0 20px ${cfg.color}40`;
  } else if (isDone) {
    bg = 'rgba(255,255,255,0.03)';
    borderColor = cfg.border;
    textColor = 'rgba(255,255,255,0.5)';
  } else if (isEliminated) {
    bg = 'rgba(255,255,255,0.01)';
    borderColor = 'rgba(255,255,255,0.04)';
    textColor = 'rgba(255,255,255,0.2)';
  }

  return (
    <div
      className="relative px-5 py-3.5 text-center transition-all duration-500"
      style={{
        background: bg,
        border: `${isActive ? 2 : 1.2}px solid ${borderColor}`,
        borderRadius: isTerminal ? 32 : 12,
        boxShadow: shadow,
        minWidth: 150,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: isDone || isActive ? cfg.color : 'rgba(255,255,255,0.1)', width: 7, height: 7, border: 'none' }} />
      {!isTerminal && (
        <Handle type="source" position={Position.Right} style={{ background: isDone ? cfg.color : 'rgba(255,255,255,0.1)', width: 7, height: 7, border: 'none' }} />
      )}

      <div className="text-[11px] font-semibold" style={{ color: textColor, transition: 'color 0.3s' }}>
        {label}
      </div>
      <div className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {sub}
      </div>

      {/* Status indicators */}
      {isActive && (
        <div className="absolute top-2 right-2">
          <div className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: cfg.color, opacity: 0.6 }} />
        </div>
      )}
      {isDone && !eliminated && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)' }}>
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      )}
      {(isEliminated || (isDone && eliminated)) && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <svg width="8" height="8" viewBox="0 0 8 8"><path d="M2 2l4 4M6 2l-4 4" stroke="#ef4444" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
        </div>
      )}
    </div>
  );
};

// Result badge node
const ResultNode = ({ data }) => {
  const { result, branch } = data;
  const cfg = BRANCH_CONFIG[branch];

  if (result === 'winner') {
    return (
      <div className="px-5 py-3 rounded-full text-center border-2 animate-in fade-in" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)' }}>
        <Handle type="target" position={Position.Left} style={{ background: '#22c55e', width: 7, height: 7, border: 'none' }} />
        <div className="text-[11px] font-bold tracking-wider" style={{ color: '#22c55e' }}>WINNER</div>
      </div>
    );
  }
  if (result === 'eliminated') {
    return (
      <div className="px-5 py-3 rounded-full text-center border" style={{ background: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.15)' }}>
        <Handle type="target" position={Position.Left} style={{ background: 'rgba(239,68,68,0.4)', width: 7, height: 7, border: 'none' }} />
        <div className="text-[10px] font-semibold tracking-wider" style={{ color: 'rgba(239,68,68,0.5)' }}>ELIMINATED</div>
      </div>
    );
  }
  return (
    <div className="px-5 py-3 rounded-full text-center border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <Handle type="target" position={Position.Left} style={{ background: 'rgba(255,255,255,0.15)', width: 7, height: 7, border: 'none' }} />
      <div className="text-[10px] font-semibold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>SURVIVED</div>
    </div>
  );
};

const nodeTypes = { rootNode: RootNode, stepNode: StepNode, resultNode: ResultNode };

// ═══════════════════════════════════════════
// BUILD NODES & EDGES
// ═══════════════════════════════════════════
function buildInitialGraph() {
  const nodes = [];
  const edges = [];

  // Root node
  nodes.push({
    id: 'root',
    type: 'rootNode',
    position: { x: 0, y: 0 },
    data: { state: null },
    draggable: false,
  });

  const branchKeys = ['home', 'draw', 'away'];

  branchKeys.forEach((bKey, bi) => {
    const steps = BRANCH_STEPS[bKey];
    const y = branchY(bi);

    steps.forEach((step, si) => {
      const nodeId = step.id;
      nodes.push({
        id: nodeId,
        type: 'stepNode',
        position: { x: stepX(si), y },
        data: {
          label: step.label,
          sub: step.sub,
          branch: bKey,
          state: null,
          isTerminal: step.isTerminal || false,
          eliminated: step.eliminated || false,
        },
        draggable: false,
      });

      // Edge from previous
      const sourceId = si === 0 ? 'root' : steps[si - 1].id;
      edges.push({
        id: `e-${sourceId}-${nodeId}`,
        source: sourceId,
        target: nodeId,
        animated: false,
        style: { stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1.5 },
        type: 'default',
      });
    });

    // Result node at the end of each branch
    const lastStep = steps[steps.length - 1];
    const resultId = `result-${bKey}`;
    nodes.push({
      id: resultId,
      type: 'resultNode',
      position: { x: stepX(steps.length), y },
      data: { result: 'pending', branch: bKey },
      draggable: false,
      hidden: true,
    });
    edges.push({
      id: `e-${lastStep.id}-${resultId}`,
      source: lastStep.id,
      target: resultId,
      animated: false,
      style: { stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 },
    });
  });

  return { nodes, edges };
}

// ═══════════════════════════════════════════
// INNER FLOW COMPONENT (needs ReactFlowProvider above)
// ═══════════════════════════════════════════
const WorkflowInner = ({ onRunStateChange }) => {
  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildInitialGraph(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const { fitView, setCenter } = useReactFlow();

  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef(null);

  const maxSteps = Math.max(...Object.values(BRANCH_STEPS).map(s => s.length));
  const branchKeys = ['home', 'draw', 'away'];

  // Fit view on mount
  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.15, duration: 0 }), 100);
  }, [fitView]);

  // ── Update node/edge states based on activeMap ──
  const applyStates = useCallback((activeMap, showResults) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === 'root') {
        return { ...node, data: { ...node.data, state: activeMap.root || null } };
      }
      if (node.type === 'resultNode') {
        if (!showResults) return { ...node, hidden: true };
        const bKey = node.id.replace('result-', '');
        const steps = BRANCH_STEPS[bKey];
        const lastStep = steps[steps.length - 1];
        let result = 'survived';
        if (lastStep.eliminated) result = 'eliminated';
        if (bKey === 'home') result = 'winner'; // demo: home wins
        return { ...node, hidden: false, data: { ...node.data, result } };
      }
      if (node.type === 'stepNode') {
        const state = activeMap[node.id] || null;
        return { ...node, data: { ...node.data, state } };
      }
      return node;
    }));

    setEdges(prevEdges => prevEdges.map(edge => {
      const targetState = activeMap[edge.target];
      const sourceState = activeMap[edge.source];
      const isLit = sourceState === 'done' || sourceState === 'eliminated' || targetState === 'active';
      const isElim = sourceState === 'eliminated';

      // Find which branch this edge belongs to
      let edgeColor = 'rgba(255,255,255,0.07)';
      for (const bKey of branchKeys) {
        const stepIds = BRANCH_STEPS[bKey].map(s => s.id);
        if (stepIds.includes(edge.target) || edge.target === `result-${bKey}`) {
          if (isLit && !isElim) edgeColor = BRANCH_CONFIG[bKey].color;
          break;
        }
      }

      return {
        ...edge,
        animated: isLit && !isElim,
        style: {
          stroke: isElim ? 'rgba(255,255,255,0.04)' : isLit ? edgeColor : 'rgba(255,255,255,0.07)',
          strokeWidth: isLit ? 2 : 1.5,
          opacity: isElim ? 0.3 : isLit ? 0.7 : 0.4,
        },
      };
    }));
  }, [setNodes, setEdges, branchKeys]);

  // ── Camera follow: pan to active column ──
  const panToStep = useCallback((stepIdx) => {
    if (stepIdx < 0) {
      // Root node
      setCenter(0, 0, { zoom: 0.85, duration: 600 });
      return;
    }
    const x = stepX(stepIdx) + 80;
    const y = 0;
    const progress = stepIdx / (maxSteps - 1);
    const zoom = 0.7 + progress * 0.2;
    setCenter(x, y, { zoom, duration: 700 });
  }, [setCenter, maxSteps]);

  // ── Run strategy ──
  const runStrategy = useCallback(() => {
    if (running) return;
    setRunning(true);
    setDone(false);
    if (onRunStateChange) onRunStateChange('running');

    const activeMap = { root: 'active' };
    applyStates(activeMap, false);
    panToStep(-1);

    let step = 0;
    const tick = () => {
      // Mark root done on first tick
      if (step === 0) activeMap.root = 'done';

      // Update branch states
      branchKeys.forEach(bKey => {
        const branchSteps = BRANCH_STEPS[bKey];
        // Mark previous step as done
        if (step > 0 && step - 1 < branchSteps.length) {
          const prev = branchSteps[step - 1];
          activeMap[prev.id] = prev.eliminated ? 'eliminated' : 'done';
        }
        // Mark current as active (if branch not eliminated)
        if (step < branchSteps.length) {
          const alreadyElim = branchSteps.slice(0, step).some(s => s.eliminated);
          if (!alreadyElim) {
            activeMap[branchSteps[step].id] = 'active';
          }
        }
      });

      applyStates({ ...activeMap }, false);
      panToStep(step);
      step++;

      if (step > maxSteps) {
        // Done
        applyStates({ ...activeMap }, true);
        setRunning(false);
        setDone(true);
        if (onRunStateChange) onRunStateChange('done');
        // Zoom out to show full picture
        setTimeout(() => fitView({ padding: 0.12, duration: 900 }), 600);
        return;
      }

      timerRef.current = setTimeout(tick, 900);
    };

    timerRef.current = setTimeout(tick, 700);
  }, [running, applyStates, panToStep, fitView, maxSteps, branchKeys, onRunStateChange]);

  // ── Reset ──
  const resetStrategy = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRunning(false);
    setDone(false);
    if (onRunStateChange) onRunStateChange('idle');
    // Reset all states
    setNodes(prevNodes => prevNodes.map(n => ({
      ...n,
      hidden: n.type === 'resultNode' ? true : false,
      data: { ...n.data, state: null, result: n.type === 'resultNode' ? 'pending' : undefined },
    })));
    setEdges(prevEdges => prevEdges.map(e => ({
      ...e,
      animated: false,
      style: { stroke: 'rgba(255,255,255,0.07)', strokeWidth: 1.5, opacity: 0.4 },
    })));
    setTimeout(() => fitView({ padding: 0.15, duration: 400 }), 50);
  }, [setNodes, setEdges, fitView, onRunStateChange]);

  // Cleanup
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #0f1019 50%, #0a0f14 100%)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Strategy Workflow
          </span>
          {done && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
              Complete
            </span>
          )}
          {running && (
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
              Running...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {done ? (
            <button onClick={resetStrategy} className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
              <RotateCcw size={11} /> Reset
            </button>
          ) : (
            <button
              onClick={runStrategy}
              disabled={running}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold transition-all"
              style={{
                background: running ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: running ? '#818cf8' : '#fff',
                opacity: running ? 0.7 : 1,
              }}
            >
              {running ? <Zap size={11} className="animate-pulse" /> : <Play size={11} />}
              {running ? 'Running...' : 'Run Strategy'}
            </button>
          )}
        </div>
      </div>

      {/* React Flow Canvas */}
      <div style={{ height: 340 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          zoomOnScroll
          minZoom={0.3}
          maxZoom={2}
        >
          <Background color="rgba(255,255,255,0.03)" gap={25} size={1} />
          <Controls
            showInteractive={false}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
          />
          <MiniMap
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}
            nodeColor={(node) => {
              if (node.type === 'rootNode') return '#6366f1';
              if (node.data?.branch) return BRANCH_CONFIG[node.data.branch]?.color || '#64748b';
              return '#64748b';
            }}
            maskColor="rgba(0,0,0,0.6)"
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {Object.entries(BRANCH_CONFIG).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1">
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, opacity: 0.7 }} />
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, fontWeight: 600, letterSpacing: '0.5px' }}>{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════
// EXPORTED WRAPPER WITH PROVIDER
// ═══════════════════════════════════════════
const StrategyWorkflow = ({ onRunStateChange }) => {
  return (
    <ReactFlowProvider>
      <WorkflowInner onRunStateChange={onRunStateChange} />
    </ReactFlowProvider>
  );
};

export default StrategyWorkflow;
