import axios from '@/lib/axios';

const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_EQUIPMENTS = [
  { id: 1, name: 'Máy chạy bộ KingSmith', status: 'active', maintainDate: '2026-05-10', room: 'Tầng 1' },
  { id: 2, name: 'Dàn tạ đa năng', status: 'maintenance', maintainDate: '2026-03-25', room: 'Tầng 2' },
  { id: 3, name: 'Xe đạp tập Elip', status: 'active', maintainDate: '2026-08-01', room: 'Tầng 1' },
];

export const equipmentService = {
  getEquipments: async () => {
    if (IS_MOCK) {
      await delay(400);
      return MOCK_EQUIPMENTS;
    }
    return axios.get('/equipments');
  },

  createEquipment: async (data) => {
    if (IS_MOCK) {
      await delay(600);
      return { ...data, id: Date.now() };
    }
    return axios.post('/equipments', data);
  },

  updateEquipment: async (id, data) => {
    if (IS_MOCK) {
      await delay(600);
      return { id, ...data };
    }
    return axios.put(`/equipments/${id}`, data);
  },

  updateEquipmentStatus: async (id, status) => {
    if (IS_MOCK) {
      await delay(400);
      return { id, status };
    }
    return axios.patch(`/equipments/${id}/status`, { status });
  },

  deleteEquipment: async (id) => {
    if (IS_MOCK) {
      await delay(400);
      return { success: true };
    }
    return axios.delete(`/equipments/${id}`);
  }
};
