const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

function div(a: number, b: number) { return Math.trunc(a / b); }
function mod(a: number, b: number) { return a - div(a, b) * b; }

function jalCal(jy: number) {
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14, jp = breaks[0], jump = 0, jm = 0;
  for (let i = 1; i < bl; i++) {
    const jm2 = breaks[i];
    jump = jm2 - jp;
    if (jy < jm2) { jm = jm2; break; }
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm2;
  }
  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;
  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number) {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const gd = div(mod(i, 153), 5) + 1;
  const gm = mod(div(i, 153), 12) + 1;
  const gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return { gy, gm, gd };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) return { jy, jm: 1 + div(k, 31), jd: mod(k, 31) + 1 };
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { jy, jm: 7 + div(k, 30), jd: mod(k, 30) + 1 };
}

export function toJalali(gy: number, gm: number, gd: number) {
  return d2j(g2d(gy, gm, gd));
}

export function toGregorian(jy: number, jm: number, jd: number) {
  return d2g(j2d(jy, jm, jd));
}

export function isLeapJalaliYear(jy: number) {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export const JALALI_MONTH_LABELS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

export const JALALI_WEEKDAY_LABELS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export interface JalaliCalendarDay {
  date: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  key: string;
}

export function buildJalaliMonthGrid(jy: number, jm: number): JalaliCalendarDay[] {
  const daysInMonth = jalaliMonthLength(jy, jm);
  const first = toGregorian(jy, jm, 1);
  const firstDate = new Date(first.gy, first.gm - 1, first.gd);
  const firstWeekday = (firstDate.getDay() + 1) % 7; 

  const prevMonth = jm === 1 ? 12 : jm - 1;
  const prevYear = jm === 1 ? jy - 1 : jy;
  const daysInPrevMonth = jalaliMonthLength(prevYear, prevMonth);

  const today = new Date();
  const todayJalali = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  const isSameMonth = todayJalali.jy === jy && todayJalali.jm === jm;

  const cells: JalaliCalendarDay[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    const date = daysInPrevMonth - firstWeekday + i + 1;
    cells.push({ date, inCurrentMonth: false, isToday: false, key: `prev-${date}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: d, inCurrentMonth: true, isToday: isSameMonth && todayJalali.jd === d, key: `cur-${d}` });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: nextDay, inCurrentMonth: false, isToday: false, key: `next-${nextDay}` });
    nextDay++;
  }
  return cells;
}