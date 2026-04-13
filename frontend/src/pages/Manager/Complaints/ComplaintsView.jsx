import React, { useState } from 'react';
import { Search, Filter, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import Modal from '@/components/Common/Modal';

// Mock Complaints Data
const complaintsMockData = [
    {
        id: 1,
        customerName: 'Nguyễn Văn A',
        phone: '0901234567',
        date: '2026-04-10',
        category: 'Facility',
        title: 'Máy tập bị hỏng',
        content: 'Máy chạy bộ ở phòng tầng 2 không hoạt động bình thường',
        status: 'pending',
        priority: 'high',
        replies: 2,
        lastUpdate: '2026-04-11'
    },
    {
        id: 2,
        customerName: 'Trần Thị B',
        phone: '0912345678',
        date: '2026-04-09',
        category: 'Service',
        title: 'Chất lượng dịch vụ',
        content: 'Huấn luyện viên không có kiến thức chuyên sâu',
        status: 'resolved',
        priority: 'medium',
        replies: 3,
        lastUpdate: '2026-04-11'
    },
    {
        id: 3,
        customerName: 'Lê Văn C',
        phone: '0923456789',
        date: '2026-04-08',
        category: 'Hygiene',
        title: 'Vệ sinh không đạt',
        content: 'Phòng tập không được vệ sinh sạch sẽ',
        status: 'pending',
        priority: 'high',
        replies: 1,
        lastUpdate: '2026-04-10'
    },
    {
        id: 4,
        customerName: 'Phạm Minh D',
        phone: '0934567890',
        date: '2026-04-07',
        category: 'Staff',
        title: 'Thái độ nhân viên',
        content: 'Nhân viên lễ tân không thân thiện',
        status: 'resolved',
        priority: 'low',
        replies: 2,
        lastUpdate: '2026-04-09'
    },
    {
        id: 5,
        customerName: 'Hoàng Thị E',
        phone: '0945678901',
        date: '2026-04-06',
        category: 'Billing',
        title: 'Lỗi thanh toán',
        content: 'Bị trừ tiền hai lần cho cùng một giao dịch',
        status: 'pending',
        priority: 'critical',
        replies: 1,
        lastUpdate: '2026-04-11'
    },
    {
        id: 6,
        customerName: 'Vũ Văn F',
        phone: '0956789012',
        date: '2026-04-05',
        category: 'Facility',
        title: 'Nước nóng không sẵn sàng',
        content: 'Nước nóng nhà tắm không đủ',
        status: 'in_progress',
        priority: 'high',
        replies: 2,
        lastUpdate: '2026-04-11'
    },
    {
        id: 7,
        customerName: 'Đỗ Thị G',
        phone: '0967890123',
        date: '2026-04-04',
        category: 'Service',
        title: 'Lớp nhóm quá tải',
        content: 'Số lượng người tham gia vượt quá dung lượng',
        status: 'resolved',
        priority: 'medium',
        replies: 3,
        lastUpdate: '2026-04-08'
    },
    {
        id: 8,
        customerName: 'Bùi Văn H',
        phone: '0978901234',
        date: '2026-04-03',
        category: 'Other',
        title: 'Đề xuất cải tiến',
        content: 'Nên có khu vực yoga riêng',
        status: 'pending',
        priority: 'low',
        replies: 0,
        lastUpdate: '2026-04-03'
    }
];

const categoryConfig = {
    Facility: { label: 'Cơ sở vật chất', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    Service: { label: 'Dịch vụ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    Hygiene: { label: 'Vệ sinh', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    Staff: { label: 'Nhân viên', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
    Billing: { label: 'Thanh toán', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    Other: { label: 'Khác', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }
};

const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock },
    in_progress: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    resolved: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle }
};

const priorityConfig = {
    critical: { label: 'Khẩn cấp', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
    high: { label: 'Cao', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
    medium: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    low: { label: 'Thấp', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
};

const ComplaintsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter complaints
    const filteredComplaints = complaintsMockData.filter(complaint => {
        const matchSearch =
            complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            complaint.phone.includes(searchTerm) ||
            complaint.title.toLowerCase().includes(searchTerm.toLowerCase());

        const matchStatus = statusFilter === 'all' || complaint.status === statusFilter;
        const matchPriority = priorityFilter === 'all' || complaint.priority === priorityFilter;

        return matchSearch && matchStatus && matchPriority;
    });

    const handleViewDetail = (complaint) => {
        setSelectedComplaint(complaint);
        setShowDetailModal(true);
    };

    const getStatusStats = () => {
        return {
            total: complaintsMockData.length,
            pending: complaintsMockData.filter(c => c.status === 'pending').length,
            inProgress: complaintsMockData.filter(c => c.status === 'in_progress').length,
            resolved: complaintsMockData.filter(c => c.status === 'resolved').length
        };
    };

    const stats = getStatusStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Khiếu Nại Và CRM</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Quản lý khiếu nại của hội viên
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng khiếu nại</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Chờ xử lý</p>
                    <p className="mt-1 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đang xử lý</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đã giải quyết</p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                type="text"
                                placeholder="Tìm theo tên, SĐT hoặc tiêu đề..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="in_progress">Đang xử lý</option>
                        <option value="resolved">Đã giải quyết</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả mức độ</option>
                        <option value="critical">Khẩn cấp</option>
                        <option value="high">Cao</option>
                        <option value="medium">Trung bình</option>
                        <option value="low">Thấp</option>
                    </select>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredComplaints.length}</span> trong <span className="font-medium">{complaintsMockData.length}</span> khiếu nại
                </div>
            </div>

            {/* Complaints List */}
            <div className="space-y-3">
                {filteredComplaints.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy khiếu nại nào</p>
                    </div>
                ) : (
                    filteredComplaints.map((complaint) => (
                        <div
                            key={complaint.id}
                            onClick={() => handleViewDetail(complaint)}
                            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{complaint.title}</h3>
                                        <Badge className={statusConfig[complaint.status].color}>
                                            {statusConfig[complaint.status].label}
                                        </Badge>
                                        <Badge className={priorityConfig[complaint.priority].color}>
                                            {priorityConfig[complaint.priority].label}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{complaint.content}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{complaint.customerName} • {complaint.phone}</span>
                                        <span>{complaint.date}</span>
                                        <Badge className={categoryConfig[complaint.category].color}>
                                            {categoryConfig[complaint.category].label}
                                        </Badge>
                                        <span className="flex items-center gap-1">
                                            <MessageCircle size={14} /> {complaint.replies} bình luận
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Cập nhật lần cuối</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{complaint.lastUpdate}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedComplaint && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Chi tiết khiếu nại"
                >
                    <div className="space-y-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{selectedComplaint.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{selectedComplaint.content}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedComplaint.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedComplaint.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Danh mục</p>
                                <Badge className={categoryConfig[selectedComplaint.category].color}>
                                    {categoryConfig[selectedComplaint.category].label}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày gửi</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedComplaint.date}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Badge className={statusConfig[selectedComplaint.status].color}>
                                {statusConfig[selectedComplaint.status].label}
                            </Badge>
                            <Badge className={priorityConfig[selectedComplaint.priority].color}>
                                {priorityConfig[selectedComplaint.priority].label}
                            </Badge>
                        </div>

                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Bình luận ({selectedComplaint.replies})</p>
                            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                                <p>Hiển thị phần bình luận...</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            {selectedComplaint.status !== 'resolved' && (
                                <Button>Đánh dấu đã giải quyết</Button>
                            )}
                            <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ComplaintsView;
