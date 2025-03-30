import MainFooter from "@/components/Footer/MainFooter.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowUpWideNarrow} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {CiSearch} from "react-icons/ci";
import {FaFilter} from "react-icons/fa";
import HelperCard from "@/components/Card/HelperCard.tsx";

function SearchPage() {

    return (
        <div className={"h-screen w-screen"}>
            <div className={"flex flex-col w-full h-full justify-center px-64 py-8 gap-8 overflow-hidden"}>
                <div className={"flex flex-row justify-between"}>
                    <div className={"flex flex-row gap-5"}>
                        <div className={"flex flex-row relative justify-center items-center w-full bg-[#F7F8F1] rounded-md"}>
                            <Input className={"border-2 rounded-md pr-10 w-96"} placeholder={"Search with Helper Name"}/>
                            <CiSearch className={"absolute text-gray-500 right-5"}/>
                        </div>
                        <Button className={"flex flex-row gap-5 bg-[#EE7C9E] hover:bg-[#EE7C9E]"}>
                            <FaFilter/>
                            <p>Filter</p>
                        </Button>
                    </div>
                    <Button className={"px-8 bg-[#EE7C9E] hover:bg-[#EE7C9E]"}>
                        <ArrowUpWideNarrow/>
                        <p>Last Active</p>
                    </Button>
                </div>
                <div className={"overflow-y-scroll grid grid-cols-1 md:grid-cols-2 gap-5 scrollbar-hide"}>
                    {[...Array(10)].map((_, i) => (
                        <HelperCard key={i}/>
                    ))}
                </div>
            </div>
            <MainFooter/>
        </div>
    );
}

export default SearchPage;