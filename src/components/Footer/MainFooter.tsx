


const MainFooter = () => {
    return (
        <div className="min-w-screen">
            <div className={"px-16 flex flex-col"}>
                <div className={"bg-[#EE7C9E] w-60 p-6 border-0 rounded-t-[15px] flex items-center justify-center text-[#FFBB70]"}>
                    <h1 className="text-2xl">MbakCare</h1>
                </div>
                <div className="flex flex-col gap-16 px-32 bg-[#EE7C9E] py-16 rounded-tr-[15px] text-white text-sm">
                    <div className={"flex flex row justify-between"}>
                        <div className={"flex flex-row gap-32"} >
                            <div className={"flex flex-col gap-4"}>
                                <p>HOME</p>
                                <p>PRODUCTS</p>
                                <p>TESTIMONIAL</p>
                                <p>ABOUT US</p>
                                <p>REGISTER</p>
                            </div>
                            <div className={"flex flex-col gap-4"}>
                                <p>FAQS</p>
                                <p>REFUND POLICY</p>
                                <p>TERMS OF SERVICE</p>
                            </div>
                        </div>
                        <div>
                            <p>Follow Us</p>
                            <div>

                            </div>
                        </div>
                    </div>
                    <div className="border-t-2 border-white flex flex-row gap-32 py-6">
                        <p>PRIVACY</p>
                        <p>TERMS OF SERVICE</p>
                        <p>CONTACT US</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainFooter;