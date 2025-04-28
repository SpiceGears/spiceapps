import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Searchbar() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search query:", query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" 
                />
                <Input
                    type="search"
                    placeholder="Szukaj..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-500"
                />
            </div>
        </form>
    )
}