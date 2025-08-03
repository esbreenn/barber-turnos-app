import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

function useServices() {
  const [services, setServices] = useState([]);
  const [servicePrices, setServicePrices] = useState({});

  const load = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'services'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setServices(data);
      const prices = {};
      data.forEach((s) => {
        prices[s.nombre] = s.precio;
      });
      setServicePrices(prices);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { services, servicePrices, reload: load };
}

export default useServices;
