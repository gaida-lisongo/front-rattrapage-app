import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        // Préserver le startTime original pour le timing
        if (key === 'currentExam' && parsedItem.questions) {
          const startTime = parsedItem.startTime; // Sauvegarder le startTime
          parsedItem.questions = parsedItem.questions.map((q, index) => ({
            ...q,
            order: index + 1
          }));
          parsedItem.startTime = startTime; // Restaurer le startTime
        }
        setStoredValue(parsedItem);
      } else {
        setStoredValue(initialValue);
      }
    } catch (error) {
      console.error('Error in useLocalStorage:', error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = (value) => {
    try {
      let valueToStore = value instanceof Function ? value(storedValue) : value;
      
      if (key === 'currentExam' && valueToStore?.questions) {
        valueToStore = {
          ...valueToStore,
          startTime: valueToStore.startTime,
          duree: valueToStore.duree,
          questions: valueToStore.questions.map((q, index) => ({
            ...q,
            order: index + 1
          }))
        };
      }

      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
}