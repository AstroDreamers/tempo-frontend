
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const LocationSearchBar = ({ locations, onSelect, onSearch }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (query.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = (locations || []).filter(
      (loc) =>
        loc?.locality?.toLowerCase().includes(lower)
    );
    setSuggestions(filtered.slice(0, 8));
    setShowSuggestions(true);
  }, [query, locations]);

  // Listen for custom map click event to close suggestions
  useEffect(() => {
    function handleMapClick() {
      setShowSuggestions(false);
    }
    window.addEventListener('tempo-map-click', handleMapClick);
    return () => {
      window.removeEventListener('tempo-map-click', handleMapClick);
    };
  }, []);

  const handleSelect = (loc) => {
    setQuery(loc.locality);
    setShowSuggestions(false);
    onSelect?.(loc);
    onSearch?.(loc);
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="backdrop-blur-md bg-white/70 border border-blue-200 shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2" style={{boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)'}}>
        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none border-none text-blue-900 placeholder-blue-400 font-medium text-base px-0 py-1"
          placeholder="Search location..."
          value={query}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
          aria-autocomplete="list"
          aria-controls="location-suggestions"
          aria-activedescendant={showSuggestions && suggestions.length > 0 ? `suggestion-${suggestions[0].id}` : undefined}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full px-4 py-1.5 text-sm font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition-colors"
          onClick={() => suggestions.length > 0 && handleSelect(suggestions[0])}
          tabIndex={-1}
        >
          Search
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="location-suggestions"
          className="absolute left-0 right-0 mt-2 bg-white/90 border border-blue-200 rounded-2xl shadow-2xl z-50 max-h-56 overflow-y-auto backdrop-blur-md"
          role="listbox"
        >
          {suggestions.map((loc) => (
            <button
              key={loc.id}
              id={`suggestion-${loc.id}`}
              className="w-full text-left px-5 py-2 font-medium text-blue-800 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-xl"
              onMouseDown={() => handleSelect(loc)}
              role="option"
              aria-selected="false"
              tabIndex={-1}
            >
              {loc.locality}
            </button>
          ))}
        </ul>
      )}
    </div>
  );
};

LocationSearchBar.propTypes = {
  locations: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  onSearch: PropTypes.func
};

export default LocationSearchBar;
