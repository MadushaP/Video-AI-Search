import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

export interface ISearchInputProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void; // Function for updating search query
}

export const SearchInput: React.FC<ISearchInputProps> = (props) => {
    const { searchQuery, setSearchQuery } = props;

    const router = useRouter();
    const [inputValue, setInputValue] = useState(searchQuery ?? "");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    }

    const handleSearch = () => {
        if (inputValue.trim() !== "") {
            router.push(`/?q=${encodeURIComponent(inputValue)}`);
        } else {
            router.push("/");
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch();
            setSearchQuery(inputValue)
        }
    }

    return (
        <div className="search__input border-[2px] border-solid border-slate-500 flex flex-row items-center gap-5 p-1 rounded-[15px] justify-center w-[800px] mx-auto">
            <label htmlFor="inputId">icon</label>
            <input
                type="text"
                id="inputId"
                placeholder="Enter your keywords"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                className="bg-[transparent] outline-none border-none w-[1000px] py-3 pl-2 pr-2"
            />
        </div>
    );
}