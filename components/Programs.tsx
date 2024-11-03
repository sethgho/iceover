import { getProgramLabel, ProgramId, Programs } from "../icehouseApi.ts";

const ProgramButtonThemes: Record<
    ProgramId,
    { toggle: string; tag: string }
> = {
    [Programs.LearnToSkate.id]: {
        toggle: "peer-checked:bg-blue-500 peer-checked:text-white",
        tag: "border-blue-500 bg-blue-500",
    },
    // [Programs.HolidayShow.id]: {
    //     toggle: "peer-checked:bg-red-500 peer-checked:text-white",
    //     tag: "border-red-500 bg-red-500",
    // },
    [Programs.FreestyleSessions.id]: {
        toggle: "peer-checked:bg-violet-400 peer-checked:text-white",
        tag: "border-violet-400 bg-violet-400",
    },
    [Programs.StickAndPuck.id]: {
        toggle: "peer-checked:bg-gray-600 peer-checked:text-white",
        tag: "border-gray-600 bg-gray-600",
    },
    [Programs.PublicSessions.id]: {
        toggle: "peer-checked:bg-stone-500 peer-checked:text-white",
        tag: "border-stone-500 bg-stone-500",
    },
};

export function ProgramCheckbox(
    { programId, isChecked, onChange }: {
        programId: number;
        isChecked: boolean;
        onChange: (e: HTMLInputElement) => void;
    },
) {
    const id = `program-${programId}`;
    const theme = ProgramButtonThemes[programId].toggle;
    return (
        <div class="flex items-center">
            <input
                type="checkbox"
                id={id}
                name="program"
                value={programId}
                class="sr-only peer"
                checked={isChecked}
                onChange={(e) => {
                    onChange(e.target as HTMLInputElement);
                }}
            />
            <label
                for={id}
                class={`${theme} cursor-pointer px-4 py-1 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-logoBlue rounded-full peer peer-unchecked:bg-white peer-unchecked:text-black 
                border-dashed peer-checked:border-opacity-0 border-2 border-gray-400 `}
            >
                <span class="">
                    {getProgramLabel(programId)}
                </span>
            </label>
        </div>
    );
}

export function ProgramTag(
    { programId }: { programId: number },
) {
    const theme = ProgramButtonThemes[programId].tag;
    return (
        <span
            class={`${theme} px-2 py-1 rounded-md text-xs border-opacity-80 border-2 bg-opacity-10 text-gray-700 italic lowercase`}
        >
            {getProgramLabel(programId)}
        </span>
    );
}
