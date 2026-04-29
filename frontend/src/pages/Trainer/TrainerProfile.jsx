import React, { useState } from 'react';
import { Award, Briefcase, Ruler } from 'lucide-react';

const TrainerProfile = () => {

  return (
    <div className="p-6">
      <div className="max-w-full">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Thông tin cá nhân</h1>
        <p className="text-sm text-gray-600 mb-6">Hồ sơ và thông tin chi tiết của huấn luyện viên.</p>

        {/* Avatar + Basic Info Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Avatar Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl font-semibold text-blue-600 border-2 border-blue-200 mb-4">
              TR
            </div>
            <div className="text-center">
              <div className="text-base font-semibold text-gray-900">Trần Minh Khoa</div>
              <div className="text-xs text-gray-600 mt-0.5">Năm sinh: 1995</div>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                TRAINER
              </span>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Họ và tên</span>
                <span className="text-sm font-medium text-gray-900">Trần Minh Khoa</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Năm sinh</span>
                <span className="text-sm font-medium text-gray-900">1995</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Số điện thoại</span>
                <span className="text-sm font-medium text-gray-900">0912 345 678</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">khoa.tran@activegym.vn</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Chuyên môn</span>
                <span className="text-sm font-medium text-gray-900">Strength & Conditioning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Awards, Experience, Measurements Section */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Awards Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Giải thưởng
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🥇
                </div>
                <div>
                  <div className="text-sm text-gray-900">HCV Men's Physique</div>
                  <div className="text-xs text-gray-600">VNBF 2023</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🥈
                </div>
                <div>
                  <div className="text-sm text-gray-900">Á quân Classic Bodybuilding</div>
                  <div className="text-xs text-gray-600">WBPF 2022</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center text-sm flex-shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-sm text-gray-900">Top 3 PT of the Year</div>
                  <div className="text-xs text-gray-600">ActiveGym 2024</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Kinh nghiệm
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Head PT — ActiveGym Hà Nội</div>
                  <div className="text-xs text-gray-600">2022 – nay · 3 năm</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-300 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Personal Trainer — California Fitness</div>
                  <div className="text-xs text-gray-600">2019 – 2022 · 3 năm</div>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blue-300 mt-1.5 flex-shrink-0"></div>
                <div>
                  <div className="text-sm text-gray-900">Chứng chỉ ACE-CPT, FMS Level 1</div>
                  <div className="text-xs text-gray-600">2018</div>
                </div>
              </div>
            </div>
          </div>

          {/* Measurements Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Số đo thể hình
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Chiều cao</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  178 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Cân nặng</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  76 <span className="text-xs text-gray-600">kg</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Ngực</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  102 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bắp tay</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  38 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bụng</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  80 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Cẳng tay</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  29 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Đùi</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  58 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <div className="text-xs text-gray-600">Bắp chuối</div>
                <div className="text-sm font-semibold text-gray-900 mt-1">
                  40 <span className="text-xs text-gray-600">cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-3 px-6 bg-white text-center text-xs text-gray-500">
        © 2026 ActiveGym Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default TrainerProfile;
