import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import { memberService } from '@/services/memberService';

// Chuẩn hoá giá trị gender từ bất kỳ định dạng nào (tiếng Anh/Việt) về Male/Female/Other
const normalizeGenderValue = (raw) => {
  if (!raw) return '';
  const map = {
    male: 'Male', nam: 'Male',
    female: 'Female', nữ: 'Female', nu: 'Female',
    other: 'Other', khác: 'Other', khac: 'Other',
  };
  return map[raw.toLowerCase().trim()] ?? raw;
};

const EditProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingProfile = location.state?.profile;

  const [form, setForm] = useState({
    full_name: existingProfile?.full_name || existingProfile?.name || '',
    phone: existingProfile?.phone || '',
    email: existingProfile?.email || '',
    dob: existingProfile?.dob ? existingProfile.dob.split('T')[0] : '',
    address: existingProfile?.address || '',
    gender: normalizeGenderValue(existingProfile?.gender),
  });
  const [loading, setLoading] = useState(!existingProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!existingProfile) {
      memberService.getMe()
        .then((data) => {
          const p = data?.data ?? data;
          setForm({
            full_name: p?.full_name || p?.name || '',
            phone: p?.phone || '',
            email: p?.email || '',
            dob: p?.dob ? p.dob.split('T')[0] : '',
            address: p?.address || '',
            gender: normalizeGenderValue(p?.gender),
          });
        })
        .catch(() => setError('Không thể tải hồ sơ.'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [existingProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await memberService.updateMe(form);
      navigate('/member/profile', {
        replace: true,
        state: { profile: updated?.data ?? updated, refreshedAt: Date.now() },
      });
    } catch (err) {
      console.error(err);
      const apiMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' ? err.response.data : null) ||
        err?.message;
      setError(apiMessage || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-2xl pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/member/profile">
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 shadow-sm rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cập Nhật Hồ Sơ</h1>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm dark:bg-gray-950 dark:border-gray-800 space-y-6">
        <Input
          label="Họ và Tên (*)"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
        />
        <Input
          label="Số điện thoại (*)"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Email đăng nhập"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ngày tháng năm sinh</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Giới tính</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="flex h-12 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>

          </select>
        </div>

        <Input
          label="Địa chỉ hiện tại"
          name="address"
          value={form.address}
          onChange={handleChange}
        />

        <div className="pt-6 mt-4">
          <Button
            type="submit"
            className="w-full h-12 text-lg font-bold rounded-xl shadow-md"
            leftIcon={<Save className="h-5 w-5" />}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu Thông Tin Mới'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
