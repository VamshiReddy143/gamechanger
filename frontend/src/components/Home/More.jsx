import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { LuArrowRight } from "react-icons/lu";
import { FaVideo } from "react-icons/fa";
import { TbScoreboard } from "react-icons/tb";
import { LuMessageSquareText } from "react-icons/lu";
import { BorderBeam } from "../../components/magicui/border-beam";

const More = () => {
  return (
    <div className="min-h-screen pt-5 px-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-[50px] font-[900] italic">
          Our Exclusive Features
        </h1>
        <p>
          <span className="text-primary">Discover </span>the unique offerings
          that set us apart
        </p>
        <div className="mt-7 flex items-center gap-1 bg-primary text-black font-[400] cursor-pointer hover:border border-primary hover:bg-[#8D51FF]/10 hover:text-white transition duration-300 px-5 py-3 rounded-xl">
          <p> Explore Playmaker features</p>
          <FiArrowRight className="mt-1" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-10 ">
        <div className="border relative border-white/20 p-7 rounded-2xl flex items-start gap-30 ">
          <div className="space-y-2 w-[60%]">
            <div className="flex items-center gap-2">
              <FaVideo size={30} className="text-primary" />
              <h1 className="text-[30px] font-bold italic">STREAM</h1>
            </div>
            <p className="">
              Share the game while capturing valuable video with the best app to
              live stream youth sports.
            </p>
            <div className="flex items-center gap-1 bg-transparent border-2 border-primary hover:bg-[#8E51FF]/10 rounded-lg px-5 py-3 w-fit italic mt-7">
              <p className="font-semibold ">Free Live Streaming</p>
              <LuArrowRight />
            </div>
          </div>
          <div className=" ">
            <img className="" src="/live.webp" />
          </div>
          <BorderBeam duration={8} size={100} />
        </div>

        <div className="flex gap-2 pt-2">
          <div className="border relative w-[50%] border-white/20 p-7 rounded-2xl flex flex-col gap-10 ">
            <div className="space-y-2 w-[60%]">
              <div className="flex items-center gap-2">
                <TbScoreboard size={30} className="text-primary" />
                <h1 className="text-[30px] font-bold italic">SCORE</h1>
              </div>
              <p className="">
                Score every game with the best free app for youth sports
                scorekeeping.
              </p>
              <div className="flex items-center gap-1 bg-transparent border-2 border-primary hover:bg-[#8E51FF]/10 rounded-lg px-5 py-3 w-fit italic mt-7">
                <p className="font-semibold ">Free Scorekeeping</p>
                <LuArrowRight />
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-50 bg-gradient-to-b from-[#07081B] to-transparent"></div>
                <img
                  className=" h-[400px] w-[250px] object-cover rounded-2xl border border-white p-2"
                  src="/v1.webp"
                />
              </div>
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#07081B] to-transparent"></div>
                <img
                  className=" h-[400px] w-[250px] object-cover rounded-2xl border border-white p-2"
                  src="/v2.webp"
                />
              </div>
            </div>
            <BorderBeam duration={8} size={100} />
          </div>

          <div className="border relative border-white/20 p-7 w-[50%] rounded-2xl flex flex-col gap-10 ">
            <div className="space-y-2 w-[60%]">
              <div className="flex items-center gap-2">
                <LuMessageSquareText size={30} className="text-primary" />
                <h1 className="text-[30px] font-bold italic">CONNECT</h1>
              </div>
              <p className="">
                Stay connected with players and their families with free team
                messaging and scheduling.
              </p>
              <div className="flex items-center gap-1 bg-transparent border-2 border-primary hover:bg-[#8E51FF]/10 rounded-lg px-5 py-3 w-fit italic mt-7">
                <p className="font-semibold ">Free Team Management</p>
                <LuArrowRight />
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#07081B] to-transparent"></div>
                <img
                  className=" h-[400px] w-[250px] object-cover rounded-2xl border border-white p-2"
                  src="/m1.jpg"
                />
              </div>
              <div className="relative">
                <div className="absolute bottom-0 left-0 w-full h-50 bg-gradient-to-t from-[#07081B] to-transparent"></div>
                <img
                  className=" h-[400px] w-[250px] object-cover rounded-2xl border border-white p-2"
                  src="/m2.jpg"
                />
              </div>
            </div>
          <BorderBeam duration={8} size={100} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
