import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle2, Video, Image as ImageIcon, CreditCard, ShieldCheck, HelpCircle } from 'lucide-react';
import Button from '@/components/Common/Button';

const gymPackagesData = [
  { 
    id: 1, 
    name: "Gói 1 Tháng Cơ Bản Nam", 
    price: "300,000 đ", 
    type: "normal",
    gender: "male",
    best: false,
    description: "Trải nghiệm đầy đủ trang thiết bị tiêu chuẩn tại phòng tập. Phù hợp cho người mới bắt đầu hoặc người có lịch công tác ngắn hạn ở thành phố này.",
    facilities: [
      "Sử dụng toàn bộ máy tập cardio và tạ",
      "Tủ để đồ cá nhân tiêu chuẩn tự quản",
      "Truy cập các lớp tập nhóm cơ bản"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  { 
    id: 2, 
    name: "Gói 1 Tháng Cơ Bản Nữ", 
    price: "300,000 đ", 
    type: "normal",
    gender: "female",
    best: false,
    description: "Trải nghiệm đầy đủ trang thiết bị tiêu chuẩn với không gian riêng biệt. Phù hợp cho nữ giới mới bắt đầu hoặc có lịch công tác ngắn hạn ở thành phố này.",
    facilities: [
      "Sử dụng toàn bộ máy tập cardio và tạ (không gian riêng)",
      "Tủ để đồ cá nhân tiêu chuẩn tự quản",
      "Truy cập các lớp tập nhóm cơ bản",
      "Khu vực tập riêng biệt cho nữ"
    ],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  { 
    id: 3, 
    name: "Gói 6 Tháng VIP Nam Tặng 1", 
    price: "1,800,000 đ", 
    type: "vip",
    gender: "male",
    best: true,
    description: "Gói tiết kiệm với thời gian đủ dài để thấy kết quả rõ rệt. Tặng thêm 1 tháng tập luyện hoàn toàn miễn phí, cùng hàng loạt quyền lợi chăm sóc cao cấp.",
    facilities: [
      "Sử dụng phòng VIP thay đồ và tủ cá nhân cực lớn",
      "Dịch vụ xông hơi đá muối không giới hạn thời gian",
      "Tặng ngay 3 buổi tập định hướng với Huấn luyện viên cá nhân",
      "Miễn phí tham gia 100% các lớp học Zumba, Yoga Master",
      "Có không gian tập riêng dành cho VIP"
    ],
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  { 
    id: 4, 
    name: "Gói 6 Tháng VIP Nữ Tặng 1", 
    price: "1,800,000 đ", 
    type: "vip",
    gender: "female",
    best: true,
    description: "Gói tiết kiệm với thời gian đủ dài để thấy kết quả rõ rệt. Tặng thêm 1 tháng tập luyện hoàn toàn miễn phí, không gian riêng biệt cùng hàng loạt quyền lợi chăm sóc cao cấp.",
    facilities: [
      "Sử dụng phòng VIP thay đồ riêng biệt và tủ cá nhân cực lớn (khu vực nữ)",
      "Dịch vụ xông hơi đá muối không giới hạn thời gian (khu vực nữ riêng biệt)",
      "Tặng ngay 3 buổi tập định hướng với Huấn luyện viên cá nhân nữ",
      "Miễn phí tham gia 100% các lớp học Yoga Master, Zumba (đề cáp riêng)",
      "Khu vực tập riêng biệt VIP dành cho nữ"
    ],
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  { 
    id: 5, 
    name: "Gói 12 Tháng VIP Nam", 
    price: "3,000,000 đ", 
    type: "vip",
    gender: "male",
    best: false,
    description: "Trải nghiệm đẳng cấp cao nhất với các đặc quyền chuẩn VIP. Cam kết dài hạn với chi phí cực rẻ mỗi tháng kèm dịch vụ hỗ trợ tối đa.",
    facilities: [
      "Sử dụng phòng VIP thay đồ và tủ cá nhân cực lớn",
      "Dịch vụ xông hơi đá muối không giới hạn thời gian",
      "Tặng ngay 3 buổi tập định hướng với Huấn luyện viên cá nhân",
      "Miễn phí tham gia 100% các lớp học Zumba, Yoga Master",
      "Ưu tiên đặt lịch các lớp tập nhóm cao cấp",
      "Đo chỉ số InBody miễn phí hàng tháng"
    ],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5adee9f50?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
  { 
    id: 6, 
    name: "Gói 12 Tháng VIP Nữ", 
    price: "3,000,000 đ", 
    type: "vip",
    gender: "female",
    best: false,
    description: "Trải nghiệm đẳng cấp cao nhất với không gian riêng biệt dành cho nữ. Cam kết dài hạn với chi phí cực rẻ mỗi tháng kèm dịch vụ hỗ trợ tối đa và chuyên biệt.",
    facilities: [
      "Sử dụng phòng VIP thay đồ riêng biệt và tủ cá nhân cực lớn (khu vực nữ)",
      "Dịch vụ xông hơi đá muối không giới hạn thời gian (khu vực nữ riêng biệt)",
      "Tặng ngay 3 buổi tập định hướng với Huấn luyện viên cá nhân nữ",
      "Miễn phí tham gia 100% các lớp học Yoga Master, Zumba (đề cáp riêng)",
      "Ưu tiên đặt lịch các lớp tập nhóm cao cấp (khu vực nữ riêng biệt)",
      "Đo chỉ số InBody miễn phí hàng tháng",
      "Khu vực tập riêng biệt VIP dành cho nữ"
    ],
    image: "https://images.unsplash.com/photo-1571019614242-c5c5adee9f50?auto=format&fit=crop&q=80&w=600",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
  },
];

const RegisterGymPackage = () => {
  // Separate packages by gender
  const malePackages = gymPackagesData.filter(pkg => pkg.gender === 'male');
  const femalePackages = gymPackagesData.filter(pkg => pkg.gender === 'female');
  
  const [selectedPkg, setSelectedPkg] = useState(malePackages[0]);
  const navigate = useNavigate();

  const handleSelectPackage = (pkg) => {
    setSelectedPkg(pkg);
  };

  const handleCheckout = () => {
    navigate('/member/register/checkout', { state: { package: selectedPkg } });
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Đăng Ký Gói Tập</h1>
        <p className="text-gray-500 text-sm mt-2">Chọn gói tập phù hợp với giới tính của bạn và hoàn tất thanh toán qua thẻ / Momo / VNPay.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Panel: Male & Female Packages */}
        <div className="xl:col-span-2 space-y-6">
          {/* Male Packages Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gói Tập Nam</h2>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-semibold">Nam</span>
            </div>
            <div className="grid gap-3">
              {malePackages.map(pkg => (
                <label 
                  key={pkg.id} 
                  onClick={() => handleSelectPackage(pkg)}
                  className={`rounded-xl border-2 p-5 cursor-pointer transition-all flex items-center justify-between relative ${selectedPkg.id === pkg.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'}`}
                >
                  {pkg.best && <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">Tiết kiệm nhất</div>}
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="package" 
                      checked={selectedPkg.id === pkg.id} 
                      onChange={() => handleSelectPackage(pkg)} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{pkg.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pkg.type === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản'}
                      </p>
                    </div>
                  </div>
                  <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">{pkg.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Female Packages Section */}
          <div className="space-y-4 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gói Tập Nữ</h2>
              <span className="text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full font-semibold">Nữ</span>
            </div>
            <div className="grid gap-3">
              {femalePackages.map(pkg => (
                <label 
                  key={pkg.id} 
                  onClick={() => handleSelectPackage(pkg)}
                  className={`rounded-xl border-2 p-5 cursor-pointer transition-all flex items-center justify-between relative ${selectedPkg.id === pkg.id ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'}`}
                >
                  {pkg.best && <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">Tiết kiệm nhất</div>}
                  <div className="flex items-center gap-4">
                    <input 
                      type="radio" 
                      name="package" 
                      checked={selectedPkg.id === pkg.id} 
                      onChange={() => handleSelectPackage(pkg)} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{pkg.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pkg.type === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản'}
                      </p>
                    </div>
                  </div>
                  <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">{pkg.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Info Sections */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  Hỗ trợ thanh toán
                </h3>
                <div className="flex gap-2 flex-wrap">
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-blue-600">VISA</div>
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-pink-500">MoMo</div>
                  <div className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 text-xs font-bold text-sky-500">VNPay</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Cam kết của chúng tôi
                </h3>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Kích hoạt gói ngay lập tức</li>
                  <li>• Quản lý lịch tập trực tuyến</li>
                  <li>• Bảo mật thanh toán tuyệt đối</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                Lưu ý quan trọng
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                <p>Mọi thắc mắc liên hệ hotline hỗ trợ: <strong>1900 8888</strong></p>
                <p>Gói tập sẽ được kích hoạt ngay sau khi thanh toán thành công. Bảo lưu chỉ áp dụng cho gói 6 tháng trở lên.</p>
                <p>Nữ giới sẽ có khu vực tập riêng biệt để đảm bảo sự thoải mái và an toàn.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Package Details */}
        <div className="sticky top-24 h-fit">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-950 dark:shadow-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Chi tiết gói</h2>
            
            <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{
              backgroundColor: selectedPkg.gender === 'male' ? '#dbeafe' : '#fce7f3',
              color: selectedPkg.gender === 'male' ? '#1e40af' : '#be185d'
            }}>
              {selectedPkg.gender === 'male' ? 'Dành cho Nam' : 'Dành cho Nữ'}
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{selectedPkg.name}</h3>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
              {selectedPkg.description}
            </p>

            <div className="space-y-4 mb-8">
              <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Quyền lợi bao gồm
              </h4>
              <ul className="space-y-3">
                {selectedPkg.facilities.map((fac, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                    {fac}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                  <ImageIcon className="h-4 w-4 text-blue-600" /> Không gian
                </div>
                <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 group relative">
                  <img src={selectedPkg.image} alt={selectedPkg.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
                  <Video className="h-4 w-4 text-red-500" /> Video
                </div>
                <div className="rounded-lg overflow-hidden aspect-video border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 relative">
                  <video 
                    className="w-full h-full outline-none object-cover" 
                    controls 
                    poster={selectedPkg.image}
                  >
                    <source src={selectedPkg.videoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              className="w-full h-12 text-base font-bold rounded-xl" 
              leftIcon={<ShoppingCart className="h-5 w-5" />} 
              rightIcon={<ArrowRight className="h-5 w-5 opacity-70" />}
            >
              Thanh Toán Nhanh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackage;
