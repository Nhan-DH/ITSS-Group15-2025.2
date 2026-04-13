import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';
import Modal from '@/components/Common/Modal';

// Mock Transactions Data
const transactionsMockData = [
    {
        id: 1,
        type: 'registration',
        customerName: 'Nguyễn Văn A',
        phone: '0901234567',
        package: 'Gói VIP',
        date: '2026-04-10',
        amount: 2500000,
        status: 'completed',
        paymentMethod: 'Credit Card',
        notes: 'Thanh toán thành công'
    },
    {
        id: 2,
        type: 'renewal',
        customerName: 'Trần Thị B',
        phone: '0912345678',
        package: 'Gói Cơ Bản',
        date: '2026-04-09',
        amount: 1000000,
        status: 'completed',
        paymentMethod: 'Cash',
        notes: 'Gia hạn tự động'
    },
    {
        id: 3,
        type: 'registration',
        customerName: 'Lê Văn C',
        phone: '0923456789',
        package: 'Lớp Nhóm',
        date: '2026-04-08',
        amount: 800000,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        notes: 'Chờ xác nhận'
    },
    {
        id: 4,
        type: 'renewal',
        customerName: 'Phạm Minh D',
        phone: '0934567890',
        package: 'Gói Nâng Cao',
        date: '2026-04-07',
        amount: 1500000,
        status: 'completed',
        paymentMethod: 'Credit Card',
        notes: 'Thanh toán thành công'
    },
    {
        id: 5,
        type: 'registration',
        customerName: 'Hoàng Thị E',
        phone: '0945678901',
        package: 'Gói VIP',
        date: '2026-04-06',
        amount: 2500000,
        status: 'failed',
        paymentMethod: 'E-wallet',
        notes: 'Thanh toán thất bại - Thử lại'
    },
    {
        id: 6,
        type: 'renewal',
        customerName: 'Vũ Văn F',
        phone: '0956789012',
        package: 'Gói Cơ Bản',
        date: '2026-04-05',
        amount: 1000000,
        status: 'completed',
        paymentMethod: 'Cash',
        notes: 'Thanh toán thành công'
    },
    {
        id: 7,
        type: 'registration',
        customerName: 'Đỗ Thị G',
        phone: '0967890123',
        package: 'Lớp Nhóm',
        date: '2026-04-04',
        amount: 800000,
        status: 'completed',
        paymentMethod: 'Bank Transfer',
        notes: 'Thanh toán thành công'
    },
    {
        id: 8,
        type: 'renewal',
        customerName: 'Bùi Văn H',
        phone: '0978901234',
        package: 'Gói Nâng Cao',
        date: '2026-04-03',
        amount: 1500000,
        status: 'pending',
        paymentMethod: 'E-wallet',
        notes: 'Chờ xác nhận từ ví điện tử'
    }
];

const transactionTypeConfig = {
    registration: { label: 'Đăng ký mới', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    renewal: { label: 'Gia hạn', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
};

const statusConfig = {
    completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    failed: { label: 'Thất bại', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
};

const TransactionsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Filter transactions
    const filteredTransactions = transactionsMockData.filter(txn => {
        const matchSearch =
            txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.phone.includes(searchTerm) ||
            txn.id.toString().includes(searchTerm);

        const matchType = typeFilter === 'all' || txn.type === typeFilter;
        const matchStatus = statusFilter === 'all' || txn.status === statusFilter;

        return matchSearch && matchType && matchStatus;
    });

    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Giao Dịch</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách đăng ký mới và gia hạn gói tập
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng giao dịch</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{transactionsMockData.length}</p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hoàn thành</p>
                    <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                        {transactionsMockData.filter(t => t.status === 'completed').length}
                    </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tổng doanh thu</p>
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatAmount(transactionsMockData.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
                    </p>
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
                                placeholder="Tìm theo tên, SĐT hoặc ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả loại</option>
                        <option value="registration">Đăng ký mới</option>
                        <option value="renewal">Gia hạn</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="failed">Thất bại</option>
                    </select>
                </div>

                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredTransactions.length}</span> trong <span className="font-medium">{transactionsMockData.length}</span> giao dịch
                </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <table className="w-full">
                    <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Loại</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Gói</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Số tiền</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Ngày</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Trạng thái</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                    Không tìm thấy giao dịch nào
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{txn.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{txn.customerName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{txn.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge className={transactionTypeConfig[txn.type].color}>
                                            {transactionTypeConfig[txn.type].label}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{txn.package}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{formatAmount(txn.amount)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{txn.date}</td>
                                    <td className="px-6 py-4">
                                        <Badge className={statusConfig[txn.status].color}>
                                            {statusConfig[txn.status].label}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewDetail(txn)}
                                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <Eye size={16} />
                                            <span className="text-sm">Chi tiết</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedTransaction && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Chi tiết giao dịch"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">ID giao dịch</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">#{selectedTransaction.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Khách hàng</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.customerName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedTransaction.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Loại giao dịch</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {transactionTypeConfig[selectedTransaction.type].label}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gói tập</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.package}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Số tiền</p>
                                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatAmount(selectedTransaction.amount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Phương thức thanh toán</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedTransaction.paymentMethod}</p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Ghi chú</p>
                            <p className="mt-1 text-gray-900 dark:text-white">{selectedTransaction.notes}</p>
                        </div>

                        <div className="flex gap-2">
                            <Badge className={statusConfig[selectedTransaction.status].color}>
                                {statusConfig[selectedTransaction.status].label}
                            </Badge>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
                            {selectedTransaction.status === 'pending' && (
                                <>
                                    <Button variant="outline">
                                        <X size={16} /> Từ chối
                                    </Button>
                                    <Button>
                                        <Check size={16} /> Xác nhận
                                    </Button>
                                </>
                            )}
                            {selectedTransaction.status === 'failed' && (
                                <Button>
                                    <Check size={16} /> Thử lại
                                </Button>
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

export default TransactionsView;
