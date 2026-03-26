import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import RoomFormComponent from "@/components/Forms/RoomForm";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/Common/Button";
import { toast } from "@/utils/toast";

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      // Giả lập tải dữ liệu từ API
      setTimeout(() => {
        setInitialData({
          name: "Phòng Yoga",
          capacity: 20,
          status: "active",
          icon: "yoga",
        });
        setIsLoading(false);
      }, 500);
    }
  }, [id, isEditing]);

  const handleSubmit = (data) => {
    console.log("Form data:", data);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        isEditing
          ? "Cập nhật thay đổi thành công!"
          : "Đã tạo phòng tập mới thành công!",
      );
      navigate("/owner/rooms");
    }, 500);
  };

  if (isEditing && !initialData)
    return (
      <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Link to="/owner/rooms">
          <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isEditing
              ? "Chỉnh sửa Khu vực / Phòng tập"
              : "Thiết lập Phòng tập mới"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {isEditing
              ? "Thay đổi thông tin sức chứa, biểu tượng hoặc trạng thái khu vực."
              : "Thêm khu vực tập luyện mới để quản lý hệ thống thuận tiện hơn."}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 dark:border-gray-800 dark:bg-gray-950">
        <RoomFormComponent
          initialData={initialData}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RoomFormPage;
