import axios from 'axios';
import { useState } from 'react';

export const useDelete = (url: string) => {
  const [error, setError] = useState<string | null>(null);

  const del = async (id: string) => {
    try {
      console.log('Deleting product with id:', id); // Добавляем отладочный вывод
      const response = await axios.delete(`${url}/${id}`);
      return response.data;
    } catch (error) {
      setError(`Error: Deletion failed with status code ${(error as Error).message}`);
    }
  };

  return { del, error };
};