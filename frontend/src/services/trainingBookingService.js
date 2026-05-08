import axios from '@/lib/axios';

const IS_MOCK = false;

export const trainingBookingService = {
    // Lấy danh sách tất cả booking
    getTrainingBookings: async () => {
        if (IS_MOCK) {
            return { data: [], total: 0 };
        }
        const response = await axios.get('/training-bookings');
        return response.data || response;
    },

    // Lấy chi tiết booking theo ID
    getTrainingBookingById: async (id) => {
        if (IS_MOCK) {
            return null;
        }
        const response = await axios.get(`/training-bookings/${id}`);
        return response.data || response;
    },

    // Tạo booking mới
    createTrainingBooking: async (data) => {
        if (IS_MOCK) {
            return { ...data, id: Date.now() };
        }
        const response = await axios.post('/training-bookings', data);
        return response.data || response;
    },

    // Cập nhật booking (dùng cho hủy = đổi status)
    updateTrainingBooking: async (id, data) => {
        if (IS_MOCK) {
            return { id, ...data };
        }
        const response = await axios.put(`/training-bookings/${id}`, data);
        return response.data || response;
    },

    // Xóa booking
    deleteTrainingBooking: async (id) => {
        if (IS_MOCK) {
            return { success: true };
        }
        return axios.delete(`/training-bookings/${id}`);
    },

    // Hủy booking (cập nhật status thành Cancelled)
    cancelTrainingBooking: async (id, reason = '') => {
        return trainingBookingService.updateTrainingBooking(id, {
            status: 'Cancelled',
            training_plan_note: reason,
        });
    },
};
