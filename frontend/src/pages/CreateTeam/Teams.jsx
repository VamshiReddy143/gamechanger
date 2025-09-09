import { useState, useEffect, useRef } from "react";
import { IoIosAdd, IoMdClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaAngleRight } from "react-icons/fa6";
import { BsSuitcaseLg } from "react-icons/bs";
import { FiHome } from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";
import { PiMountains } from "react-icons/pi";
import { LuMountainSnow } from "react-icons/lu";
import { GiMountainRoad } from "react-icons/gi";
import { IoSunnyOutline } from "react-icons/io5";
import { LuLeaf } from "react-icons/lu";
import { FaRegSnowflake } from "react-icons/fa";
import { LuFlower2 } from "react-icons/lu";
import { fetchTeams, createNewTeam } from "../../api/teamApi";
import Lottie from "lottie-react";
import loadingAnimation from "../../animations/loader.json";
import { useNavigate } from 'react-router-dom';


const steps = [
  "Select your team sport",
  "Select your team type",
  "How old are your players?",
  "Where is your team based?",
  "What's your team name?",
  "When is your upcoming season?",
  "Finish",
];

const sports = [
  { name: "Basketball", icon: "/bb.svg" },
  { name: "Softball", icon: "/g2.svg" },
  { name: "Ice Hockey", icon: "/g3.svg" },
  { name: "Bowling", icon: "/g4.svg" },
  { name: "Football", icon: "/g5.svg" },
  { name: "Tennis & Raquetball", icon: "/g6.svg" },
  { name: "Cheerleading", icon: "/g7.svg" },
  { name: "Field Hockey", icon: "/g8.svg" },
  { name: "Soccer", icon: "/g9.svg" },
  { name: "Volleyball", icon: "/g10.svg" },
  { name: "Baseball", icon: "/g11.svg" },
  { name: "Swimming", icon: "/g12.svg" },
];

const teamTypes = [
  { name: "Select / Travel", icon: BsSuitcaseLg },
  { name: "Local League / Rec / Other", icon: FiHome },
  { name: "School", icon: GiGraduateCap },
];

const ageGroups = [
  { name: "Under 13", icon: PiMountains },
  { name: "Between 13-18", icon: LuMountainSnow },
  { name: "Over 18", icon: GiMountainRoad },
];

const seasons = [
  { name: "Summer 2025", icon: IoSunnyOutline },
  { name: "Fall 2025", icon: LuLeaf },
  { name: "Winter 2025-26", icon: FaRegSnowflake },
  { name: "Spring-2026", icon: LuFlower2 },
  { name: "Summer 2026", icon: IoSunnyOutline },
  { name: "Fall 2026", icon: LuLeaf },
];

const Teams = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [teams, setTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    sport: "",
    teamType: "",
    ageGroup: "",
    location: "",
    teamName: "",
    season: "",
  });
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const modalContentRef = useRef(null);
   const navigate = useNavigate(); 

  // Fetch teams on component mount and when search query changes
  useEffect(() => {
    const getTeams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchTeams(searchQuery);
        setTeams(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch teams");
      } finally {
        setIsLoading(false);
      }
    };

    getTeams();
  }, [searchQuery]);

  // Google Maps API initialization
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleMapsLoaded(true);
        initAutocomplete();
      };
      document.head.appendChild(script);
    } else {
      setGoogleMapsLoaded(true);
      initAutocomplete();
    }

    return () => {
      const script = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const initAutocomplete = () => {
    if (window.google && window.google.maps) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, location: value });

    if (value.length > 1 && googleMapsLoaded) {
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          { input: value, types: ["(cities)"] },
          (predictions, status) => {
            if (status === "OK") {
              setLocationSuggestions(predictions);
              setShowSuggestions(true);
            } else {
              setLocationSuggestions([]);
              setShowSuggestions(false);
            }
          }
        );
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (prediction) => {
    if (placesService.current) {
      placesService.current.getDetails(
        { placeId: prediction.place_id },
        (place, status) => {
          if (status === "OK") {
            setFormData({
              ...formData,
              location: place.formatted_address,
            });
            setShowSuggestions(false);
          }
        }
      );
    }
  };

  const handleSelectOption = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        setIsLoading(true);
        const newTeam = await createNewTeam({
          sport: formData.sport,
          teamType: formData.teamType,
          ageGroup: formData.ageGroup,
          location: formData.location,
          teamName: formData.teamName,
          season: formData.season,
        });
        setTeams([...teams, newTeam.data]);
        closeModal();
      } catch (error) {
        setError(error.message || "Failed to create team");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isOptionSelected = (field, value) => {
    return formData[field] === value;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-[400px] p-2">
            {sports.map((sport) => (
              <div
                key={sport.name}
                className={`flex flex-col gap-3 items-center border group h-25 w-30 p-2 text-center leading-[20px] rounded-xl cursor-pointer ${
                  isOptionSelected("sport", sport.name)
                    ? "bg-violet-200 border-violet-400"
                    : "border-black hover:bg-violet-200 hover:border-none"
                }`}
                onClick={() => handleSelectOption("sport", sport.name)}
              >
                <img src={sport.icon} alt="" className="h-10" />
                <p
                  className={`font-[400] ${
                    isOptionSelected("sport", sport.name)
                      ? "text-violet-600"
                      : "text-black group-hover:text-violet-400"
                  }`}
                >
                  {sport.name}
                </p>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-3 gap-5 overflow-y-auto max-h-[400px] p-2">
            {teamTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.name}
                  className={`border w-40 flex flex-col items-center justify-center p-2 rounded-xl group h-25 cursor-pointer ${
                    isOptionSelected("teamType", type.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("teamType", type.name)}
                >
                  <Icon
                    size={50}
                    className={
                      isOptionSelected("teamType", type.name)
                        ? "text-violet-600"
                        : "text-black/80"
                    }
                  />
                  <p
                    className={`${
                      isOptionSelected("teamType", type.name)
                        ? "text-violet-600"
                        : "text-gray-600 group-hover:text-violet-400"
                    }`}
                  >
                    {type.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-3 gap-5 overflow-y-auto max-h-[400px] p-2">
            {ageGroups.map((age) => {
              const Icon = age.icon;
              return (
                <div
                  key={age.name}
                  className={`border w-40 flex flex-col items-center justify-center p-2 rounded-xl group h-25 cursor-pointer ${
                    isOptionSelected("ageGroup", age.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("ageGroup", age.name)}
                >
                  <Icon
                    size={50}
                    className={
                      isOptionSelected("ageGroup", age.name)
                        ? "text-violet-600"
                        : "text-black/80"
                    }
                  />
                  <p
                    className={`${
                      isOptionSelected("ageGroup", age.name)
                        ? "text-violet-600"
                        : "text-gray-600 group-hover:text-violet-400"
                    }`}
                  >
                    {age.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 3:
        return (
          <div className="relative">
            <p className="text-gray-600 pb-3">
              Team location can later be adjusted in team settings on the
              GameChanger app.
            </p>
            <input
              type="text"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleLocationChange}
              className="p-2 rounded w-full border border-gray-600 text-black"
            />
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {locationSuggestions.map((prediction, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectLocation(prediction)}
                  >
                    {prediction.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div>
            <p className="text-gray-600 pb-3">
              Make sure team members will recognize your team's name. Team name
              can later be adjusted in team settings on the GameChanger app.
            </p>
            <input
              type="text"
              placeholder="ex. Manheim Tigers"
              value={formData.teamName}
              onChange={(e) =>
                setFormData({ ...formData, teamName: e.target.value })
              }
              className="border p-2 rounded w-full border-gray-600 text-black"
            />
            <p className="text-gray-600 py-3">
              Team name should be at least 3 characters.
            </p>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[400px] p-2">
            {seasons.map((season) => {
              const Icon = season.icon;
              return (
                <div
                  key={season.name}
                  className={`border w-40 flex flex-col gap-3 items-center justify-center p-2 rounded-xl group h-25 cursor-pointer ${
                    isOptionSelected("season", season.name)
                      ? "bg-violet-200 border-violet-400"
                      : "border-gray-700 hover:bg-violet-200 hover:border-none"
                  }`}
                  onClick={() => handleSelectOption("season", season.name)}
                >
                  <Icon
                    size={40}
                    className={
                      isOptionSelected("season", season.name)
                        ? "text-violet-600"
                        : "text-black/80"
                    }
                  />
                  <p
                    className={`${
                      isOptionSelected("season", season.name)
                        ? "text-violet-600"
                        : "text-gray-600 group-hover:text-violet-400"
                    }`}
                  >
                    {season.name}
                  </p>
                </div>
              );
            })}
          </div>
        );
      case 6:
        return (
          <p className="text-green-600">✅ All set! Click Finish to save.</p>
        );
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(0);
    setFormData({
      sport: "",
      teamType: "",
      ageGroup: "",
      location: "",
      teamName: "",
      season: "",
    });
  };

  // Group teams by season
  const groupedTeams = teams.reduce((acc, team) => {
    const season = team.season || "Unknown Season"; // Fallback if season is missing
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(team);
    return acc;
  }, {});

  // Sort seasons to ensure consistent order (optional, based on seasons array order)
  const sortedSeasons = Object.keys(groupedTeams).sort((a, b) => {
    const seasonOrder = seasons.map((s) => s.name);
    return seasonOrder.indexOf(a) - seasonOrder.indexOf(b);
  });
  return (
    <div className="min-h-screen pt-7 px-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[30px]">HOME</h1>
        <div
          className="flex items-center gap-2 font-semibold border border-white rounded-full px-5 py-2 w-fit cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd size={25} />
          <p>Create Team</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white/20 rounded-xl p-2 mt-7 w-full">
        <CiSearch className="text-gray-100 mr-2" />
        <input
          type="text"
          placeholder="Find a Team, League or Tournament"
          className="bg-transparent outline-none text-gray-100 placeholder:text-white/20 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="mt-4 flex flex-col items-center justify-center">
          <Lottie
            animationData={loadingAnimation}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
          <p className="mt-2 text-gray-600">Loading teams...</p>
        </div>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Teams List */}
      <div className="mt-10">
        {sortedSeasons.map((season) => (
          <div key={season} className="mb-8">
            <h1 className="font-bold text-[22px]">{season}</h1>
            {groupedTeams[season].map((team) => {
              const sport = sports.find((s) => s.name === team.sport);
              const sportIcon = sport ? sport.icon : "/bb.svg";
              return (
                <div
                  key={team._id}
                  className="border border-white/30 rounded-xl mt-7 p-3 flex items-center justify-between hover:bg-white/10 cursor-pointer"
                   onClick={() => navigate(`/team/${team._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={sportIcon}
                      alt={team.sport}
                      className="h-15 border-3 rounded-full border-white/20 bg-white"
                    />
                    <p className="font-semibold text-[17px]">{team.teamName}</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <p>Staff</p>
                    <FaAngleRight />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {sortedSeasons.length === 0 && !isLoading && (
          <p className="text-gray-700 flex items-center justify-center font-extrabold text-8xl font-sans">
            No Teams Found.
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-100 w-[650px] py-10 rounded-lg p-6 max-h-[90vh] flex flex-col relative">
            <h1 className="text-[25px] font-semibold flex flex-col items-center justify-center text-black pb-4">
              New Team
            </h1>
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-5 left-4 text-gray-600 hover:text-gray-800"
            >
              <IoMdClose size={24} />
            </button>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>

            <h2 className="text-xl text-black font-semibold mb-4">
              {steps[currentStep]}
            </h2>

            <div className="flex-1 overflow-y-auto" ref={modalContentRef}>
              {renderStepContent()}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || isLoading}
                className="px-4 py-1 bg-blue-600 text-white rounded-full disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 0 && !formData.sport) ||
                  (currentStep === 1 && !formData.teamType) ||
                  (currentStep === 2 && !formData.ageGroup) ||
                  (currentStep === 3 && !formData.location) ||
                  (currentStep === 4 && formData.teamName.length < 3) ||
                  (currentStep === 5 && !formData.season) ||
                  isLoading
                }
                className="px-4 py-1 bg-blue-500 text-white rounded-full disabled:opacity-50"
              >
                {isLoading
                  ? "Processing..."
                  : currentStep === steps.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
