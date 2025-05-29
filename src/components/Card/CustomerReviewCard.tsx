import StarRating from "@/components/Inputer/StarRating.tsx";
import test from "@/assets/images/profile/test.jpg"

function CustomerReviewCard() {
    return (
        <div className={"bg-[#F7F8F1] p-8 rounded-md w-full "}>
            <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-row gap-8"}>
                    <img src={test} alt={"Pictures"} className={"h-16 w-16 rounded-full border-1 border-[#492924] object-cover"}/>
                    <div className={"flex flex-col gap-2 text-[#492924]"}>
                        <h1 className={"text-xl font-bold"}>Kevin Pramudya</h1>
                        <h3 className={"text-sm"}>Family in Bekasi</h3>
                    </div>
                </div>
                <StarRating rating={2.5}/>
                <p className={"text-sm text-[#492924] text-justify"}>He is a good helper and I am happy with his work. You should hire him because he has workaholic mentality</p>
            </div>
        </div>
    );
}

export default CustomerReviewCard;