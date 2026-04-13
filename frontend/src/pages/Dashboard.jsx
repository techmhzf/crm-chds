import { useState, useEffect, useMemo } from 'react';
import { X, Plus, Inbox } from 'lucide-react';
import { useLeads } from '../context/LeadContext.jsx';
import { getDashboardStats } from '../services/leadService.js';
import Navbar from '../components/Navbar.jsx';
import LeadCard from '../components/LeadCard.jsx';
import StatusPipeline from '../components/StatusPipeline.jsx';
import AddLeadModal from '../components/AddLeadModal.jsx';
import MessageTemplateModal from '../components/MessageTemplateModal.jsx';
import FollowUpBanner from '../components/FollowUpBanner.jsx';
import TodaysTasksPanel from '../components/TodaysTasksPanel.jsx';
import ImportCSVModal from '../components/ImportCSVModal.jsx';

const INDUSTRIES = ['general', 'sales', 'travel', 'tech', 'design', 'real_estate', 'finance', 'marketing', 'other'];
const INDUSTRY_LABELS = {
  general: 'General', sales: 'Sales', travel: 'Travel', tech: 'Tech',
  design: 'Design', real_estate: 'Real Estate', finance: 'Finance',
  marketing: 'Marketing', other: 'Other',
};

export default function Dashboard() {
  const { leads, loading, fetchLeads } = useLeads();
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [aiLead, setAiLead] = useState(null);

  const refreshAll = async () => {
    setRefreshing(true);
    await fetchLeads();
    try { const { data } = await getDashboardStats(); setStats(data); } catch {}
    setRefreshing(false);
  };

  useEffect(() => {
    refreshAll();
  }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(search.toLowerCase()));
      const matchIndustry = !industryFilter || lead.industry === industryFilter;
      const matchStatus = !statusFilter || lead.status === statusFilter;
      return matchSearch && matchIndustry && matchStatus;
    });
  }, [leads, search, industryFilter, statusFilter]);

  const hasFilter = search || industryFilter || statusFilter;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  const statCards = [
    { label: 'Total Leads', value: stats?.total ?? leads.length, leftColor: 'border-l-white' },
    { label: 'Connected', value: stats?.statusCounts?.connected ?? 0, leftColor: 'border-l-blue-400' },
    { label: 'Replied', value: stats?.totalReplied ?? 0, leftColor: 'border-l-green-400' },
    { label: 'Potential', value: stats?.statusCounts?.potential_client ?? 0, leftColor: 'border-l-emerald-400' },
    { label: 'This Week', value: stats?.thisWeek ?? 0, leftColor: 'border-l-amber-400' },
  ];

  const selectCls = 'bg-[#111] border border-white/10 rounded-lg px-3 py-3 text-[#888] focus:outline-none focus:border-white/30 text-sm transition-all';

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      <div className="px-6 pt-6 pb-4 border-b border-white/5 flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-[#888] text-sm hidden sm:block">{today}</span>
          <button
            onClick={refreshAll}
            disabled={refreshing || loading}
            title="Refresh leads (also auto-refreshes when you return from LinkedIn)"
            className="flex items-center gap-1.5 bg-transparent border border-white/20 text-[#888] hover:text-white hover:border-white/40 rounded-lg px-3 py-1.5 text-xs transition-all disabled:opacity-40"
          >
            <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 px-6 py-5">
          {statCards.map(({ label, value, leftColor }) => (
            <div key={label} className={`bg-[#111] rounded-xl p-4 border-l-2 ${leftColor} flex-1`}>
              <p className="text-[#888] text-xs mb-1 whitespace-nowrap">{label}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <TodaysTasksPanel onGenerateMessage={setAiLead} />

        <FollowUpBanner />

        <StatusPipeline
          counts={stats?.statusCounts || {}}
          activeStatus={statusFilter}
          onSelect={setStatusFilter}
        />

        <div className="flex flex-col md:flex-row gap-3 px-6 py-4 items-stretch md:items-center">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or company..."
              className="w-full bg-[#111] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 text-sm transition-all"
            />
          </div>
          <div className="flex gap-3 items-stretch w-full md:w-auto">
            <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className={selectCls + ' flex-1 md:flex-none md:w-44'}>
              <option value="">All Industries</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{INDUSTRY_LABELS[i]}</option>
              ))}
            </select>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-transparent border border-white/20 text-white hover:bg-white/5 rounded-lg px-4 py-3 text-sm transition-all whitespace-nowrap shrink-0"
            >
              Import CSV
            </button>
            {hasFilter && (
              <button
                onClick={() => { setSearch(''); setIndustryFilter(''); setStatusFilter(null); }}
                className="bg-transparent border border-white/20 text-[#888] hover:text-white hover:bg-white/5 rounded-lg px-3 py-3 text-sm transition-all shrink-0 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="px-6 pb-24">
          {loading && leads.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Inbox className="w-16 h-16 text-[#333] mb-4" />
              <h3 className="text-lg font-semibold text-white">No leads yet</h3>
              <p className="text-sm text-[#888] mt-1 mb-6">
                {leads.length === 0 ? 'Add your first LinkedIn connection to get started' : 'Try adjusting your filters'}
              </p>
              {leads.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-white text-black font-semibold hover:bg-gray-100 rounded-lg px-4 py-2 text-sm transition-all"
                >
                  Add First Lead
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-[#555] text-xs mb-4">
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''}{hasFilter ? ' (filtered)' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLeads.map((lead) => (
                  <LeadCard key={lead._id} lead={lead} onGenerateMessage={setAiLead} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 bg-white text-black w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-lg z-40 transition-all"
        title="Add Lead"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} />}
      {showImportModal && <ImportCSVModal onClose={() => setShowImportModal(false)} />}
      {aiLead && <MessageTemplateModal lead={aiLead} onClose={() => setAiLead(null)} />}
    </div>
  );
}
