import React from 'react';

interface DateRangePickerProps {
  onChange: (range: { start: Date | null; end: Date | null }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange }) => {
  const [startDate, setStartDate] = React.useState<string>('');
  const [endDate, setEndDate] = React.useState<string>('');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onChange({
      start: e.target.value ? new Date(e.target.value) : null,
      end: endDate ? new Date(endDate) : null,
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    onChange({
      start: startDate ? new Date(startDate) : null,
      end: e.target.value ? new Date(e.target.value) : null,
    });
  };

  return (
    <div className="flex gap-4 items-center bg-gray-800 p-4 rounded-lg">
      <div>
        <label className="block text-sm text-gray-400">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="bg-gray-700 text-white p-2 rounded"
        />
      </div>
    </div>
  );
}; 