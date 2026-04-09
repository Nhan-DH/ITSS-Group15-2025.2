import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '@/components/Common/Button';
import { toast } from '@/utils/toast';

const RegisterGymPackageCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.package;
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!selectedPackage) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10">
          <p className="text-red-600 dark:text-red-400">Vui lòng chọn gói tập trước khi thanh toán.</p>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setIsCompleted(true);
      toast.success('Thanh toán thành công! Gói tập đã được kích hoạt.');
      setTimeout(() => {
        navigate('/member/my-package');
      }, 2000);
    }, 1500);
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-8 dark:border-green-900/30 dark:bg-green-900/10 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-300 mb-2">Đăng Ký Thành Công!</h2>
          <p className="text-green-700 dark:text-green-400 mb-6">
            Gói tập của bạn đã được kích hoạt. Bạn sẽ được chuyển hướng đến trang quản lý gói tập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Thông Tin Thanh Toán</h2>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white">Chọn phương thức thanh toán</h3>
              
              <div className="space-y-3">
                {[
                  { id: 'card', label: 'Thẻ Ngân Hàng', desc: 'Visa, Mastercard' },
                  { id: 'momo', label: 'Ví MoMo', desc: 'Thanh toán qua MoMo' },
                  { id: 'vnpay', label: 'VNPay', desc: 'Thanh toán qua VNPay' },
                  { id: 'bank', label: 'Chuyển Khoản Ngân Hàng', desc: 'Chuyển tiền trực tiếp' }
                ].map(method => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{method.label}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="font-semibold mb-1">Lưu ý bảo mật</p>
                  <p>Mọi giao dịch đều được bảo mật tuyệt đối. Thông tin cá nhân của bạn sẽ không được chia sẻ cho bên thứ ba.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              isLoading={isLoading}
              className="w-full h-12 text-lg font-bold rounded-xl"
            >
              {isLoading ? 'Đang xử lý...' : 'Xác Nhận Thanh Toán'}
            </Button>
          </div>
        </div>

        {/* Right: Order Summary Card */}
        <div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Tóm tắt đơn hàng</h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gói tập</span>
                <span className="font-semibold text-gray-900 dark:text-white">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Loại gói</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedPackage.type === 'vip' ? 'Gói VIP' : 'Gói Cơ Bản'}
                </span>
              </div>
              
              {selectedPackage.gender === 'female' && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Loại hành động</span>
                  <span className="text-sm px-2 py-1 rounded bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 font-semibold">Khu vực nữ</span>
                </div>
              )}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Giá gốc</span>
                <span className="text-gray-900 dark:text-white font-semibold">{selectedPackage.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Phí xử lý</span>
                <span className="text-gray-900 dark:text-white">Miễn phí</span>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mb-6 border border-blue-200 dark:border-blue-900/30">
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">Tổng thanh toán</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{selectedPackage.price}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">Quyền lợi chi tiết:</h4>
              <ul className="space-y-2">
                {selectedPackage.facilities.slice(0, 3).map((fac, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                    {fac}
                  </li>
                ))}
                {selectedPackage.facilities.length > 3 && (
                  <li className="text-xs text-gray-500 dark:text-gray-500 italic">
                    + {selectedPackage.facilities.length - 3} quyền lợi khác...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterGymPackageCheckout;
