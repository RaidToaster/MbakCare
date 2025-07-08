import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";
import { Button } from "@/components/Inputer/Button.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { useState, useEffect } from "react";
import Notification from "@/components/InfoComponent/Notification.tsx";
import { ContractService, ContractDetails } from "@/lib/services/ContractService.ts";
import { useAuthCt } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { NotificationService } from "@/lib/services/NotificationService";

function InboxDetailPage() {
    const navigate = useNavigate();
    const { id: contractId } = useParams<{ id: string }>();
    const location = useLocation();
    const { userRole } = useAuthCt();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (data?.user) {
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    const [contractDetails, setContractDetails] = useState<ContractDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [showConfirmPopup, setShowConfirmPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    const [isHelperAvailable, setIsHelperAvailable] = useState(true);

    useEffect(() => {
        if (!contractId) {
            setError("Contract ID is missing.");
            setIsLoading(false);
            return;
        }
        const fetchContract = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const details = await ContractService.getContractDetailsById(contractId);
                if (!details) {
                    setError("Contract not found or you do not have permission to view it.");
                } else if (userRole === 'helper' && details.helper_id !== currentUser?.id) {
                    setError("You do not have permission to view this contract.");
                    setContractDetails(null);
                }
                else {
                    setContractDetails(details);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load contract details.");
            } finally {
                setIsLoading(false);
            }
        };
        if (currentUser) {
            fetchContract();
            if (userRole === 'helper') {
                ContractService.isHelperAvailable(currentUser.id).then(setIsHelperAvailable);
            }
        }
    }, [contractId, currentUser, userRole]);

    function backTrack() {
        navigate('/inbox/view');
    }

    const handleContractAction = async (action: 'Active' | 'Declined') => {
        if (!contractDetails || !currentUser) return;
        setIsProcessingAction(true);
        setActionError(null);
        try {
            const mappedStatus: 'Active' | 'Terminated' = action === 'Declined' ? 'Terminated' : 'Active';
            const { error: updateError } = await ContractService.updateContractStatus(contractDetails.id, mappedStatus);
            if (updateError) throw updateError;

            // Mark the notification as read
            await NotificationService.markContractNotificationAsRead(contractDetails.id, currentUser.id);

            setPopupMessage(`Contract successfully ${action === 'Active' ? 'accepted' : 'declined'}.`);
            setShowConfirmPopup(true);

            if (contractDetails) setContractDetails({ ...contractDetails, status: mappedStatus });
        } catch (err: any) {
            setActionError(`Failed to ${action === 'Active' ? 'accept' : 'decline'} contract: ${err.message}`);
        } finally {
            setIsProcessingAction(false);
        }
    };

    function closeConfirmPopup() {
        setShowConfirmPopup(false);
        navigate("/inbox/view");
    }

    if (isLoading) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex justify-center items-center h-full pt-40 text-[#492924]">Loading contract...</div>
                <MainFooter />
            </div>
        );
    }

    if (error) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-col justify-center items-center h-full pt-40 text-red-500">
                    <p>{error}</p>
                    <Button onClick={backTrack} className="mt-4">Back to Inbox</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    if (!contractDetails) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-col justify-center items-center h-full pt-40 text-[#492924]">
                    <p>Contract details could not be loaded.</p>
                    <Button onClick={backTrack} className="mt-4">Back to Inbox</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="w-full flex justify-start relative mb-0 lg:mb-4">
                    <TbArrowBackUp className={"cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block"} size={window.innerWidth < 768 ? 32 : 40} onClick={backTrack} />
                    <TbArrowBackUp className={"cursor-pointer absolute left-0 top-[-20px] lg:hidden"} size={32} onClick={backTrack} />
                </div>
                <div className="flex flex-col justify-center relative bg-[#F7F8F1] rounded-md p-6 sm:p-8 md:p-10 lg:p-14 gap-5 w-full text-justify shadow-md">
                    <h1 className={"text-2xl sm:text-3xl mb-6 sm:m-10 text-center font-bold"}>Contract Proposal Review</h1>
                    <p className="text-sm sm:text-base">
                        Contract No: {contractDetails.id || "N/A"}<br />
                        Proposed on: {new Date(contractDetails.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <div className={"flex flex-col gap-4 lg:flex-row items-start lg:items-start justify-between w-full text-sm sm:text-base"}>
                        <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                            <b>Proposed By (Customer):</b><br />
                            <b>Name:</b> {contractDetails.customer_name || "N/A"}<br />
                        </div>
                        <div className="w-full lg:w-1/2">
                            <b>For (Helper):</b><br />
                            <b>Name:</b> {contractDetails.helper_name || "N/A"}<br />
                        </div>
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-4"}>
                        <p className={"font-bold text-base sm:text-lg"}>1. Main Duties and Responsibilities</p>
                        {contractDetails.tasks && contractDetails.tasks.length > 0 ? (
                            contractDetails.tasks.map((task, i) => (
                                <p className={"pl-4 text-sm sm:text-base"} key={i}> {task.task_type}</p>
                            ))
                        ) : <p className="pl-4 text-sm text-gray-500">No main duties specified.</p>}
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>2. Contract Duration</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            Proposed duration: {contractDetails.duration_months} months, from {new Date(contractDetails.start_date).toLocaleDateString('en-GB')} to {new Date(contractDetails.end_date).toLocaleDateString('en-GB')}.
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>3. Accommodation</p>
                        <p className={"pl-4 text-sm sm:text-base"}>
                            {/* This needs to be part of contractDetails if dynamic */}
                            Accommodation: To be discussed or as per standard agreement.
                        </p>
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>4. Additional Facilities Offered</p>
                        {contractDetails.facilities && contractDetails.facilities.length > 0 ? (
                            contractDetails.facilities.map((facility, i) => (
                                <p className={"pl-4 text-sm sm:text-base"} key={i}> {facility}</p>
                            ))
                        ) : <p className="pl-4 text-sm text-gray-500">No additional facilities specified.</p>}
                    </div>
                    <div className={"flex flex-col gap-1.5 mt-3"}>
                        <p className={"font-bold text-base sm:text-lg"}>5. Proposed Salary</p>
                        {/* <p className={"pl-4 text-sm sm:text-base"}>
                            Proposed monthly salary: <b>Rp{contractDetails.agreed_salary?.toLocaleString('id-ID') || "5,600,000"},00</b> (Example - this should be from contract data).
                        </p> */}
                        <p className={"pl-4 text-sm sm:text-base"}>
                            Proposed monthly salary: <b>Rp5,600,000,00</b> (Dummy Value).
                        </p>
                    </div>
                    <p className="mt-4 text-xs text-gray-600">Standard clauses regarding additional tasks, dispute resolution, rights, and responsibilities apply as per MbakCare platform terms.</p>
                </div>

                {actionError && <div className="text-center text-red-500 bg-red-100 p-3 rounded-md my-4">{actionError}</div>}

                {userRole === 'helper' && contractDetails.status === 'Pending' && (
                    <div className={"flex flex-col sm:flex-row justify-center items-center gap-4 mt-6"}>
                        {!isHelperAvailable && (
                            <p className="text-center text-red-500 font-semibold">
                                You cannot accept a new contract while you are in an active one.
                            </p>
                        )}
                        <Button size={'xl'} color="pink" onClick={() => handleContractAction('Active')} disabled={isProcessingAction || !isHelperAvailable}>
                            {isProcessingAction ? "Processing..." : "Accept Contract"}
                        </Button>
                        <Button size={'xl'} color="white" onClick={() => handleContractAction('Declined')} disabled={isProcessingAction}>
                            {isProcessingAction ? "Processing..." : "Decline Contract"}
                        </Button>
                    </div>
                )}
                {contractDetails.status !== 'Pending' && (
                    <div className="text-center text-lg font-semibold mt-6">Contract Status: {contractDetails.status}</div>
                )}
            </div>
            <MainFooter />

            {showConfirmPopup && (
                <Notification
                    title={"Action Successful"}
                    message={popupMessage}
                    variant={0}
                    onClose={closeConfirmPopup}
                />
            )}
        </div>
    );
}

export default InboxDetailPage;