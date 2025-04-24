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
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
                />
                <Input
                    type="search"
                    placeholder="Szukaj..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-gray-500"
                />
            </div>
        </form>
    )
}