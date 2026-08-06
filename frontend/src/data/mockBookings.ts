export const memoryRoomBookings = [
  {
    id: 'bk_1001',
    userId: 'usr_guest',
    userName: 'Rahul Kumar',
    userEmail: 'guest@gonahotel.com',
    roomId: 'room_2person_deluxe',
    roomName: 'Deluxe Double Room (2 Person)',
    roomImage: '/assets/room-2person-deluxe.jpg?v=2',
    checkIn: '2026-08-10',
    checkOut: '2026-08-13',
    guests: { adults: 2, children: 0 },
    totalNights: 3,
    pricePerNight: 2500,
    totalAmount: 7500,
    paymentStatus: 'paid' as const,
    bookingStatus: 'confirmed' as const,
    paymentId: 'pay_rzp_9812739182',
    invoiceId: 'INV-ROOM-2026-001',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk_1002',
    userId: 'usr_guest2',
    userName: 'Priya Sharma',
    userEmail: 'priya@gmail.com',
    roomId: 'room_4person',
    roomName: 'Family Quad Room (4 Person)',
    roomImage: '/assets/room-4person.jpg?v=2',
    checkIn: '2026-08-15',
    checkOut: '2026-08-17',
    guests: { adults: 4, children: 0 },
    totalNights: 2,
    pricePerNight: 4000,
    totalAmount: 8000,
    paymentStatus: 'paid' as const,
    bookingStatus: 'confirmed' as const,
    paymentId: 'pay_rzp_7263819011',
    invoiceId: 'INV-ROOM-2026-002',
    createdAt: new Date().toISOString()
  }
];

export const memoryFoodOrders = [
  {
    id: 'ord_3001',
    userId: 'usr_guest',
    userName: 'Rahul Kumar',
    userPhone: '+91 98765 12345',
    items: [
      { itemId: 'item_p_butter', name: 'Paneer Butter Masala', price: 200, quantity: 2, isVeg: true,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&q=80&fit=crop' },
      { itemId: 'item_jeera_rice', name: 'Jeera Rice', price: 90, quantity: 2, isVeg: true,
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=200&q=80&fit=crop' },
      { itemId: 'item_dal_tadka', name: 'Dal Tadka', price: 120, quantity: 1, isVeg: true,
        image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=200&q=80&fit=crop' }
    ],
    orderType: 'delivery' as const,
    deliveryAddress: 'Table 4, Gona Restaurant Hall',
    subtotal: 700,
    tax: 35,
    discount: 0,
    totalAmount: 735,
    paymentStatus: 'paid' as const,
    orderStatus: 'preparing' as const,
    paymentId: 'pay_rzp_food_99182',
    invoiceId: 'INV-FOOD-2026-042',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord_3002',
    userId: 'usr_guest2',
    userName: 'Rahul Kumar',
    userPhone: '+91 9696631621',
    items: [
      { itemId: 'item_masala_dosa', name: 'Masala Dosa', price: 80, quantity: 3, isVeg: true,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80&fit=crop' },
      { itemId: 'item_tea', name: 'Special Chai', price: 20, quantity: 3, isVeg: true,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&q=80&fit=crop' }
    ],
    orderType: 'dine_in' as const,
    deliveryAddress: 'Table 7',
    subtotal: 300,
    tax: 15,
    discount: 0,
    totalAmount: 315,
    paymentStatus: 'pending' as const,
    orderStatus: 'placed' as const,
    paymentId: '',
    invoiceId: 'INV-FOOD-2026-043',
    createdAt: new Date().toISOString()
  }
];

export const memoryFarmBookings: never[] = [];
