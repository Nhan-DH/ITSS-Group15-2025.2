import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import Button from '@/components/Common/Button';

const RenewPackage = () => {
  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gia hạn Online</h1>
        <p className="text-gray-500 text-sm mt-1">Gia hạn gói tập hoặc nâng cấp dịch vụ thanh toán siêu tốc qua thẻ / Momo / VNPay.</p>
      </div>

      <div className="grid gap-4">
        {[
          { id: 1, name: "Gói 1 Tháng Cơ Bản", price: "300,000 đ", best: false },
          { id: 2, name: "Gói 6 Tháng Tặng 1", price: "1,800,000 đ", best: true },
          { id: 3, name: "Gói 12 Tháng VIP", price: "3,000,000 đ", best: false },
        ].map(pkg => (
          <label key={pkg.id} className={`rounded-xl border-2 p-5 cursor-pointer transition-all flex items-center justify-between ${pkg.best ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-md' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 hover:border-blue-300'} relative`}>
             {pkg.best && <div className="absolute -top-3 right-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-sm tracking-widest">Tiết kiệm nhất</div>}
            <div className="flex items-center gap-4">
              <input type="radio" name="package" defaultChecked={pkg.best} className="h-5 w-5 text-blue-600 focus:ring-blue-500" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{pkg.name}</p>
              </div>
            </div>
            <p className="font-extrabold text-lg text-blue-600 dark:text-blue-400">{pkg.price}</p>
          </label>
        ))}
      </div>

      <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
        <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-blue-500/25 shadow-lg" leftIcon={<ShoppingCart className="h-5 w-5" />} rightIcon={<ArrowRight className="h-5 w-5 opacity-70" />}>
          Thanh Toán Nhanh
        </Button>
      </div>
    </div>
  );
};
export default RenewPackage;
