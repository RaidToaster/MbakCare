import {Button} from "@/components/InfoComponent/Button.tsx";

function Notification({title, message, variant}: {title:string, message:string, variant:number}) {
    return (
        <div className={"bg-white flex flex-col justify-center items-center w-128 h-96 rounded-md"}>
            <h2 className={"text-2xl font-bold"}>{title}</h2>
            <p className={"text-center"}>{message}</p>

                <div className={"flex flex-row gap-10 items-center justify-center"}>
                    {variant == 1 && (
                        <Button size={'lg'} color={'pink'} rounded={'med'} >
                            Cancel
                        </Button>
                    )}
                    <Button size={'lg'} color={'white'} rounded={'med'} >
                        Confirm
                    </Button>
                </div>


        </div>
    );
}

export default Notification;