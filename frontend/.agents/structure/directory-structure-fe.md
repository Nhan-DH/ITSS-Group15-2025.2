# Cấu trúc thư mục Frontend

```text
gym-management-frontend/
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── default-avatar.png
│   │   └── gym-bg.jpg
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── icons/
│   │   │   │   ├── dashboard.svg
│   │   │   │   ├── member.svg
│   │   │   │   └── package.svg
│   │   │   └── backgrounds/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── MainLayout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── Common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Alert.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── Charts/
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── MemberStatsChart.jsx
│   │   │   └── PerformanceChart.jsx
│   │   │
│   │   ├── Forms/
│   │   │   ├── MemberForm.jsx
│   │   │   ├── PackageForm.jsx
│   │   │   ├── EquipmentForm.jsx
│   │   │   └── FeedbackForm.jsx
│   │   │
│   │   └── Dashboard/
│   │       ├── StatsCard.jsx
│   │       ├── RecentActivities.jsx
│   │       └── UpcomingSchedules.jsx
│   │
│   ├── pages/
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── Login.css (optional)
│   │   │
│   │   ├── Owner/
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── RoomManagement/
│   │   │   │   ├── RoomList.jsx
│   │   │   │   ├── RoomForm.jsx
│   │   │   │   └── RoomDetail.jsx
│   │   │   ├── EquipmentManagement/
│   │   │   │   ├── EquipmentList.jsx
│   │   │   │   ├── EquipmentForm.jsx
│   │   │   │   └── EquipmentDetail.jsx
│   │   │   ├── StaffManagement/
│   │   │   │   ├── StaffList.jsx
│   │   │   │   ├── StaffForm.jsx
│   │   │   │   └── StaffDetail.jsx
│   │   │   ├── MemberManagement/
│   │   │   │   ├── MemberList.jsx
│   │   │   │   ├── MemberDetail.jsx
│   │   │   │   └── MemberForm.jsx
│   │   │   ├── PackageManagement/
│   │   │   │   ├── PackageList.jsx
│   │   │   │   ├── PackageForm.jsx
│   │   │   │   └── PackageDetail.jsx
│   │   │   ├── FeedbackManagement/
│   │   │   │   ├── FeedbackList.jsx
│   │   │   │   └── FeedbackDetail.jsx
│   │   │   └── Reports/
│   │   │       ├── RevenueReport.jsx
│   │   │       ├── MemberReport.jsx
│   │   │       └── StaffPerformanceReport.jsx
│   │   │
│   │   ├── Manager/
│   │   │   ├── ManagerDashboard.jsx
│   │   │   ├── MemberManagement/
│   │   │   │   ├── MemberList.jsx
│   │   │   │   ├── RegisterMember.jsx
│   │   │   │   ├── RenewPackage.jsx
│   │   │   │   └── MemberDetail.jsx
│   │   │   ├── PackageManagement/
│   │   │   │   └── PackageListView.jsx
│   │   │   └── FeedbackManagement/
│   │   │       ├── FeedbackList.jsx
│   │   │       └── ProcessFeedback.jsx
│   │   │
│   │   ├── Trainer/
│   │   │   ├── TrainerDashboard.jsx
│   │   │   ├── StudentManagement/
│   │   │   │   ├── StudentList.jsx
│   │   │   │   ├── StudentDetail.jsx
│   │   │   │   └── TrackProgress.jsx
│   │   │   ├── Schedule/
│   │   │   │   ├── ScheduleList.jsx
│   │   │   │   └── ScheduleForm.jsx
│   │   │   └── Evaluation/
│   │   │       ├── EvaluationList.jsx
│   │   │       └── EvaluationForm.jsx
│   │   │
│   │   └── Member/
│   │       ├── MemberDashboard.jsx
│   │       ├── MyPackage/
│   │       │   ├── PackageInfo.jsx
│   │       │   ├── TrainingHistory.jsx
│   │       │   └── RemainingSessions.jsx
│   │       ├── RenewPackage/
│   │       │   └── RenewPackage.jsx
│   │       ├── Feedback/
│   │       │   └── SendFeedback.jsx
│   │       └── Profile/
│   │           ├── ProfileInfo.jsx
│   │           └── EditProfile.jsx
│   │
│   ├── routes/
│   │   ├── index.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── RoleBasedRoute.jsx
│   │
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useThemeStore.js
│   │   └── useUIStore.js
│   │
│   ├── hooks/
│   │   ├── queries/
│   │   │   ├── useMembers.js
│   │   │   ├── usePackages.js
│   │   │   ├── useEquipment.js
│   │   │   ├── useFeedbacks.js
│   │   │   ├── useReports.js
│   │   │   └── useAuth.js
│   │   │
│   │   └── mutations/
│   │       ├── useMemberMutations.js
│   │       ├── usePackageMutations.js
│   │       ├── useEquipmentMutations.js
│   │       ├── useFeedbackMutations.js
│   │       └── useAuthMutations.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── memberService.js
│   │   ├── packageService.js
│   │   ├── equipmentService.js
│   │   ├── feedbackService.js
│   │   └── reportService.js
│   │
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   ├── memberSchemas.js
│   │   ├── packageSchemas.js
│   │   ├── equipmentSchemas.js
│   │   └── feedbackSchemas.js
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   └── menuConfig.js
│   │
│   ├── styles/
│   │   ├── index.css
│   │   ├── variables.css
│   │   └── globals.css
│   │
│   ├── lib/
│   │   ├── queryClient.js
│   │   └── axios.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── vite-env.d.ts
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md```
