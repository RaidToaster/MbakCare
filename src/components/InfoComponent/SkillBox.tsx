import {cva, VariantProps} from "class-variance-authority";

const skillBoxVariants = cva(
    "shadow-md px-4 py-2 rounded-md border-2",
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
                default: " ",
                f:"w-62 flex items-center justify-center",

            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type SkillBoxProps = {
    skill: string
} & VariantProps<typeof skillBoxVariants>

function SkillBox({ skill, variant, size, fixed }: SkillBoxProps) {
    return (
        <div className={skillBoxVariants({ variant, size, fixed  })}>
            <p>{skill}</p>
        </div>
    );
}

export default SkillBox;