import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';


import Login from '@/pages/Login/Login';
import OwnerDashboard from '@/pages/Owner/OwnerDashboard';
import MemberList from '@/pages/Owner/MemberManagement/MemberList';
import MemberFormPage from '@/pages/Owner/MemberManagement/MemberForm';
import MemberDetail from '@/pages/Owner/MemberManagement/MemberDetail';
import PackageList from '@/pages/Owner/PackageManagement/PackageList';
import PackageFormPage from '@/pages/Owner/PackageManagement/PackageForm';
import EquipmentList from '@/pages/Owner/EquipmentManagement/EquipmentList';
import EquipmentFormPage from '@/pages/Owner/EquipmentManagement/EquipmentForm';
import StaffList from '@/pages/Owner/StaffManagement/StaffList';
import StaffFormPage from '@/pages/Owner/StaffManagement/StaffForm';
import RoomList from '@/pages/Owner/RoomManagement/RoomList';
import FeedbackList from '@/pages/Owner/FeedbackManagement/FeedbackList';
import RevenueReport from '@/pages/Owner/Reports/RevenueReport';

import ManagerDashboard from '@/pages/Manager/ManagerDashboard';
import ManagerMemberList from '@/pages/Manager/MemberManagement/MemberList';
import RegisterMember from '@/pages/Manager/MemberManagement/RegisterMember';
import ManagerMemberDetail from '@/pages/Manager/MemberManagement/MemberDetail';
import ManagerMemberFormPage from '@/pages/Manager/MemberManagement/MemberForm';
import ManagerRenewPackage from '@/pages/Manager/MemberManagement/RenewPackage';
import ManagerFeedbackList from '@/pages/Manager/FeedbackManagement/FeedbackList';
import ManagerPackageList from '@/pages/Manager/PackageManagement/PackageListView';

import TrainerDashboard from '@/pages/Trainer/TrainerDashboard';
import StudentList from '@/pages/Trainer/StudentManagement/StudentList';
import TrackProgress from '@/pages/Trainer/StudentManagement/TrackProgress';
import ScheduleList from '@/pages/Trainer/Schedule/ScheduleList';
import EvaluationForm from '@/pages/Trainer/Evaluation/EvaluationForm';

import MemberDashboard from '@/pages/Member/MemberDashboard';
import PackageInfo from '@/pages/Member/MyPackage/PackageInfo';
import TrainingHistory from '@/pages/Member/MyPackage/TrainingHistory';
import RenewPackage from '@/pages/Member/RenewPackage/RenewPackage';
import SendFeedback from '@/pages/Member/Feedback/SendFeedback';
import ProfileInfo from '@/pages/Member/Profile/ProfileInfo';
import EditProfile from '@/pages/Member/Profile/EditProfile';

export const router = createBrowserRouter([
  // Public Route: Bất kỳ ai cũng vào được (Login)
  {
    path: '/login',
    element: <Login />,
  },
  
  // Private Routes: Phải có Token JWT (Bọc bởi PrivateRoute)
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      // 1. Nếu gõ / thay vì /owner thì đá tự động về dashboard
      {
        path: '/',
        element: <Navigate to="/member/dashboard" replace />,
      },
      // Bọc Layout chính (Sidebar + Header)
      {
        element: <MainLayout />,
        children: [
          // 2. Member Normal Dashboard
          {
            path: 'member',
            element: <RoleBasedRoute allowedRoles={['member', 'owner', 'manager', 'trainer']} />,
            children: [
              { path: 'dashboard', element: <MemberDashboard /> },
              { path: 'my-package', element: <PackageInfo /> },
              { path: 'history', element: <TrainingHistory /> },
              { path: 'renew', element: <RenewPackage /> },
              { path: 'feedback', element: <SendFeedback /> },
              { path: 'profile', element: <ProfileInfo /> },
              { path: 'profile/edit', element: <EditProfile /> }
            ]
          },
          // 3. System Owner Area (Chỉ Chủ Cửa Hàng)
          {
            path: 'owner',
            element: <RoleBasedRoute allowedRoles={['owner']} />,
            children: [
              { path: 'dashboard', element: <OwnerDashboard /> },
              { path: 'members', element: <MemberList /> },
              { path: 'members/create', element: <MemberFormPage /> },
              { path: 'members/:id', element: <MemberDetail /> },
              { path: 'members/:id/edit', element: <MemberFormPage /> },
              { path: 'packages', element: <PackageList /> },
              { path: 'packages/create', element: <PackageFormPage /> },
              { path: 'packages/:id/edit', element: <PackageFormPage /> },
              { path: 'equipment', element: <EquipmentList /> },
              { path: 'equipment/create', element: <EquipmentFormPage /> },
              { path: 'equipment/:id/edit', element: <EquipmentFormPage /> },
              { path: 'staffs', element: <StaffList /> },
              { path: 'staffs/create', element: <StaffFormPage /> },
              { path: 'staffs/:id/edit', element: <StaffFormPage /> },
              { path: 'rooms', element: <RoomList /> },
              { path: 'feedbacks', element: <FeedbackList /> },
              { path: 'reports/revenue', element: <RevenueReport /> }
            ]
          },
          // 4. Manager Area (Quản lý thu ngân)
          {
            path: 'manager',
            element: <RoleBasedRoute allowedRoles={['manager', 'owner']} />,
            children: [
              { path: 'dashboard', element: <ManagerDashboard /> },
              { path: 'members', element: <ManagerMemberList /> },
              { path: 'members/:id', element: <ManagerMemberDetail /> },
              { path: 'members/:id/edit', element: <ManagerMemberFormPage /> },
              { path: 'members/register', element: <RegisterMember /> },
              { path: 'members/renew', element: <ManagerRenewPackage /> },
              { path: 'packages', element: <ManagerPackageList /> },
              { path: 'feedbacks', element: <ManagerFeedbackList /> }
            ]
          },
          // 5. Trainer Area (Huấn luyện viên)
          {
            path: 'trainer',
            element: <RoleBasedRoute allowedRoles={['trainer']} />,
            children: [
              { path: 'dashboard', element: <TrainerDashboard /> },
              { path: 'students', element: <StudentList /> },
              { path: 'students/:id/progress', element: <TrackProgress /> },
              { path: 'schedule', element: <ScheduleList /> },
              { path: 'evaluation', element: <EvaluationForm /> }
            ]
          }
        ]
      }
    ]
  },

  // 404 Not Found Handle
  {
    path: '*',
    element: (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Trang bạn tìm không tồn tại</p>
      </div>
    ),
  }
]);
