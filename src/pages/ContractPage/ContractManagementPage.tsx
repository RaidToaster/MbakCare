import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ContractService, ContractDetails } from "@/lib/services/ContractService";
import { Button } from "@/components/Inputer/Button";
import { TbArrowBackUp } from "react-icons/tb";
import { FaCalendarAlt, FaUser, FaExclamationTriangle } from "react-icons/fa";
import Notification from "@/components/InfoComponent/Notification";
import { useAuthCt } from "@/lib/auth-context.tsx";

function ContractManagementPage() {
    const navigate = useNavigate();
    const { user, userRole } = useAuthCt();
    const [activeContract, setActiveContract] = useState<ContractDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [isTerminating, setIsTerminating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchActiveContract();
    }, [user, userRole]);

    async function fetchActiveContract() {
        if (!user || !userRole) {
            setIsLoading(false);
            return;
        }

        // Only fetch for customer or helper roles
        if (userRole !== 'customer' && userRole !== 'helper') {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const contract = await ContractService.getActiveContractForUser(user.id, userRole as 'customer' | 'helper');
            setActiveContract(contract);
        } catch (error) {
            console.error("Error fetching active contract:", error);
            setError("Failed to fetch active contract");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleTerminateContract() {
        if (!activeContract || !user || userRole !== 'customer') {
            setError("Only customers can terminate contracts");
            return;
        }

        try {
            setIsTerminating(true);
            setError(null);

            const { data, error: terminateError } = await ContractService.updateContractStatus(
                activeContract.id,
                'Terminated'
            );

            if (terminateError) {
                throw terminateError;
            }

            setSuccessMessage("Contract terminated successfully");
            setActiveContract(null);
            setShowTerminateModal(false);

            // Refresh the contract data after a delay
            setTimeout(() => {
                fetchActiveContract();
                setSuccessMessage(null);
            }, 3000);

        } catch (error: any) {
            console.error("Error terminating contract:", error);
            setError(error.message || "Failed to terminate contract");
        } finally {
            setIsTerminating(false);
        }
    }

    function formatDate(dateString: string) {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    function calculateRemainingDays(endDate: string) {
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Contract has ended";
        if (diffDays === 0) return "Ends today";
        if (diffDays === 1) return "1 day remaining";
        return `${diffDays} days remaining`;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen min-w-full max-w-screen h-full">
                <NavigationBar />
                <div className="flex justify-center items-center h-full pt-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EE7C9E]"></div>
                </div>
                <MainFooter />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen min-w-full max-w-screen h-full">
                <NavigationBar />
                <div className="flex flex-col items-center justify-center h-full pt-40 px-4">
                    <div className="text-center max-w-md">
                        <div className="text-6xl mb-4">🔒</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-6">
                            Please log in to view your contracts and manage your active agreements.
                        </p>
                        <Button onClick={() => navigate('/auth/login')}>
                            Go to Login
                        </Button>
                    </div>
                </div>
                <MainFooter />
            </div>
        );
    }

    return (
        <div className="min-h-screen min-w-full max-w-screen h-full">
            <NavigationBar />
            <div className="flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]">
                <div className="w-full flex justify-start relative mb-4">
                    <TbArrowBackUp
                        className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block"
                        size={40}
                        onClick={() => navigate(-1)}
                    />
                    <TbArrowBackUp
                        className="cursor-pointer absolute left-0 top-[-20px] lg:hidden"
                        size={32}
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="text-2xl sm:text-3xl font-bold text-center w-full">Contract Management</h1>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {successMessage && (
                    <Notification
                        title="Success"
                        message={successMessage}
                        variant={0}
                        onClose={() => setSuccessMessage(null)}
                    />
                )}

                {!activeContract ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Active Contract</h2>
                            <p className="text-gray-500 mb-6">
                                {userRole === 'customer'
                                    ? "You don't have any active contracts at the moment."
                                    : "You are not currently assigned to any active contract."
                                }
                            </p>
                            {userRole === 'customer' && (
                                <Button onClick={() => navigate('/search')}>
                                    Find a Helper
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#F7F8F1] rounded-lg p-6 shadow-md">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Active Contract Details</h2>
                                <p className="text-sm text-gray-600">
                                    Contract #{activeContract.contract_number || activeContract.id.substring(0, 8)}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
                                    {activeContract.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <FaUser className="text-[#EE7C9E] mr-2" />
                                    <h3 className="font-semibold">Customer</h3>
                                </div>
                                <p className="text-lg">{activeContract.customer_name}</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <FaUser className="text-[#EE7C9E] mr-2" />
                                    <h3 className="font-semibold">Helper</h3>
                                </div>
                                <p className="text-lg">{activeContract.helper_name}</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <FaCalendarAlt className="text-[#EE7C9E] mr-2" />
                                    <h3 className="font-semibold">Start Date</h3>
                                </div>
                                <p>{formatDate(activeContract.start_date)}</p>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center mb-2">
                                    <FaCalendarAlt className="text-[#EE7C9E] mr-2" />
                                    <h3 className="font-semibold">End Date</h3>
                                </div>
                                <p>{formatDate(activeContract.end_date)}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {calculateRemainingDays(activeContract.end_date)}
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-3">Contract Tasks</h3>
                            <div className="bg-white p-4 rounded-lg shadow">
                                {activeContract.tasks.map((task, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                        <span>{task.skill_name}</span>
                                        <span className="text-sm text-gray-600">{task.task_type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {activeContract.facilities && activeContract.facilities.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold mb-3">Provided Facilities</h3>
                                <div className="bg-white p-4 rounded-lg shadow">
                                    {activeContract.facilities.map((facility, index) => (
                                        <div key={index} className="py-1">
                                            • {facility}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t">
                            {userRole === 'customer' && (
                                <div className="flex justify-end">
                                    <Button
                                        variant="destructive"
                                        onClick={() => setShowTerminateModal(true)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        <FaExclamationTriangle className="mr-2" />
                                        Terminate Contract
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <MainFooter />

            {/* Termination Confirmation Modal */}
            {showTerminateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-200 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <FaExclamationTriangle className="text-red-500 text-2xl mr-3" />
                            <h3 className="text-xl font-bold">Confirm Contract Termination</h3>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to terminate this contract? This action cannot be undone.
                            Both you and the helper will be notified about the termination.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowTerminateModal(false)}
                                disabled={isTerminating}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleTerminateContract}
                                disabled={isTerminating}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {isTerminating ? "Terminating..." : "Terminate Contract"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContractManagementPage;