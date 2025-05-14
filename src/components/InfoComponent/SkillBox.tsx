

function SkillBox({skill}: {skill: string}) {
    return (
        <div className={"bg-[#FFF2F3] shadow-md px-4 py-2 rounded-md border-[#492924] border-2"}>
            <p className={"text-[#492924]"}>{skill}</p>
        </div>
    );
}

export default SkillBox;