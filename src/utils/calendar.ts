export interface CalendarDay {
  date: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  key: string;
}

/** Builds a Monday-first 6x7 grid for the given month, padded with the
 * tail/head days of the adjacent months so every week row is full. */
export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0 = Sunday. Convert to Monday-first index (0 = Monday).
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isSameMonth = today.getFullYear() === year && today.getMonth() === month;

  const cells: CalendarDay[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    const date = daysInPrevMonth - firstWeekday + i + 1;
    cells.push({ date, inCurrentMonth: false, isToday: false, key: `prev-${date}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      date: d,
      inCurrentMonth: true,
      isToday: isSameMonth && today.getDate() === d,
      key: `cur-${d}`,
    });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ date: nextDay, inCurrentMonth: false, isToday: false, key: `next-${nextDay}` });
    nextDay++;
  }

  return cells;
}

export const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
