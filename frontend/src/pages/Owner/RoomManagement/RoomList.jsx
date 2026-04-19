import React, { useMemo, useState } from 'react';
import { Plus, Users, MapPin, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFacilities } from '@/hooks/queries/useFacilities';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';

const RoomList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: facilityResponse, isLoading } = useFacilities(page, limit);

  // Mock data fallback
  const mockRooms = [
    { id: 1, facility_name: 'Khu vực Cardio (Tầng 1)', facility_type: 'cardio', status: 'active', max_capacity: 30, current_capacity: 15, description: 'Khu vực máy chạy bộ, xe đạp' },
    { id: 2, facility_name: 'Phòng Tập Tạ (Tầng 2)', facility_type: 'weights', status: 'active', max_capacity: 50, current_capacity: 40, description: 'Khu vực tạ tự do và máy tập' },
    { id: 3, facility_name: 'Phòng Yoga Cao Cấp', facility_type: 'yoga', status: 'maintenance', max_capacity: 20, current_capacity: 0, description: 'Phòng yoga với trang thiết bị cao cấp' },
    { id: 4, facility_name: 'Sân Boxing & MMA', facility_type: 'boxing', status: 'active', max_capacity: 15, current_capacity: 5, description: 'Khu vực võ thuật' },
    { id: 5, facility_name: 'Khu vực thay đồ', facility_type: 'locker', status: 'active', max_capacity: 100, current_capacity: 30, description: 'Tủ khóa và phòng thay đồ' },
  ];

  // Handle API response
  const rooms = useMemo(() => {
    if (!facilityResponse) return mockRooms;
    if (Array.isArray(facilityResponse)) return facilityResponse;
    if (facilityResponse.data && facilityResponse.data.length > 0) return facilityResponse.data;
    if (isLoading === false && !facilityResponse?.data) return mockRooms;
    return mockRooms;
  }, [facilityResponse, isLoading]);

  const totalItems = useMemo(() => {
    if (!facilityResponse) return mockRooms.length;
    if (Array.isArray(facilityResponse)) return facilityResponse.length;
    return facilityResponse.total_items || mockRooms.length;
  }, [facilityResponse]);

  const totalPages = useMemo(() => {
    if (!facilityResponse) return 1;
    if (Array.isArray(facilityResponse)) return 1;
    return facilityResponse.total_pages || Math.ceil(totalItems / limit) || 1;
  }, [facilityResponse, totalItems]);

  // Map API data to display format
  const displayRooms = useMemo(() => {
    return rooms.map(room => ({
      id: room.id || room.facility_id,
      name: room.facility_name || room.facilityName || room.name || 'N/A',
      capacity: room.max_capacity || room.MaxCapacity || room.capacity || 0,
      current: room.current_capacity || room.CurrentCapacity || 0,
      status: room.status || 'active',
      description: room.description || '',
      icon: room.facility_type === 'cardio' ? '🏃' : 
            room.facility_type === 'weights' ? '🏋️' : 
            room.facility_type === 'yoga' ? '🧘' : '🏢',
    }));
  }, [rooms]);

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

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayRooms.map((room) => (
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
                <span className={`font-semibold ${room.capacity > 0 && room.current / room.capacity > 0.8 ? 'text-red-500' : 'text-green-500'}`}>
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
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Trang {page} / {totalPages} (Tổng: {totalItems} phòng)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList;
