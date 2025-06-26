import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  onDateSelect?: (startDate: Date | null, endDate: Date | null) => void;
}

export default function TravelDatePicker({ onDateSelect }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5)); // June 2025
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const [isFlexible, setIsFlexible] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getNextMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1);
  };

  const getPreviousMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() - 1);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      setCurrentMonth(getNextMonth(currentMonth));
    } else {
      setCurrentMonth(getPreviousMonth(currentMonth));
    }
  };

  const handleDateClick = (date: Date) => {
    if (isFlexible) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // Starting new selection
      setSelectedStart(date);
      setSelectedEnd(null);
      setIsSelectingEnd(true);
      onDateSelect?.(date, null);
    } else if (selectedStart && !selectedEnd) {
      // Selecting end date
      if (date >= selectedStart) {
        setSelectedEnd(date);
        setIsSelectingEnd(false);
        onDateSelect?.(selectedStart, date);
      } else {
        // If selected date is before start, make it the new start
        setSelectedStart(date);
        setSelectedEnd(null);
        onDateSelect?.(date, null);
      }
    }
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedStart) return false;
    if (selectedStart && date.getTime() === selectedStart.getTime()) return true;
    if (selectedEnd && date.getTime() === selectedEnd.getTime()) return true;
    return false;
  };

  const isStartDate = (date: Date) => {
    return selectedStart && date.getTime() === selectedStart.getTime();
  };

  const isEndDate = (date: Date) => {
    return selectedEnd && date.getTime() === selectedEnd.getTime();
  };

  const renderCalendar = (monthDate: Date) => {
    const days = getDaysInMonth(monthDate);
    const monthName = monthNames[monthDate.getMonth()];
    const year = monthDate.getFullYear();

    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {monthName} {year}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="h-10"></div>;
            }
            
            const isSelected = isDateSelected(date);
            const inRange = isDateInRange(date);
            const isStart = isStartDate(date);
            const isEnd = isEndDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <button
                key={date.getDate()}
                onClick={() => handleDateClick(date)}
                disabled={isFlexible}
                className={`
                  h-10 w-10 rounded-full text-sm font-medium transition-all duration-200 relative
                  ${isFlexible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                  ${isSelected && !inRange ? 
                    (isStart ? 'bg-teal-500 text-white' : 'bg-red-500 text-white') 
                    : ''
                  }
                  ${inRange && !isSelected ? 'bg-pink-100 text-gray-800' : ''}
                  ${isStart ? 'bg-teal-500 text-white' : ''}
                  ${isEnd ? 'bg-red-500 text-white' : ''}
                  ${isToday && !isSelected ? 'border-2 border-gray-400' : ''}
                  ${!isSelected && !inRange ? 'text-gray-700 hover:bg-gray-100' : ''}
                `}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          When would you like to go?
        </h2>
        
        {/* Toggle buttons */}
        <div className="flex bg-gray-100 rounded-full p-1 w-fit mx-auto">
          <button
            onClick={() => setIsFlexible(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isFlexible 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Choose dates
          </button>
          <button
            onClick={() => setIsFlexible(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isFlexible 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            I'm flexible
          </button>
        </div>
      </div>

      {!isFlexible && (
        <>
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderCalendar(currentMonth)}
            {renderCalendar(getNextMonth(currentMonth))}
          </div>

          {/* Selected dates display */}
          {(selectedStart || selectedEnd) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                {selectedStart && !selectedEnd && (
                  <span>Check-in: <strong>{selectedStart.toLocaleDateString()}</strong> - Select check-out date</span>
                )}
                {selectedStart && selectedEnd && (
                  <span>
                    <strong>{selectedStart.toLocaleDateString()}</strong> - <strong>{selectedEnd.toLocaleDateString()}</strong>
                    {' '}({Math.ceil((selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60 * 24))} nights)
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {isFlexible && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            Flexible dates selected - we'll find the best deals for you!
          </div>
          <div className="text-sm text-gray-400 mt-2">
            Switch to "Choose dates" to select specific dates
          </div>
        </div>
      )}
    </div>
  );
}