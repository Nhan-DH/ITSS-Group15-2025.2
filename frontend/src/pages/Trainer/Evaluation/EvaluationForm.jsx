import React, { useState } from 'react';

const TrainerRequests = () => {
  const [requests, setRequests] = useState([
    // Today
    {
      id: 1,
      date: '11/04/2026',
      name: 'Nguyễn Tuấn A',
      time: '10:00',
      status: 'pending',
      curriculum: 'Skinny Fat',
      birthDate: '12/05/1998',
      measurements: { height: '170', weight: '68', bodyFat: '24%', shoulder: '45' },
      notes: 'Có chấn thương vai, dây chằng yếu.',
      preferredSchedule: 'Thứ 2 - 4 - 6 (18:00)'
    },
    {
      id: 2,
      date: '11/04/2026',
      name: 'Trần Minh B',
      time: '14:30',
      status: 'accepted',
      curriculum: 'Core Training',
      birthDate: '15/03/1997',
      measurements: { height: '175', weight: '72', bodyFat: '20%', shoulder: '48' },
      notes: 'Không có chấn thương.',
      preferredSchedule: 'Thứ 3 - 5 (19:00)'
    },
    // Yesterday
    {
      id: 3,
      date: '10/04/2026',
      name: 'Lê Thị C',
      time: '18:20',
      status: 'rejected',
      curriculum: 'Cardio Mix',
      birthDate: '22/07/1999',
      measurements: { height: '162', weight: '55', bodyFat: '25%', shoulder: '40' },
      notes: 'Mong muốn tập giảm cân.',
      preferredSchedule: 'Thứ 2 - 4 - 6 (17:00)'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [viewingDetail, setViewingDetail] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Chưa duyệt</div>;
      case 'accepted':
        return <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Đã chấp nhận</div>;
      case 'rejected':
        return <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Từ chối</div>;
      default:
        return null;
    }
  };

  const groupedRequests = {};
  requests.forEach((req) => {
    if (!groupedRequests[req.date]) {
      groupedRequests[req.date] = [];
    }
    groupedRequests[req.date].push(req);
  });

  const sortedDates = Object.keys(groupedRequests).sort((a, b) => new Date(b) - new Date(a));

  if (viewingDetail && selectedRequest) {
    return (
      <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
        <button
          onClick={() => setViewingDetail(false)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 mb-6"
        >
          ← Quay lại danh sách
        </button>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-4">Chi tiết yêu cầu tập luyện</h2>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Giáo trình mong muốn</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-semibold text-gray-800">{selectedRequest.curriculum}</div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Họ tên</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-semibold text-gray-800">{selectedRequest.name}</div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Ngày sinh</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm font-semibold text-gray-800">{selectedRequest.birthDate}</div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Số đo cơ thể</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-3 rounded-lg text-sm">Chiều cao: {selectedRequest.measurements.height}cm</div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">Cân nặng: {selectedRequest.measurements.weight}kg</div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">Body fat: {selectedRequest.measurements.bodyFat}</div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">Vai rộng: {selectedRequest.measurements.shoulder}cm</div>
            </div>
          </div>

          <div className="mb-5">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Thông tin khác</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800">{selectedRequest.notes}</div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Lịch mong muốn hỗ trợ</label>
            <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-800">{selectedRequest.preferredSchedule}</div>
          </div>

          {selectedRequest.status === 'pending' && (
            <button
              onClick={() => {
                const newRequests = requests.map(req =>
                  req.id === selectedRequest.id ? { ...req, status: 'accepted' } : req
                );
                setRequests(newRequests);
                setSelectedRequest({ ...selectedRequest, status: 'accepted' });
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              ✔ Chấp nhận yêu cầu
            </button>
          )}
          {selectedRequest.status === 'accepted' && (
            <div className="text-center py-3 bg-green-50 text-green-700 rounded-lg font-bold">
              ✓ Đã chấp nhận
            </div>
          )}
          {selectedRequest.status === 'rejected' && (
            <div className="text-center py-3 bg-red-50 text-red-700 rounded-lg font-bold">
              ✗ Đã từ chối
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Yêu Cầu Tập Luyện</h1>
      <p className="text-sm text-gray-500 mb-6">Danh sách những yêu cầu tập luyện từ học viên.</p>

      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-4 my-5 before:flex-1 before:h-px before:bg-gray-300 after:flex-1 after:h-px after:bg-gray-300">
            <span className="text-sm font-bold text-gray-600">{date}</span>
          </div>

          {groupedRequests[date].map((request) => (
            <div
              key={request.id}
              onClick={() => {
                setSelectedRequest(request);
                setViewingDetail(true);
              }}
              className="bg-white border border-gray-200 rounded-xl p-4 mb-3 flex justify-between items-center cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="font-bold text-gray-800">{request.name}</div>
                <div className="text-sm text-gray-500">{request.time}</div>
              </div>
              {getStatusBadge(request.status)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TrainerRequests;
