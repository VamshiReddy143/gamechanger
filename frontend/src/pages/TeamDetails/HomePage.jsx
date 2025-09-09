import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { FiUser, FiCalendar } from "react-icons/fi";
import { FaFutbol } from "react-icons/fa";
import footballAnimation from "../../animations/football.json";
import VideoDemo from "./VideoDemo";
import { getEventsByTeam, getRecentActivities } from '../../api/teamApi';

const HomePage = () => {
  const { id: teamId } = useParams();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming events
        setLoadingEvents(true);
        const eventsData = await getEventsByTeam(teamId);
        const now = new Date();
        const upcoming = eventsData
          .filter(event => new Date(event.startDate) > now)
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
          .slice(0, 3); // Limit to 3 upcoming events
        setUpcomingEvents(upcoming);

        // Fetch recent activities (players added, events scheduled, etc.)
        setLoadingActivities(true);
        const activitiesData = await getRecentActivities(teamId);
        setRecentActivities(activitiesData.slice(0, 3)); // Limit to 3 recent activities
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoadingEvents(false);
        setLoadingActivities(false);
      }
    };

    fetchData();
  }, [teamId]);

  if (error) {
    return (
      <div className="p-8 text-white flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Data</h3>
        <p className="text-white/80 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Skeleton loader for events
  const EventSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/5 rounded-lg p-4 animate-pulse">
          <div className="h-5 w-3/4 bg-white/10 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-white/10 rounded mb-1"></div>
          <div className="h-3 w-2/3 bg-white/10 rounded"></div>
        </div>
      ))}
    </div>
  );

  // Skeleton loader for activities
  const ActivitySkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3">
          <div className="bg-white/10 p-2 rounded-full h-10 w-10 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-white/10 rounded"></div>
            <div className="h-3 w-1/2 bg-white/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-8 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="bg-white/10 rounded-xl p-6 min-h-[300px]">
            {loadingEvents ? (
              <EventSkeleton />
            ) : upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <motion.div 
                    key={event._id}
                    className="bg-white/5 rounded-lg p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-lg font-bold capitalize">{event.eventType}</h3>
                    {event.title && <p className="text-gray-300">{event.title}</p>}
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(event.startDate).toLocaleString()} -{' '}
                      {new Date(event.endDate).toLocaleTimeString()}
                    </p>
                    <p className="text-sm text-gray-400">{event.location}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <Lottie
                  animationData={footballAnimation}
                  loop={true}
                  style={{ width: 200, height: 200 }}
                />
                <h3 className="text-xl font-bold mb-2">No Upcoming Matches</h3>
                <p className="text-gray-400 mb-6">Check back later for scheduled events</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="bg-white/10 rounded-xl p-6 min-h-[300px]">
            {loadingActivities ? (
              <ActivitySkeleton />
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <div className="bg-white/10 p-2 rounded-full">
                      {activity.type === 'player_added' ? (
                        <FiUser className="text-violet-400" />
                      ) : activity.type === 'event_scheduled' ? (
                        <FiCalendar className="text-blue-400" />
                      ) : (
                        <FaFutbol className="text-green-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.text}</p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-40 h-40 mb-4">
                  <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                  <div className="absolute inset-4 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-8 bg-white/15 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <h3 className="text-xl font-bold text-gray-300">No Activity Yet</h3>
                <p className="text-gray-500 text-center max-w-xs mt-2">
                  Your team's activities will appear here when you start managing players and events
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Live Content</h2>
        <VideoDemo />
      </div>
    </div>
  );
};

export default HomePage;