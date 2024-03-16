import FeatureCard from "./FeatureCard";
import Divider from '@mui/material/Divider';

export default function Features () {
  return(
    <div className="flex sm:flex-row flex-col sm:justify-start ps-16 justify-center items-center bg-[#e10f37] mt-10 p-0">
        <FeatureCard heading={"8.4k Reviews"} content={"(4.9) Rating"} icon={"star"} />
        <Divider orientation="vertical" flexItem />
        <FeatureCard heading={"25+"} content={"Resturants"} icon={"table"} />
        <Divider orientation="vertical" flexItem />
        <FeatureCard heading={"100+"} content={"Food Items"} icon={"food"} />
    </div>

  );
}
