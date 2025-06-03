import NavigationBar from "@/components/InfoBar/NavigationBar.tsx";
import InboxCard from "@/components/Card/InboxCard.tsx";

function ViewInboxPage() {
    return (
        <div className={"min-h-screen min-w-full max-w-screen h-full"}>
            <NavigationBar />
            <div className={"flex flex-col w-full h-full px-8 lg:px-64 py-8 pt-40 gap-8 text-[#492924]"}>
                <div className="flex flex-col items-center justify-center relative">
                    <h1 className={"font-bold text-4xl text-center"}>Your Inbox</h1>
                    <div className="w-24 h-0.5 bg-[#DA807B] mt-1 rounded-md"></div>
                </div>
                <div className={"flex flex-col gap-2 w-full"}>
                    {[...Array(10)].map((_, i) => (
                        <InboxCard key={i} sender={'Admin'} senderOrigin={'System'} title={'New Account Created!'} description={'Welcome Abroad It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).'} time={'00.00 PM'} isRead={true} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ViewInboxPage;