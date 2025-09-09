import { MdOutlineFileDownload } from "react-icons/md";
import { TbShoppingBagDiscount } from "react-icons/tb";

const Features = () => {
 return (
 <div className="min-h-screen bg-[#07081B] pt-40 flex items-center justify-between gap-10 px-10">
 <div className="w-[50%]">

 <h1 className="text-[55px] font-[700] italic leading-[50px]">
 Fuel Your Game, <br />
 <span className="text-primary">Elevate </span>Every Play
 </h1>
 <p className="text-[18px] text-gray-400 mt-5">
 You are the star — capture every moment like a champion.
 </p>

 <div className="mt-10 space-y-3">

 {/* Card 1 */}
 <div className="bg-white/6 border border-white/5 hover:border-primary hover:bg-gradient-to-r from-violet-500/30 from-[80%] to-white/5 transition-all duration-500 ease-in-out flex items-center gap-3 rounded-xl p-7 hover:text-white">
 <div className=" p-4 border border-primary rounded-xl">
 <TbShoppingBagDiscount className="text-violet-400" size={35} />
 </div>
 <div>
 <h1 className="text-[20px] font-[600]">Kickoff Special</h1>
 <p className="text-[18px] font-[400] text-gray-300 group-hover:text-white">
 Score up to 50% off your first match-day booking
 </p>
 </div>
 </div>

 {/* Card 2 */}
 <div className="bg-white/6 border border-white/5 hover:border-primary hover:bg-gradient-to-r from-violet-500/30 from-[80%] to-white/5 transition-all duration-500 ease-in-out rounded-xl p-7 hover:text-white">
 <h1 className="text-[20px] font-[600]">Get the PlayMaker App</h1>

 <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-all duration-500 ease-in-out">
 <MdOutlineFileDownload size={20} />
 <p>Download on the App Store</p>
 </div>

 <div className="flex items-center gap-2 text-gray-300 hover:text-gray-100 transition-all duration-500 ease-in-out">
 <MdOutlineFileDownload size={20} />
 <p>Get it on Google Play</p>
 </div>
 </div>

 </div>

 </div>

 <div className="w-[50%] flex  gap-3">
 <img className="h-[500px] w-[300px] object-cover mt-7 rounded-2xl border border-white/20 p-2 hover:border-primary transition-all duration-500 ease-in-out" src="/h1.jpg" alt="Sports action" />
 <img className="h-[500px] w-[300px] object-cover rounded-2xl border border-white/20 p-2 hover:border-primary transition-all duration-500 ease-in-out" src="/hhh.jpg" alt="Sports action" />
 {/* <img className="h-[500px] w-[700px]" src="/play.svg"/> */}
 </div>
 </div>
 );
};

export default Features;



