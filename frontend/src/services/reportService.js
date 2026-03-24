import axios from '@/lib/axios';

const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const reportService = {
  getRevenueSummary: async (period) => {
    if (IS_MOCK) {
      await delay(700);
      return {
        totalRevenue: 152000000,
        growthRate: 12.5,
        period: period, // month, quarter, year
        data: [
          { label: 'Tuần 1', value: 30000000 },
          { label: 'Tuần 2', value: 45000000 },
          { label: 'Tuần 3', value: 35000000 },
          { label: 'Tuần 4', value: 42000000 },
        ]
      };
    }
    return axios.get(`/reports/revenue?period=${period}`);
  },

  getMemberStats: async () => {
    if (IS_MOCK) {
      await delay(600);
      return {
        totalActive: 450,
        newThisMonth: 34,
        expiredThisMonth: 12,
        distribution: [
          { type: 'Gói VIP', count: 120 },
          { type: 'Gói Cơ Bản', count: 200 },
          { type: 'Lớp Nhóm', count: 130 },
        ]
      };
    }
    return axios.get('/reports/members');
  }
};
