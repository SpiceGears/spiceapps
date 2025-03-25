import { useState } from "react";

export default function Searchbar() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search query:", query);
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center">
            <input
                type="text"
                placeholder="Szukaj..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-4 py-2 border border-gray-30 rounded-1-md "
            />

        </form>
    )
}