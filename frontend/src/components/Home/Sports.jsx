import { FaBaseballBall } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaBasketballBall } from "react-icons/fa";
import { MdOutlineSportsRugby } from "react-icons/md";
import { FaVolleyballBall } from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { MdAddCircleOutline } from "react-icons/md";
import { BiSolidCricketBall } from "react-icons/bi";const Sports =()=>{
    return(
        <div className="min-h-screen flex flex-col items-center justify-center">
               <div className="spacy-y-4 ">
                <h1 className="text-[50px] uppercase font-[900] text-center italic leading-[45px]">robust tools for <br/> every coach</h1>
               <p className="text-center py-7">See how GameChanger can transform your team’s season.</p>
               </div>

               <div className="grid grid-cols-4 gap-4 mt-10">
               
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#E51733] cursor-pointer">
                        <FaBaseballBall size={30} className="text-[#E51733]"/>
                        <p className="font-semibold">BASEBALL</p>
                        <FaLongArrowAltRight />
                    </div>

                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#D7FF38] cursor-pointer">
                        <FaBaseballBall size={30} className="text-[#D7FF38]"/>
                        <p className="font-semibold">SOFTBALL</p>
                        <FaLongArrowAltRight />
                    </div>


                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#FF6518] cursor-pointer">
                        <FaBasketballBall size={30} className="text-[#FF6518]"/>
                        <p className="font-semibold">BASKETBALL</p>
                        <FaLongArrowAltRight />
                    </div>


                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#DE9444] cursor-pointer">
                        <MdOutlineSportsRugby size={30} className="text-[#DE9444]"/>
                        <p className="font-semibold">RUGBY</p>
                        <FaLongArrowAltRight />
                    </div>

                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#2382F2] cursor-pointer">
                        <FaVolleyballBall size={30} className="text-[#2382F2]"/>
                        <p className="font-semibold">VOLLEYBALL</p>
                        <FaLongArrowAltRight />
                    </div>

                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#2382F2] cursor-pointer">
                        <GiSoccerBall size={30} className="text-[#2382F2]"/>
                        <p className="font-semibold">SOCCER</p>
                        <FaLongArrowAltRight />
                    </div>

                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#D7FF38] cursor-pointer">
                        <BiSolidCricketBall size={30} className="text-[#D7FF38]"/>
                        <p className="font-semibold">CRICKET</p>
                        <FaLongArrowAltRight />
                    </div>

                    
                    <div className="flex bg-white/5 items-center gap-2 border border-white/40 px-4 py-7 rounded-lg hover:border-[#5B7180] cursor-pointer">
                        <MdAddCircleOutline size={30} className="text-[#5B7180]"/>
                        <p className="font-semibold">ALL OTHER SPORTS</p>
                        <FaLongArrowAltRight />
                    </div>
              
               </div>
        </div>
    )

}

export default Sports