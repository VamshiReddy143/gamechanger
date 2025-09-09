import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CgArrowTopRight } from "react-icons/cg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Vamshi",
      description:
        "Vamshi developed a kid-safe video calling application powered by Agora. The app focuses on providing a secure environment where children can connect with their friends and family without exposure to inappropriate content. He implemented real-time moderation tools, parental controls, and playful UI elements designed specifically for young users.",
      image: "/user1.jpg",
    },
    {
      id: 2,
      name: "Rahul",
      description:
        "Rahul built an interactive educational platform using React on the frontend and Node.js on the backend. Her platform allows teachers to host live sessions, manage assignments, and track student performance in real-time. She integrated gamification features such as quizzes, badges, and leaderboards to improve student engagement.",
      image: "/user2.jpg",
    },
    {
      id: 3,
      name: "Priya",
      description:
        "Priya created a fully functional e-commerce mobile application using Flutter. The app features smooth product browsing, secure payments, and a personalized recommendation engine powered by machine learning. Rahul designed a seamless checkout flow and integrated multiple payment gateways to make transactions easy for customers worldwide.",
      image: "/user3.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("");
  const sectionRef = useRef(null);
  const youHandRef = useRef(null);
  const weHandRef = useRef(null);

  // GSAP Animation with ScrollTrigger
  useEffect(() => {
    const youHand = youHandRef.current;
    const weHand = weHandRef.current;

    // Initial positions: hands are off-screen
    gsap.set(youHand, { x: "-100%", opacity: 1 });
    gsap.set(weHand, { x: "120%", opacity: 1 });

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%", // Start when the top of the section is 80% down the viewport
        end: "top 20%", // End when the top of the section is 20% down the viewport
        scrub: 1, // Smoothly animate with scroll
        toggleActions: "play none none reverse", // Reverse animation when scrolling back
      },
    });

    // Hands move to meet in the middle
    tl.to(youHand, {
      x: "0%", // Move to the right
      duration: 2,
      ease: "power2.inOut",
    })
      .to(
        weHand,
        {
          x: "0%", // Move to the left
          duration: 2,
          ease: "power2.inOut",
        },
        "<" // Start at the same time as the previous animation
      )
      // Hands move back if scrolling continues
      .to(youHand, {
        x: "-100%", // Move back to the left
        duration: 1,
        ease: "power2.inOut",
      })
      .to(
        weHand,
        {
          x: "120%", // Move back to the right
          duration: 1,
          ease: "power2.inOut",
        },
        "<"
      );

    // Cleanup ScrollTrigger on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const goToPrevious = () => {
    setSlideDirection("slide-right");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? stories.length - 1 : prevIndex - 1
      );
      setSlideDirection("");
    }, 300);
  };

  const goToNext = () => {
    setSlideDirection("slide-left");
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === stories.length - 1 ? 0 : prevIndex + 1
      );
      setSlideDirection("");
    }, 300);
  };

  return (
    <div
      ref={sectionRef}
      className="flex flex-col items-center justify-center min-h-screen  mt-10 py-10"
    >
      <div className="flex items-center relative ">
        <div className="flex items-center">
          <h1 className="text-6xl font-bold mb-8 italic text-white">
            <span className="text-primary">Success</span>
          </h1>
          <img
            ref={youHandRef}
            className="h-30 absolute z-0"
            src="/you.svg"
            alt="You Hand"
          />
        </div>
        <div className="flex items-center">
          <img
            ref={weHandRef}
            className="h-30 absolute z-0"
            src="/we.svg"
            alt="We Hand"
          />
          <h1 className="text-6xl font-bold mb-8 italic text-white">Stories</h1>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 mt-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full">
          {/* Image container with sliding effect */}
          <div className="relative w-full md:w-1/2 h-[500px] overflow-hidden">
            <div
              className={`w-full h-full transition-transform duration-300 ease-in-out ${slideDirection}`}
              style={{
                transform:
                  slideDirection === "slide-left"
                    ? "translateX(-100%)"
                    : slideDirection === "slide-right"
                    ? "translateX(100%)"
                    : "translateX(0)",
              }}
            >
              <img
                className="w-full h-full object-cover rounded-lg"
                src={stories[currentIndex].image}
                alt={stories[currentIndex].name}
              />
            </div>
          </div>

          {/* Text content */}
          <div className="w-full md:w-1/2">
            <div className="mt-10 transition-opacity duration-300">
              <p className="text-2xl font-semibold text-primary">
                {stories[currentIndex].name}
              </p>
              <p className="text-lg mt-4 text-gray-400">
                {stories[currentIndex].description}
              </p>
            </div>

            <div className="mt-10 flex gap-4">
              <button
                onClick={goToPrevious}
                className="p-4 bg-transparent border border-gray-600 rounded-full cursor-pointer text-white hover:bg-gray-800"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={goToNext}
                className="p-4 bg-transparent border border-gray-600 rounded-full cursor-pointer text-white hover:bg-gray-800"
              >
                <FaArrowRight />
              </button>
            </div>

            <div>
              <div className="font-bold border border-gray-600 px-3 py-2 group hover:bg-white rounded-full w-fit mt-10 flex items-center gap-2 cursor-pointer">
                <div className="border p-2 rounded-full bg-white text-black group-hover:bg-black group-hover:text-white">
                  <CgArrowTopRight size={22} />
                </div>
                <p className="text-white group-hover:text-black">View all</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;