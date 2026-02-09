'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Play, Save, Target, Scale } from 'lucide-react';

// ─── Metrics ───
const METRICS = [
  { id: 'xg', name: 'Expected Goals (xG)', icon: '📊' },
  { id: 'form', name: 'Recent Form', icon: '🔥' },
  { id: 'h2h', name: 'H2H Win Rate', icon: '⚔️' },
  { id: 'possession', name: 'Possession %', icon: '🎮' },
  { id: 'injuries', name: 'Squad Health', icon: '🏥' },
];

// ─── Branches ───
const BRANCHES = ['home', 'draw', 'away'];
const BRANCH_META = {
  home: { label: 'Home', color: '#10b981', emoji: '🏠' },
  draw: { label: 'Draw', color: '#64748b', emoji: '🤝' },
  away: { label: 'Away', color: '#f59e0b', emoji: '✈️' },
};

// ─── Layout ───
const START_X = 300;
const START_Y = 30;
const FIRST_STEP_Y = 160;
const STEP_GAP = 120;
const BRANCH_SPACING = 280;

function bx(i) {
  return START_X + (i - 1) * BRANCH_SPACING;
}

// ─── Dark mode detection ───
function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setDark(el.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ─── Theme CSS (injected once) ───
const THEME_CSS = `
  .react-flow__node-startNode,
  .react-flow__node-stepNode {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 12px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    cursor: pointer;
  }
  .react-flow__node-stepNode {
    overflow: visible !important;
  }
  .react-flow__node.selected {
    border-color: #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59,130,246,0.15);
  }
  .dark .react-flow__node-startNode,
  .dark .react-flow__node-stepNode {
    background: #1e293b;
    border-color: rgba(148,163,184,0.2);
    color: #e2e8f0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .dark .react-flow__handle {
    background: #475569;
    border-color: #64748b;
  }
  .dark .react-flow__controls button {
    background: #1e293b;
    border-color: #334155;
    fill: #94a3b8;
  }
  .dark .react-flow__controls button:hover {
    background: #334155;
  }
  .dark .react-flow__minimap {
    background: rgba(15,23,42,0.8) !important;
  }
  .rf-add-btn {
    background: #f1f5f9;
    color: #94a3b8;
    border: 1px solid #e2e8f0;
    transition: all 0.15s;
  }
  .rf-add-btn:hover {
    background: #dbeafe;
    color: #3b82f6;
    border-color: #93c5fd;
  }
  .dark .rf-add-btn {
    background: #1e293b;
    color: #64748b;
    border: 1px solid #334155;
  }
  .dark .rf-add-btn:hover {
    background: rgba(59,130,246,0.15);
    color: #60a5fa;
    border-color: rgba(59,130,246,0.3);
  }
`;

// ═══════════════════════════════
// START NODE
// ═══════════════════════════════
function StartNode() {
  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600 }}>Start</div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

// ═══════════════════════════════
// STEP NODE (with + button below)
// ═══════════════════════════════
function StepNode({ data }) {
  const hasMetric = !!data.metric;

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12,
          whiteSpace: 'nowrap',
        }}
      >
        {hasMetric ? (
          <>
            <span style={{ fontSize: 14 }}>{data.metric.icon}</span>
            <span>{data.metric.name}</span>
          </>
        ) : (
          <span style={{ opacity: 0.4 }}>Select metric</span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />

      {/* + button centered below node on the edge line */}
      <button
        className="nopan nodrag rf-add-btn"
        onClick={(e) => {
          e.stopPropagation();
          if (data.onAddAfter) data.onAddAfter(data.stepIndex);
        }}
        style={{
          position: 'absolute',
          bottom: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 18,
          height: 18,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
          zIndex: 10,
          lineHeight: 1,
          padding: 0,
        }}
      >
        +
      </button>
    </div>
  );
}

const nodeTypes = { startNode: StartNode, stepNode: StepNode };

// ═══════════════════════════════
// MAIN STUDIO COMPONENT
// ═══════════════════════════════
function StudioInner() {
  const { fitView } = useReactFlow();
  const isDark = useDarkMode();

  // ─── State ───
  const [steps, setSteps] = useState([
    {
      id: 'step-1',
      metric: null,
      branchConfig: {
        home: { edgeType: 'match', weight: 5 },
        draw: { edgeType: 'match', weight: 5 },
        away: { edgeType: 'match', weight: 5 },
      },
    },
  ]);

  const [metricModal, setMetricModal] = useState(null);
  const [nodeModal, setNodeModal] = useState(null);
  const [edgeModal, setEdgeModal] = useState(null);

  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  // ─── Actions ───
  const addStepAfter = useCallback((index) => {
    setSteps((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, {
        id: 'step-' + Date.now(),
        metric: null,
        branchConfig: {
          home: { edgeType: 'match', weight: 5 },
          draw: { edgeType: 'match', weight: 5 },
          away: { edgeType: 'match', weight: 5 },
        },
      });
      return next;
    });
  }, []);

  const deleteStep = useCallback((stepId) => {
    setSteps((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== stepId) : prev));
  }, []);

  const pickMetric = useCallback(
    (metric) => {
      if (!metricModal) return;
      setSteps((prev) =>
        prev.map((s) => (s.id === metricModal.stepId ? { ...s, metric } : s))
      );
      setMetricModal(null);
    },
    [metricModal]
  );

  const updateEdgeConfig = useCallback((stepId, branch, field, value) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        return {
          ...s,
          branchConfig: {
            ...s.branchConfig,
            [branch]: { ...s.branchConfig[branch], [field]: value },
          },
        };
      })
    );
  }, []);

  // ─── Build nodes & edges ───
  const { builtNodes, builtEdges } = useMemo(() => {
    const ns = [];
    const es = [];

    ns.push({
      id: 'start',
      type: 'startNode',
      position: { x: START_X, y: START_Y },
      data: {},
      draggable: true,
    });

    BRANCHES.forEach((branch, bi) => {
      const x = bx(bi);
      const meta = BRANCH_META[branch];

      steps.forEach((step, si) => {
        const nodeId = step.id + '-' + branch;

        ns.push({
          id: nodeId,
          type: 'stepNode',
          position: { x, y: FIRST_STEP_Y + si * STEP_GAP },
          data: {
            branch,
            stepId: step.id,
            stepIndex: si,
            metric: step.metric,
            onAddAfter: addStepAfter,
          },
          draggable: true,
        });

        if (si === 0) {
          // Branch edge: start -> first step
          es.push({
            id: 'e-start-' + branch,
            source: 'start',
            target: nodeId,
            type: 'default',
            label: meta.emoji + ' ' + meta.label,
            labelStyle: { fontSize: 10, fontWeight: 600, fill: meta.color },
            labelBgStyle: {
              fill: isDark ? '#0f172a' : '#ffffff',
              fillOpacity: 0.9,
            },
            labelBgPadding: [4, 6],
            labelBgBorderRadius: 4,
            style: { stroke: meta.color, strokeWidth: 2 },
          });
        } else {
          // Step edge: prev -> this (with edge type indicator)
          const prevId = steps[si - 1].id + '-' + branch;
          const cfg = step.branchConfig[branch];
          const indicator =
            cfg.edgeType === 'match' ? '🎯' : '⚖️ ' + cfg.weight;

          es.push({
            id: 'e-' + prevId + '-' + nodeId,
            source: prevId,
            target: nodeId,
            type: 'default',
            label: indicator,
            labelStyle: { fontSize: 11, cursor: 'pointer' },
            labelBgStyle: {
              fill: isDark ? '#0f172a' : '#ffffff',
              fillOpacity: 0.9,
            },
            labelBgPadding: [3, 5],
            labelBgBorderRadius: 4,
            style: { stroke: meta.color, strokeWidth: 1.5 },
            data: { stepId: step.id, branch },
          });
        }
      });
    });

    return { builtNodes: ns, builtEdges: es };
  }, [steps, isDark, addStepAfter]);

  const [nodes, setNodes, onNodesChange] = useNodesState(builtNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(builtEdges);

  // Sync when steps/theme change
  useEffect(() => {
    setNodes(builtNodes);
    setEdges(builtEdges);
    setTimeout(() => fitView({ padding: 0.2, duration: 200 }), 50);
  }, [builtNodes, builtEdges, setNodes, setEdges, fitView]);

  // Fit on mount
  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.2, duration: 0 }), 200);
  }, [fitView]);

  // ─── Click handlers ───
  const onNodeClick = useCallback((_, node) => {
    if (node.type !== 'stepNode') return;
    const step = stepsRef.current.find((s) => s.id === node.data.stepId);
    if (!step) return;
    if (!step.metric) {
      setMetricModal({ stepId: node.data.stepId, branch: node.data.branch });
    } else {
      setNodeModal({ stepId: node.data.stepId, branch: node.data.branch });
    }
  }, []);

  const onEdgeClick = useCallback((_, edge) => {
    if (edge.data && edge.data.stepId) {
      setEdgeModal({ stepId: edge.data.stepId, branch: edge.data.branch });
    }
  }, []);

  // ─── Modal data ───
  const nodeStep = nodeModal ? steps.find((s) => s.id === nodeModal.stepId) : null;
  const nodeEdgeCfg =
    nodeStep && nodeModal ? nodeStep.branchConfig[nodeModal.branch] : null;
  const edgeStep = edgeModal ? steps.find((s) => s.id === edgeModal.stepId) : null;
  const edgeCfg =
    edgeStep && edgeModal ? edgeStep.branchConfig[edgeModal.branch] : null;

  return (
    <div className="w-full space-y-3">
      <style>{THEME_CSS}</style>

      {/* ─── Toolbar ─── */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Strategy Studio
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addStepAfter(steps.length - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <Plus size={12} /> Step
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 transition-colors">
            <Play size={11} /> Run
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 transition-colors">
            <Save size={11} /> Save
          </button>
        </div>
      </div>

      {/* ─── Canvas ─── */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        style={{ height: 550, position: 'relative' }}
      >
        {/* Pinned context — translucent top right */}
        <div
          className="text-gray-300 dark:text-slate-700"
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            zIndex: 10,
            pointerEvents: 'none',
            fontSize: 10,
            fontWeight: 600,
            textAlign: 'right',
          }}
        >
          <div>Jackpot #12345</div>
          <div style={{ marginTop: 2, fontSize: 9 }}>17 matches</div>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          panOnDrag
          zoomOnScroll
          minZoom={0.3}
          maxZoom={2.5}
        >
          <Background
            color={isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9'}
            gap={20}
            size={1}
          />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'startNode') return '#6366f1';
              return BRANCH_META[n.data?.branch]?.color || '#64748b';
            }}
          />
        </ReactFlow>
      </div>

      {/* ═══════════ MODALS ═══════════ */}

      {/* Metric Picker */}
      {metricModal && (
        <Overlay onClose={() => setMetricModal(null)}>
          <ModalCard title="Select Metric">
            <div className="flex flex-col gap-1.5">
              {METRICS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => pickMetric(m)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    bg-gray-50 dark:bg-slate-800/60
                    border border-gray-200 dark:border-slate-700
                    hover:border-blue-300 dark:hover:border-blue-800
                    hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <span className="text-lg">{m.icon}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-slate-200">
                    {m.name}
                  </span>
                </button>
              ))}
            </div>
          </ModalCard>
        </Overlay>
      )}

      {/* Node Config (metric + edge config + delete) */}
      {nodeModal && nodeStep && nodeEdgeCfg && (
        <Overlay onClose={() => setNodeModal(null)}>
          <ModalCard
            title={
              (nodeStep.metric?.icon || '') +
              ' ' +
              (nodeStep.metric?.name || 'Configure Step')
            }
          >
            <div className="space-y-5">
              {/* Change metric */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-2">
                  Metric
                </label>
                <select
                  value={nodeStep.metric?.id || ''}
                  onChange={(e) => {
                    const m = METRICS.find((x) => x.id === e.target.value);
                    if (m) {
                      setSteps((prev) =>
                        prev.map((s) =>
                          s.id === nodeModal.stepId ? { ...s, metric: m } : s
                        )
                      );
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm
                    bg-white dark:bg-slate-800
                    border border-gray-300 dark:border-slate-600
                    text-gray-800 dark:text-slate-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  {METRICS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.icon} {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edge type for this branch */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-2">
                  Edge — {BRANCH_META[nodeModal.branch]?.emoji}{' '}
                  {BRANCH_META[nodeModal.branch]?.label}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['match', 'weight'].map((type) => {
                    const active = nodeEdgeCfg.edgeType === type;
                    const isMatch = type === 'match';
                    return (
                      <button
                        key={type}
                        onClick={() =>
                          updateEdgeConfig(
                            nodeModal.stepId,
                            nodeModal.branch,
                            'edgeType',
                            type
                          )
                        }
                        className={
                          'flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-semibold transition-all border ' +
                          (active
                            ? isMatch
                              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                              : 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 dark:border-purple-700 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500')
                        }
                      >
                        {isMatch ? <Target size={16} /> : <Scale size={16} />}
                        {isMatch ? 'Match' : 'Weight'}
                        <span className="text-[9px] font-normal opacity-60">
                          {isMatch ? 'Pass / Fail' : 'Adds points'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weight slider */}
              {nodeEdgeCfg.edgeType === 'weight' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-2">
                    Weight: {nodeEdgeCfg.weight}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={nodeEdgeCfg.weight}
                    onChange={(e) =>
                      updateEdgeConfig(
                        nodeModal.stepId,
                        nodeModal.branch,
                        'weight',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full accent-purple-500"
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 dark:text-slate-600 mt-1">
                    <span>0</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                  {nodeEdgeCfg.weight === 0 && (
                    <div className="mt-2 text-[10px] font-semibold text-center text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg py-1.5">
                      ⚠️ Weight 0 = This step will be skipped
                    </div>
                  )}
                </div>
              )}

              {/* Delete */}
              {steps.length > 1 && (
                <button
                  onClick={() => {
                    deleteStep(nodeModal.stepId);
                    setNodeModal(null);
                  }}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold transition-colors
                    bg-red-50 dark:bg-red-950/20
                    text-red-500 dark:text-red-400
                    border border-red-200 dark:border-red-900
                    hover:bg-red-100 dark:hover:bg-red-900/30"
                >
                  Delete Step
                </button>
              )}
            </div>
          </ModalCard>
        </Overlay>
      )}

      {/* Edge Config Modal (quick toggle from edge click) */}
      {edgeModal && edgeCfg && (
        <Overlay onClose={() => setEdgeModal(null)}>
          <ModalCard
            title={
              'Edge — ' +
              (BRANCH_META[edgeModal.branch]?.emoji || '') +
              ' ' +
              (BRANCH_META[edgeModal.branch]?.label || '')
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-2">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['match', 'weight'].map((type) => {
                    const active = edgeCfg.edgeType === type;
                    const isMatch = type === 'match';
                    return (
                      <button
                        key={type}
                        onClick={() =>
                          updateEdgeConfig(
                            edgeModal.stepId,
                            edgeModal.branch,
                            'edgeType',
                            type
                          )
                        }
                        className={
                          'flex flex-col items-center gap-1.5 py-3 rounded-lg text-xs font-semibold transition-all border ' +
                          (active
                            ? isMatch
                              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                              : 'bg-purple-50 dark:bg-purple-950/30 border-purple-400 dark:border-purple-700 text-purple-600 dark:text-purple-400'
                            : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500')
                        }
                      >
                        {isMatch ? <Target size={16} /> : <Scale size={16} />}
                        {isMatch ? 'Match' : 'Weight'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {edgeCfg.edgeType === 'weight' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-slate-500 mb-2">
                    Weight: {edgeCfg.weight}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    value={edgeCfg.weight}
                    onChange={(e) =>
                      updateEdgeConfig(
                        edgeModal.stepId,
                        edgeModal.branch,
                        'weight',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full accent-purple-500"
                  />
                  {edgeCfg.weight === 0 && (
                    <div className="mt-2 text-[10px] font-semibold text-center text-amber-500">
                      ⚠️ Weight 0 = step skipped
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModalCard>
        </Overlay>
      )}
    </div>
  );
}

// ═══════════════════════════════
// SHARED MODAL PIECES
// ═══════════════════════════════
function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {children}
    </div>
  );
}

function ModalCard({ title, children }) {
  return (
    <div
      className="rounded-2xl w-full max-w-sm overflow-hidden shadow-xl
        bg-white dark:bg-slate-900
        border border-gray-200 dark:border-slate-700"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-5 py-3 border-b border-gray-100 dark:border-slate-800">
        <span className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {title}
        </span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ═══════════════════════════════
// EXPORT
// ═══════════════════════════════
export default function StrategyStudio() {
  return (
    <ReactFlowProvider>
      <StudioInner />
    </ReactFlowProvider>
  );
}
