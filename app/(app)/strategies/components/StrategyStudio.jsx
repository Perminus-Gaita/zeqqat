'use client';

import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Save, Plus, Trash2 } from 'lucide-react';

// ============================================
// DUMMY MATCH DATA
// ============================================
const DUMMY_MATCHES = Array.from({ length: 17 }, (_, i) => ({
  id: i + 1,
  homeTeam: `Team ${i + 1}A`,
  awayTeam: `Team ${i + 1}B`,
  homeOdds: parseFloat((Math.random() * 2 + 1.2).toFixed(2)),
  drawOdds: parseFloat((Math.random() * 1.5 + 2.8).toFixed(2)),
  awayOdds: parseFloat((Math.random() * 3 + 2.5).toFixed(2)),
  homeForm: Math.floor(Math.random() * 6),
  awayForm: Math.floor(Math.random() * 6),
  isDerby: Math.random() > 0.8,
}));

// ============================================
// CUSTOM NODE: START
// ============================================
const StartNode = ({ data }) => {
  return (
    <div className="px-8 py-5 shadow-xl rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600">
      <div className="text-white text-center">
        <div className="text-sm font-semibold text-slate-400 mb-2">START</div>
        <div className="text-3xl font-bold mb-1">17 Matches</div>
        {data.results && (
          <div className="text-xs text-slate-400 mt-2">
            {data.results.total} evaluated
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CUSTOM NODE: BRANCH HEAD
// ============================================
const BranchNode = ({ data, id }) => {
  const colors = {
    HOME: { 
      bg: 'bg-gradient-to-br from-emerald-700 to-emerald-800', 
      border: 'border-emerald-500', 
      text: 'text-emerald-50',
      hover: 'hover:from-emerald-600 hover:to-emerald-700'
    },
    DRAW: { 
      bg: 'bg-gradient-to-br from-blue-700 to-blue-800', 
      border: 'border-blue-500', 
      text: 'text-blue-50',
      hover: 'hover:from-blue-600 hover:to-blue-700'
    },
    AWAY: { 
      bg: 'bg-gradient-to-br from-purple-700 to-purple-800', 
      border: 'border-purple-500', 
      text: 'text-purple-50',
      hover: 'hover:from-purple-600 hover:to-purple-700'
    },
  };

  const color = colors[data.armType] || colors.HOME;

  return (
    <div className={`px-6 py-5 shadow-xl rounded-xl ${color.bg} border-2 ${color.border} min-w-[260px]`}>
      <div className={color.text}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">
            {data.armType === 'HOME' && '🏠 HOME'}
            {data.armType === 'DRAW' && '🤝 DRAW'}
            {data.armType === 'AWAY' && '✈️ AWAY'}
          </div>
        </div>

        <select
          value={data.logicType}
          onChange={(e) => data.onLogicChange(id, e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900 text-white border border-slate-600 mb-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="AND">AND (All must pass)</option>
          <option value="OR">OR (Any can pass)</option>
          <option value="WEIGHTED">WEIGHTED (Score sum)</option>
        </select>

        <button
          onClick={() => data.onAddCondition(id)}
          className={`w-full py-2.5 bg-slate-900 ${color.hover} rounded-lg text-sm font-medium transition-all border border-slate-600 flex items-center justify-center gap-2`}
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </button>

        {data.results && (
          <div className="mt-4 pt-4 border-t border-slate-600">
            <div className="text-lg font-semibold">
              {data.results.count} picks
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// CUSTOM NODE: CONDITION
// ============================================
const ConditionNode = ({ data, id }) => {
  return (
    <div className="px-5 py-4 shadow-lg rounded-xl bg-slate-700 border-2 border-slate-500 min-w-[240px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-slate-200">CONDITION</div>
        <button
          onClick={() => data.onDelete(id)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <select
          value={data.field}
          onChange={(e) => data.onUpdate(id, { field: e.target.value })}
          className="w-full px-3 py-2 text-sm rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="homeOdds">Home Odds</option>
          <option value="drawOdds">Draw Odds</option>
          <option value="awayOdds">Away Odds</option>
          <option value="homeForm">Home Form</option>
          <option value="awayForm">Away Form</option>
          <option value="isDerby">Derby Match</option>
        </select>

        <div className="flex gap-2">
          <select
            value={data.operator}
            onChange={(e) => data.onUpdate(id, { operator: e.target.value })}
            className="w-16 px-2 py-2 text-sm rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="<">&lt;</option>
            <option value="<=">&le;</option>
            <option value=">">&gt;</option>
            <option value=">=">&ge;</option>
            <option value="==">==</option>
          </select>

          <input
            type="number"
            step="0.1"
            value={data.value}
            onChange={(e) => data.onUpdate(id, { value: parseFloat(e.target.value) })}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        {data.showWeight && (
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-sm font-medium">Weight:</span>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => data.onUpdate(id, { weight: parseInt(e.target.value) })}
              className="w-20 px-3 py-2 text-sm rounded-lg bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <span className="text-sm">%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// NODE TYPES
// ============================================
const nodeTypes = {
  startNode: StartNode,
  branchNode: BranchNode,
  conditionNode: ConditionNode,
};

// ============================================
// EDGE STYLES - BRIGHT AND VISIBLE!
// ============================================
const defaultEdgeOptions = {
  animated: true,
  style: { 
    stroke: '#3b82f6',  // Bright blue - very visible!
    strokeWidth: 3 
  },
  markerEnd: { 
    type: MarkerType.ArrowClosed, 
    color: '#3b82f6',
    width: 20,
    height: 20
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function StrategyStudio() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [results, setResults] = useState(null);
  const [hasRun, setHasRun] = useState(false);

  const handlersRef = useRef({});

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ 
      ...params, 
      ...defaultEdgeOptions
    }, eds)),
    [setEdges]
  );

  const handleLogicChange = useCallback((nodeId, logicType) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              logicType,
            },
          };
          return updatedNode;
        }
        if (node.type === 'conditionNode' && node.data.parentBranch === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              showWeight: logicType === 'WEIGHTED',
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleAddCondition = useCallback((branchId) => {
    setNodes((nds) => {
      const branchNode = nds.find((n) => n.id === branchId);
      const conditionsUnderBranch = nds.filter(
        (n) => n.type === 'conditionNode' && n.data.parentBranch === branchId
      );

      const newNodeId = `condition-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: 'conditionNode',
        position: {
          x: branchNode.position.x,
          y: branchNode.position.y + 180 + conditionsUnderBranch.length * 150,
        },
        data: {
          parentBranch: branchId,
          field: 'homeOdds',
          operator: '<',
          value: 1.5,
          weight: 40,
          showWeight: branchNode.data.logicType === 'WEIGHTED',
          onUpdate: handlersRef.current.handleUpdateCondition,
          onDelete: handlersRef.current.handleDeleteCondition,
        },
      };

      return [...nds, newNode];
    });

    setEdges((eds) => {
      const conditionsUnderBranch = nodes.filter(
        (n) => n.type === 'conditionNode' && n.data.parentBranch === branchId
      );
      
      const sourceNodeId = conditionsUnderBranch.length === 0 
        ? branchId 
        : conditionsUnderBranch[conditionsUnderBranch.length - 1].id;

      const newNodeId = `condition-${Date.now()}`;
      const newEdge = {
        id: `e${sourceNodeId}-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        ...defaultEdgeOptions,
        animated: false,  // Don't animate condition connections
      };

      return [...eds, newEdge];
    });
  }, [nodes, setNodes, setEdges]);

  const handleUpdateCondition = useCallback((nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleDeleteCondition = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  }, [setNodes, setEdges]);

  handlersRef.current = {
    handleLogicChange,
    handleAddCondition,
    handleUpdateCondition,
    handleDeleteCondition,
  };

  // Initialize nodes only once
  React.useEffect(() => {
    if (nodes.length === 0) {
      const initialNodes = [
        {
          id: '1',
          type: 'startNode',
          position: { x: 400, y: 50 },
          data: { label: 'START' },
        },
        {
          id: '2',
          type: 'branchNode',
          position: { x: 100, y: 250 },
          data: {
            armType: 'HOME',
            logicType: 'AND',
            onLogicChange: handleLogicChange,
            onAddCondition: handleAddCondition,
          },
        },
        {
          id: '3',
          type: 'branchNode',
          position: { x: 400, y: 250 },
          data: {
            armType: 'DRAW',
            logicType: 'OR',
            onLogicChange: handleLogicChange,
            onAddCondition: handleAddCondition,
          },
        },
        {
          id: '4',
          type: 'branchNode',
          position: { x: 700, y: 250 },
          data: {
            armType: 'AWAY',
            logicType: 'WEIGHTED',
            onLogicChange: handleLogicChange,
            onAddCondition: handleAddCondition,
          },
        },
      ];

      const initialEdges = [
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          ...defaultEdgeOptions,
        },
        {
          id: 'e1-3',
          source: '1',
          target: '3',
          ...defaultEdgeOptions,
        },
        {
          id: 'e1-4',
          source: '1',
          target: '4',
          ...defaultEdgeOptions,
        },
      ];

      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, []);

  const evaluateCondition = (match, condition) => {
    const value = match[condition.field];
    switch (condition.operator) {
      case '<': return value < condition.value;
      case '<=': return value <= condition.value;
      case '>': return value > condition.value;
      case '>=': return value >= condition.value;
      case '==': return value === condition.value;
      default: return false;
    }
  };

  const runStrategy = () => {
    const branchNodes = nodes.filter((n) => n.type === 'branchNode');
    const conditionNodes = nodes.filter((n) => n.type === 'conditionNode');

    const predictions = DUMMY_MATCHES.map((match) => {
      const armResults = branchNodes.map((branch) => {
        const branchConditions = conditionNodes.filter((c) => c.data.parentBranch === branch.id);

        if (branchConditions.length === 0) {
          return { arm: branch.data.armType, passed: false, confidence: 0 };
        }

        let passed = false;
        let confidence = 0;

        if (branch.data.logicType === 'AND') {
          passed = branchConditions.every((c) => evaluateCondition(match, c.data));
          confidence = passed ? 100 : 0;
        } else if (branch.data.logicType === 'OR') {
          passed = branchConditions.some((c) => evaluateCondition(match, c.data));
          confidence = passed ? 100 : 0;
        } else if (branch.data.logicType === 'WEIGHTED') {
          confidence = branchConditions.reduce((sum, c) => {
            return sum + (evaluateCondition(match, c.data) ? c.data.weight : 0);
          }, 0);
          passed = confidence >= 70;
        }

        return { arm: branch.data.armType, passed, confidence };
      });

      const passedArms = armResults.filter((r) => r.passed);

      if (passedArms.length === 0) {
        return { match, prediction: 'SKIP', reason: 'No arm passed' };
      } else if (passedArms.length === 1) {
        return { match, prediction: passedArms[0].arm, reason: `${passedArms[0].arm} arm passed` };
      } else {
        const winner = passedArms.reduce((a, b) => (a.confidence > b.confidence ? a : b));
        return { match, prediction: winner.arm, reason: `Highest confidence: ${winner.arm}` };
      }
    });

    const summary = {
      total: predictions.length,
      home: predictions.filter((p) => p.prediction === 'HOME').length,
      draw: predictions.filter((p) => p.prediction === 'DRAW').length,
      away: predictions.filter((p) => p.prediction === 'AWAY').length,
      skip: predictions.filter((p) => p.prediction === 'SKIP').length,
    };

    setResults({ predictions, summary });
    setHasRun(true);

    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'startNode') {
          return { ...node, data: { ...node.data, results: summary } };
        }
        if (node.type === 'branchNode') {
          const count = summary[node.data.armType.toLowerCase()];
          return { ...node, data: { ...node.data, results: { count } } };
        }
        return node;
      })
    );
  };

  const saveStrategy = () => {
    console.log('Saving strategy:', { nodes, edges });
    alert('Strategy saved! (Database integration pending)');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Strategy Studio</h2>
        <p className="text-sm text-gray-600 dark:text-slate-300">
          Build your betting strategy using visual workflows. Each arm evaluates all 17 matches independently.
        </p>
      </div>

      {/* React Flow Canvas - WHITE BACKGROUND FOR VISIBILITY! */}
      <div className="bg-white border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden" style={{ height: '700px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Controls className="bg-white border border-gray-300 shadow-lg" />
          <MiniMap 
            className="bg-gray-100 border border-gray-300 shadow-lg" 
            nodeColor={(node) => {
              if (node.type === 'startNode') return '#475569';
              if (node.type === 'branchNode') {
                if (node.data.armType === 'HOME') return '#10b981';
                if (node.data.armType === 'DRAW') return '#3b82f6';
                if (node.data.armType === 'AWAY') return '#a855f7';
              }
              return '#64748b';
            }}
          />
          <Background 
            color="#e5e7eb" 
            gap={20} 
            size={1}
          />
        </ReactFlow>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
        <button
          onClick={runStrategy}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Play className="w-5 h-5" />
          Test Strategy
        </button>

        <button
          onClick={saveStrategy}
          disabled={!hasRun}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5" />
          Save Strategy
        </button>
      </div>

      {/* Results Panel */}
      {hasRun && results && (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Test Results</h3>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-100 dark:bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{results.summary.total}</div>
              <div className="text-sm text-gray-600 dark:text-slate-300 mt-1">Total</div>
            </div>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{results.summary.home}</div>
              <div className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">Home</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{results.summary.draw}</div>
              <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">Draw</div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{results.summary.away}</div>
              <div className="text-sm text-purple-600 dark:text-purple-300 mt-1">Away</div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-400">{results.summary.skip}</div>
              <div className="text-sm text-orange-600 dark:text-orange-300 mt-1">Skip</div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.predictions.map((pred, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    #{pred.match.id} {pred.match.homeTeam} vs {pred.match.awayTeam}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                    Odds: {pred.match.homeOdds} / {pred.match.drawOdds} / {pred.match.awayOdds}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${
                      pred.prediction === 'HOME'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : pred.prediction === 'DRAW'
                        ? 'text-blue-700 dark:text-blue-400'
                        : pred.prediction === 'AWAY'
                        ? 'text-purple-700 dark:text-purple-400'
                        : 'text-orange-700 dark:text-orange-400'
                    }`}
                  >
                    {pred.prediction === 'HOME' && '🏠 HOME'}
                    {pred.prediction === 'DRAW' && '🤝 DRAW'}
                    {pred.prediction === 'AWAY' && '✈️ AWAY'}
                    {pred.prediction === 'SKIP' && '⏭️ SKIP'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">{pred.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
