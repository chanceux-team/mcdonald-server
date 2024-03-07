export interface Calendar {
  id: number;
  date: string;
  count: number;
}

export interface CalendarUpdateParams {
  id: number;
  count: number;
  date: string;
}
