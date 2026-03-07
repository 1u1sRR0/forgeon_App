'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Search, Grid3x3, List, TrendingUp, BarChart3, Database, Activity, X } from 'lucide-react';
import { MarketIntelItem } from '@/modules/marketIntel/marketIntelTypes';

type TabType = 'TREND' | 'SECTOR_INSIGHT' | 'STARTUP_DATA' | 'DEMAND_INDICATOR';

const TABS = [
  { id: 'TREND' as TabType, label: 'Trend Analysis', icon: TrendingUp },
  { id: 'SECTOR_INSIGHT' as TabType, label: 'Sector Insights', icon: BarChart3 },
  { id: 'STARTUP_DATA' as TabType, label: 'Startup Data', icon: Database },
  { id: 'DEMAND_INDICATOR' as TabType, label: 'Demand Indicators', icon: Activity },
];

export default function MarketIntelligencePage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>('TREND');
  const [items, setItems] = useState<MarketIntelItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketIntelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MarketIntelItem | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  useEffect(() => {
    if (session?.user) {
      fetchItems();
    }
  }, [session]);

  useEffect(() => {
    let filtered = items.filter(item => item.type === activeTab);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.sector.toLowerCase().includes(query)
      );
    }
    setFilteredItems(filtered);
  }, [items, activeTab, searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/market-intelligence/items');
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await fetch('/api/market-intelligence/generate', { method: 'POST' });
      const data = await res.json();
      if (data.items) setItems(data.items);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveToProject = async (item: MarketIntelItem) => {
    setSelectedItem(item);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) setProjects(data.projects);
    } catch (error) {
      console.error('Error:', error);
    }
    setShowSaveDialog(true);
  };

  const confirmSaveToProject = async () => {
    if (!selectedItem || !selectedProjectId) return;
    try {
      await fetch(`/api/projects/${selectedProjectId}/research/attach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intelItemId: selectedItem.id }),
      });
      alert('Attached!');
      setShowSaveDialog(false);
      setSelectedItem(null);
      setSelectedProjectId('');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed');
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-primary)' }}>Please log in</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <div 
        className="border-b"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 
                className="text-3xl font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Market Intelligence
              </h1>
              <p 
                className="text-lg"
                style={{ color: 'var(--text-secondary)' }}
              >
                Signals, trends, and evidence to validate your next build
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              <BarChart3 className="h-4 w-4" />
              {generating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div 
        className="border-b"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id)} 
                  className="flex items-center gap-2 px-4 py-3 border-b-2 transition-colors"
                  style={{
                    borderColor: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')} 
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: viewMode === 'grid' ? 'white' : 'var(--text-secondary)',
              }}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--bg-card)',
                color: viewMode === 'list' ? 'white' : 'var(--text-secondary)',
              }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div 
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" 
              style={{ color: 'var(--accent-primary)' }}
            />
          </div>
        ) : filteredItems.length === 0 ? (
          <div 
            className="text-center py-16 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <BarChart3 
              className="h-12 w-12 mx-auto mb-4" 
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h3 
              className="text-xl font-semibold mb-2" 
              style={{ color: 'var(--text-primary)' }}
            >
              No items found
            </h3>
            <button
              onClick={handleGenerate}
              className="mt-4 px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
              }}
            >
              Generate Dataset
            </button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border p-6 transition-all cursor-pointer hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {item.sector}
                  </span>
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: item.confidence >= 80 ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                      color: item.confidence >= 80 ? 'white' : 'var(--text-secondary)',
                    }}
                  >
                    {item.confidence}%
                  </span>
                </div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-sm line-clamp-2 mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.signals.slice(0, 3).map((signal: { label: string; strength: number; explanation: string }, idx: number) => (
                    <span 
                      key={idx} 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: 'rgba(var(--accent-primary-rgb), 0.1)',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      {signal.label}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="flex-1 px-4 py-2 rounded-lg border font-medium transition-colors text-sm"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleSaveToProject(item)}
                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    Save to Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      {selectedItem && !showSaveDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-end"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="w-full max-w-2xl h-full overflow-y-auto p-6 shadow-xl"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {selectedItem.title}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--bg-elevated)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {selectedItem.sector}
                  </span>
                  <span 
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{
                      backgroundColor: 'var(--accent-primary)',
                      color: 'white',
                    }}
                  >
                    {selectedItem.confidence}%
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                }}
              >
                <X className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Overview
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedItem.content.overview}
                </p>
              </div>
              <div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Evidence Signals
                </h3>
                <div className="space-y-3">
                  {selectedItem.content.evidenceSignals.map((signal: { label: string; strength: number; explanation: string }, idx: number) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--bg-elevated)' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="font-medium"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {signal.label}
                        </span>
                        <span 
                          className="text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Strength: {signal.strength}/5
                        </span>
                      </div>
                      <p 
                        className="text-sm"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {signal.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Risks & Limitations
                </h3>
                <ul 
                  className="list-disc list-inside space-y-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {selectedItem.content.risks.map((risk: string, idx: number) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  How to Use in Forgeon
                </h3>
                <ul 
                  className="list-disc list-inside space-y-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {selectedItem.content.howToUse.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleSaveToProject(selectedItem)}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                Save to Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          onClick={() => {
            setShowSaveDialog(false);
            setSelectedItem(null);
            setSelectedProjectId('');
          }}
        >
          <div
            className="w-full max-w-md rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Save to Project
            </h3>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Select a project
            </p>
            <select 
              value={selectedProjectId} 
              onChange={(e) => setSelectedProjectId(e.target.value)} 
              className="w-full px-3 py-2 rounded-lg border mb-4"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">Select...</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSelectedItem(null);
                  setSelectedProjectId('');
                }}
                className="flex-1 px-4 py-2 rounded-lg border font-medium transition-colors"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveToProject}
                disabled={!selectedProjectId}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
