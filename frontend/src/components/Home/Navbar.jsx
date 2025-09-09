import React, { useState, useEffect } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { Link } from 'react-router-dom';

const Navbar = () => {
    const sportsList = [
        { name: 'Football', image: "⚽" },
        { name: 'Volleyball', image: '🏐' },
        { name: 'Hockey', image: '🏒' },
        { name: 'Basketball', image: '🏀' },
        { name: 'Tennis', image: '🎾' },
        { name: 'Cricket', image: '🏏' },
        { name: 'Baseball', image: '⚾' },
        { name: 'Rugby', image: '🏉' },
        { name: 'Badminton', image: '🏸' },
        { name: 'Table Tennis', image: '🏓' },
    ];

    const featuresList = [
        { name: 'Live Scores', image: '📊' },
        { name: 'Training Plans', image: '📝' },
        { name: 'Community', image: '👥' },
        { name: 'Analytics', image: '📈' },
    ];

    const resourcesList = [
        { name: 'Guides', image: '📚' },
        { name: 'Tutorials', image: '🎥' },
        { name: 'Blog', image: '✍️' },
        { name: 'FAQ', image: '❓' },
    ];

    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleDropdownEnter = (dropdown) => {
        setActiveDropdown(dropdown);
        setIsDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        // Close only if not hovering over dropdown content
        if (!isDropdownOpen) {
            setActiveDropdown(null);
        }
    };

    const handleDropdownContentLeave = () => {
        setActiveDropdown(null);
        setIsDropdownOpen(false);
    };

    return (
        <div className="w-full relative">
            {/* Backdrop for dropdown - only visible when dropdown is active */}
            {activeDropdown && (
                <div 
                    className="fixed inset-0 bg-black/10 z-30 backdrop-blur-sm"
                    onClick={() => {
                        setActiveDropdown(null);
                        setIsDropdownOpen(false);
                    }}
                />
            )}

            {/* Navbar Container */}
            <div className={`fixed max-w-7xl mx-auto rounded-xl mt-10 top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/20 backdrop-blur-md shadow-md' : 'bg-white/10 backdrop-blur-xl'}`}>
                {/* Navbar Content */}
                <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl text-violet-600 font-bold">PLAYMAKER</h1>
                    </div>

                    {/* Menu Items */}
                    <div className="flex items-center gap-8">
                        {/* Sports Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleDropdownEnter('sports')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="flex items-center gap-1 font-medium text-white hover:text-violet-400 transition-colors">
                                <span>Sports</span>
                                <IoIosArrowDown className={`transition-transform duration-200 ${activeDropdown === 'sports' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Features Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleDropdownEnter('features')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="flex items-center gap-1 font-medium text-white hover:text-violet-400 transition-colors">
                                <span>Features</span>
                                <IoIosArrowDown className={`transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        {/* Resources Menu */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleDropdownEnter('resources')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="flex items-center gap-1 font-medium text-white hover:text-violet-400 transition-colors">
                                <span>Resources</span>
                                <IoIosArrowDown className={`transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                            </button>
                        </div>

                        <Link to={"/pricing"}>
                        <button className="font-medium text-white hover:text-violet-400 transition-colors">
                            Pricing
                        </button>
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4">
                       <Link to={"/login"}>
                        <button className="bg-transparent border border-white text-white hover:bg-white/10 py-2 px-6 rounded-full font-medium transition-colors">
                            Sign In
                        </button>
                       </Link>
                        <button className="bg-violet-600 hover:bg-violet-700 text-white py-2 px-6 rounded-full font-medium transition-colors">
                            Join Us
                        </button>
                    </div>
                </div>

                {/* Dropdown Menus */}
                <div 
                    className={`absolute left-0 right-0 top-full z-50 transition-all duration-300 ease-out ${activeDropdown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={handleDropdownContentLeave}
                >
                    {/* Sports Dropdown */}
                    {activeDropdown === 'sports' && (
                        <div className="bg-white text-gray-800 shadow-xl rounded-b-lg max-w-7xl mx-auto px-6 py-6 border-t border-gray-100">
                            <div className="grid grid-cols-5 gap-4">
                                {sportsList.map((sport, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-violet-100 hover:bg-violet-50 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                    >
                                        <span className="text-3xl">{sport.image}</span>
                                        <span className="font-medium">{sport.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Features Dropdown */}
                    {activeDropdown === 'features' && (
                        <div className="bg-white text-gray-800 shadow-xl rounded-b-lg max-w-7xl mx-auto px-6 py-6 border-t border-gray-100">
                            <div className="grid grid-cols-4 gap-4">
                                {featuresList.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center bg-violet-100 gap-3 p-4 rounded-lg hover:bg-violet-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center"
                                    >
                                        <span className="text-3xl mb-2">{feature.image}</span>
                                        <span className="font-medium">{feature.name}</span>
                                        <span className="text-sm text-gray-500 mt-1">Learn more →</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resources Dropdown */}
                    {activeDropdown === 'resources' && (
                        <div className="bg-white text-gray-800 shadow-xl rounded-b-lg max-w-7xl mx-auto px-6 py-6 border-t border-gray-100">
                            <div className="grid grid-cols-4 gap-4">
                                {resourcesList.map((resource, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center gap-3 p-4 bg-violet-100 rounded-lg hover:bg-violet-50 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-center"
                                    >
                                        <span className="text-3xl mb-2">{resource.image}</span>
                                        <span className="font-medium">{resource.name}</span>
                                        <span className="text-sm text-gray-500 mt-1">Explore →</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer to prevent content from being hidden under fixed navbar */}
            <div className="h-20"></div>
        </div>
    );
};

export default Navbar;