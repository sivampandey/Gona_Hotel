const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  const defaultUrl = import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://gona-hotel.onrender.com/api';
  const rawUrl = (envUrl || defaultUrl).trim().replace(/\/+$/, '');
  return rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;
};


const API_BASE_URL = getApiBaseUrl();

const safeParseJson = async (res: Response) => {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: res.statusText || 'Unexpected server response format' };
  }
};

const safeFetch = async (url: string, options?: RequestInit) => {
  try {
    const res = await fetch(url, options);
    const data = await safeParseJson(res);
    return { data, status: res.status, ok: res.ok };
  } catch (error: any) {
    return {
      data: {
        success: false,
        message: 'Unable to connect to authentication server. Render backend may be starting up (cold start) or offline. Please try again in a few seconds.'
      },
      status: 0,
      ok: false
    };
  }
};


const getHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = localStorage.getItem('gona_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await safeParseJson(res);
    return data?.status === 'online';
  } catch (error) {
    return false;
  }
};


export const apiService = {
  // Auth API
  login: async (emailOrPhone: string, password?: string) => {
    return await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email: emailOrPhone, identifier: emailOrPhone, phone: emailOrPhone, password })
    });
  },

  register: async (name: string, email: string, password?: string, phone?: string) => {
    return await safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ name, email, password, phone })
    });
  },


  forgotPassword: async (email: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email })
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  resetPassword: async (token: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ token, password })
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Rooms API
  getRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    return { data: await safeParseJson(res), status: res.status };
  },

  getRoomById: async (identifier: string) => {
    const res = await fetch(`${API_BASE_URL}/rooms/${identifier}`);
    return { data: await safeParseJson(res), status: res.status };
  },

  updateRoomAdmin: async (id: string, roomData: any) => {
    return await safeFetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(roomData)
    });
  },


  // Food Menu API
  getMenu: async () => {
    const res = await fetch(`${API_BASE_URL}/food/menu`);
    return { data: await safeParseJson(res), status: res.status };
  },

  // Room Bookings API
  createRoomBooking: async (bookingData: any) => {
    const res = await fetch(`${API_BASE_URL}/bookings/rooms`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(bookingData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getUserRoomBookings: async () => {
    const res = await fetch(`${API_BASE_URL}/bookings/rooms/my`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getAllRoomBookingsAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/bookings/rooms`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  updateRoomBookingStatusAdmin: async (id: string, statusData: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/bookings/rooms/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(statusData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Food Orders API
  createFoodOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE_URL}/food/orders`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(orderData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getUserFoodOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/food/orders/my`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getAllFoodOrdersAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/food/orders`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  updateFoodOrderStatusAdmin: async (id: string, statusData: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/food/orders/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(statusData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Farm Bookings API
  createFarmBooking: async (farmData: any) => {
    const res = await fetch(`${API_BASE_URL}/farm/bookings`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(farmData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getUserFarmBookings: async () => {
    const res = await fetch(`${API_BASE_URL}/farm/bookings/my`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getAllFarmBookingsAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/farm/bookings`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  updateFarmBookingStatusAdmin: async (id: string, statusData: any) => {
    const res = await fetch(`${API_BASE_URL}/admin/farm/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(statusData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Payment UTR Proof API
  submitUtrProof: async (paymentData: {
    bookingId?: string;
    orderId?: string;
    bookingType: 'room' | 'food' | 'farm';
    utrNumber: string;
    payerName?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/payments/submit-utr`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(paymentData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getPendingPaymentsAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/payments/pending`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  verifyOrRejectPaymentAdmin: async (id: string, actionData: { action: 'verify' | 'reject'; rejectionReason?: string; bookingType?: string }) => {
    const res = await fetch(`${API_BASE_URL}/admin/payments/verify/${id}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(actionData)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Coupons API
  validateCoupon: async (code: string, amount: number) => {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ code, amount })
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getCouponsAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  // Admin Analytics & Customers
  getAdminAnalytics: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  },

  getCustomersAdmin: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: getHeaders(true)
    });
    return { data: await safeParseJson(res), status: res.status };
  }
};
