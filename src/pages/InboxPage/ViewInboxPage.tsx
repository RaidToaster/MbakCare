// src/pages/InboxPage/ViewInboxPage.tsx
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import InboxCard from "@/components/Card/InboxCard.tsx";
import { useEffect, useState } from "react";
import { ContractService, BasicContractInfo } from "@/lib/services/ContractService.ts";
import { useAuthCt } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

function ViewInboxPage() {
    const { userRole, isLoading: authIsLoading } = useAuthCt();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [pendingContracts, setPendingContracts] = useState<BasicContractInfo[]>([]);
    const [isLoadingContracts, setIsLoadingContracts] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (data?.user) {
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        });
    }, []);

    useEffect(() => {
        if (currentUser && userRole === 'helper' && !authIsLoading) {
            setIsLoadingContracts(true);
            setError(null);
            ContractService.getPendingContractsForHelper(currentUser.id)
                .then(data => {
                    setPendingContracts(data);
                })
                .catch(err => {
                    console.error("Failed to fetch pending contracts:", err);
                    setError("Could not load your contract proposals.");
                })
                .finally(() => {
                    setIsLoadingContracts(false);
                });
        } else if (!authIsLoading && userRole !== 'helper') {
            // Handle non-helper users or show appropriate message
            setPendingContracts([]);
            setIsLoadingContracts(false);
        } else if (!authIsLoading && !currentUser) {
            setIsLoadingContracts(false); // No user logged in
        }
    }, [currentUser, userRole, authIsLoading]);

    if (authIsLoading || isLoadingContracts) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className={"flex justify-center items-center w-full h-full px-8 lg:px-64 py-8 pt-40 text-[#492924]"}>
                    Loading inbox...
                </div>
            </div>
        );
    }

    if (!currentUser || userRole !== 'helper') {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924] items-center"}>
                    <h1 className={"font-bold text-4xl text-center"}>Inbox</h1>
                    <p>This inbox is for helpers to review contract proposals.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative mb-4">
                    <h1 className={"font-bold text-3xl sm:text-4xl text-center"}>Contract Proposals</h1>
                    <div className="w-48 sm:w-64 h-0.5 bg-[#DA807B] mt-1 rounded-md"></div>
                </div>
                {error && <div className="text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</div>}
                <div className={"flex flex-col gap-3 md:gap-4 w-full"}>
                    {pendingContracts.length > 0 ? (
                        pendingContracts.map((contract) => (
                            <InboxCard key={contract.id} contract={contract} />
                        ))
                    ) : (
                        !isLoadingContracts && <p className="text-center text-gray-500">You have no pending contract proposals at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ViewInboxPage;