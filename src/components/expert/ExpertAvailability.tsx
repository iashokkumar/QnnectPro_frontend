import { useState, useEffect } from 'react';
import { format, addDays, isSameDay } from 'date-fns';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DaySchedule {
  day: string;
  date: Date;
  isWorkingDay: boolean;
  timeSlots: TimeSlot[];
}

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

const ExpertAvailability = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize the weekly schedule
  useEffect(() => {
    const today = new Date();
    const weekDays = [];
    
    // Create a week's schedule starting from today
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dayName = format(date, 'EEEE');
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      weekDays.push({
        day: dayName,
        date,
        isWorkingDay: !isWeekend,
        timeSlots: timeSlots.map((time) => ({
          id: `${dayName}-${time}`,
          startTime: time,
          endTime: `${parseInt(time.split(':')[0]) + 1}:00`,
          isAvailable: !isWeekend && time >= '09:00' && time < '18:00'
        }))
      });
    }
    
    setSchedule(weekDays);
    setIsLoading(false);
  }, []);

  const toggleTimeSlot = (dayIndex: number, slotId: string) => {
    const updatedSchedule = [...schedule];
    const day = updatedSchedule[dayIndex];
    const slotIndex = day.timeSlots.findIndex(slot => slot.id === slotId);
    
    if (slotIndex !== -1) {
      day.timeSlots[slotIndex].isAvailable = !day.timeSlots[slotIndex].isAvailable;
      setSchedule(updatedSchedule);
    }
  };

  const toggleWorkingDay = (dayIndex: number) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex].isWorkingDay = !updatedSchedule[dayIndex].isWorkingDay;
    
    // Update all time slots for this day
    updatedSchedule[dayIndex].timeSlots = updatedSchedule[dayIndex].timeSlots.map(slot => ({
      ...slot,
      isAvailable: updatedSchedule[dayIndex].isWorkingDay
    }));
    
    setSchedule(updatedSchedule);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In a real app, you would save this to your backend
      // await fetch('/api/expert/availability', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ schedule }),
      // });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading availability...</div>;
  }

  const selectedDaySchedule = schedule.find(day => 
    isSameDay(day.date, selectedDate)
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Availability
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Set your weekly availability and manage your schedule.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-4">
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="material-icons text-green-400">check_circle</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Your availability has been saved successfully!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {/* Calendar Navigation */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {format(selectedDate, 'MMMM yyyy')}
              </h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="material-icons">chevron_right</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date())}
                  className="ml-2 px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Today
                </button>
              </div>
            </div>
            
            {/* Week Days */}
            <div className="mt-4 grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {schedule.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(day.date)}
                  className={`flex flex-col items-center py-2 px-1 bg-white ${
                    isSameDay(day.date, selectedDate)
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs">{format(day.date, 'EEE')}</span>
                  <span className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                    isSameDay(day.date, selectedDate)
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-900'
                  }`}>
                    {format(day.date, 'd')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div className="px-4 py-5 sm:p-6">
            {selectedDaySchedule && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {format(selectedDaySchedule.date, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">
                      {selectedDaySchedule.isWorkingDay ? 'Available' : 'Not Available'}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const dayIndex = schedule.findIndex(d => 
                          isSameDay(d.date, selectedDaySchedule.date)
                        );
                        if (dayIndex !== -1) {
                          toggleWorkingDay(dayIndex);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        selectedDaySchedule.isWorkingDay ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                      role="switch"
                      aria-checked={selectedDaySchedule.isWorkingDay}
                    >
                      <span className="sr-only">Toggle availability</span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          selectedDaySchedule.isWorkingDay ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {selectedDaySchedule.isWorkingDay ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                      {selectedDaySchedule.timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            const dayIndex = schedule.findIndex(d => 
                              isSameDay(d.date, selectedDaySchedule.date)
                            );
                            if (dayIndex !== -1) {
                              toggleTimeSlot(dayIndex, slot.id);
                            }
                          }}
                          className={`py-2 px-3 text-sm font-medium rounded-md ${
                            slot.isAvailable
                              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                        >
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="material-icons mr-1 text-gray-400 text-base">info</span>
                      Click on a time slot to toggle its availability
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <span className="material-icons text-gray-300 text-4xl">event_busy</span>
                    <p className="mt-2 text-sm text-gray-500">You're not available on this day.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const dayIndex = schedule.findIndex(d => 
                          isSameDay(d.date, selectedDaySchedule.date)
                        );
                        if (dayIndex !== -1) {
                          toggleWorkingDay(dayIndex);
                        }
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Make Available
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Weekly Schedule Overview */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule Overview</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Day
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Hours
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((day, index) => {
                    const availableSlots = day.timeSlots.filter(slot => slot.isAvailable);
                    const startTime = availableSlots[0]?.startTime || '';
                    const endTime = availableSlots[availableSlots.length - 1]?.endTime || '';
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {format(day.date, 'EEEE')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(day.date, 'MMM d')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {day.isWorkingDay ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Not Available
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {day.isWorkingDay && availableSlots.length > 0 ? (
                            `${startTime} - ${endTime}`
                          ) : 'Not available'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertAvailability;
