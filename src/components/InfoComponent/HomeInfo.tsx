import home1 from "../../assets/images/home/Job Posting.png"
import home2 from "../../assets/images/home/Verified Helpers.png"
import home3 from "../../assets/images/home/Secure Payment.png"
import home4 from "../../assets/images/home/Task.png"

const HomeInfo = ({ title, desc, type}: { title: string; desc: string; type: number }) => {

    function picture (type: number): string{
        if (type == 1){
            return home1
        }else if (type == 2){
            return home2
        }else if (type == 3){
            return home3
        }else if (type == 4){
            return home4
        }
        return ""
    }
    return (
        <div className={"flex flex-col justify-center items-center gap-4"}>
            <img src={picture(type)} alt={"Pictures"} className={"h-40"}/>
            <h3 className={"text-2xl font-bold text-center"}>{title}</h3>
            <p className={"text-center w-2/3"}>{desc}</p>
        </div>
    );
};

export default HomeInfo;