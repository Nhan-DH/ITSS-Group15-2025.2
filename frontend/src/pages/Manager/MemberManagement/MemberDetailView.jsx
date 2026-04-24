import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, Mail, Calendar, Pause, Edit2 } from 'lucide-react';
import Button from '@/components/Common/Button';
import Badge from '@/components/Common/Badge';

// Mock member detail data
const memberDetailMock = {
    1: {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenv.a@email.com',
        phone: '0901234567',
        gender: 'Nam',
        dob: '1995-03-15',
        address: '123 Nguyễn Hữu Cảnh, P.22, Bình Thạnh, TP.HCM',
        avatar: 'https://via.placeholder.com/150',
        status: 'active',
        joinDate: '2024-06-10',
        currentPackage: {
            name: 'Gói VIP',
            price: '2,500,000',
            startDate: '2024-06-10',
            expiryDate: '2026-06-10',
            sessionsPerMonth: 16,
            sessionsUsed: 8,
            sessionsRemaining: 24,
            features: ['Tập luyện 24/7', 'Tư vấn nutritionist', 'Group classes', 'Personal trainer']
        },
        packageHistory: [
            { name: 'Gói VIP', startDate: '2024-06-10', expiryDate: '2025-06-10', price: '2,500,000' },
            { name: 'Gói Nâng Cao', startDate: '2024-01-20', expiryDate: '2024-06-10', price: '1,500,000' }
        ],
        recentTransactions: [
            { date: '2026-04-10', type: 'Renewal', package: 'Gói VIP', amount: '2,500,000', status: 'Success' },
            { date: '2026-03-15', type: 'Session Package', package: '+10 sessions', amount: '500,000', status: 'Success' },
            { date: '2026-02-10', type: 'Monthly Fee', package: 'Gói VIP', amount: '2,500,000', status: 'Success' }
        ],
        timeline: [
            { date: '2026-04-10', event: 'Gia hạn gói VIP', details: 'Thanh toán thành công' },
            { date: '2026-03-15', event: 'Mua thêm 10 buổi', details: '+10 session buổi tập' },
            { date: '2026-02-10', event: 'Thanh toán tháng 2', details: 'Gia hạn tự động' },
            { date: '2024-06-10', event: 'Tham gia phòng gym', details: 'Đăng ký gói VIP' }
        ]
    }
};

const Tabs = {
    INFO: 'info',
    PACKAGE: 'package',
    HISTORY: 'history',
    TRANSACTIONS: 'transactions'
};

const MemberDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(Tabs.INFO);

    const member = memberDetailMock[id] || memberDetailMock[1];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <button
                    onClick={() => navigate('/manager/members')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeft size={20} />
                    <span>Quay lại</span>
                </button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Edit2 size={16} />
                        Chỉnh sửa
                    </Button>
                    <Button variant="outline" size="sm">
                        <Pause size={16} />
                        Tạm dừng
                    </Button>
                </div>
            </div>

            {/* Member Card */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                    <div className="h-32 w-32 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex-shrink-0"></div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h1>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        {member.status === 'active' ? '✓ Đang hoạt động' : 'Tạm dừng'}
                                    </Badge>
                                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                        {member.currentPackage.name}
                                    </Badge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Thành viên từ</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{member.joinDate}</p>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Điện thoại</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{member.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{member.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Ngày sinh</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{member.dob}</p>
                                </div>
                            </div>
                        </div>

                        {/* Package Overview */}
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Gói hiện tại hết hạn vào</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{member.currentPackage.expiryDate}</p>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {member.currentPackage.sessionsRemaining} buổi còn lại / {member.currentPackage.sessionsPerMonth} buổi/tháng
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                {[
                    { key: Tabs.INFO, label: 'Thông tin' },
                    { key: Tabs.PACKAGE, label: 'Gói tập' },
                    { key: Tabs.HISTORY, label: 'Lịch sử' },
                    { key: Tabs.TRANSACTIONS, label: 'Giao dịch' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === tab.key
                                ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">

                {/* Info Tab */}
                {activeTab === Tabs.INFO && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Họ tên</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Giới tính</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày sinh</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.dob}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Điện thoại</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Địa chỉ</p>
                                <p className="mt-1 font-medium text-gray-900 dark:text-white">{member.address}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Package Tab */}
                {activeTab === Tabs.PACKAGE && (
                    <div className="space-y-6">
                        <div className="rounded-lg border-2 border-blue-200 p-4 dark:border-blue-900/30">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{member.currentPackage.name}</h3>
                            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Giá</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{member.currentPackage.price}đ</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tính năng</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{member.currentPackage.features.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Từ</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{member.currentPackage.startDate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Đến</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">{member.currentPackage.expiryDate}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tính năng:</p>
                                <ul className="mt-2 space-y-1">
                                    {member.currentPackage.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="text-green-600">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Lịch sử gói</h3>
                            <div className="space-y-2">
                                {member.packageHistory.map((pkg, i) => (
                                    <div key={i} className="flex justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{pkg.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.startDate} → {pkg.expiryDate}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{pkg.price}đ</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === Tabs.HISTORY && (
                    <div className="space-y-4">
                        {member.timeline.map((item, i) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 dark:text-blue-400">•</span>
                                    </div>
                                    {i < member.timeline.length - 1 && (
                                        <div className="h-12 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                    )}
                                </div>
                                <div className="pb-4">
                                    <p className="font-medium text-gray-900 dark:text-white">{item.event}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.details}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Transactions Tab */}
                {activeTab === Tabs.TRANSACTIONS && (
                    <div className="space-y-3">
                        {member.recentTransactions.map((txn, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 dark:border-gray-800">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{txn.type}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{txn.date} • {txn.package}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">{txn.amount}đ</p>
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">✓ {txn.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberDetailView;
