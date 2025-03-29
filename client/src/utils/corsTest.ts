import axios from 'axios';

/**
 * Tests the CORS setup of the API
 * This is a utility function to quickly check if CORS is working
 * @returns Promise that resolves to server response or rejects with error
 */
export const testCORS = async (): Promise<{ message: string }> => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  try {
    console.log('Testing CORS with API URL:', API_URL);
    const response = await axios.get(`${API_URL}/cors-test`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('CORS Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('CORS Test Failed:', error);
    throw error;
  }
}; 