import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import {useState} from "react";

function LevelPage() {
    const [level, setLevel] = useState(0)
    const [exp, setExp] = useState(1000)
    const [maxExp, setMaxExp] = useState(2000)
    const rate = exp/maxExp

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className={"flex flex-col gap-8"}>
                    <div className="flex flex-col items-center justify-center relative">
                        <h1 className={"font-bold text-4xl text-center"}>Your Level</h1>
                        <div className="w-32 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                    </div>
                    <div className={"flex flex-row justify-center items-center gap-6"}>
                        <h2 className={'text-2xl'}>{level}</h2>
                        <div
                            className="relative w-full h-6 rounded-md overflow-hidden border-2 border-[#492924] bg-[#F7F8F1]">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#EE7C9E]"
                                style={{width: `${rate * 100}%`}}
                            />
                        </div>
                        <h2 className={'text-2xl'}>{level + 1}</h2>
                    </div>
                    <p className={'text-center'}>
                        <b>Your current level is {level}</b>, equivalent to 5 years of real-world work experience. You
                        need <b>{exp} EXP</b> to
                        reach level {level + 1}. Keep completing tasks or submit verified certificates to level up
                        faster.
                    </p>
                </div>

                <div className={"flex flex-col gap-8"}>
                    <div className="flex flex-col items-center justify-center relative">
                        <h1 className={"font-bold text-4xl text-center"}>Daily EXP Summary</h1>
                        <div className="w-32 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                    </div>
                    <h3 className={'text-center text-xl text-[#EE7C9E]'}>You earned {exp} EXP today!</h3>
                    <div className={'flex flex-col gap-4 items-center w-full'}>
                        <p>Task Completed:</p>
                        <div className={'flex flex-col gap-2 items-center justify-center w-full'}>
                            {[...Array(5)].map((i) => (
                                <div className={'flex flex-row justify-between w-4/6'} key={i}>
                                    <p className={'font-semibold w-2/6'}>Main Task</p>
                                    <p className={'w-3/4'}>Childcare & Babysitting</p>
                                    <p className={'w-1/6'}>10 EXP</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
            <MainFooter/>
        </div>
    );
}

export default LevelPage;