import { useState, useMemo, useCallback } from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../animations/empty.json';
import { FiSearch, FiX, FiMapPin, FiCalendar } from 'react-icons/fi';
import debounce from "lodash.debounce";


const CURRENT_YEAR = new Date().getFullYear();

const OpponentsPage = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    city: '',
    season: '',
    year: CURRENT_YEAR,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);

  // Season options
  const seasonOptions = useMemo(() => {
    return [
      { value: '', label: 'All Seasons' },
      { value: 'WINTER', label: `Winter ${CURRENT_YEAR}` },
      { value: 'SPRING', label: `Spring ${CURRENT_YEAR}` },
      { value: 'SUMMER', label: `Summer ${CURRENT_YEAR}` },
      { value: 'FALL', label: `Fall ${CURRENT_YEAR}` },
    ];
  }, []);

  // Debounced city search for future Google Places integration
  const handleCitySearch = useCallback(
    debounce(async (query) => {
      if (!query) {
        setCitySuggestions([]);
        return;
      }

      try {
        // TODO: Replace with actual Google Places API call
        // const results = await fetchGooglePlaces(query);
        // setCitySuggestions(results);
        
        // Mock response for now
        setCitySuggestions([
          `${query}, USA`,
          `${query} City`,
          `New ${query}`,
        ]);
      } catch (err) {
        console.error('Failed to fetch city suggestions:', err);
        setError('Failed to load city suggestions');
      }
    }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'city') {
      handleCitySearch(value);
    }
  };

  const clearSearch = () => {
    setSearchParams({
      query: '',
      city: '',
      season: '',
      year: CURRENT_YEAR,
    });
    setCitySuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);

    try {
      // TODO: Implement actual search logic
      console.log('Searching with:', searchParams);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to search opponents');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const hasFilters = searchParams.query || searchParams.city || searchParams.season;

  return (
    <div className="p-4 md:p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Find Opponents</h2>
      
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Find Opponent */}
          <div>
            <label htmlFor="query" className="block text-sm font-medium mb-1 flex items-center">
              <FiSearch className="mr-2" />
              Find or create opponent
            </label>
            <div className="relative">
              <input
                id="query"
                name="query"
                type="text"
                placeholder="Search by name or skill level"
                className="w-full p-2 pl-8 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
                value={searchParams.query}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* City Search */}
          <div className="relative">
            <label htmlFor="city" className="block text-sm font-medium mb-1 flex items-center">
              <FiMapPin className="mr-2" />
              City
            </label>
            <div className="relative">
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Enter city"
                className="w-full p-2 pl-8 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
                value={searchParams.city}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              {citySuggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg">
                  {citySuggestions.map((city, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        setSearchParams(prev => ({ ...prev, city }));
                        setCitySuggestions([]);
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Season Selector */}
          <div>
            <label htmlFor="season" className="block text-sm font-medium mb-1 flex items-center">
              <FiCalendar className="mr-2" />
              Season
            </label>
            <select
              id="season"
              name="season"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={searchParams.season}
              onChange={handleSearchChange}
            >
              {seasonOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {hasFilters && (
            <button
              type="button"
              onClick={clearSearch}
              className="flex items-center text-sm text-gray-400 hover:text-white"
            >
              <FiX className="mr-1" />
              Clear filters
            </button>
          )}
          <button
            type="submit"
            disabled={isSearching}
            className={`ml-auto px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSearching ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
          {error}
        </div>
      )}

      {/* Content */}
      {isSearching ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 bg-[#7008E7]"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
          <p className="font-bold text-xl text-gray-400 mt-4">
            {hasFilters ? 'No opponents match your search' : 'No opponents found'}
          </p>
          <p className="text-gray-500">
            {hasFilters ? 'Try adjusting your filters' : 'Add opponents to track their performance'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OpponentsPage;