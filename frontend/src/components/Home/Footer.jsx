const Footer = () => {
  return (
    <div className="px-10 mt-10 py-10">
      <div className="bg-gray-900 rounded-xl px-7 py-7">
        <div className="grid grid-cols-4 gap-7 ">
          <div className="space-y-5">
            <p className="font-semibold text-[17px]">CONTACT</p>
            <p className="font-semibold text-[15px]">+91 9876543210</p>
            <p className="font-semibold text-[15px] underline">Contact Us</p>
            <p className="font-semibold text-[15px]">
              2804 Mission College Blvd. Santa Clara, CA, USA 95054
            </p>
          </div>


            <div className="space-y-4">
            <p className="font-semibold text-[15px]">WHY PLAYMAKER</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Different Games</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Live Streaming</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Engaging</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Team Collaboration</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Coach Training</p>
          </div>

             <div className="space-y-4">
            <p className="font-semibold text-[15px]">COMPANY</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">About Us</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Blogs</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Compliance & Policy</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Management</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Events</p>
              <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Careers</p>
                <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Live events</p>
          </div>



           <div className="space-y-4">
            <p className="font-semibold text-[15px]">GET STARTED</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Login</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Pricing</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Support Plans</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Get Started</p>
            <p className=" text-[12px] text-gray-400 hover:text-white hover:underline cursor-pointer">Talk to Us</p>
    
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center  gap-5 mt-7">
        <p className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Privacy Policy</p>
        <p  className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Cookie Policy</p>
        <p  className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Terms of Service</p>
        <p  className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Acceptable Use Policy</p>
        <p  className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Sitemap</p>
        <p  className="text-gray-400 text-[12px] hover:text-white hover:underline cursor-pointer">Report Abuse of Our Terms and Services</p>

      </div>
       <div className="flex justify-center items-center  gap-4 mt-10">
         <p className="font-bold">PLAYMAKER</p>
          <p  className="text-gray-400 text-[12px] ">Copyright © 2025 PlayMaker</p>
          <div className="h-[10px] w-[1px] bg-gray-400"/>
            <p  className="text-gray-400 text-[12px] ">All rights reserved</p>


      </div>
    </div>
  );
};

export default Footer;
