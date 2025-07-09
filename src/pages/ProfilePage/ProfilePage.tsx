import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import MainFooter from "@/components/InfoBar/MainFooter.tsx";
import defaultUserIcon from "@/assets/images/profile/Default.png";
import PhotoInputer from "@/components/Inputer/PhotoInputer.tsx";
import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/Inputer/Input.tsx";
import BoxInput from "@/components/Inputer/BoxInput.tsx";
import { Button } from "@/components/Inputer/Button.tsx";
import OnOffToggle from "@/components/Inputer/OnOffToggle.tsx";
import { ProfileService, HelperProfileData, CustomerProfileData } from "@/lib/services/ProfileService.ts";
import { useAuthCt } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import Notification from "@/components/InfoComponent/Notification.tsx";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";


type ProfileFormData = Partial<HelperProfileData & CustomerProfileData & { base_location_id?: string | null; looking_for_job?: boolean; looking_for_helper?: boolean; skillsToUpdate?: string[] }>;
interface LocationOption { id: string; name: string; }
interface SkillOption { id: string; name: string; }

function ProfilePage() {
    const { userRole, user: authUserFromContext, isLoading: authLoading } = useAuthCt(); // Using useAuth
    const [authUser, setAuthUser] = useState<User | null>(authUserFromContext);

    useEffect(() => {
        if (!authUserFromContext && !authLoading) {
            supabase.auth.getUser().then(({ data }) => {
                setAuthUser(data?.user ?? null);
            });
        } else if (authUserFromContext) {
            setAuthUser(authUserFromContext);
        }
    }, [authUserFromContext, authLoading]);


    const navigate = useNavigate();

    const [formData, setFormData] = useState<ProfileFormData>({});
    const [initialProfilePictureUrl, setInitialProfilePictureUrl] = useState<string | null>(null);
    const [newProfilePictureFile, setNewProfilePictureFile] = useState<File | null>(null);

    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successInfo, setSuccessInfo] = useState<string | null>(null);

    const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
    const [allSkillOptions, setAllSkillOptions] = useState<SkillOption[]>([]);
    const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);

    const religionOptions = ['Islam', 'Catholic', 'Christian', 'Hindu', 'Buddha', 'Konghucu', 'Other', 'Prefer not to say'];
    const languageOptions = ['English', 'Indonesia', 'Russian', 'French', 'Spanish', 'Arabic', 'Mandarin', 'Javanese', 'Sundanese'];
    const jobTypeOptions = ["Full-Time", "Part-Time", "Live-in", "Live-out", "Flexible"];
    const contractStatusOptions = ["Available", "On Contract", "Unavailable", "Resigned", "Terminated"];
    const dayOffOptions = ["Flexible", "Sunday Only", "Weekend", "Any Weekday"];
    const confirmChoices = ["Yes", "No"];
    const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
    const educationLevelOptions = ["Not Specified", "SD", "SMP", "SMA/SMK", "Diploma", "S1", "S2", "S3"];

    const fetchProfileData = useCallback(async () => {
        if (authUser && userRole) {
            setIsLoadingData(true);
            setError(null);
            try {
                const profile = await ProfileService.getCurrentUserProfile(authUser.id, userRole);
                if (profile) {
                    setFormData(profile);
                    setInitialProfilePictureUrl(profile.profile_picture || null);
                    if (userRole === 'helper' && profile.id) {
                        const helperSkills = await ProfileService.getHelperSkills(profile.id);
                        setSelectedSkillIds(helperSkills);
                        const helperSpecificProfile = profile as HelperProfileData;
                        setFormData(prev => ({
                            ...prev,
                            looking_for_job: helperSpecificProfile.contract_status === 'Available',
                        }));
                    }
                } else {
                    setError("Could not load your profile data. Please try again later.");
                }
            } catch (err: any) {
                setError(err.message || "Failed to fetch your profile information.");
            } finally {
                setIsLoadingData(false);
            }
        } else if (!authLoading && authUser === null) { // Check if authUser is explicitly null after loading
            setError("User not authenticated. Please log in.");
            setIsLoadingData(false);
            navigate("/auth/login");
        } else if (!authLoading && !authUser) { // General case if authUser might be undefined initially
            setIsLoadingData(false); // Stop loading if auth is done and no user
        }
    }, [authUser, userRole, authLoading, navigate]);

    useEffect(() => {
        if (authUser) { // Only fetch profile data if authUser is determined
            fetchProfileData();
        }
        ProfileService.getLocations().then(setLocationOptions);
        if (userRole === 'helper') {
            ProfileService.getSkillsForHelperEdit().then(setAllSkillOptions);
        }
    }, [fetchProfileData, userRole, authUser]);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const target = e.target as HTMLInputElement;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? target.checked : (type === 'number' && value !== '') ? (isNaN(Number(value)) ? prev[name as keyof ProfileFormData] : Number(value)) : value
        }));
    };

    const handleBoxInputChange = (fieldName: keyof ProfileFormData, selectedValue: string | string[]) => {
        // Special handling for has_pets: convert "Yes"/"No" string to boolean
        if (fieldName === 'has_pets') {
            setFormData(prev => ({ ...prev, [fieldName]: selectedValue === "Yes" }));
        } else {
            setFormData(prev => ({ ...prev, [fieldName]: selectedValue }));
        }
    };

    const handleSkillSelectionForBoxInput = (selectedSkillNames: string[]) => {
        const newSelectedIds = selectedSkillNames
            .map(name => allSkillOptions.find(s => s.name === name)?.id)
            .filter(Boolean) as string[];
        setSelectedSkillIds(newSelectedIds);
        return newSelectedIds;
    };

    const handlePhotoInputChange = (file: File | null) => {
        setNewProfilePictureFile(file);
    };

    const handleLookingForJobToggle = () => {
        const newValue = !(formData.looking_for_job ?? false);
        setFormData(prev => ({ ...prev, looking_for_job: newValue }));
    };
    const handleLookingForHelperToggle = () => {
        const newValue = !(formData.looking_for_helper ?? false);
        setFormData(prev => ({ ...prev, looking_for_helper: newValue }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!authUser || !userRole) {
            setError("Authentication error.");
            return;
        }
        setIsSaving(true);
        setError(null);
        setSuccessInfo(null);

        try {
            let finalProfilePictureUrl = initialProfilePictureUrl;
            if (newProfilePictureFile) {
                const { publicUrl, error: uploadError } = await ProfileService.uploadProfilePicture(authUser.id, newProfilePictureFile);
                if (uploadError || !publicUrl) throw uploadError || new Error("Profile picture upload failed.");
                finalProfilePictureUrl = publicUrl;
            }

            const userTableData: Partial<HelperProfileData | CustomerProfileData> = {
                name: formData.name,
                address: formData.address,
                phone: formData.phone,
                profile_picture: finalProfilePictureUrl,
            };
            console.log("userID IS:", authUser.id);
            const { error: userUpdateError } = await ProfileService.updateUserTable(authUser.id, userTableData);
            if (userUpdateError) throw userUpdateError;

            if (userRole === 'helper') {
                const helperTableData: Partial<HelperProfileData> = {
                    age: formData.age,
                    religion: formData.religion,
                    base_location_id: formData.base_location_id,
                    about_me: formData.about_me,
                    salary_expectation: formData.salary_expectation,
                    available_from: formData.available_from,
                    contract_status: formData.looking_for_job ? 'Available' : (formData.contract_status === 'Available' ? 'Unavailable' : formData.contract_status),
                    marital_status: formData.marital_status,
                    number_of_kids: formData.number_of_kids,
                    preferred_job_type: formData.preferred_job_type,
                    education_level: formData.education_level,
                    day_off_preference: formData.day_off_preference,
                    languages: formData.languages,
                    professional_title: formData.professional_title,
                };
                const { error: helperUpdateError } = await ProfileService.updateHelperTable(authUser.id, helperTableData);
                if (helperUpdateError) throw helperUpdateError;

                const { error: skillUpdateError } = await ProfileService.updateHelperSkills(authUser.id, selectedSkillIds);
                if (skillUpdateError) throw skillUpdateError;

            } else if (userRole === 'customer') {
                const customerTableData: Partial<CustomerProfileData> = {
                    family_description: formData.family_description,
                    num_family_members: formData.num_family_members,
                    has_pets: formData.has_pets,
                    preferred_helper_level: formData.preferred_helper_level,
                };
                const { error: customerUpdateError } = await ProfileService.updateCustomerTable(authUser.id, customerTableData);
                if (customerUpdateError) throw customerUpdateError;
            }
            setSuccessInfo("Profile updated successfully!");
            setNewProfilePictureFile(null);
            fetchProfileData();
        } catch (err: any) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingData || authLoading && !authUser) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-1 justify-center items-center h-full pt-40 text-[#492924]">Loading profile...</div>
                <MainFooter />
            </div>
        );
    }

    if (!authLoading && !authUser) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-col justify-center items-center h-full pt-40 text-[#492924]">
                    <p>Please log in to view and edit your profile.</p>
                    <Button onClick={() => navigate('/auth/login')} className="mt-4">Login</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    if (error && !formData.id && !isLoadingData) {
        return (
            <div className={"min-h-screen min-w-full max-w-screen h-full"}>
                <NavigationBar />
                <div className="flex flex-col justify-center items-center h-full pt-40 text-red-500">
                    <p>{error}</p>
                    <Button onClick={fetchProfileData} className="mt-4">Try Again</Button>
                </div>
                <MainFooter />
            </div>
        );
    }

    const displayProfilePicture = newProfilePictureFile ? URL.createObjectURL(newProfilePictureFile) : initialProfilePictureUrl || defaultUserIcon;
    const currentSelectedSkillNames = selectedSkillIds.map(id => allSkillOptions.find(s => s.id === id)?.name).filter(Boolean) as string[];

    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <form onSubmit={handleSubmit} className={"flex flex-col w-full h-full px-4 sm:px-8 lg:px-32 xl:px-64 py-8 pt-28 sm:pt-32 md:pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative">
                    <h1 className={"font-bold text-3xl sm:text-4xl text-center"}>Edit Your Profile</h1>
                    <div className="w-48 sm:w-64 h-0.5 bg-[#DA807B] mt-2 rounded-md"></div>
                </div>

                {error && <Notification title="Update Error" message={error} variant={1} onClose={() => setError(null)} />}
                {successInfo && <Notification title="Success!" message={successInfo} variant={0} onClose={() => setSuccessInfo(null)} />}

                <div className={"bg-[#F7F8F1] p-6 sm:p-8 rounded-md shadow-md flex flex-col gap-6 md:gap-8 w-full"}>
                    <div className={"flex flex-col gap-2 w-full items-center justify-center"}>
                        <h3 className={"text-lg sm:text-xl font-semibold text-[#EE7C9E]"}>Profile Picture</h3>
                        <PhotoInputer onChange={handlePhotoInputChange} defaultPhoto={displayProfilePicture} full={true} />
                    </div>
                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <label htmlFor="name" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Full Name</label>
                        <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} />
                    </div>
                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <label htmlFor="phone" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Phone Number</label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} />
                    </div>
                    <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                        <label htmlFor="address" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Address</label>
                        <Input id="address" name="address" value={formData.address || ''} onChange={handleInputChange} />
                    </div>

                    {userRole === 'helper' && (
                        <>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="age" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Age</label>
                                <Input id="age" name="age" type="number" value={formData.age || ''} onChange={handleInputChange} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="marital_status" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Marital Status</label>
                                <BoxInput list={maritalStatusOptions} choosenItem={formData.marital_status || ""} onlyOne={(val) => handleBoxInputChange('marital_status', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="number_of_kids" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Number of Kids</label>
                                <Input id="number_of_kids" name="number_of_kids" type="number" value={formData.number_of_kids === null || formData.number_of_kids === undefined ? '' : formData.number_of_kids} onChange={handleInputChange} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Religion</h3>
                                <BoxInput list={religionOptions} choosenItem={formData.religion || ""} onlyOne={(val) => handleBoxInputChange('religion', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="base_location_id" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Base Location</label>
                                <select id="base_location_id" name="base_location_id" value={formData.base_location_id || ''} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-pink-500 focus:border-pink-500">
                                    <option value="">Select Location</option>
                                    {locationOptions.map(loc => (<option key={loc.id} value={loc.id}>{loc.name}</option>))}
                                </select>
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Languages Spoken</h3>
                                <BoxInput list={languageOptions} choosenItem={formData.languages || []} multipleAns={(val) => { handleBoxInputChange('languages', val); return val; }} multiple={true} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Main Skills</h3>
                                <BoxInput list={allSkillOptions.map(s => s.name)} choosenItem={currentSelectedSkillNames} multipleAns={handleSkillSelectionForBoxInput} multiple={true} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="education_level" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Highest Education Level</label>
                                <BoxInput list={educationLevelOptions} choosenItem={formData.education_level || ""} onlyOne={(val) => handleBoxInputChange('education_level', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Preferred Job Type</h3>
                                <BoxInput list={jobTypeOptions} choosenItem={formData.preferred_job_type || ""} onlyOne={(val) => handleBoxInputChange('preferred_job_type', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Current Contract Status</h3>
                                <BoxInput list={contractStatusOptions} choosenItem={formData.contract_status || ""} onlyOne={(val) => handleBoxInputChange('contract_status', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Day Off Preference</h3>
                                <BoxInput list={dayOffOptions} choosenItem={formData.day_off_preference || ""} onlyOne={(val) => handleBoxInputChange('day_off_preference', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="available_from" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Available From Date</label>
                                <Input id="available_from" name="available_from" type="date" value={formData.available_from || ''} onChange={handleInputChange} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="salary_expectation" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Salary Expectation (Rp)</label>
                                <Input id="salary_expectation" name="salary_expectation" type="number" value={formData.salary_expectation || ''} onChange={handleInputChange} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="professional_title" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Professional Title/Tagline</label>
                                <Input id="professional_title" name="professional_title" value={formData.professional_title || ''} onChange={handleInputChange} placeholder="e.g., Experienced Nanny, Diligent Housekeeper" />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Level & Experience</h3>
                                <div className="w-full p-4 border border-gray-200 rounded-md bg-white flex justify-between items-center">
                                    <p>Your current level is: <strong>{formData.level || 1}</strong></p>
                                    <Button type="button" color="pink" rounded="med" onClick={() => navigate('/profile/level')}>
                                        View Level Progress
                                    </Button>
                                </div>
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="about_me" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>About Me</label>
                                <textarea id="about_me" name="about_me" value={formData.about_me || ''} onChange={handleInputChange} rows={5} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" />
                            </div>
                            <OnOffToggle caption={'Actively Looking for Job'} value={formData.looking_for_job ?? false} handleValue={handleLookingForJobToggle} />
                            <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-6 py-3 rounded-sm text-xs"}>
                                <p className={"text-justify"}>Enable this if you are actively looking for a job. Your contract status will be set to "Available".</p>
                            </div>
                        </>
                    )}

                    {userRole === 'customer' && (
                        <>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="family_description" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>About Your Family / Household</label>
                                <textarea id="family_description" name="family_description" value={formData.family_description || ''} onChange={handleInputChange} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500" />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="num_family_members" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Number of Family Members</label>
                                <Input id="num_family_members" name="num_family_members" type="number" value={formData.num_family_members === null || formData.num_family_members === undefined ? '' : formData.num_family_members} onChange={handleInputChange} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <h3 className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Do you have pets?</h3>
                                <BoxInput list={confirmChoices} choosenItem={formData.has_pets ? "Yes" : "No"} onlyOne={(val) => handleBoxInputChange('has_pets', val)} multiple={false} />
                            </div>
                            <div className={"flex flex-col gap-2 w-full items-start justify-center"}>
                                <label htmlFor="preferred_helper_level" className={"text-sm sm:text-md font-semibold text-[#EE7C9E]"}>Preferred Helper Level (1-20)</label>
                                <Input id="preferred_helper_level" name="preferred_helper_level" type="number" value={formData.preferred_helper_level || ''} onChange={handleInputChange} min="1" max="20" />
                            </div>
                            <OnOffToggle caption={'Actively Looking for Helper'} value={formData.looking_for_helper ?? false} handleValue={handleLookingForHelperToggle} />
                            <div className={"bg-[#FFF2F3] border-l-2 border-[#EE7C9E] px-6 py-3 rounded-sm text-xs"}>
                                <p className={"text-justify"}>Enable this if you are actively looking for a helper. Your request will be visible to available helpers.</p>
                            </div>
                        </>
                    )}

                    <div className={"flex flex-row gap-4 justify-end w-full mt-4"}>
                        <Button type="button" size={'lg'} color={'white'} rounded={'med'} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" size={'lg'} color={'pink'} rounded={'med'} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </form>
            <MainFooter />
        </div>
    );
}

export default ProfilePage;