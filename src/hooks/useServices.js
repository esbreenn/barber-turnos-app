import { useMemo } from 'react';

// Hook simplificado: devuelve dos servicios fijos con precios predeterminados.
function useServices() {
  const services = useMemo(
    () => [
      { id: 'corte', nombre: 'Corte de pelo' },
      { id: 'corte-barba', nombre: 'Corte de pelo y barba' },
    ],
    []
  );

  const servicePrices = useMemo(
    () => ({
      'Corte de pelo': 9000,
      'Corte de pelo y barba': 12000,
    }),
    []
  );

  return { services, servicePrices };
}

export default useServices;
