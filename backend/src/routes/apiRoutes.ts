import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';

// Controllers
import { registerUser, loginUser, getProfile, toggleWishlist, forgotPassword, resetPassword } from '../controllers/authController';
import { getRooms, getRoomBySlugOrId, createRoom, updateRoom, blockRoomDates } from '../controllers/roomController';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/foodController';
import { createRoomBooking, getUserBookings, getAllBookingsAdmin, updateBookingStatusAdmin } from '../controllers/bookingController';
import { createFoodOrder, getUserFoodOrders, getFoodOrderById, getAllFoodOrdersAdmin, updateFoodOrderStatusAdmin } from '../controllers/foodOrderController';
import { createFarmBooking, getUserFarmBookings, getAllFarmBookingsAdmin, updateFarmBookingStatusAdmin } from '../controllers/farmController';
import { submitUtrProof, getPendingTransactionsAdmin, verifyOrRejectPaymentAdmin } from '../controllers/paymentController';
import { 
  getAdminAnalytics, getGalleryAdmin, addGalleryItemAdmin, deleteGalleryItemAdmin, 
  getReviewsAdmin, createReview, toggleReviewApprovalAdmin, getCouponsAdmin, 
  addCouponAdmin, toggleCouponActiveAdmin, deleteCouponAdmin, validateCouponPublic, getCustomersAdmin,
  deleteCustomerAdmin
} from '../controllers/adminController';



const router = Router();

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.get('/auth/profile', authenticateToken, getProfile);
router.post('/auth/wishlist', authenticateToken, toggleWishlist);

// Room Routes
router.get('/rooms', getRooms);
router.get('/rooms/:identifier', getRoomBySlugOrId);
router.post('/rooms', authenticateToken, requireAdmin, createRoom);
router.put('/rooms/:id', authenticateToken, requireAdmin, updateRoom);
router.post('/rooms/:id/block-dates', authenticateToken, requireAdmin, blockRoomDates);

// Room Booking Routes (Canonical + Alias)
router.post('/bookings/rooms', authenticateToken, createRoomBooking);
router.post('/bookings/room', authenticateToken, createRoomBooking); // Alias
router.get('/bookings/rooms/my', authenticateToken, getUserBookings);
router.get('/admin/bookings/rooms', authenticateToken, requireAdmin, getAllBookingsAdmin);
router.put('/admin/bookings/rooms/:id', authenticateToken, requireAdmin, updateBookingStatusAdmin);

// Restaurant & Menu Routes (Canonical + Alias)
router.get('/food/menu', getMenuItems);
router.get('/menu', getMenuItems); // Alias
router.post('/food/menu', authenticateToken, requireAdmin, createMenuItem);
router.put('/food/menu/:id', authenticateToken, requireAdmin, updateMenuItem);
router.delete('/food/menu/:id', authenticateToken, requireAdmin, deleteMenuItem);

// Food Order Routes (Canonical + Alias)
router.post('/food/orders', authenticateToken, createFoodOrder);
router.post('/orders/food', authenticateToken, createFoodOrder); // Alias
router.get('/food/orders/my', authenticateToken, getUserFoodOrders);
router.get('/food/orders/track/:id', getFoodOrderById);
router.get('/admin/food/orders', authenticateToken, requireAdmin, getAllFoodOrdersAdmin);
router.put('/admin/food/orders/:id', authenticateToken, requireAdmin, updateFoodOrderStatusAdmin);

// Farm Booking Routes (Canonical + Alias)
router.post('/farm/bookings', authenticateToken, createFarmBooking);
router.post('/bookings/farm', authenticateToken, createFarmBooking); // Alias
router.get('/farm/bookings/my', authenticateToken, getUserFarmBookings);
router.get('/admin/farm/bookings', authenticateToken, requireAdmin, getAllFarmBookingsAdmin);
router.put('/admin/farm/bookings/:id', authenticateToken, requireAdmin, updateFarmBookingStatusAdmin);

// Payment Routes (Client UPI QR + UTR + Admin Verification)
router.post('/payments/submit-utr', authenticateToken, submitUtrProof);
router.get('/admin/payments/pending', authenticateToken, requireAdmin, getPendingTransactionsAdmin);
router.put('/admin/payments/verify/:id', authenticateToken, requireAdmin, verifyOrRejectPaymentAdmin);

// Coupons, Gallery, Reviews & Admin Routes
router.post('/coupons/validate', validateCouponPublic);
router.post('/reviews', createReview);

router.get('/admin/analytics', authenticateToken, requireAdmin, getAdminAnalytics);
router.get('/admin/gallery', getGalleryAdmin);
router.post('/admin/gallery', authenticateToken, requireAdmin, addGalleryItemAdmin);
router.delete('/admin/gallery/:id', authenticateToken, requireAdmin, deleteGalleryItemAdmin);
router.get('/admin/reviews', getReviewsAdmin);
router.put('/admin/reviews/:id/approval', authenticateToken, requireAdmin, toggleReviewApprovalAdmin);
router.get('/admin/coupons', authenticateToken, requireAdmin, getCouponsAdmin);
router.post('/admin/coupons', authenticateToken, requireAdmin, addCouponAdmin);
router.put('/admin/coupons/:id/active', authenticateToken, requireAdmin, toggleCouponActiveAdmin);
router.delete('/admin/coupons/:id', authenticateToken, requireAdmin, deleteCouponAdmin);
router.get('/admin/customers', authenticateToken, requireAdmin, getCustomersAdmin);

router.delete('/admin/customers/:id', authenticateToken, requireAdmin, deleteCustomerAdmin);

export default router;

