import { useEffect } from "react";

const Comments = () => {
  // Data for each column
  const leftColumn = [
    {
      comment:
        "The platform's video quality is outstanding! I can see every detail of my son's soccer matches.",
      name: "SARAH",
      role: "Soccer Parent",
      image: "/user1.jpg",
    },
    {
      comment:
        "As a coach, this has revolutionized how I analyze our team's performance after games.",
      name: "COACH DAVE",
      role: "Basketball Coach",
      image: "/user2.jpg",
    },
    {
      comment:
        "Never miss a moment of my daughter's volleyball games, even when I can't be there in person.",
      name: "LISA",
      role: "Volleyball Fan",
      image: "/user3.jpg",
    },
  ];

  const middleColumn = [
    {
      comment:
        "The automatic highlight reel after each game is my favorite feature! Saves me so much time.",
      name: "MIKE",
      role: "Football Dad",
      image: "/user4.jpg",
    },
    {
      comment:
        "Being able to rewatch key moments from different angles has helped my son improve his technique.",
      name: "JAMES",
      role: "Tennis Parent",
      image: "/user5.jpg",
    },
    {
      comment:
        "The live streaming is so smooth, it feels like I'm right there on the sidelines!",
      name: "EMILY",
      role: "Swimming Mom",
      image: "/user6.jpg",
    },
  ];

  const rightColumn = [
    {
      comment:
        "Sharing game clips with grandparents who live abroad has never been easier.",
      name: "ROBERT",
      role: "Hockey Grandparent",
      image: "/user7.jpg",
    },
    {
      comment:
        "The player stats tracking has helped my daughter understand her strengths and areas to improve.",
      name: "ANNA",
      role: "Lacrosse Mom",
      image: "/user8.jpg",
    },
    {
      comment:
        "The community features let us connect with other sports families in our area.",
      name: "DAVID",
      role: "Baseball Dad",
      image: "/user9.jpg",
    },
  ];

  // Animation effect
  useEffect(() => {
    const columns = document.querySelectorAll(".comments-column");

    columns.forEach((column, index) => {
      // Different speeds for each column
      const speed = index === 1 ? 0.5 : 0.3; // Middle column is faster

      // Clone the content for seamless looping
      const content = column.innerHTML;
      column.innerHTML = content + content + content;

      // Animation
      let position = 0;
      const animate = () => {
        position -= speed;
        if (position <= -column.scrollHeight / 3) {
          position = 0;
        }
        column.style.transform = `translateY(${position}px)`;
        requestAnimationFrame(animate);
      };

      animate();
    });
  }, []);

  return (
    <div className="min-h-screen max-w-7xl mx-auto overflow-hidden mt-10 pb-20">
      <h1 className="text-[50px] uppercase font-[900] text-center italic leading-[47px]">
        A FEW <span className="text-primary">WORDS</span> FROM OUR CHEERING{" "}
        <br /> SECTION
      </h1>

      <div className="relative grid grid-cols-3 gap-3 mt-15 h-[500px] overflow-hidden">
        {/* Left column - slowest */}
        <div className="flex flex-col gap-3 comments-column">
          {[...leftColumn, ...leftColumn, ...leftColumn].map((item, index) => (
            <div
              key={`left-${index}`}
              className="border  border-white/30 p-4 bg-white/5 rounded-xl min-h-[200px]"
            >
              <p className="text-gray-300 ">"{item.comment}"</p>
              <div className="flex items-center justify-between mt-7">
                <img
                  className="h-15 w-15 rounded-full object-cover h-12 w-12"
                  src={item.image}
                  alt={item.name}
                />
                <div className="mt-7">
                  <p className="font-semibold text-primary text-[15px] italic">{item.name}</p>
                  <p className="text-[15px] text-gray-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Middle column - fastest */}
        <div className="flex flex-col gap-3 comments-column">
          {[...middleColumn, ...middleColumn, ...middleColumn].map(
            (item, index) => (
              <div
                key={`middle-${index}`}
                className="border border-white/30 bg-white/5 p-4 rounded-xl min-h-[200px]"
              >
                <p className="text-gray-300 ">"{item.comment}"</p>
                <div className="flex items-center justify-between mt-7">
                  <img
                    className="h-15 w-15 rounded-full object-cover h-12 w-12"
                    src={item.image}
                    alt={item.name}
                  />
                    <div className="mt-7">
                  <p className="font-semibold text-primary text-[15px] italic">{item.name}</p>
                  <p className="text-[15px] text-gray-400">{item.role}</p>
                </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Right column - slowest */}
        <div className="flex flex-col gap-3 comments-column">
          {[...rightColumn, ...rightColumn, ...rightColumn].map(
            (item, index) => (
              <div
                key={`right-${index}`}
                className="border border-white/30 p-4 bg-white/5 rounded-xl min-h-[200px]"
              >
                <p className="text-gray-300 ">"{item.comment}"</p>
                <div className="flex items-center justify-between mt-7">
                  <img
                    className="h-15 w-15 rounded-full object-cover h-12 w-12"
                    src={item.image}
                    alt={item.name}
                  />
                    <div className="mt-7">
                  <p className="font-semibol text-primary text-[15px] italic">{item.name}</p>
                  <p className="text-[15px] text-gray-400">{item.role}</p>
                </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="absolute top-0 left-0 w-full h-50 bg-gradient-to-b from-[#07081B] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#07081B] to-transparent"></div>
      </div>
    </div>
  );
};

export default Comments;
