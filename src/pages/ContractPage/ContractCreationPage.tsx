// src/pages/ContractPage/ContractCreationPage.tsx
import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import { TbArrowBackUp, TbContract } from "react-icons/tb";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ContractQuestionCard from "@/components/Card/ContractQuestionCard.tsx";
import { Button } from "@/components/Inputer/Button.tsx";
import { useAuthCt } from "@/lib/auth-context";
import { SearchService } from "@/lib/services/SearchService.ts";
import { supabase } from "@/lib/supabase.ts";

interface SkillOption { id: string; name: string; }
interface FacilityOption { id: string; name: string; }

export interface ContractDraftData {
    helperId: string | null;
    helperName?: string; // Optional: Fetch and pass for display
    customerName?: string; // Optional: Fetch and pass for display
    customerId?: string;
    numMainTasks: string;
    selectedMainTaskIds: string[];
    selectedMainTaskNames: string[];
    providesHousing: string;
    selectedFacilityIds: string[];
    selectedFacilityNames: string[];
    selectedDuration: string;
}

function ContractCreationPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole: currentUserRole } = useAuthCt();
    const [currentUser, setCurrentUser] = useState<any>(null);

    const [helperId, setHelperId] = useState<string | null>(null);
    const [helperName, setHelperName] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setCurrentUser(data.user);
            } else {
                setCurrentUser(null);
            }
        };
        fetchCurrentUser();
    }, []);
    const [numMainTasks, setNumMainTasks] = useState("1");
    const [selectedMainTaskIds, setSelectedMainTaskIds] = useState<string[]>([]);
    const [providesHousing, setProvidesHousing] = useState<string>("Yes");
    const [selectedFacilityIds, setSelectedFacilityIds] = useState<string[]>([]);
    const [selectedDuration, setSelectedDuration] = useState<string>("1 Year");
    const [skillOptions, setSkillOptions] = useState<SkillOption[]>([]);
    const [facilityOptions, setFacilityOptions] = useState<FacilityOption[]>([]);
    const [formError, setFormError] = useState<string | null>(null);

    const defaultDurationOptions = ["6 Months", "1 Year", "2 Years"];
    const confirmChoices = ["Yes", "No"];

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const hId = queryParams.get('helperId');
        if (hId) {
            setHelperId(hId);
            const fetchHelperName = async () => {
                const { data } = await supabase.from('users').select('name').eq('id', hId).single();
                if (data) setHelperName(data.name || undefined);
            };
            fetchHelperName();
        } else {
            console.warn("Helper ID is missing from query params.");
            setFormError("Helper information is required to create a contract.");
        }

        SearchService.fetchFilterOptions().then(options => {
            setSkillOptions(options.skills.map(s => ({ id: s.id, name: s.name })));
        });

        const fetchFacilities = async () => {
            const { data, error: err } = await supabase.from('facilities').select('id, name');
            if (err) console.error("Error fetching facilities", err);
            else setFacilityOptions(data || []);
        };
        fetchFacilities();
    }, [location.search]);

    function backTrack() {
        navigate(-1);
    }

    const handleNumTasksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, "");
        const numValue = parseInt(onlyNums);
        if (onlyNums === "" || (numValue >= 0 && numValue <= 10)) {
            setNumMainTasks(onlyNums);
            if (selectedMainTaskIds.length > numValue && onlyNums !== "") {
                setSelectedMainTaskIds(prev => prev.slice(0, numValue));
            }
        }
    };

    const handleGenerateContract = () => {
        setFormError(null);
        if (!currentUser || currentUserRole !== 'customer') {
            setFormError("Only customers can generate contracts.");
            return;
        }
        if (!helperId) {
            setFormError("Helper information is missing.");
            return;
        }
        const numTasksValue = parseInt(numMainTasks || "0");
        if (numTasksValue > 0 && selectedMainTaskIds.length !== numTasksValue) {
            setFormError(`Please select exactly ${numMainTasks} main tasks for the contract.`);
            return;
        }
        if (numTasksValue === 0 && selectedMainTaskIds.length > 0) {
            setFormError(`Number of tasks is 0, but tasks are selected. Please clear selected tasks or increase task count.`);
            return;
        }


        const selectedMainTaskNames = selectedMainTaskIds
            .map(id => skillOptions.find(s => s.id === id)?.name)
            .filter(Boolean) as string[];

        const selectedFacilityNames = selectedFacilityIds
            .map(id => facilityOptions.find(f => f.id === id)?.name)
            .filter(Boolean) as string[];

        const draftData: ContractDraftData = {
            helperId,
            helperName,
            customerId: currentUser.id,
            customerName: (currentUser.user_metadata?.name || currentUser.email) as string,
            numMainTasks,
            selectedMainTaskIds,
            selectedMainTaskNames,
            providesHousing,
            selectedFacilityIds,
            selectedFacilityNames,
            selectedDuration,
        };
        navigate('/contract/detail', { state: { contractDraft: draftData } });
    };

    const handleMainTaskSelection = (selectedTaskNames: string[]): string[] => {
        const numTasksValue = parseInt(numMainTasks || "0");
        let newSelectedIds = selectedTaskNames
            .map(name => skillOptions.find(s => s.name === name)?.id)
            .filter(Boolean) as string[];

        if (newSelectedIds.length > numTasksValue && numTasksValue > 0) {
            newSelectedIds = newSelectedIds.slice(0, numTasksValue);
            setFormError(`You can only select up to ${numMainTasks} tasks.`);
        }
        setSelectedMainTaskIds(newSelectedIds);
        return newSelectedIds.map(id => skillOptions.find(s => s.id === id)?.name).filter(Boolean) as string[];
    };

    const handleHousingSelection = (selection: string) => {
        setProvidesHousing(selection);
    };

    const handleFacilitySelection = (selectedFacilityNames: string[]): string[] => {
        const newSelectedIds = selectedFacilityNames
            .map(name => facilityOptions.find(f => f.name === name)?.id)
            .filter(Boolean) as string[];
        setSelectedFacilityIds(newSelectedIds);
        return newSelectedIds.map(id => facilityOptions.find(f => f.id === id)?.name).filter(Boolean) as string[];
    };

    const handleDurationSelection = (selection: string) => {
        setSelectedDuration(selection);
    };

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative mb-4">
                    <TbArrowBackUp className={"cursor-pointer absolute left-0 top-1/2 -translate-y-1/2"} size={window.innerWidth < 768 ? 32 : 40} onClick={backTrack} />
                    <h1 className={"font-bold text-2xl sm:text-3xl md:text-4xl text-center"}>Contract Questions</h1>
                    <div className="w-48 sm:w-64 h-0.5 bg-[#DA807B] mt-1 rounded-md"></div>
                </div>

                {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center mb-4">{formError}</div>}

                <div className={"flex flex-col gap-6 w-full"}>
                    <div className={"bg-[#FFF2F3] px-6 sm:px-8 md:px-12 py-6 sm:py-8 rounded-md shadow-lg"}>
                        <p className="mb-2 text-sm sm:text-base">How many main tasks do you want to assign? (0-10)</p>
                        <input
                            type={"text"}
                            className={"border-[#492924] border-b-2 w-12 sm:w-16 text-center focus:outline-none focus:border-pink-500 bg-transparent text-sm sm:text-base"}
                            inputMode="numeric"
                            onChange={handleNumTasksChange}
                            pattern="[0-9]*"
                            maxLength={2}
                            value={numMainTasks}
                        />
                    </div>

                    <ContractQuestionCard
                        question={"Select the main tasks you want to assign:"}
                        list={skillOptions.map(s => s.name)}
                        choosenItem={selectedMainTaskIds.map(id => skillOptions.find(s => s.id === id)?.name).filter(Boolean) as string[]}
                        multipleAns={handleMainTaskSelection}
                        multiple={true}
                    />
                    <ContractQuestionCard
                        question={"Are you willing to provide housing accommodation:"}
                        list={confirmChoices}
                        choosenItem={providesHousing}
                        onlyOne={handleHousingSelection}
                        multiple={false}
                    />
                    <ContractQuestionCard
                        question={"Select the facility/facilities you want to provide:"}
                        list={facilityOptions.map(f => f.name)}
                        choosenItem={selectedFacilityIds.map(id => facilityOptions.find(f => f.id === id)?.name).filter(Boolean) as string[]}
                        multipleAns={handleFacilitySelection}
                        multiple={true}
                    />
                    <ContractQuestionCard
                        question={"Select contract duration:"}
                        list={defaultDurationOptions}
                        choosenItem={selectedDuration}
                        onlyOne={handleDurationSelection}
                        multiple={false}
                    />

                    <div className={"flex items-center justify-center mt-4"}>
                        <Button onClick={handleGenerateContract} size={'xl'} className={"text-md"}>
                            <TbContract className={"size-8"} />Generate Contract
                        </Button>
                    </div>
                </div>
            </div>
            <MainFooter />
        </div>
    );
}

export default ContractCreationPage;