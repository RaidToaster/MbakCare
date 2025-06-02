// src/pages/ContractPage/ContractDetailPage.tsx
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import { Button } from "@/components/Inputer/Button.tsx";
import { IoIosSend } from "react-icons/io";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { useState, useEffect } from "react";
import Notification from "@/components/InfoComponent/Notification.tsx";
import { ContractService } from "@/lib/services/ContractService.ts";
import { ContractDraftData } from "./ContractCreationPage.tsx"; // Ensure this path is correct
import { supabase } from "@/lib/supabase.ts"; // For fetching current user

function ContractDetailPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUser(data.user);
        });
    }, []);

    const [draftData, setDraftData] = useState<ContractDraftData | null>(null);
    const [isLoading, setIsLoading] = useState(false); // For the "Send Contract" action
    const [error, setError] = useState<string | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);

    useEffect(() => {
        if (location.state && location.state.contractDraft) {
            setDraftData(location.state.contractDraft as ContractDraftData);
        } else {
            setError("Contract draft data not found. Please go back and fill the form.");
            // Optionally navigate back or show a more prominent error
            // navigate('/contract/create'); 
        }
    }, [location.state]);

    function backTrack() {
        // Navigate back to the creation page, potentially passing existing draft data
        // or just navigate(-1) if you don't need to preserve state on back navigation.
        navigate(-1);
    }

    const parseDurationToMonths = (durationString: string): number => {
        if (durationString.includes("Year")) {
            return parseInt(durationString.split(" ")[0]) * 12;
        }
        if (durationString.includes("Months")) {
            return parseInt(durationString.split(" ")[0]);
        }
        return 12; // Default or throw error
    };

    async function sendContract() {
        if (!draftData || !currentUser || !draftData.helperId) {
            setError("Required contract information is missing to send the contract.");
            return;
        }
        setError(null);
        setIsLoading(true);

        const durationInMonths = parseDurationToMonths(draftData.selectedDuration);
        const today = new Date();
        const endDate = new Date(today);
        endDate.setMonth(today.getMonth() + durationInMonths);

        const tasksToCreate = draftData.selectedMainTaskIds.map(skillId => ({
            skill_id: skillId,
            task_type: 'Main' as 'Main' | 'Additional',
            quantity: 1,
            rate_per_task: 0,
        }));

        const contractInsertData = {
            customer_id: currentUser.id,
            helper_id: draftData.helperId,
            start_date: today.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            duration_months: durationInMonths,
            tasks: tasksToCreate,
            facilities: draftData.selectedFacilityIds,
        };

        try {
            const { contract: newContract, error: creationError } = await ContractService.createContract(
                contractInsertData,
                tasksToCreate,
                draftData.selectedFacilityIds
            );

            if (creationError || !newContract) {
                throw creationError || new Error("Failed to create and send contract.");
            }
            setShowConfirmPopup(true);
        } catch (err: any) {
            setError(err.message || "An error occurred while sending the contract.");
        } finally {
            setIsLoading(false);
        }
    }

    function closeConfirmPopup() {
        setShowConfirmPopup(false);
        navigate("/search"); // Or to a contracts list page
    }


    if (error && !draftData) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-col justify-center items-center h-full pt-40 text-red-500">
                    <p>{error}</p>
                    <Button onClick={() => navigate('/contract/create')} className="mt-4">Create New Contract</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    if (!draftData) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex justify-center items-center h-full pt-40 text-[#492924]">Loading contract draft details...</div>
                <MainFooter />
            </div>
        );
    }

    const customerDisplayName = draftData.customerName || currentUser?.user_metadata?.name || currentUser?.email || "Customer Name";
    const helperDisplayName = draftData.helperName || "Helper Name"; // Helper name passed from creation page
    const contractCreationDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const durationInMonthsValue = parseDurationToMonths(draftData.selectedDuration);
    const contractStartDate = new Date();
    const contractEndDate = new Date(contractStartDate);
    contractEndDate.setMonth(contractStartDate.getMonth() + durationInMonthsValue);

    const startDateDisplay = contractStartDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const endDateDisplay = contractEndDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });


    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="w-full flex justify-start relative mb-0 lg:mb-4">
                    <TbArrowBackUp className={"cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block"} size={40} onClick={backTrack} />
                    <TbArrowBackUp className={"cursor-pointer absolute left-0 top-[-20px] lg:hidden"} size={32} onClick={backTrack} />
                </div>
                <div className="flex flex-col justify-center relative bg-[#F7F8F1] rounded-md p-6 sm:p-10 lg:px-14 gap-5 w-full text-justify shadow-md">
                    <h1 className={"text-2xl sm:text-3xl mt-4 mb-6 sm:m-10 text-center font-bold"}>Employment Contract Between Customer And Helper</h1>
                    <p className="text-sm sm:text-base">
                        Contract No: PENDING - TO BE GENERATED<br />
                        On this day, {contractCreationDate}, at Yogyakarta, a work contract has been mutually agreed upon
                        between:</p>
                    <div className={"flex flex-col gap-4 lg:gap-0 lg:flex-row items-start lg:items-start lg:justify-between w-full text-sm sm:text-base"}>
                        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                            <b>First Party:</b><br />
                            <b>Name:</b> {customerDisplayName}<br />
                            {/* <b>Address:</b> Jl. Solo No. 123, Yogyakarta (Example Address)<br /> */}
                            Hereinafter referred to as the Customer.
                        </div>

                        <div className="w-full lg:w-1/2">
                            <b>Second Party (Helper):</b><br />
                            <b>Name:</b> {helperDisplayName}<br />
                            {/* <b>Address:</b> Jl. Malioboro No. 456, Yogyakarta (Example Address)<br /> */}
                            Hereinafter referred to as the Domestic Worker or Helper.<br />
                        </div>
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>1. Main Duties and Responsibilities</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Helper agrees to carry out the following {draftData.numMainTasks} main tasks as specified and agreed upon:
                        </p>
                        {draftData.selectedMainTaskNames.length > 0 ? (
                            draftData.selectedMainTaskNames.map((skill, i) => (
                                <p className={"pl-4 text-sm sm:text-base"} key={i}> {skill}</p>
                            ))
                        ) : <p className="pl-4 text-sm text-gray-500">No main duties specified.</p>}
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Helper shall perform these duties responsibly, professionally, and in accordance with
                            cleanliness and safety standards in the household.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>2. Contract Duration</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            This employment contract shall be valid for a duration of {draftData.selectedDuration.toLowerCase()}, starting from {startDateDisplay} and ending on {endDateDisplay}, unless extended or terminated according to the terms of this
                            contract.
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>3. Accommodation</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            {draftData.providesHousing === "Yes"
                                ? "The Customer agrees to provide proper and safe accommodation for the Helper during the entire contract period."
                                : "Accommodation is not provided by the Customer under this contract."}
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>4. Additional Facilities</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Helper will receive the following benefits from the Customer:
                        </p>
                        {draftData.selectedFacilityNames.length > 0 ? (
                            draftData.selectedFacilityNames.map((facility, i) => (
                                <p className={"pl-4 text-sm sm:text-base"} key={i}> {facility}</p>
                            ))
                        ) : <p className="pl-4 text-sm text-gray-500">No additional facilities specified.</p>}
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>5. Helper Salary and Payment System</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Helper’s salary will be transferred monthly through the Payment menu on the MbakCare
                            platform.<br />
                            An automatic monthly invoice will appear to ensure timely payment and to avoid missed or late
                            payments from the Customer.<br />
                            The salary amount is calculated automatically by the system, based on:<br />
                            The Helper’s current level or experience (EXP)<br />
                            The number of main tasks assigned in the contract<br />
                            The total number of additional tasks requested during the month<br />
                            For this contract, the agreed monthly salary is <b>Rp5.600.000,00</b>. (Example Salary)<br />
                            This system is designed to ensure that the salary is neither underpaid nor overpriced,
                            reflecting a fair workload-to-pay ratio.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>6. Additional Tasks</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Customer may add up to 3 (three) additional tasks per day, outside of the agreed main tasks
                            in the contract.
                            This daily limit is implemented to accommodate customer needs while preventing overwork and
                            ensuring the Helper’s well-being.
                            Each additional task added by the Customer will incur an extra charge of Rp20.000,00 per task,
                            which will be automatically included in the Helper’s end-of-month salary invoice.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>7. Dispute Resolution</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
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

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>8. Rights and Responsibilities</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            The Customer shall:<br />
                            Pay the Helper’s salary on time as calculated by the system.
                            Provide a safe and respectful work environment.
                            Allow sufficient rest time and honor the Helper’s rights.<br />
                            The Helper shall:<br />
                            Perform all assigned duties professionally and diligently.
                            Maintain discretion, cleanliness, and respect in the household.
                            Uphold trust and avoid any acts that could harm either party.
                        </p>
                    </div>

                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>9. Final Clause</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            This contract is made in duplicate and signed willingly by both parties without any coercion.
                            This contract is also subject to the applicable rules and policies set by the MbakCare platform.
                        </p>
                    </div>

                    <div className={"flex flex-col sm:flex-row justify-between items-center mt-10 pt-6 border-t border-gray-300"}>
                        <div className={"flex flex-col gap-2 items-center text-center mb-6 sm:mb-0"}>
                            <h3 className="font-semibold">Customer</h3>
                            <div className="h-16 w-32 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-xs italic">Signature Area</div>
                            <img alt={'Agree'} />
                            <h3>{customerDisplayName}</h3>
                        </div>
                        <div className={"flex flex-col gap-2 items-center  text-center"}>
                            <h3 className="font-semibold">Helper</h3>
                            <div className="h-16 w-32 border border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-xs italic">Signature Area</div>
                            <h3>{helperDisplayName}</h3>
                        </div>
                    </div>
                </div>

                <div className={"flex justify-center items-center mt-4"}>
                    <Button size={'xl'} onClick={sendContract} disabled={isLoading || !draftData}>
                        {isLoading ? "Sending..." : <><IoIosSend className={"size-8"} /> Send Contract</>}
                    </Button>
                </div>
            </div>
            <MainFooter />

            {showConfirmPopup && (
                <Notification
                    title={"Contract Sent Successfully"}
                    message={"The contract has been created and is now pending the helper's review and acceptance."}
                    variant={0}
                    onClose={closeConfirmPopup}
                />
            )}
        </div>
    );
}

export default ContractDetailPage;