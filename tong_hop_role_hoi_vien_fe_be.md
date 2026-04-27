# Tong hop danh gia role hoi vien (FE/BE)

Ngay cap nhat: 2026-04-27

## 1) Pham vi va co so doi chieu
- Trong tam tai lieu: role hoi vien (member).
- Cach doi chieu chinh: doc code frontend/backend dang ton tai thay vi dua vao gia dinh cu.
- Nguon doi chieu uu tien:
  - FE member pages: `frontend/src/pages/Member/*`
  - FE services: `frontend/src/services/memberService.js`, `packageService.js`, `feedbackService.js`, `authService.js`
  - BE router: `backend/go/internal/infra/api/routes/router.go`, `auth_routes.go`
  - BE handlers: `backend/go/internal/infra/api/handlers/member_api.go`, `feedback_api.go`, `auth_api.go`
- Tai lieu nghiep vu/PDF chi duoc dung lam nguon phu de so khop muc tieu nghiep vu.

## 2) Ket luan nhanh
- FE member khong con o trang thai "chi co UI". Nhieu luong da noi API that:
  - ho so ca nhan
  - goi tap cua toi
  - dang ky goi
  - gia han goi
  - lich su tap luyen
  - dashboard member
  - gui feedback
- Tuy nhien, luong `Lich tap` cua member van chu yeu la UI mock/local state, chua di theo contract schedule/booking that tu backend.
- BE hien da co cum endpoint self-service cho member day du hon ban danh gia cu:
  - profile
  - packages
  - training history
  - schedule
  - feedback list
- Lech contract `PATCH /feedbacks/{id}/status` khong con la van de: BE da co route va handler tuong ung.
- Khoang trong lon nhat hien tai khong nam o CRUD co ban, ma nam o:
  - luong booking lich tap thuc su cho member
  - ownership check tren mot so shared endpoint
  - thanh toan/invoice van la demo o tang UI, chua thanh luong end-to-end

## 3) Doi chieu nghiep vu hoi vien voi code hien tai
Theo nghiep vu, hoi vien can:
- Dang nhap he thong.
- Theo doi goi tap.
- Quan ly lich/lịch su tap luyen.
- Gui phan hoi chat luong dich vu.
- Gia han goi truc tuyen.
- Nhan thong tin khuyen mai.

Trang thai hien tai theo code:
- Dang nhap: da co.
- Theo doi goi tap: da co FE+BE va dang chay qua API that.
- Lich su tap luyen: da co FE+BE va FE dang goi API that.
- Lich tap/schedule: BE da co, nhung page FE member schedule van mock.
- Gui phan hoi: da co FE+BE; FE gui `POST /feedbacks`.
- Gia han goi: da co mutation that toi BE, nhung buoc thanh toan tren UI la demo.
- Khuyen mai: chua thay module/route/man hinh/API rieng cho hoi vien.

## 4) Frontend da co va da noi API that
### 4.1 Route/menu cho member
- Route member ton tai ro rang trong `frontend/src/routes/index.jsx`:
  - `/member/dashboard`
  - `/member/schedule`
  - `/member/my-package`
  - `/member/history`
  - `/member/register`
  - `/member/renew`
  - `/member/feedback`
  - `/member/profile`
- Menu role member ton tai trong `frontend/src/utils/menuConfig.js`.

### 4.2 Auth va session
- FE login dung `authService.login()` goi `POST /auth/login`.
- Store luu `user`, `token`, `refreshToken` trong `frontend/src/store/useAuthStore.js`.
- FE co service `authService.getCurrentUser()` goi `GET /auth/me`.
- `PrivateRoute`/`RoleBasedRoute` dang dua chu yeu vao token + user trong store de bao ve route.

### 4.3 Cac luong member da noi API that
#### a) Dashboard member
- `frontend/src/pages/Member/MemberDashboard.jsx` dang goi that:
  - `memberService.getMe()`
  - `packageService.getMemberPackages()`
  - `memberService.getMySchedule()`
- Dashboard da lay du lieu profile, goi active, va buoi tap/booking sap toi tu backend.

#### b) Ho so ca nhan
- `frontend/src/pages/Member/Profile/ProfileInfo.jsx` dang goi `memberService.getMe()`.
- `frontend/src/pages/Member/Profile/EditProfile.jsx` dang:
  - load du lieu bang `memberService.getMe()`
  - cap nhat bang `memberService.updateMe()`
- Tuc la luong `/members/me` da duoc FE su dung that.

#### c) Goi tap cua toi
- `frontend/src/pages/Member/MyPackage/PackageInfo.jsx` dung `useMemberPackages()`.
- Hook nay goi `packageService.getMemberPackages()`, mapping toi `GET /members/me/packages`.

#### d) Dang ky goi tap
- `frontend/src/pages/Member/RegisterPackage/RegisterGymPackage.jsx` goi `packageService.getPackages()` => `GET /packages`.
- `RegisterGymPackageCheckout.jsx` goi mutation `useRegisterPackage()`.
- Mutation nay xuong `packageService.registerPackage()` => `POST /members/me/packages/register`.

#### e) Gia han goi tap
- `frontend/src/pages/Member/RenewPackage/RenewPackage.jsx` dung `useMemberPackages()`.
- `PaymentCheckout.jsx` goi mutation `useRenewPackage()`.
- Mutation xuong `packageService.renewPackage()` => `POST /members/me/packages/renew`.

#### f) Lich su tap luyen
- `frontend/src/pages/Member/MyPackage/TrainingHistory.jsx` goi `memberService.getMyTrainingHistory()`.
- Service xuong `GET /members/me/training-history`.

#### g) Gui feedback
- `frontend/src/pages/Member/Feedback/SendFeedback.jsx` da goi that `feedbackService.createFeedback()`.
- Service xuong `POST /feedbacks`.

## 5) Frontend da co nhung van la demo/mock hoac ban that ban mock
### 5.1 Trang lich tap member van chua noi backend that
- `frontend/src/pages/Member/Schedule/Schedule.jsx` la file lon dung rat nhieu `useState()` de giu:
  - workout data mock
  - available booking mock
  - member request mock
  - trainer info mock
- Page nay khong goi:
  - `memberService.getMySchedule()`
  - `GET /training-bookings`
  - `POST /training-bookings`
- Nghia la BE da co du lieu/route nen tang, nhung FE page schedule chua di theo luong that.

### 5.2 Checkout dang ky/gia han chi mo phong thanh toan
- `RegisterGymPackageCheckout.jsx` va `PaymentCheckout.jsx` deu co UI chon:
  - VNPAY
  - MoMo
  - card
  - bank transfer
- Tuy nhien:
  - QR/card/bank form chi la presentation demo
  - FE khong goi cong thanh toan that
  - FE khong nhan invoice/payment result that tu backend
  - mutation that chi kich hoat/goi gia han package

### 5.3 Catalog goi tap la "real data + local metadata + fallback mock"
- `RegisterGymPackage.jsx` co goi `GET /packages` that.
- Nhung page van tron them `LOCAL_METADATA` de bo sung:
  - description
  - image
  - video
  - gender/type/best
- Neu API loi, FE fallback ve `gymPackagesData` local.
- Nghia la danh muc goi tap tren UI khong phai 100% tu backend.

### 5.4 Optimistic cache van dua tren logic UI
- `frontend/src/hooks/mutations/usePackageMutations.js` co optimistic update cho register/renew.
- Phan optimistic nay tu tinh:
  - duration theo ten goi
  - endDate moi
- Day la hop ly cho trai nghiem UI, nhung khong nen xem no la bang chung cho luong invoice/payment that.

## 6) Backend da co gi cho role hoi vien
### 6.1 Auth va session
- Public auth:
  - `POST /auth/login`
  - `POST /auth/refresh`
- Protected auth:
  - `POST /auth/logout`
  - `GET /auth/me`
- `auth_routes.go` va `auth_api.go` cho thay `GET /auth/me` da ton tai that.

### 6.2 RBAC va self-service cho member
- Router tach ro:
  - `memberOnly` cho role `MEMBER`
  - `allRoles` cho `OWNER/MANAGER/PT/MEMBER`
- Cum endpoint self-service hien tai cua member:
  - `GET /members/me`
  - `PUT /members/me`
  - `GET /members/me/packages`
  - `POST /members/me/packages/register`
  - `POST /members/me/packages/renew`
  - `GET /members/me/training-history`
  - `GET /members/me/schedule`
  - `GET /members/me/feedbacks`

### 6.3 Ownership check da co tren mot so diem quan trong
- `GET /members/{id}`:
  - neu role la MEMBER thi chi duoc xem record cua chinh minh.
- `GET /members/me*`:
  - resolve member theo `account_id` trong JWT.
- `POST /feedbacks`:
  - neu role la MEMBER thi `member_id` duoc gan theo user dang dang nhap.
- `GET /feedbacks/{id}`:
  - neu role la MEMBER thi chi xem feedback cua chinh minh.

### 6.4 Cum self-service moi da duoc implement that
- `member_api.go` hien da co handler cho:
  - `GetMyTrainingHistory`
  - `GetMySchedule`
  - `GetMyFeedbacks`
- Vi vay ket luan cu "BE chua co training-history/schedule/feedback self-service" da khong con dung.

### 6.5 Feedback status patch da ton tai that
- Router da khai bao:
  - `PATCH /feedbacks/{id}/status`
- `feedback_api.go` da co `UpdateStatus`.
- Vi vay ket luan cu "FE/BE mismatch tai PATCH feedback status" can bo.

## 7) Contract API member-facing hien tai
### 7.1 Da co FE+BE
- `POST /auth/login`
- `GET /auth/me`
- `GET /members/me`
- `PUT /members/me`
- `GET /members/me/packages`
- `POST /members/me/packages/register`
- `POST /members/me/packages/renew`
- `GET /members/me/training-history`
- `GET /members/me/schedule`
- `GET /members/me/feedbacks`
- `POST /feedbacks`

### 7.2 Da co BE nhung FE member page chua dung dung muc tieu
- `GET /members/me/schedule`
  - dashboard da dung
  - page schedule chi tiet cua member chua dung
- `POST /training-bookings`
  - router cho phep all authenticated roles
  - nhung member schedule UI chua tich hop luong dat lich that

### 7.3 Luu y contract thuc te o FE
- Register/renew package la mutation that toi backend.
- Chon payment method, VAT, QR, the, chuyen khoan hien la UI demo.
- Invoice/payment confirmation khong duoc tra ve thanh hop dong member-facing end-to-end.

## 8) Khoang trong va rui ro ky thuat can ghi nhan
### 8.1 Ownership check chua dong deu tren shared endpoint
- Chua thay ownership check tuong duong trong handlers:
  - `GET /subscriptions/{id}`
  - `GET /training-bookings/{id}`
  - `GET /training-sessions/{id}`
- Vi cac route nay mo cho `allRoles`, member co the can them rang buoc neu duoc phep truy cap.

### 8.2 Luong booking lich tap chua hoan tat
- `POST /training-bookings` da mo route.
- Nhung FE member schedule chua su dung route nay de tao yeu cau dat lich that.
- Hien tai khoang trong lon nhat cua nghiep vu member nam o day.

### 8.3 Invoice co trong schema nhung chua thanh luong member end-to-end
- `backend/db/gymdb.sql` co bang `Invoice`.
- `backend/db/datasample.sql` co sample data cho `Invoice`.
- Nhung trong luong member register/renew hien tai:
  - khong thay create invoice that trong handler member self-service
  - khong thay API member-facing tra invoice/payment status
  - FE checkout van la demo UI

### 8.4 Khong thay module khuyen mai cho hoi vien
- Khong thay route/page/service/module rieng cho:
  - promotion
  - voucher
  - discount
  - thong bao khuyen mai member-facing

## 9) Phan loai trang thai theo 3 nhom
### 9.1 Da implemented end-to-end (FE+BE)
- Dang nhap.
- Lay profile member hien tai.
- Cap nhat profile member.
- Xem danh sach goi da dang ky.
- Dang ky goi tap moi.
- Gia han goi tap.
- Xem lich su tap luyen.
- Gui feedback.
- Lay feedback list cua member qua API (BE + service san sang; FE submit da co, list API da san sang cho tich hop tiep).

### 9.2 Co BE that, nhung FE member chua khai thac dung
- Schedule self-service API.
- Training booking route.
- Auth `GET /auth/me` co BE va service, nhung route guard FE dang dua chu yeu vao local auth store.

### 9.3 Dang o muc demo/mock/absent
- Member schedule UI chi tiet.
- Payment gateway/invoice workflow.
- Promotion/khuyen mai cho hoi vien.

## 10) Lo trinh hoan thien de xuat
### P1
- Thay the page `Member/Schedule` bang luong that dua tren:
  - `GET /members/me/schedule`
  - `POST /training-bookings`
  - cac trang thai booking/session that
- Chot contract FE-BE cho booking UX cua member:
  - tao yeu cau
  - xem lich sap toi
  - xem request dang cho/xac nhan/tu choi
- Lam ro boundary "that vs demo" cua register/renew:
  - neu giu demo payment thi tai lieu phai noi ro
  - neu lam that thi bo sung invoice/payment flow

### P2
- Bo sung ownership check cho cac shared read endpoint mo cho MEMBER:
  - subscription by id
  - training booking by id
  - training session by id
- Neu nghiep vu van yeu cau, them module khuyen mai/thong bao khuyen mai cho hoi vien.

## 11) Definition of Done de danh gia role hoi vien
- Member dang nhap thanh cong va lay duoc thong tin tu `GET /auth/me` hoac profile self-service.
- Member xem/sua duoc ho so cua chinh minh qua `/members/me`.
- Member xem duoc danh sach goi cua minh va thuc hien dang ky/gia han qua API that.
- Member xem duoc lich su tap luyen qua API that.
- Member co schedule/booking flow that, khong con dung local mock data.
- Member gui feedback thanh cong va co cach theo doi du lieu feedback cua minh.
- Cac endpoint member truy cap deu co ownership check dong deu theo JWT.
- Neu UI hien thi thanh toan, tai lieu/contract phai noi ro phan nao la demo, phan nao la that.
