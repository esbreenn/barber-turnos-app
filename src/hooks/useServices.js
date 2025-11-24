import { useMemo } from 'react';

// Hook simplificado: devuelve dos servicios fijos con precios predeterminados.
function useServices() {
  const services = useMemo(
    () => [
      { id: 'corte', nombre: 'Corte solo' },
      { id: 'corte-barba', nombre: 'Corte y barba' },
    ],
    []
  );

  const servicePrices = useMemo(
    () => ({
      'Corte solo': 10000,
      'Corte y barba': 13000,
    }),
    []
  );

  return { services, servicePrices };
}

export default useServices;
