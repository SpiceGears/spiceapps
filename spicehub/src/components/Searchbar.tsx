import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Searchbar() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search query:", query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <div className="relative flex items-center text-gray-400 focus-within:text-gray-600">
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5 absolute ml-3" />
                <input
                    type="text"
                    placeholder="Szukaj..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-3 pl-10 py-2 border border-none ring-2 ring-gray-300 text-white rounded-2xl focus:ring-gray-500 focus:ring-2 "
                />
            </div>
            

        </form>
    )
}