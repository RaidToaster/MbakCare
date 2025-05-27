import {cva, VariantProps} from "class-variance-authority";
import {FaCheckCircle} from "react-icons/fa";

const skillBoxVariants = cva(
    "relative shadow-md px-4 py-2 rounded-md border-2",
    {
        variants: {
            variant: {
                default: "bg-[#FFF2F3] border-[#492924] text-[#492924]",
                pink: "bg-pink-100 border-pink-600 text-pink-800",
                white: "bg-white border-[#492924] text-[#492924]",
            },
            size: {
                default: "text-sm",
                lg: "text-base px-6 py-3",
            },
            fixed:{
                f:"w-54 flex items-center justify-center",
            },
            option:{
                y:"hover:cursor-pointer",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type SkillBoxProps = {
    item: string,
    canSelected?: boolean,
    isSelected?:boolean,
    onSelect?:(item:string) => void
} & VariantProps<typeof skillBoxVariants>

function SkillBox({ item, variant, size, fixed, option, canSelected = false, isSelected, onSelect }: SkillBoxProps) {

    function handleClick() {
        if (onSelect && canSelected) {
            onSelect(item);
        }
    }

    return (
        <div
            className={`${skillBoxVariants({ variant, size, fixed, option })} ${isSelected ? "border-[#EE7C9E] text-[#EE7C9E]" : ""}`}
            onClick={handleClick}
        >
            {isSelected && (
                <FaCheckCircle className="absolute left-3 top-2" size={12} />
            )}
            <p>{item}</p>
        </div>
    );
}

export default SkillBox;