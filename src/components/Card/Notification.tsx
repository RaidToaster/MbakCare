import {Button} from "@/components/InfoComponent/Button.tsx";
import {useEffect} from "react";

function Notification({title, message, variant, onClose}: {title:string, message:string, variant:number,onClose:() => void}) {

    useEffect(() => {
        document.body.classList.add("overflow-hidden");
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex justify-center items-center pointer-events-auto"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
            }}
        >
            <div className="absolute inset-0 pointer-events-none"/>
            <div className="bg-white z-50 flex flex-col justify-center items-center w-128 h-76 rounded-md gap-5 shadow-lg pointer-events-auto">
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="text-center">{message}</p>

                <div className="flex flex-row gap-10 items-center justify-center">
                    {variant === 1 && (
                        <Button size="lg" color="pink" rounded="med">
                            Cancel
                        </Button>
                    )}
                    <Button
                        size="lg"
                        color={variant === 1 ? "white" : "pink"}
                        rounded="med"
                        onClick={onClose}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>

    );
}

export default Notification;