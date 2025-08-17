import { useMemo } from 'react';

// Hook simplificado: devuelve dos servicios fijos con precios predeterminados.
function useServices() {
  const services = useMemo(
    () => [
      { id: 'corte', nombre: 'Corte de Cabello' },
      { id: 'corte-barba', nombre: 'Corte de Cabello y Barba' },
    ],
    []
  );

  const servicePrices = useMemo(
    () => ({
      'Corte de Cabello': 9000,
      'Corte de Cabello y Barba': 12000,
    }),
    []
  );

  return { services, servicePrices };
}

export default useServices;
