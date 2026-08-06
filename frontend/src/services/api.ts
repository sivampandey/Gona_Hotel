const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === 'online';
  } catch (error) {
    return false;
  }
};

export const apiService = {
  // Auth API
  login: async (email: string, password?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return { data: await res.json(), status: res.status };
  },

  register: async (name: string, email: string, password?: string, phone?: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    return { data: await res.json(), status: res.status };
  },

  // Rooms API
  getRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    return { data: await res.json(), status: res.status };
  },

  // Food Menu API
  getMenu: async () => {
    const res = await fetch(`${API_BASE_URL}/menu`);
    return { data: await res.json(), status: res.status };
  },

  // Bookings API
  createRoomBooking: async (bookingData: any) => {
    const token = localStorage.getItem('gona_token');
    const res = await fetch(`${API_BASE_URL}/bookings/room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    return { data: await res.json(), status: res.status };
  },

  createFoodOrder: async (orderData: any) => {
    const token = localStorage.getItem('gona_token');
    const res = await fetch(`${API_BASE_URL}/orders/food`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    return { data: await res.json(), status: res.status };
  },

  createFarmBooking: async (farmData: any) => {
    const token = localStorage.getItem('gona_token');
    const res = await fetch(`${API_BASE_URL}/bookings/farm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(farmData)
    });
    return { data: await res.json(), status: res.status };
  }
};
