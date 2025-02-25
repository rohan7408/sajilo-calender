// Nepali language conversion utilities
export const nepaliData = {
  "numbers": {
    "0": "०",
    "1": "१",
    "2": "२",
    "3": "३",
    "4": "४",
    "5": "५",
    "6": "६",
    "7": "७",
    "8": "८",
    "9": "९"
  },
  "week_days": {
    "Sunday": "आइतबार",
    "Monday": "सोमबार",
    "Tuesday": "मङ्गलबार",
    "Wednesday": "बुधबार",
    "Thursday": "बिहीबार",
    "Friday": "शुक्रबार",
    "Saturday": "शनिबार"
  },
  "months": {
    "Baishakh": "बैशाख",
    "Jestha": "जेठ",
    "Ashadh": "असार",
    "Shrawan": "श्रावण",
    "Bhadra": "भाद्र",
    "Ashwin": "आश्विन",
    "Kartik": "कार्तिक",
    "Mangsir": "मंसिर",
    "Poush": "पौष",
    "Magh": "माघ",
    "Falgun": "फाल्गुन",
    "Chaitra": "चैत्र"
  }
};

/**
 * Converts English numbers to Nepali numbers
 * @param num - The number to convert
 * @returns The Nepali representation of the number
 */
export const toNepaliNumeral = (num: number | string): string => {
  return String(num).split('').map(digit => 
    nepaliData.numbers[digit as keyof typeof nepaliData.numbers] || digit
  ).join('');
};

/**
 * Converts a Nepali date string to Nepali language
 * @param dateStr - Date string in format "13 Mangalbar Falgun 2081"
 * @returns The date in Nepali language
 */
export const convertToNepaliLanguage = (dateStr: string): string => {
  // Split the date string into components
  const parts = dateStr.split(' ');
  if (parts.length !== 4) return dateStr; // Return original if format doesn't match
  
  const [day, weekday, month, year] = parts;
  
  // Convert each part
  const nepaliDay = toNepaliNumeral(day);
  const nepaliWeekday = nepaliData.week_days[weekday as keyof typeof nepaliData.week_days] || weekday;
  const nepaliMonth = nepaliData.months[month as keyof typeof nepaliData.months] || month;
  const nepaliYear = toNepaliNumeral(year);
  
  // Combine the parts in Nepali format
  return `${nepaliDay} ${nepaliWeekday} ${nepaliMonth} ${nepaliYear}`;
};

/**
 * Example usage:
 * convertToNepaliLanguage("13 Tuesday Falgun 2081")
 * Returns: "१३ मङ्गलबार फाल्गुन २०८१"
 */ 