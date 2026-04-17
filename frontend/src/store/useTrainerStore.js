import { create } from 'zustand';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert a preferredSchedule array of { day, slots } into calendar events.
 * day: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7' | 'Chủ nhật'
 * The function maps each day to the *next upcoming* date (from today, April 2026)
 * and creates an event entry.
 */
const DAY_TO_DOW = {
  'Thứ 2': 1,
  'Thứ 3': 2,
  'Thứ 4': 3,
  'Thứ 5': 4,
  'Thứ 6': 5,
  'Thứ 7': 6,
  'Chủ nhật': 0,
};

const pad2 = (n) => String(n).padStart(2, '0');

function nextDateForDOW(dow) {
  const today = new Date(2026, 3, 17); // April 17, 2026
  const diff = (dow - today.getDay() + 7) % 7 || 7;
  const d = new Date(today);
  d.setDate(today.getDate() + diff);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function slotToStartEnd(slot) {
  // slot format: '06:00 – 07:00' or '06:00 - 07:00'
  const parts = slot.replace('–', '-').split('-').map((s) => s.trim());
  return { start: parts[0] || '00:00', end: parts[1] || '01:00' };
}

function timesOverlap(s1, e1, s2, e2) {
  return s1 < e2 && s2 < e1;
}

// ─── initial data ─────────────────────────────────────────────────────────────

const initialStudents = [
  {
    id: 1,
    name: 'Nguyễn Tuấn A',
    phone: '0901xxx',
    goal: 'Giảm mỡ',
    package: 'PT 1:1 - 36 Buổi',
    remaining: 12,
    avatar: 'NA',
    birthDate: '12/05/1998',
    inbody: [
      { date: '2026-01-10', weight: 72, bodyFat: 26, muscle: 30 },
      { date: '2026-02-10', weight: 70, bodyFat: 24, muscle: 31 },
      { date: '2026-03-10', weight: 68, bodyFat: 22, muscle: 32 },
      { date: '2026-04-10', weight: 67, bodyFat: 21, muscle: 32.5 },
    ],
  },
  {
    id: 2,
    name: 'Lê Thị B',
    phone: '0902xxx',
    goal: 'Tăng cơ, độ mông',
    package: 'PT 1:1 - 12 Buổi',
    remaining: 3,
    avatar: 'LB',
    birthDate: '20/08/2000',
    inbody: [
      { date: '2026-02-15', weight: 55, bodyFat: 28, muscle: 22 },
      { date: '2026-03-15', weight: 54, bodyFat: 26, muscle: 23 },
    ],
  },
];

const initialEvents = {
  '2026-04-17': [
    { start: '08:25', end: '10:05', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: false, confirmed: false, absent: false },
    { start: '10:15', end: '11:45', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B2', student: 'Trần Thị B', studentId: 2, done: false, confirmed: false, absent: false },
  ],
  '2026-04-14': [
    { start: '07:00', end: '08:30', name: 'Buổi tập Cardio Mix', curriculum: 'Cardio Mix', room: 'Phòng A1', student: 'Lê Văn C', studentId: null, done: true, confirmed: true, absent: false },
  ],
  '2026-04-10': [
    { start: '09:00', end: '10:30', name: 'Buổi tập Core', curriculum: 'Core Training', room: 'Phòng B1', student: 'Phạm Thị D', studentId: null, done: true, confirmed: true, absent: false },
    { start: '14:00', end: '15:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng C2', student: 'Hoàng Văn E', studentId: null, done: true, confirmed: true, absent: false },
  ],
  '2026-04-07': [
    { start: '08:00', end: '09:30', name: 'Buổi tập Strength', curriculum: 'Strength Basic', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: true, confirmed: true, absent: false },
  ],
  '2026-04-22': [
    { start: '10:00', end: '11:30', name: 'Buổi tập Skinny fat', curriculum: 'Skinny fat', room: 'Phòng B1', student: 'Nguyễn Tuấn A', studentId: 1, done: false, confirmed: false, absent: false },
  ],
  '2026-04-24': [
    { start: '15:00', end: '16:30', name: 'Buổi tập Cardio', curriculum: 'Cardio Mix', room: 'Phòng A2', student: 'Trần Thị B', studentId: 2, done: false, confirmed: false, absent: false },
  ],
};

const initialRequests = [
  {
    id: 1,
    date: '11/04/2026',
    name: 'Nguyễn Tuấn A',
    studentId: 1,
    time: '10:00',
    status: 'pending',
    curriculum: 'Skinny Fat',
    birthDate: '12/05/1998',
    measurements: { height: '170', weight: '68', bodyFat: '24%', shoulder: '45' },
    notes: 'Có chấn thương vai, dây chằng yếu.',
    // preferredSchedule is now a structured array of { day, slots[] }
    preferredSchedule: [
      { day: 'Thứ 2', slots: ['18:00 – 19:00'] },
      { day: 'Thứ 4', slots: ['18:00 – 19:00'] },
      { day: 'Thứ 6', slots: ['18:00 – 19:00'] },
    ],
    rejectionReason: '',
  },
  {
    id: 2,
    date: '11/04/2026',
    name: 'Trần Minh B',
    studentId: null,
    time: '14:30',
    status: 'accepted',
    curriculum: 'Core Training',
    birthDate: '15/03/1997',
    measurements: { height: '175', weight: '72', bodyFat: '20%', shoulder: '48' },
    notes: 'Không có chấn thương.',
    preferredSchedule: [
      { day: 'Thứ 3', slots: ['19:00 – 20:00'] },
      { day: 'Thứ 5', slots: ['19:00 – 20:00'] },
    ],
    rejectionReason: '',
  },
  {
    id: 3,
    date: '10/04/2026',
    name: 'Lê Thị C',
    studentId: null,
    time: '18:20',
    status: 'rejected',
    curriculum: 'Cardio Mix',
    birthDate: '22/07/1999',
    measurements: { height: '162', weight: '55', bodyFat: '25%', shoulder: '40' },
    notes: 'Mong muốn tập giảm cân.',
    preferredSchedule: [
      { day: 'Thứ 2', slots: ['17:00 – 18:00'] },
      { day: 'Thứ 4', slots: ['17:00 – 18:00'] },
      { day: 'Thứ 6', slots: ['17:00 – 18:00'] },
    ],
    rejectionReason: 'Lịch đã kín trong thời gian này.',
  },
];

// ─── store ────────────────────────────────────────────────────────────────────

const useTrainerStore = create((set, get) => ({
  students: initialStudents,
  scheduleEvents: initialEvents,
  trainingRequests: initialRequests,

  // ── Add an InBody entry for a student  ────────────────────────────────────
  addInBodyEntry: (studentId, entry) => {
    set((state) => ({
      students: state.students.map((s) =>
        s.id === studentId
          ? { ...s, inbody: [...s.inbody, { date: new Date().toISOString().slice(0, 10), ...entry }] }
          : s
      ),
    }));
  },

  // ── Confirm attendance for a session  ─────────────────────────────────────
  confirmAttendance: (dateKey, idx) => {
    set((state) => {
      const events = JSON.parse(JSON.stringify(state.scheduleEvents));
      if (events[dateKey]?.[idx]) {
        events[dateKey][idx].confirmed = true;
      }
      return { scheduleEvents: events };
    });
  },

  // ── Report absence for a session  ─────────────────────────────────────────
  reportAbsence: (dateKey, idx, reason) => {
    set((state) => {
      const events = JSON.parse(JSON.stringify(state.scheduleEvents));
      if (events[dateKey]?.[idx]) {
        events[dateKey][idx].absent = true;
        events[dateKey][idx].absenceReason = reason;
      }
      return { scheduleEvents: events };
    });
  },

  // ── Accept a training request  ────────────────────────────────────────────
  // Returns { ok: true } or { ok: false, conflicts: [{ day, slot, existingTime }] }
  acceptRequest: (requestId) => {
    const state = get();
    const req = state.trainingRequests.find((r) => r.id === requestId);
    if (!req) return { ok: false, conflicts: [] };

    // Build a list of proposed new events
    const proposed = [];
    for (const dayObj of req.preferredSchedule) {
      const dow = DAY_TO_DOW[dayObj.day];
      if (dow === undefined) continue;
      const dateKey = nextDateForDOW(dow);
      for (const slot of dayObj.slots) {
        const { start, end } = slotToStartEnd(slot);
        proposed.push({ dateKey, day: dayObj.day, slot, start, end });
      }
    }

    // Check conflicts against existing schedule
    const conflicts = [];
    const events = state.scheduleEvents;
    for (const p of proposed) {
      const dayEvents = events[p.dateKey] || [];
      for (const ev of dayEvents) {
        if (timesOverlap(p.start, p.end, ev.start, ev.end)) {
          conflicts.push({
            day: p.day,
            slot: p.slot,
            existingStudent: ev.student,
            existingTime: `${ev.start} – ${ev.end}`,
          });
        }
      }
    }

    if (conflicts.length > 0) {
      return { ok: false, conflicts };
    }

    // No conflicts – inject events + update request status
    set((state) => {
      const newEvents = JSON.parse(JSON.stringify(state.scheduleEvents));
      for (const p of proposed) {
        if (!newEvents[p.dateKey]) newEvents[p.dateKey] = [];
        newEvents[p.dateKey].push({
          start: p.start,
          end: p.end,
          name: `Buổi tập ${req.curriculum}`,
          curriculum: req.curriculum,
          room: 'Phòng TBD',
          student: req.name,
          studentId: req.studentId,
          done: false,
          confirmed: false,
          absent: false,
        });
        // Sort by start time
        newEvents[p.dateKey].sort((a, b) => a.start.localeCompare(b.start));
      }

      return {
        scheduleEvents: newEvents,
        trainingRequests: state.trainingRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'accepted' } : r
        ),
      };
    });

    return { ok: true };
  },

  // ── Reject a training request  ────────────────────────────────────────────
  rejectRequest: (requestId, reason) => {
    set((state) => ({
      trainingRequests: state.trainingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'rejected', rejectionReason: reason } : r
      ),
    }));
  },
}));

export default useTrainerStore;
