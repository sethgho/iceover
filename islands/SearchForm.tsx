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
        <form class="w-full mb-8">
            <div class="flex justify-evenly items-center">
                {Object.values(Programs).map(({ id, label }) => (
                    <label class="flex items-center gap-1">
                        <input
                            type="checkbox"
                            name="program"
                            value={id}
                            checked={query.programs.includes(id)}
                            onChange={(e) => {
                                (e.target as HTMLInputElement).form?.submit();
                            }}
                        />
                        {label}
                    </label>
                ))}
            </div>
        </form>
    );
}
