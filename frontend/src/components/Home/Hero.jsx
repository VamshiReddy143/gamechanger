import React from "react";

const Hero = () => {
  return (
    <div className="min-h-screen relative font-bebas w-screen bg-cover bg-center pt-35 flex flex-col items-center justify-center text-white">
      <div className="absolute top-0 left-0 w-screen h-full -z-10">
        <video
          className="w-full h-full object-cover"
          src="/hero.mp4"
          autoPlay
          loop
          muted
        />
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#07081B] to-transparent"></div>
      </div>

      <h1 className="text-[70px] uppercase italic font-[900] text-center leading-[63px]">
        <span className="text-primary ">Broadcast</span> your games <br />
        <span className="text-primary">capture</span> every play <br />
        and <span className="text-primary">engage</span> your fans.
      </h1>
      <p className="pt-5 text-xl">
        Simplify your season with the top-rated youth sports app — always free
        for coaches!
      </p>

      <div className="flex flex-col items-center ">
        <button className="bg-primary hover:bg-white/10 hover:border italic border-primary text-white py-4 px-6 rounded-xl mt-10 font-semibold hover:bg-violet-600 transition duration-300">
          Download PlayMaker
        </button>
        <div className="flex gap-2 mt-5">
          <img className="w-[150px] h-[50px]" src="/playstore.png" />
          <img className="w-[150px] h-[50px]" src="/appstore.png" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
