import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { Button } from "@/components/Inputer/Button.tsx";
// import { ArrowUpWideNarrow } from "lucide-react"; // Marked as unused
import { Input } from "@/components/Inputer/Input.tsx";
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import HelperCard from "@/components/Card/HelperCard.tsx";
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useEffect, useState, useCallback } from "react";
import BoxInput from "@/components/Inputer/BoxInput.tsx";
// import { supabase } from "@/lib/supabase"; // Marked as unused in this file directly
import { AuthService } from "@/lib/services/AuthService";
import { SearchService, HelperSearchResult, HelperSearchFilters } from "@/lib/services/SearchService";
import { useAuthCt } from "@/lib/auth-context"; // Assuming AuthContext.tsx and useAuth hook
import { useNavigate } from "react-router-dom";

// type UserRole = 'customer' | 'helper' | 'admin'; // Marked as unused

interface FilterOptions {
    locations: { id: string, name: string }[];
    skills: { id: string, name: string, category: string }[];
}

function SearchPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCurrentUserCustomer, setIsCurrentUserCustomer] = useState<boolean>(false);
    const [isLoadingUserRole /*, setIsLoadingUserRole*/] = useState<boolean>(false); // setIsLoadingUserRole marked as unused

    const [helpers, setHelpers] = useState<HelperSearchResult[]>([]);
    const [isLoadingHelpers, setIsLoadingHelpers] = useState<boolean>(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMoreHelpers, setHasMoreHelpers] = useState<boolean>(true);

    const [appliedFilters, setAppliedFilters] = useState<Partial<HelperSearchFilters>>({});
    const [tempFilters, setTempFilters] = useState<Partial<HelperSearchFilters>>({});

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({ locations: [], skills: [] });

    const [defaultJobTime] = useState<string[]>(["Available", "Resigned", "Unavailable"]);
    const [defaultStarRating] = useState<string[]>(['5', '4', '3', '2', '1']);
    const [defaultAgeSection] = useState<string[]>(["18-30", "31-45", "46-60"]);
    const [defaultLevelSelection] = useState<string[]>(["1-5", "6-10", "11-20"]);
    const [defaultSalarySection] = useState<string[]>(["<2000000", "2000000-4000000", "4000000-6000000", ">6000000"]);

    const { userRole, user } = useAuthCt();
    const navigate = useNavigate();

    // useEffect(() => {
    //     const checkUserRole = async () => {
    //         if (user && userRole === null && !AuthService.isLoading) { // Assuming AuthService might have an isLoading state from context
    //             try {
    //                 await AuthService.signOut();
    //                 navigate("/auth/login");
    //             } catch (error) {
    //                 console.error("Error during sign out:", error);
    //             }
    //         }
    //     };
    //     if (!AuthService.isLoading) { // Prevent running if auth service is still initializing
    //         checkUserRole();
    //     }
    // }, [userRole, user, navigate]);

    useEffect(() => {
        setIsCurrentUserCustomer(userRole === 'customer');
    }, [userRole]);

    useEffect(() => {
        SearchService.fetchFilterOptions().then(options => {
            setFilterOptions(options);
        }).catch(error => {
            console.error("Failed to load filter options:", error);
        });
    }, []);

    const loadHelpers = useCallback(async (page = 1, newFilters?: Partial<HelperSearchFilters>) => {
        if (isLoadingUserRole || !isCurrentUserCustomer) {
            if (!isLoadingUserRole && !isCurrentUserCustomer) {
                setHelpers([]);
                setHasMoreHelpers(false);
            }
            return;
        }

        setIsLoadingHelpers(true);
        setSearchError(null);
        const currentFilters = newFilters || appliedFilters;

        try {
            const results = await SearchService.fetchHelpers({
                ...currentFilters,
                name: searchTerm,
                page: page,
                limit: 10
            });

            if (page === 1) {
                setHelpers(results);
            } else {
                setHelpers(prev => [...prev, ...results]);
            }
            setHasMoreHelpers(results.length > 0 && results.length === 10);
            setCurrentPage(page);

        } catch (error: any) {
            setSearchError(error.message || "Could not load helpers.");
            setHasMoreHelpers(false);
        } finally {
            setIsLoadingHelpers(false);
        }
    }, [isLoadingUserRole, isCurrentUserCustomer, appliedFilters, searchTerm]);


    useEffect(() => {
        if (isCurrentUserCustomer) { // Only load helpers if the user is a customer
            loadHelpers(1);
        } else if (!isLoadingUserRole) { // If not customer and role check is done, clear helpers
            setHelpers([]);
            setHasMoreHelpers(false);
        }
    }, [appliedFilters, searchTerm, isCurrentUserCustomer, isLoadingUserRole, loadHelpers]);


    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    function toggleFilterPopup() {
        if (!isFilterOpen) {
            setTempFilters(appliedFilters);
        }
        setIsFilterOpen(!isFilterOpen);
    }

    useEffect(() => {
        if (isFilterOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isFilterOpen]);

    const handleFilterChange = (filterName: keyof HelperSearchFilters, value: any) => {
        setTempFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        setIsFilterOpen(false);
        setCurrentPage(1);
    };

    const handleResetFilters = () => {
        setTempFilters({});
        setAppliedFilters({});
        setIsFilterOpen(false);
        setCurrentPage(1);
    };

    const loadMoreHelpers = () => {
        if (hasMoreHelpers && !isLoadingHelpers) {
            loadHelpers(currentPage + 1);
        }
    };

    const parseRange = (rangeString: string): { min?: number; max?: number } => {
        if (rangeString.includes('-')) {
            const [min, max] = rangeString.split('-').map(s => parseInt(s.match(/\d+/)?.[0] || "0", 10));
            return { min, max };
        } else if (rangeString.startsWith('<')) {
            return { max: parseInt(rangeString.match(/\d+/)?.[0] || "0", 10) - 1 };
        } else if (rangeString.startsWith('>')) {
            return { min: parseInt(rangeString.match(/\d+/)?.[0] || "0", 10) + 1 };
        }
        return {};
    };

    const handleAgeFilterSelect = (selectedAges: string | string[]) => {
        const agesArray = Array.isArray(selectedAges) ? selectedAges : (selectedAges ? [selectedAges] : []);
        if (agesArray.length === 0) {
            handleFilterChange('minAge', undefined);
            handleFilterChange('maxAge', undefined);
            return;
        }
        const firstRange = agesArray[0];
        const { min, max } = parseRange(firstRange.split(" ")[0]);
        handleFilterChange('minAge', min);
        handleFilterChange('maxAge', max);
    };

    const handleLevelFilterSelect = (selectedLevels: string | string[]) => {
        const levelsArray = Array.isArray(selectedLevels) ? selectedLevels : (selectedLevels ? [selectedLevels] : []);
        if (levelsArray.length === 0) {
            handleFilterChange('minLevel', undefined);
            handleFilterChange('maxLevel', undefined);
            return;
        }
        const firstRange = levelsArray[0];
        const { min, max } = parseRange(firstRange.split(" ")[1]);
        handleFilterChange('minLevel', min);
        handleFilterChange('maxLevel', max);
    };

    const handleSalaryFilterSelect = (selectedSalaries: string | string[]) => {
        const salariesArray = Array.isArray(selectedSalaries) ? selectedSalaries : (selectedSalaries ? [selectedSalaries] : []);
        if (salariesArray.length === 0) {
            handleFilterChange('minSalary', undefined);
            handleFilterChange('maxSalary', undefined);
            return;
        }
        const firstRange = salariesArray[0];
        const cleanedRange = firstRange.replace(/Rp| Million| /g, '');
        const { min, max } = parseRange(cleanedRange);
        handleFilterChange('minSalary', min ? min * 1000000 : undefined);
        handleFilterChange('maxSalary', max ? max * 1000000 : undefined);
    };


    if (isLoadingUserRole && !user) {
        return (
            <div className="min-w-full max-w-screen h-screen cursor-default">
                <NavigationBar />
                <div className="flex flex-1 justify-center items-center h-full pt-40">Loading user data...</div>
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
                                placeholder={"Search Helper Name"}
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                            />
                            <CiSearch className={"absolute text-gray-500 right-3 top-1/2 -translate-y-1/2"} size={20} />
                        </div>
                        <Button className={"flex flex-row gap-2 items-center justify-center"} onClick={toggleFilterPopup}>
                            <FaFilter size={14} />
                            <p>Filter</p>
                        </Button>
                    </div>
                </div>

                {!isCurrentUserCustomer && !isLoadingUserRole && (
                    <div className="text-center py-10 text-gray-600 flex-grow flex items-center justify-center">
                        <p>Helper search is available for customers. Please log in or register as a customer to find helpers.</p>
                    </div>
                )}

                {isCurrentUserCustomer && (
                    <>
                        {isLoadingHelpers && helpers.length === 0 && <div className="text-center py-10 flex-grow flex items-center justify-center">Loading helpers...</div>}
                        {searchError && <div className="text-center py-10 text-red-500 flex-grow flex items-center justify-center">Error: {searchError}</div>}
                        {!isLoadingHelpers && helpers.length === 0 && !searchError && (
                            <div className="text-center py-10 text-gray-500 flex-grow flex items-center justify-center">No helpers found matching your criteria.</div>
                        )}

                        <div className={"overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5 md:gap-6 scrollbar-hide pb-10"}>
                            {helpers.map((helper) => (
                                <HelperCard key={helper.id} helper={helper} />
                            ))}
                            {isLoadingHelpers && helpers.length > 0 && <div className="col-span-full text-center py-5">Loading more...</div>}
                        </div>
                        {hasMoreHelpers && !isLoadingHelpers && helpers.length > 0 && (
                            <div className="flex justify-center mt-4 mb-8">
                                <Button onClick={loadMoreHelpers} color="white" className="border border-gray-300">
                                    Load More Helpers
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {isFilterOpen && (
                    <div className={"fixed inset-0 left-0 top-0 w-full h-full z-50 text-[#492924] overflow-hidden"}
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                        onClick={toggleFilterPopup}
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`fixed left-0 top-0 w-full max-w-md sm:max-w-lg md:max-w-xl h-full flex flex-col justify-start bg-white shadow-2xl`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`flex flex-row gap-4 p-4 md:p-6 items-center text-white ${isCurrentUserCustomer ? 'bg-[#EE7C9E]' : 'bg-[#996052]'}`}>
                                <button className="cursor-pointer" onClick={toggleFilterPopup}>
                                    <IoClose size={28} />
                                </button>
                                <h2 className="text-lg font-semibold">Filter Options</h2>
                            </div>
                            <div className={'flex-grow flex flex-col gap-5 px-4 md:px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'}>
                                <div className={"flex flex-col gap-2"}>
                                    <label htmlFor="availableFrom" className="font-medium">Available From</label>
                                    <Input
                                        id="availableFrom"
                                        type={"date"}
                                        color={'cream'}
                                        value={tempFilters.availableFrom || ''}
                                        onChange={(e) => handleFilterChange('availableFrom', e.target.value)}
                                    />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Contract Status</p>
                                    <BoxInput
                                        list={defaultJobTime}
                                        choosenItem={tempFilters.contractStatus || ""}
                                        onlyOne={(selected) => handleFilterChange('contractStatus', selected || undefined)}
                                        multiple={false}
                                        isFilter={true}
                                    />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Main Skills</p>
                                    <BoxInput
                                        list={filterOptions.skills.map(s => s.name)}
                                        choosenItem={tempFilters.skills?.map(id => filterOptions.skills.find(s => s.id === id)?.name).filter(Boolean) as string[] || []}
                                        //multipleAns={(selectedNames) => handleFilterChange('skills', selectedNames.map(name => filterOptions.skills.find(s => s.name === name)?.id).filter(Boolean))}
                                        multiple={true}
                                        isFilter={true}
                                    />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Location</p>
                                    <select
                                        value={tempFilters.locationId || ''}
                                        onChange={(e) => handleFilterChange('locationId', e.target.value || undefined)}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-pink-500 focus:border-pink-500"
                                    >
                                        <option value="">All Locations</option>
                                        {filterOptions.locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Minimum Rating</p>
                                    <BoxInput
                                        list={defaultStarRating}
                                        choosenItem={tempFilters.minRating ? String(tempFilters.minRating) : ""}
                                        onlyOne={(selected) => handleFilterChange('minRating', selected ? parseInt(selected) : undefined)}
                                        multiple={false}
                                        isFilter={true}
                                    />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Age</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min Age" type="number" color={'cream'} value={tempFilters.minAge || ''} onChange={(e) => handleFilterChange('minAge', e.target.value ? parseInt(e.target.value) : undefined)} />
                                        <Input placeholder="Max Age" type="number" color={'cream'} value={tempFilters.maxAge || ''} onChange={(e) => handleFilterChange('maxAge', e.target.value ? parseInt(e.target.value) : undefined)} />
                                    </div>
                                    <BoxInput list={defaultAgeSection} onlyOne={handleAgeFilterSelect} isFilter={true} multiple={false} />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Helper Level</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min Level" type="number" color={'cream'} value={tempFilters.minLevel || ''} onChange={(e) => handleFilterChange('minLevel', e.target.value ? parseInt(e.target.value) : undefined)} />
                                        <Input placeholder="Max Level" type="number" color={'cream'} value={tempFilters.maxLevel || ''} onChange={(e) => handleFilterChange('maxLevel', e.target.value ? parseInt(e.target.value) : undefined)} />
                                    </div>
                                    <BoxInput list={defaultLevelSelection} onlyOne={handleLevelFilterSelect} isFilter={true} multiple={false} />
                                </div>
                                <div className={"flex flex-col gap-2"}>
                                    <p className="font-medium">Salary Expectation (per month)</p>
                                    <div className={'flex flex-row gap-2'}>
                                        <Input placeholder="Min Salary" type="number" step="100000" color={'cream'} value={tempFilters.minSalary || ''} onChange={(e) => handleFilterChange('minSalary', e.target.value ? parseInt(e.target.value) : undefined)} />
                                        <Input placeholder="Max Salary" type="number" step="100000" color={'cream'} value={tempFilters.maxSalary || ''} onChange={(e) => handleFilterChange('maxSalary', e.target.value ? parseInt(e.target.value) : undefined)} />
                                    </div>
                                    <BoxInput list={defaultSalarySection} onlyOne={handleSalaryFilterSelect} isFilter={true} multiple={false} />
                                </div>
                            </div>
                            <div className={'flex flex-row items-center gap-3 md:gap-5 justify-end border-t-2 border-gray-200 p-4 md:p-6 sticky bottom-0 bg-white'}>
                                <Button className={'w-1/2 md:w-auto px-6'} color={'white'} onClick={handleResetFilters}>Reset</Button>
                                <Button className={'w-1/2 md:w-auto px-6'} onClick={handleApplyFilters}>Apply Filters</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
            <MainFooter />
        </div>
    );
}

export default SearchPage;