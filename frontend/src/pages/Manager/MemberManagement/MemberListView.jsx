import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronRight } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import Badge from '@/components/Common/Badge';

// Mock Data
const membersMockData = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        package: 'Gói VIP',
        status: 'active',
        expiryDate: '2026-06-10',
        joinDate: '2024-06-10',
        sessionsRemaining: 24
    },
    {
        id: 2,
        name: 'Trần Thị B',
        phone: '0912345678',
        package: 'Gói Cơ Bản',
        status: 'active',
        expiryDate: '2026-05-15',
        joinDate: '2024-05-15',
        sessionsRemaining: 12
    },
    {
        id: 3,
        name: 'Lê Văn C',
        phone: '0923456789',
        package: 'Lớp Nhóm',
        status: 'paused',
        expiryDate: '2026-07-20',
        joinDate: '2024-01-20',
        sessionsRemaining: 8
    },
    {
        id: 4,
        name: 'Phạm Minh D',
        phone: '0934567890',
        package: 'Gói Nâng Cao',
        status: 'active',
        expiryDate: '2026-04-30',
        joinDate: '2024-04-30',
        sessionsRemaining: 18
    },
    {
        id: 5,
        name: 'Hoàng Thị E',
        phone: '0945678901',
        package: 'Gói Cơ Bản',
        status: 'expired',
        expiryDate: '2025-12-15',
        joinDate: '2024-12-15',
        sessionsRemaining: 0
    },
    {
        id: 6,
        name: 'Vũ Văn F',
        phone: '0956789012',
        package: 'Gói VIP',
        status: 'active',
        expiryDate: '2026-08-10',
        joinDate: '2024-08-10',
        sessionsRemaining: 28
    },
    {
        id: 7,
        name: 'Đỗ Thị G',
        phone: '0967890123',
        package: 'Lớp Nhóm',
        status: 'active',
        expiryDate: '2026-09-05',
        joinDate: '2024-09-05',
        sessionsRemaining: 15
    },
    {
        id: 8,
        name: 'Bùi Văn H',
        phone: '0978901234',
        package: 'Gói Nâng Cao',
        status: 'paused',
        expiryDate: '2026-10-20',
        joinDate: '2024-02-20',
        sessionsRemaining: 5
    },
];

const statusConfig = {
    active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    paused: { label: 'Tạm dừng', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    expired: { label: 'Hết hạn', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
};

const MemberListView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter members
    const filteredMembers = membersMockData.filter(member => {
        const matchSearch =
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm) ||
            member.id.toString().includes(searchTerm);

        const matchStatus = statusFilter === 'all' || member.status === statusFilter;

        return matchSearch && matchStatus;
    });

    const getStatusBadge = (status) => {
        const config = statusConfig[status];
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản Lý Hội Viên</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Danh sách tất cả hội viên tại phòng gym
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

                    {/* Status Filter */}
                    <div className="flex gap-2 items-center">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="paused">Tạm dừng</option>
                            <option value="expired">Hết hạn</option>
                        </select>
                    </div>
                </div>

                {/* Result count */}
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    Hiển thị <span className="font-medium">{filteredMembers.length}</span> trong <span className="font-medium">{membersMockData.length}</span> hội viên
                </div>
            </div>

            {/* Members List */}
            <div className="space-y-3">
                {filteredMembers.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
                        <p className="text-gray-500 dark:text-gray-400">Không tìm thấy hội viên nào</p>
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <Link key={member.id} to={`/manager/members/${member.id}`}>
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500"></div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-medium text-gray-900 dark:text-white">{member.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{member.phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex sm:items-center sm:gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{member.package}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{member.sessionsRemaining} buổi còn lại</p>
                                        </div>

                                        <div className="text-right">
                                            {getStatusBadge(member.status)}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Hết hạn</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{member.expiryDate}</p>
                                        </div>
                                    </div>

                                    <ChevronRight className="ml-2 text-gray-400" size={20} />
                                </div>

                                {/* Mobile view */}
                                <div className="mt-3 flex flex-wrap gap-3 sm:hidden">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Gói</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{member.package}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Hết hạn</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{member.expiryDate}</p>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {getStatusBadge(member.status)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default MemberListView;
