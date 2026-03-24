import axios from '@/lib/axios';

const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_FEEDBACKS = [
  { id: 1, memberName: 'Nguyễn Văn A', type: 'trainer', content: 'PT nhiệt tình, chuyên môn cao', rating: 5, date: '2026-03-20', status: 'resolved' },
  { id: 2, memberName: 'Trần Thị B', type: 'equipment', content: 'Máy chạy số 3 bị kẹt thảm', rating: 2, date: '2026-03-22', status: 'pending' },
  { id: 3, memberName: 'Lê Văn C', type: 'service', content: 'Phòng thay đồ mùi ẩm mốc', rating: 3, date: '2026-03-21', status: 'processing' },
];

export const feedbackService = {
  getFeedbacks: async () => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_FEEDBACKS;
    }
    return axios.get('/feedbacks');
  },

  createFeedback: async (data) => {
    if (IS_MOCK) {
      await delay(800);
      return { ...data, id: Date.now(), status: 'pending', date: new Date().toISOString().split('T')[0] };
    }
    return axios.post('/feedbacks', data);
  },

  updateFeedbackStatus: async (id, status, responseText) => {
    if (IS_MOCK) {
      await delay(600);
      return { id, status, responseText };
    }
    return axios.patch(`/feedbacks/${id}/status`, { status, responseText });
  }
};
