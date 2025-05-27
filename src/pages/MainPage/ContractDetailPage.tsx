import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import {useNavigate} from "react-router-dom";
import {TbArrowBackUp} from "react-icons/tb";
import {Button} from "@/components/InfoComponent/Button.tsx";
import {IoIosSend} from "react-icons/io";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import {useState} from "react";
import Notification from "@/components/Card/Notification.tsx";

function ContractDetailPage() {
    const navigate = useNavigate();
    // const defaultSkill = ["House Cleaning", "Cooking", "Laundry Care", "Pet Care", "Dishwashing"]
    const defaultFacility = ["Wi-Fi Access", "Free Meals", "Transport Fee", "Holiday Bonus", "Healthcare Support", "Weekend Off", "Job Supplies"]

    const [confirmPopup, setConfirmPopup] = useState(false)

    function backTrack (){
        navigate(-1);
    }
    
    function sendContract (){
        setConfirmPopup(true)
    }

    function closePopup (){
        setConfirmPopup(false)
        navigate("/helper-profile")
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar/>
            <div className={"flex flex-col w-full h-full px-8 md:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <TbArrowBackUp className={"absolute left-48"} size={40} onClick={backTrack}/>
                <div className="flex flex-col justify-center relative bg-[#F7F8F1] rounded-md p-6 gap-5 w-full text-justify px-14 shadow-md">
                    <h1 className={"text-3xl m-10 text-center font-bold"}>Employment Contract Between Customer And Helper</h1>
                    <p>Contract No: DW/YOG/2025/087<br/>
                        On this day, 04 April 2025, at Yogyakarta, a work contract has been mutually agreed upon
                        between:</p>
                    <div className={"flex flex-row items-center justify-between w-full"}>
                        <p>
                            <b>First Party:</b><br/>
                            <b>Name:</b> Joshua Sutanto<br/>
                            <b>Address:</b> Jl. Solo No. 123, Yogyakarta<br/>
                            Hereinafter referred to as the Customer.
                        </p>

                        <p>
                            <b>Second Party (Helper):</b><br/>
                            <b>Name:</b> Nur Kusuma<br/>
                            <b>Address:</b> Jl. Malioboro No. 456, Yogyakarta<br/>
                            Hereinafter referred to as the Domestic Worker or Helper.<br/>
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>1. Main Duties and Responsibilities</p>
                        <p className={"pl-4"}>
                            The Helper agrees to carry out the following five (5) main tasks as specified and agreed upon:
                            Childcare & Babysitting
                            Cooking
                            House Cleaning
                            Laundry Care
                            Ironing & Clothes Care
                            The Helper shall perform these duties responsibly, professionally, and in accordance with
                            cleanliness and safety standards in the household.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>2. Contract Duration</p>
                        <p className={"pl-4"}>
                            This employment contract shall be valid for a duration of 1 (one) year, starting from 07 Agustus
                            2025 and ending on 07 Agustus 2026, unless extended or terminated according to the terms of this
                            contract.
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>3. Accommodation</p>
                        <p className={"pl-4"}>
                            The Customer agrees to provide proper and safe accommodation for the Helper during the entire
                            contract period.
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>4. Additional Facilities</p>
                        <p className={"pl-4"}>
                            The Helper will receive the following benefits from the Customer:
                        </p>
                        {defaultFacility && (defaultFacility.map((facility, i) => {
                                return (
                                    <p className={"pl-4"} key={i}>
                                        &gt; {facility}
                                    </p>
                                )})
                        )}
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>5. Helper Salary and Payment System</p>
                        <p className={"pl-4"}>
                            The Helper’s salary will be transferred monthly through the Payment menu on the MbakCare
                            platform.<br/>
                            An automatic monthly invoice will appear to ensure timely payment and to avoid missed or late
                            payments from the Customer.<br/>
                            The salary amount is calculated automatically by the system, based on:<br/>
                            The Helper’s current level or experience (EXP)<br/>
                            The number of main tasks assigned in the contract<br/>
                            The total number of additional tasks requested during the month<br/>
                            For this contract, the agreed monthly salary is <b>Rp5.600.000,00</b>.<br/>
                            This system is designed to ensure that the salary is neither underpaid nor overpriced,
                            reflecting a fair workload-to-pay ratio.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>6. Additional Tasks</p>
                        <p className={"pl-4"}>
                            The Customer may add up to 3 (three) additional tasks per day, outside of the agreed main tasks
                            in the contract.
                            This daily limit is implemented to accommodate customer needs while preventing overwork and
                            ensuring the Helper’s well-being.
                            Each additional task added by the Customer will incur an extra charge of Rp20.000,00 per task,
                            which will be automatically included in the Helper’s end-of-month salary invoice.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>7. Dispute Resolution</p>
                        <p className={"pl-4"}>
                            In the event of disputes, inappropriate behavior, criminal actions, or any negative conduct,
                            either party may use the “Report” button available in the Contract menu on the MbakCare
                            platform.
                            This feature allows one party to report the other to MbakCare Admin for inappropriate incidents
                            or violations.
                            The Admin team will review and follow up on the report accordingly.
                            If serious violations are confirmed, the Admin reserves the right to:
                            Terminate the contract, and/or
                            Blacklist the offending party from the platform to maintain user safety and service integrity.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>8. Rights and Responsibilities</p>
                        <p className={"pl-4"}>
                            The Customer shall:<br/>
                            Pay the Helper’s salary on time as calculated by the system.
                            Provide a safe and respectful work environment.
                            Allow sufficient rest time and honor the Helper’s rights.<br/>
                            The Helper shall:<br/>
                            Perform all assigned duties professionally and diligently.
                            Maintain discretion, cleanliness, and respect in the household.
                            Uphold trust and avoid any acts that could harm either party.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5"}>
                        <p className={"font-bold"}>
                        9. Final Clause</p>
                        <p className={"pl-4"}>
                            This contract is made in duplicate and signed willingly by both parties without any coercion.
                            This contract is also subject to the applicable rules and policies set by the MbakCare platform.
                        </p>
                    </div>

                    <div className={"flex flex-row justify-between m-10"}>
                        <div className={"flex flex-col gap-4 text-center"}>
                            <h3>Customer</h3>
                            <img alt={'Agree'}/>
                            <h3>Jonathan Sutanto</h3>
                        </div>
                        <div className={"flex flex-col gap-4 text-center justify-between"}>
                            <h3>Helper</h3>
                            {/*<img alt={'Agree'}/>*/}
                            <h3>Jonathan Sutanto</h3>
                        </div>
                    </div>
                </div>

                <div className={"flex justify-center items-center"}>

                    <Button size={'xl'} onClick={sendContract}>
                        <IoIosSend className={"size-8"} />
                        Send Contract
                    </Button>
                </div>
            </div>
            <MainFooter/>

            {confirmPopup && (
                <Notification
                    title={"Contract Sent Successfully"}
                    message={"Please wait for their response. They may choose to accept, decline, or negotiate the contract with you."}
                    variant={0}
                    onClose={closePopup}
                />
            )}

        </div>
    );
}

export default ContractDetailPage;
