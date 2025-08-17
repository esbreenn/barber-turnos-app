import { collection, getDocs, updateDoc, doc, deleteField } from 'firebase/firestore';
import { db } from '../src/firebase/config.js';

async function removeCompletado() {
  const snapshot = await getDocs(collection(db, 'turnos'));
  const updates = snapshot.docs.map(d => updateDoc(doc(db, 'turnos', d.id), {
    completado: deleteField()
  }));
  await Promise.all(updates);
  console.log('Propiedad "completado" eliminada de todos los turnos.');
}

removeCompletado().catch(err => {
  console.error('Error en la migración:', err);
});
