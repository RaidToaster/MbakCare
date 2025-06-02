import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { Button } from "@/components/Inputer/Button.tsx";
import { Input } from "@/components/Inputer/Input.tsx";
import { CiSearch } from "react-icons/ci";
// import { FaFilter } from "react-icons/fa"; 
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
// import { motion } from "framer-motion"; 
// import { IoClose } from "react-icons/io5"; 
import { useEffect, useState, useCallback } from "react";
// import BoxInput from "@/components/Inputer/BoxInput.tsx"; 
// import { AuthService } from "@/lib/services/AuthService"; 
import { SearchService, CustomerSearchResult, CustomerSearchFilters } from "@/lib/services/SearchService";
import { useAuthCt } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import CustomerCard from "@/components/Card/CustomerCard";
import { supabase } from "@/lib/supabase";

function SearchCustomerPage() {
    // const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCurrentUserHelper, setIsCurrentUserHelper] = useState<boolean>(false);
    const [isLoadingUserRole, setIsLoadingUserRole] = useState<boolean>(true);

    const [customers, setCustomers] = useState<CustomerSearchResult[]>([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMoreCustomers, setHasMoreCustomers] = useState<boolean>(true);

    const [appliedFilters, setAppliedFilters] = useState<Partial<CustomerSearchFilters>>({});
    // const [tempFilters, setTempFilters] = useState<Partial<CustomerSearchFilters>>({});

    const { userRole, isLoading: isAuthContextLoading } = useAuthCt();
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!isAuthContextLoading) {
            setIsLoadingUserRole(false);
            setIsCurrentUserHelper(userRole === 'helper');
            if (user && userRole === null) {

            }
        }
    }, [userRole, user, isAuthContextLoading, navigate]);


    const loadCustomers = useCallback(async (page = 1, newFilters?: Partial<CustomerSearchFilters>) => {
        if (isLoadingUserRole || !isCurrentUserHelper) {
            if (!isLoadingUserRole && !isCurrentUserHelper) {
                setCustomers([]);
                setHasMoreCustomers(false);
            }
            return;
        }

        setIsLoadingCustomers(true);
        setSearchError(null);
        const currentFilters = newFilters || appliedFilters;

        try {
            const results = await SearchService.fetchCustomers({
                ...currentFilters,
                name: searchTerm,
                page: page,
                limit: 10
            });

            if (page === 1) {
                setCustomers(results);
            } else {
                setCustomers(prev => [...prev, ...results]);
            }
            setHasMoreCustomers(results.length > 0 && results.length === 10);
            setCurrentPage(page);

        } catch (error: any) {
            setSearchError(error.message || "Could not load customers.");
            setHasMoreCustomers(false);
        } finally {
            setIsLoadingCustomers(false);
        }
    }, [isLoadingUserRole, isCurrentUserHelper, appliedFilters, searchTerm]);


    useEffect(() => {
        if (isCurrentUserHelper && !isLoadingUserRole) {
            loadCustomers(1);
        } else if (!isLoadingUserRole && !isCurrentUserHelper) {
            setCustomers([]);
            setHasMoreCustomers(false);
        }
    }, [appliedFilters, searchTerm, isCurrentUserHelper, isLoadingUserRole, loadCustomers]);


    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const loadMoreCustomers = () => {
        if (hasMoreCustomers && !isLoadingCustomers) {
            loadCustomers(currentPage + 1);
        }
    };

    if (isLoadingUserRole || (isAuthContextLoading && !user)) {
        return (
            <div className="min-w-full max-w-screen h-screen cursor-default">
                <NavigationBar />
                <div className="flex justify-center items-center h-full pt-40">Loading user data...</div>
                <MainFooter />
            </div>
        );
    }

    return (
        <div className={"min-w-full max-w-screen h-screen cursor-default"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 md:px-8 lg:px-16 xl:px-32 py-8 pt-28 md:pt-32 lg:pt-40 gap-6 md:gap-8 overflow-hidden relative"}>
                <div className={"flex flex-col gap-4 lg:flex-row justify-between items-center"}>
                    <div className={"flex flex-col md:flex-row gap-3 md:gap-4 w-full lg:w-auto"}>
                        <div className={"flex flex-row relative items-center w-full md:max-w-xs lg:max-w-md bg-[#F7F8F1] rounded-md shadow-sm"}>
                            <Input
                                color={'cream'}
                                serial={'search'}
                                placeholder={"Search Customer Name"}
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                className="pr-10"
                            />
                            <CiSearch className={"absolute text-gray-500 right-3 top-1/2 -translate-y-1/2"} size={20} />
                        </div>
                        {/* Filter button removed for now */}
                        {/* <Button className={"flex flex-row gap-2 items-center justify-center"} onClick={toggleFilterPopup}>
                            <FaFilter size={14} />
                            <p>Filter</p>
                        </Button> */}
                    </div>
                </div>

                {!isCurrentUserHelper && !isLoadingUserRole && (
                    <div className="text-center py-10 text-gray-600 flex-grow flex items-center justify-center">
                        <p>Customer search is available for helpers. Please log in or register as a helper to find job opportunities.</p>
                    </div>
                )}

                {isCurrentUserHelper && (
                    <>
                        {isLoadingCustomers && customers.length === 0 && <div className="text-center py-10 flex-grow flex items-center justify-center">Loading customers...</div>}
                        {searchError && <div className="text-center py-10 text-red-500 flex-grow flex items-center justify-center">Error: {searchError}</div>}
                        {!isLoadingCustomers && customers.length === 0 && !searchError && (
                            <div className="text-center py-10 text-gray-500 flex-grow flex items-center justify-center">No customers found matching your criteria.</div>
                        )}

                        {customers.length > 0 && (
                            <div className={"overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 md:gap-6 scrollbar-hide pb-10"}>
                                {customers.map((customer) => (
                                    <CustomerCard key={customer.id} customer={customer} />
                                ))}
                            </div>
                        )}
                        {isLoadingCustomers && customers.length > 0 && <div className="col-span-full text-center py-5">Loading more...</div>}
                        {hasMoreCustomers && !isLoadingCustomers && customers.length > 0 && (
                            <div className="flex justify-center py-4">
                                <Button onClick={loadMoreCustomers} color="white" className="border border-gray-300">
                                    Load More Customers
                                </Button>
                            </div>
                        )}
                    </>
                )}
                {/* Filter Drawer functionality removed for now */}
            </div>
            <MainFooter />
        </div>
    );
}

export default SearchCustomerPage;