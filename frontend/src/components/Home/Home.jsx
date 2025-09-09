import About from "./About"
import Comments from "./Comments"
import Features from "./Features"
import Footer from "./Footer"
import Hero from "./Hero"
import InfiniteSportsScroller from "./InfiniteSportsScroller"
import More from "./More"
import Navbar from "./Navbar"
import Sports from "./Sports"
import SuccessStories from "./SuccessStories"

const Home=()=>{
    return(
        <div>
               <Navbar />
      <Hero />
      <Features />
      <InfiniteSportsScroller/>
      <About />
      <More />
      <Sports/>
      <SuccessStories/>
      <Comments/>
      <Footer/>
        </div>
    )
}

export default Home