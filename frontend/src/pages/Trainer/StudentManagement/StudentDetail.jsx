import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import useTrainerStore from '@/store/useTrainerStore';

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, unit, icon: Icon, iconColor, bgColor, trend }) => (
  <div className={`${bgColor} rounded-2xl p-4`}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
      <div className={`w-7 h-7 rounded-lg ${iconColor} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <div className="text-2xl font-black text-gray-900">{value}<span className="text-sm font-semibold text-gray-500 ml-1">{unit}</span></div>
    {trend !== null && trend !== undefined && (
      <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${trend < 0 ? 'text-green-600' : trend > 0 ? 'text-red-500' : 'text-gray-400'}`}>
        {trend < 0 ? <TrendingDown className="w-3 h-3" /> : trend > 0 ? <TrendingUp className="w-3 h-3" /> : null}
        {trend !== 0 ? `${trend > 0 ? '+' : ''}${trend} từ lần trước` : 'Không đổi'}
      </div>
    )}
  </div>
);

// ─── Custom Tooltip for chart ─────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <div className="font-bold text-gray-700 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-bold text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── InBody history table ─────────────────────────────────────────────────────
const InBodyTable = ({ data }) => {
  if (!data || data.length === 0) return <div className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</div>;
  const keyed = [...data].reverse();
  const fields = [
    { key: 'weight', label: 'Cân nặng (kg)' },
    { key: 'bodyFat', label: 'Mỡ (%)' },
    { key: 'muscle', label: 'Cơ (kg)' },
    { key: 'chest', label: 'Ngực (cm)' },
    { key: 'waist', label: 'Bụng (cm)' },
    { key: 'arm', label: 'Bắp tay (cm)' },
    { key: 'forearm', label: 'Cẳng tay (cm)' },
    { key: 'thigh', label: 'Đùi (cm)' },
    { key: 'calf', label: 'Bắp chuối (cm)' },
  ];

  // Only show rows where at least one record has a value
  const activeFields = fields.filter(f => keyed.some(e => e[f.key] !== undefined && e[f.key] !== null));

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Chỉ số</th>
            {keyed.map((e, i) => (
              <th key={i} className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{e.date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeFields.map((f, ri) => (
            <tr key={f.key} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className="px-4 py-3 font-semibold text-gray-700 whitespace-nowrap">{f.label}</td>
              {keyed.map((e, i) => {
                const val = e[f.key];
                const prev = keyed[i + 1]?.[f.key];
                const delta = val !== undefined && prev !== undefined ? +(val - prev).toFixed(1) : null;
                return (
                  <td key={i} className="px-4 py-3 text-center">
                    {val !== undefined ? (
                      <div>
                        <div className="font-bold text-gray-900">{val}</div>
                        {delta !== null && (
                          <div className={`text-xs font-semibold ${delta < 0 ? 'text-green-500' : delta > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {delta > 0 ? '+' : ''}{delta}
                          </div>
                        )}
                      </div>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const StudentDetail = () => {
  const { id } = useParams();
  const students = useTrainerStore((s) => s.students);
  const student = students.find((s) => String(s.id) === String(id));

  const [chartMetric, setChartMetric] = useState('all'); // 'all' | 'weight' | 'bodyFat' | 'muscle'

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div className="text-5xl">🔍</div>
        <h2 className="text-xl font-bold text-gray-700">Không tìm thấy học viên</h2>
        <Link to="/trainer/students" className="text-blue-600 text-sm font-semibold hover:underline">← Quay lại danh sách</Link>
      </div>
    );
  }

  const inbody = student.inbody || [];
  const latest = inbody[inbody.length - 1];
  const prev = inbody[inbody.length - 2];

  const delta = (key) => latest && prev && prev[key] !== undefined ? +(latest[key] - prev[key]).toFixed(1) : null;

  const chartData = inbody.map((e) => ({
    date: e.date.slice(5), // 'MM-DD'
    'Cân nặng': e.weight,
    'Mỡ (%)': e.bodyFat,
    'Cơ (kg)': e.muscle,
  }));

  const lineConfig = [
    { key: 'Cân nặng', color: '#3B82F6', hide: chartMetric !== 'all' && chartMetric !== 'weight' },
    { key: 'Mỡ (%)', color: '#F59E0B', hide: chartMetric !== 'all' && chartMetric !== 'bodyFat' },
    { key: 'Cơ (kg)', color: '#10B981', hide: chartMetric !== 'all' && chartMetric !== 'muscle' },
  ];

  const metricFilters = [
    { value: 'all', label: 'Tất cả' },
    { value: 'weight', label: 'Cân nặng' },
    { value: 'bodyFat', label: 'Mỡ (%)' },
    { value: 'muscle', label: 'Cơ (kg)' },
  ];

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto w-full">
      {/* Back button + header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/trainer/students">
          <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-base font-black text-blue-700">
            {student.avatar || student.name.split(' ').slice(-2).map(w => w[0]).join('')}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-xs text-gray-500">{student.goal} · {student.package} · còn {student.remaining} buổi</p>
          </div>
        </div>
        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${student.remaining <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {student.remaining <= 3 ? '⚠ Sắp hết buổi' : '✓ Đang hoạt động'}
        </span>
      </div>

      {/* Stats row */}
      {latest && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Cân nặng" value={latest.weight} unit="kg" icon={Activity} iconColor="bg-blue-500" bgColor="bg-blue-50" trend={delta('weight')} />
          <StatCard label="Mỡ cơ thể" value={latest.bodyFat} unit="%" icon={TrendingDown} iconColor="bg-amber-500" bgColor="bg-amber-50" trend={delta('bodyFat')} />
          <StatCard label="Khối lượng cơ" value={latest.muscle} unit="kg" icon={TrendingUp} iconColor="bg-emerald-500" bgColor="bg-emerald-50" trend={delta('muscle')} />
        </div>
      )}

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Biểu đồ theo dõi InBody</h3>
            <p className="text-xs text-gray-500 mt-0.5">Cập nhật tự động sau mỗi buổi xác nhận điểm danh</p>
          </div>
          <div className="flex gap-1">
            {metricFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setChartMetric(f.value)}
                className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors ${
                  chartMetric === f.value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {chartData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            Chưa có dữ liệu InBody
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              {lineConfig.map((l) => !l.hide && (
                <Line
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  stroke={l.color}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: l.color }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* InBody history table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Lịch sử đo chỉ số</h3>
        <InBodyTable data={inbody} />
      </div>
    </div>
  );
};

export default StudentDetail;
