import { ProgramCheckbox } from "../components/Programs.tsx";
import { Programs } from "../icehouseApi.ts";

export type SearchQuery = {
    programs: number[];
    startDate: Date;
    endDate: Date;
};

type SearchFormProps = {
    query: SearchQuery;
};
export default function SearchForm(props: SearchFormProps) {
    const { query } = props;

    return (
        <form class="w-full">
            <div class="flex flex-wrap justify-start gap-2">
                {Object.values(Programs).map(({ id }) => (
                    <ProgramCheckbox
                        programId={id}
                        isChecked={query.programs.includes(id)}
                        onChange={(e) => {
                            e.form?.submit();
                        }}
                    />
                ))}
            </div>
        </form>
    );
}
