import Profile1 from "@/assets/images/home/Review Profile 1.png";
import {AiFillStar} from "react-icons/ai";
import Testi1 from "@/assets/images/home/Testimoni Portrait 1.png";

function ReviewCard() {
    return (
        <div
            className={"flex flex-row gap-8 text-[#492924] md:text-start justify-center md:justify-evenly text-center w-full items-center"}>
            <div
                className={"flex flex-col gap-8 text-[#492924] md:text-start justify-center md:justify-start text-center w-full md:w-1/2"}>
                <h1 className={"text-3xl font-bold"}>Customer Reviews</h1>
                <p className={"md:w-2/3"}>"This platform has truly changed my life! I found a reliable job quickly, and
                    the task management feature makes everything so much easier. I feel more valued and secure in my
                    work."</p>
                <div className={"flex flex-row gap-4 items-center justify-center md:justify-start"}>
                    <img src={Profile1} alt={"Profile"} className={"w-16 h-16 rounded-full object-cover"}/>
                    <div className={"flex flex-col gap-2"}>
                        <h3>Siti Rahma</h3>
                        <p>Professional Helper</p>
                    </div>
                </div>
                <div className={"flex flex-row gap-4 items-center justify-center md:justify-start"}>
                    <div className={"flex flex-row gap-2"}>
                        <AiFillStar className={"text-[#EFBB4B]"}/>
                        <AiFillStar className={"text-[#EFBB4B]"}/>
                        <AiFillStar className={"text-[#EFBB4B]"}/>
                        <AiFillStar className={"text-[#EFBB4B]"}/>
                        <AiFillStar/>
                    </div>
                    <p>4.8</p>
                </div>
            </div>
            <img src={Testi1} alt={"Pictures"} className={"h-120 hidden md:block"}/>
        </div>
    );
}

export default ReviewCard;