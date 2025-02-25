import { ADToBS, BSToAD } from 'bikram-sambat-js';

// Bikram Sambat calendar utility functions

// Nepali months names
export const nepaliMonths = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 
  'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 
  'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Nepali days names
export const nepaliDays = [
  'Aaitabar', 'Sombar', 'Mangalbar', 
  'Budhabar', 'Bihibar', 'Sukrabar', 'Sanibar'
];

// Parse a date string in the format "YYYY-MM-DD" to get year, month, day
const parseDateString = (dateString: string): { year: number; month: number; day: number } => {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
};

// Convert Gregorian date to Bikram Sambat date
export const convertToBikramSambat = (date: Date): { year: number; month: number; day: number } => {
  // Format the date as YYYY-MM-DD for the library
  const formattedDate = date.toISOString().split('T')[0];
  
  // Convert to BS
  const bsDateString = ADToBS(formattedDate);
  
  // Parse the result
  const { year, month, day } = parseDateString(bsDateString);
  
  // Return with 0-indexed month for our component
  return { year, month: month - 1, day };
};

// Convert Bikram Sambat date to Gregorian date
export const convertToGregorian = (bsYear: number, bsMonth: number, bsDay: number): Date => {
  // Format the BS date as YYYY-MM-DD for the library (with 1-indexed month)
  const formattedBsDate = `${bsYear}-${String(bsMonth + 1).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`;
  
  // Convert to AD
  const adDateString = BSToAD(formattedBsDate);
  
  // Parse and return as Date object
  return new Date(adDateString);
};

// Get the number of days in a specific Bikram Sambat month
export const getDaysInMonth = (year: number, month: number): number => {
  try {
    // Format the BS date for the first day of the month
    const formattedBsDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    
    // Get the BS date for the first day of the next month
    let nextMonthBsDate: string;
    if (month === 11) {
      nextMonthBsDate = `${year + 1}-01-01`;
    } else {
      nextMonthBsDate = `${year}-${String(month + 2).padStart(2, '0')}-01`;
    }
    
    // Convert both to AD
    const currentMonthAdDate = new Date(BSToAD(formattedBsDate));
    const nextMonthAdDate = new Date(BSToAD(nextMonthBsDate));
    
    // Calculate the difference in days
    const diffTime = nextMonthAdDate.getTime() - currentMonthAdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch {
    // Fallback to default values if the library doesn't support the date
    const defaultDaysInMonth = [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30];
    return defaultDaysInMonth[month];
  }
};

// Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
export const getFirstDayOfMonth = (year: number, month: number): number => {
  try {
    // Format the BS date for the first day of the month
    const formattedBsDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    
    // Convert to AD and get the day of week
    const adDateString = BSToAD(formattedBsDate);
    const adDate = new Date(adDateString);
    
    return adDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
  } catch {
    // Fallback to approximation if the library doesn't support the date
    const baseDay = (year + Math.floor(year / 4) - Math.floor(year / 100) + Math.floor(year / 400)) % 7;
    const monthOffset = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4][month];
    return (baseDay + monthOffset) % 7;
  }
}; 