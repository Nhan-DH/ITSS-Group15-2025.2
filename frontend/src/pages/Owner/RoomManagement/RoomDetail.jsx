import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  MapPin,
  Activity,
  LayoutGrid,
  HelpCircle,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import Button from "@/components/Common/Button";

const RoomDetail = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data fetching
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setTimeout(() => {
      // Giả lập dữ liệu phòng trả về
      setRoom({
        id: id,
        name: "Khu vực Cardio (Tầng 1)",
        capacity: 30,
        current: 15,
        status: "active",
        icon: "🏃",
        description:
          "Khu vực trang bị đầy đủ máy chạy bộ, máy eliptical, và xe đạp tập cao cấp nhằm phục vụ các bài tập tim mạch, tăng cường thể lực và đốt mỡ hiệu quả. Không gian rộng rãi thoáng mát với hệ thống lọc không khí tiêu chuẩn.",
        facilities: [
          "10 Máy chạy bộ Kingsmith",
          "5 Xe đạp tập Elipsport",
          "Hệ thống điều hòa trung tâm",
          "Máy lọc nước RO",
          "Tủ để đồ cá nhân tự phục vụ",
        ],
        images: [
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
          "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
        ],
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Dummy video
      });
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading || !room) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 dark:text-gray-400">
          Đang tải thông tin chi tiết...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/owner/rooms">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 h-10 w-10"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl bg-gray-100 p-2 rounded-xl dark:bg-gray-800">
                {room.icon}
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {room.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                  room.status === "active"
                    ? "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {room.status === "active" ? "Đang hoạt động" : "Đang bảo trì"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/owner/rooms/${room.id}/edit`}>
            <Button>Chỉnh sửa phòng</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Chỉ số hiện tại
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg dark:bg-gray-900/50">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  Sức chứa tối đa
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {room.capacity} người
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                <div className="flex items-center text-blue-600 dark:text-blue-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  Số khách hiện tại
                </div>
                <div
                  className={`font-bold ${room.current / room.capacity > 0.8 ? "text-red-500" : "text-blue-600 dark:text-blue-400"}`}
                >
                  {room.current} người
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                <div
                  className={`h-2.5 rounded-full ${room.current / room.capacity > 0.8 ? "bg-red-500" : "bg-blue-600"}`}
                  style={{
                    width: `${Math.min(100, (room.current / room.capacity) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-right text-gray-500">
                Hiệu suất: {Math.round((room.current / room.capacity) * 100)}%
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-purple-500" />
              Mô tả chung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {room.description}
            </p>

            <h4 className="font-medium text-gray-900 dark:text-white mt-6 mb-3 flex items-center gap-2 text-sm">
              <LayoutGrid className="h-4 w-4 text-orange-500" />
              Cơ sở vật chất & Tiện ích
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {room.facilities.map((facility, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0"></div>
                  {facility}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column - Media */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-500" />
              Hình ảnh nổi bật
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-gray-200 dark:border-gray-800"
                >
                  <img
                    src={imgUrl}
                    alt={`Phòng tập ${index + 1}`}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Tour */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Video className="h-4 w-4 text-red-500" />
              Video thư viện giới thiệu
            </h3>
            <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              {/* HTML5 Video element cho mục đích chạy video nội bộ hoặc public URL */}
              <video
                className="w-full aspect-video outline-none"
                controls
                poster="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800"
              >
                <source src={room.videoUrl} type="video/mp4" />
                <p>Trình duyệt của bạn không hỗ trợ thẻ video.</p>
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
