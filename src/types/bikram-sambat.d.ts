declare module 'bikram-sambat' {
  export interface BSDate {
    year: number;
    month: number;
    day: number;
  }

  export function ADToBS(date: Date): BSDate;
  export function BSToAD(year: number, month: number, day: number): Date;
} 