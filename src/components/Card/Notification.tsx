import {Button} from "@/components/InfoComponent/Button.tsx";

function Notification({title, message, variant, onClose}: {title:string, message:string, variant:number,onClose:() => void}) {
    return (
        <div className={"fixed inset-0 w-screen h-full bg-gray-900 z-[999] flex justify-center items-center bg-opacity-40"}>
            <div className={"bg-white flex flex-col justify-center items-center w-128 h-96 rounded-md gap-5"}>
                <h2 className={"text-2xl font-bold"}>{title}</h2>
                <p className={"text-center"}>{message}</p>

                <div className={"flex flex-row gap-10 items-center justify-center"}>
                    {variant == 1 && (
                        <Button size={'lg'} color={'pink'} rounded={'med'}>
                            Cancel
                        </Button>
                    )}
                    <Button size={'lg'} color={variant == 1 ? 'white' : 'pink'} rounded={'med'} onClick={onClose}>
                        Confirm
                    </Button>
                </div>
            </div>
        </div>

    );
}

export default Notification;