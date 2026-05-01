import React from "react";

const DropdownFilter = ({ label, options, selected, onChange }) => {
  return (
    <div className="flex flex-col items-start">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownFilter;
