declare module 'bikram-sambat-js' {
  export default class BikramSambat {
    constructor(date: string, calendar?: 'AD' | 'BS');
    toBS(): string;
    toAD(): string;
  }

  export function ADToBS(date: string): string;
  export function BSToAD(date: string): string;
} 