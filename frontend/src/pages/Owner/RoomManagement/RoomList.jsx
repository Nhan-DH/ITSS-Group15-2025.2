import React from 'react';
import { Plus, Users, MapPin, Edit, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';

const RoomList = () => {
  const rooms = [
    { id: 1, name: "Khu vực Cardio (Tầng 1)", capacity: 30, current: 15, status: "active", icon: "🏃" },
    { id: 2, name: "Phòng Tập Tạ (Tầng 2)", capacity: 50, current: 40, status: "active", icon: "🏋️" },
    { id: 3, name: "Phòng Yoga Cao Cấp", capacity: 20, current: 0, status: "maintenance", icon: "🧘" },
    { id: 4, name: "Sân Boxing & MMA", capacity: 15, current: 5, status: "active", icon: "🥊" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quản lý Khu vực / Phòng Tập</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Theo dõi sức chứa và mật độ hiện tại của các không gian tập.
          </p>
        </div>
        <Link to="/owner/rooms/create">
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Thêm phân khu mới
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col hover:border-blue-400 transition-colors dark:border-gray-800 dark:bg-gray-950 dark:hover:border-blue-500">
            <div className="text-4xl mb-4 bg-gray-50 h-16 w-16 flex items-center justify-center rounded-2xl dark:bg-gray-900">
              {room.icon}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 flex-1 dark:text-white">
              {room.name}
            </h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4 mr-2" />
                Sức chứa: {room.capacity} người
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-500 dark:text-gray-400"><MapPin className="h-4 w-4 mr-2" /> Hiện tại:</span>
                <span className={`font-semibold ${room.current / room.capacity > 0.8 ? 'text-red-500' : 'text-green-500'}`}>
                  {room.current} người
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                room.status === 'active' 
                  ? 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {room.status === 'active' ? 'Đang mở cửa' : 'Bảo trì'}
              </span>
              <div className="flex gap-1">
                <Link to={`/owner/rooms/${room.id}`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/50"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4"/>
                  </Button>
                </Link>
                <Link to={`/owner/rooms/${room.id}/edit`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4"/>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50"
                  title="Xóa"
                  onClick={() => toast.error('Tính năng xóa đang được phát triển')}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
