import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { InvoiceMemory } from "./InvoiceMemory";

export default function ItemAutocomplete({ value, onChange, onSelectItem, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    if (newValue.length > 0) {
      const results = InvoiceMemory.searchItems(newValue);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    onSelectItem(item);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => {
          if (value.length > 0) {
            const results = InvoiceMemory.searchItems(value);
            if (results.length > 0) {
              setSuggestions(results);
              setShowSuggestions(true);
            }
          }
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((item, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              onClick={() => handleSelectSuggestion(item)}
            >
              <div className="font-medium text-gray-900">{item.description}</div>
              <div className="text-sm text-gray-500">
                Rate: ${item.rate?.toFixed(2)} • Used {item.useCount || 1} times
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}