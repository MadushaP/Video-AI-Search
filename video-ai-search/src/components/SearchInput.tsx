import { useRouter } from "next/navigation";
import { useState, ChangeEvent,useEffect  } from "react";

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

  // useEffect hook to update input based on URL changes
  useEffect(() => {
    const currentQuery = router.query?.q; // Use optional chaining
    if (currentQuery) {
      // Update input only if there's a query
      setInputValue(decodeURIComponent(currentQuery));
    } else {
      // If no query, use default behavior (empty input)
      setInputValue("");
    }
  }, [router.query]);

    return (
        <div className="search__input border-[2px] border-solid border-slate-500 flex flex-row items-center gap-5 p-1 rounded-[15px] justify-center w-[800px] mx-auto">
            <label className="text-3xl pl-3 " htmlFor="inputId">🔎</label>
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