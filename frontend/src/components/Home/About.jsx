import { RiTeamLine } from "react-icons/ri";
import { TextReveal } from "../../components/magicui/text-reveal";

const About = () => {
  return (
    <div className="min-h-screen px-10 pt-10">
      <div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <img
              className="h-[500px] w-full object-cover rounded-2xl"
              src="/play1.png"
              alt="Play illustration"
            />
          </div>

          <div className="w-[60%]">
            <div className="flex items-center gap-1">
              <RiTeamLine className="text-primary" />
              <p>Choose your team</p>
            </div>
      
            <h1 className="text-[50px] font-bold pt-3 leading-[50px]">
              Your Personal Squad of{" "}
              <span className="text-primary italic">Game-Changing</span>{" "}
              Experts
            </h1>
         
            <p className="text-[16px] text-gray-400 pt-5 ">
              We build custom all-star teams of world-class B2B marketing pros
              to power up your in-house lineup. Working side-by-side with your
              squad, we bring championship-level strategy and years of elite
              experience. Every player on our roster knows their role and brings
              deep expertise to the game. Together, we play for one goal: to
              build a high-performance marketing engine that wins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
