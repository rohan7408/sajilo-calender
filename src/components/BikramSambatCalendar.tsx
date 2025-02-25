import React, { useState, useEffect, useRef } from 'react';
import { 
  nepaliMonths, 
  nepaliDays, 
  convertToBikramSambat, 
  getDaysInMonth, 
  getFirstDayOfMonth,
  convertToGregorian
} from '../utils/bikramSambat';

// English day names with shorter versions for mobile
const englishDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const englishDaysMobile = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const BikramSambatCalendar: React.FC = () => {
  const currentDate = convertToBikramSambat(new Date());
  
  const [selectedDate, setSelectedDate] = useState<{ year: number; month: number; day: number | null }>({
    year: currentDate.year,
    month: currentDate.month,
    day: currentDate.day
  });
  
  const [viewMode, setViewMode] = useState<'calendar' | 'months' | 'years'>('calendar');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Check for mobile view on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Adjust calendar cell size based on container width
  useEffect(() => {
    const adjustCellSize = () => {
      if (calendarRef.current) {
        const containerWidth = calendarRef.current.clientWidth;
        // Increase gap for all screen sizes
        const gap = window.innerWidth >= 640 ? 6 : 4; // 6px gap on desktop, 4px on mobile
        const totalGapWidth = gap * 6; // 6 gaps for 7 columns
        const cellSize = Math.floor((containerWidth - totalGapWidth) / 7);
        
        const cells = calendarRef.current.querySelectorAll('.calendar-day, .empty-cell');
        cells.forEach(cell => {
          (cell as HTMLElement).style.width = `${cellSize}px`;
          (cell as HTMLElement).style.height = `${cellSize}px`;
        });
      }
    };
    
    adjustCellSize();
    window.addEventListener('resize', adjustCellSize);
    return () => window.removeEventListener('resize', adjustCellSize);
  }, [viewMode]);
  
  // Handle year change
  const handleYearChange = (increment: number) => {
    setSelectedDate(prev => ({
      ...prev,
      year: prev.year + increment,
      day: null
    }));
  };
  
  // Handle month change
  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11, day: null };
      }
      return { ...prev, month: newMonth, day: null };
    });
  };
  
  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0, day: null };
      }
      return { ...prev, month: newMonth, day: null };
    });
  };
  
  // Handle day selection
  const handleDayClick = (day: number) => {
    setSelectedDate(prev => ({ ...prev, day }));
  };
  
  // Handle month selection from month view
  const handleMonthSelect = (month: number) => {
    setSelectedDate(prev => ({ ...prev, month, day: null }));
    setViewMode('calendar');
  };
  
  // Handle year selection from year view
  const handleYearSelect = (year: number) => {
    setSelectedDate(prev => ({ ...prev, year, day: null }));
    setViewMode('months');
  };
  
  // Toggle view mode
  const toggleMonthView = () => {
    setViewMode(viewMode === 'months' ? 'calendar' : 'months');
  };
  
  const toggleYearView = () => {
    setViewMode(viewMode === 'years' ? 'calendar' : 'years');
  };
  
  // Get today button
  const handleTodayClick = () => {
    const today = convertToBikramSambat(new Date());
    setSelectedDate({
      year: today.year,
      month: today.month,
      day: today.day
    });
    setViewMode('calendar');
  };
  
  // Check if a day is a Saturday (holiday)
  const isSaturday = (year: number, month: number, day: number): boolean => {
    try {
      const date = convertToGregorian(year, month, day);
      return date.getDay() === 6; // 6 is Saturday
    } catch {
      // Fallback if conversion fails
      const firstDay = getFirstDayOfMonth(year, month);
      return (firstDay + day - 1) % 7 === 6;
    }
  };
  
  // Get the day of week for a specific date
  const getDayOfWeek = (year: number, month: number, day: number): number => {
    try {
      const date = convertToGregorian(year, month, day);
      return date.getDay();
    } catch {
      // Fallback if conversion fails
      const firstDay = getFirstDayOfMonth(year, month);
      return (firstDay + day - 1) % 7;
    }
  };
  
  // Get Gregorian date for a Bikram Sambat date
  const getGregorianDay = (year: number, month: number, day: number): string => {
    try {
      const date = convertToGregorian(year, month, day);
      return date.getDate().toString();
    } catch {
      // Return empty string if conversion fails
      return '';
    }
  };
  
  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate.year, selectedDate.month);
    const firstDay = getFirstDayOfMonth(selectedDate.year, selectedDate.month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="empty-cell border border-transparent"></div>
      );
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        currentDate.year === selectedDate.year && 
        currentDate.month === selectedDate.month && 
        currentDate.day === day;
      
      const isSelected = 
        selectedDate.day === day;
      
      const isHoliday = isSaturday(selectedDate.year, selectedDate.month, day);
      
      // Get the corresponding Gregorian day
      const gregorianDay = getGregorianDay(selectedDate.year, selectedDate.month, day);
      
      days.push(
        <div 
          key={day} 
          onClick={() => handleDayClick(day)}
          className={`
            relative flex flex-col items-center justify-center
            border transition-colors duration-200 calendar-day overflow-hidden
            ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
            ${isSelected ? 'bg-blue-500 text-white border-blue-600' : 'hover:bg-gray-100'}
            ${isHoliday && !isSelected ? 'text-red-500 font-medium' : ''}
            ${isHoliday && isSelected ? 'bg-red-500 text-white border-red-600' : ''}
          `}
        >
          <span className={`absolute top-0.5 right-1 text-gray-400 ${isMobile ? 'text-[6px]' : 'text-[8px]'}`}>
            {gregorianDay}
          </span>
          <span className={isMobile ? 'text-xs' : 'text-sm'}>{day}</span>
        </div>
      );
    }
    
    return days;
  };
  
  // Render months for month selection
  const renderMonths = () => {
    return nepaliMonths.map((month, index) => {
      const isCurrentMonth = 
        currentDate.year === selectedDate.year && 
        currentDate.month === index;
      
      const isSelected = selectedDate.month === index;
      
      return (
        <div 
          key={month} 
          onClick={() => handleMonthSelect(index)}
          className={`
            p-2 rounded-lg cursor-pointer text-center
            transition-colors duration-200 text-sm sm:text-base sm:p-4
            ${isCurrentMonth ? 'bg-blue-100 border border-blue-500' : ''}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}
          `}
        >
          {isMobile ? month.substring(0, 3) : month}
        </div>
      );
    });
  };
  
  // Render years for year selection
  const renderYears = () => {
    const years = [];
    const startYear = selectedDate.year - (isMobile ? 4 : 6);
    const count = isMobile ? 9 : 12;
    
    for (let year = startYear; year < startYear + count; year++) {
      const isCurrentYear = currentDate.year === year;
      const isSelected = selectedDate.year === year;
      
      years.push(
        <div 
          key={year} 
          onClick={() => handleYearSelect(year)}
          className={`
            p-2 rounded-lg cursor-pointer text-center
            transition-colors duration-200 text-sm sm:text-base sm:p-4
            ${isCurrentYear ? 'bg-blue-100 border border-blue-500' : ''}
            ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'hover:bg-gray-100'}
          `}
        >
          {year}
        </div>
      );
    }
    
    return years;
  };
  
  // Get Nepali date in full format
  const getNepaliDateString = () => {
    if (selectedDate.day === null) return null;
    
    const dayOfWeek = getDayOfWeek(selectedDate.year, selectedDate.month, selectedDate.day);
    
    // Always show the full date format, regardless of device
    return `${selectedDate.day} ${nepaliDays[dayOfWeek]} ${nepaliMonths[selectedDate.month]} ${selectedDate.year}`;
  };
  
  // Get Gregorian date string for the selected date
  const getGregorianDateString = () => {
    if (selectedDate.day === null) return null;
    
    try {
      const gregorianDate = convertToGregorian(selectedDate.year, selectedDate.month, selectedDate.day);
      return gregorianDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return null;
    }
  };
  
  return (
    <div ref={calendarRef} className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-3 sm:p-6 calendar-container">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={() => handleYearChange(-1)}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous Year"
          >
            <span className="text-gray-600">«</span>
          </button>
          <button 
            onClick={handlePrevMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Previous Month"
          >
            <span className="text-gray-600">‹</span>
          </button>
        </div>
        
        <div className="text-center flex space-x-1 sm:space-x-2">
          <button 
            onClick={toggleYearView}
            className="text-base sm:text-lg font-bold hover:text-blue-600 transition-colors"
          >
            {selectedDate.year}
          </button>
          <button 
            onClick={toggleMonthView}
            className="text-base sm:text-lg font-bold hover:text-blue-600 transition-colors"
          >
            {nepaliMonths[selectedDate.month]}
          </button>
        </div>
        
        <div className="flex space-x-1 sm:space-x-2">
          <button 
            onClick={handleNextMonth}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Next Month"
          >
            <span className="text-gray-600">›</span>
          </button>
          <button 
            onClick={() => handleYearChange(1)}
            className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
            aria-label="Next Year"
          >
            <span className="text-gray-600">»</span>
          </button>
        </div>
      </div>
      
      {/* Today button */}
      <div className="mb-2 sm:mb-4 flex justify-center">
        <button 
          onClick={handleTodayClick}
          className="px-3 py-1 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          Today
        </button>
      </div>
      
      {/* Calendar view */}
      {viewMode === 'calendar' && (
        <div className="view-transition">
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-1 sm:mb-2">
            {(isMobile ? englishDaysMobile : englishDays).map((day, index) => (
              <div 
                key={index} 
                className={`text-center text-xs sm:text-sm font-medium p-1 border-b-2 ${index === 6 ? 'text-red-500 border-red-300' : 'text-gray-500 border-gray-200'}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {renderCalendarDays()}
          </div>
        </div>
      )}
      
      {/* Month selection view */}
      {viewMode === 'months' && (
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-2 view-transition">
          {renderMonths()}
        </div>
      )}
      
      {/* Year selection view */}
      {viewMode === 'years' && (
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-2 view-transition">
          {renderYears()}
        </div>
      )}
      
      {/* Selected date display - simplified */}
      {selectedDate.day && (
        <div className="mt-3 sm:mt-6 text-center">
          <div className="text-base sm:text-lg font-semibold">
            {getNepaliDateString()}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">
            {getGregorianDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default BikramSambatCalendar; 