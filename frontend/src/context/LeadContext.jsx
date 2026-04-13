import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as leadService from '../services/leadService.js';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await leadService.getAllLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh when user returns to this tab (e.g. after saving via Chrome extension)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLeads();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchLeads]);

  const addLead = async (leadData) => {
    const { data } = await leadService.createLead(leadData);
    setLeads((prev) => [data, ...prev]);
    return data;
  };

  const removeLead = async (id) => {
    await leadService.deleteLead(id);
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  const changeStatus = async (id, status) => {
    const { data } = await leadService.updateLeadStatus(id, status);
    setLeads((prev) => prev.map((l) => (l._id === id ? data : l)));
    return data;
  };

  const editLead = async (id, leadData) => {
    const { data } = await leadService.updateLead(id, leadData);
    setLeads((prev) => prev.map((l) => (l._id === id ? data : l)));
    return data;
  };

  return (
    <LeadContext.Provider value={{ leads, loading, fetchLeads, addLead, removeLead, changeStatus, editLead }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => useContext(LeadContext);
