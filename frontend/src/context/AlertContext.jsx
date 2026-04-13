import { createContext, useContext, useState, useEffect } from 'react';
import { getFollowUpAlerts } from '../services/alertService.js';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);

  const fetchAlerts = async () => {
    try {
      const { data } = await getFollowUpAlerts();
      setAlerts(data.leads || []);
      setAlertCount(data.count || 0);
    } catch {
      // silent — user may not be authenticated yet
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, alertCount, fetchAlerts }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
