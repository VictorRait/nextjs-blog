import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function SearchInput() {
	const [searchTerm, setSearchTerm] = useState("");
	const [open, setOpen] = useState(false);

	const results = useQuery(api.posts.searchPost, { terms: searchTerm, limit: 5 });

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchTerm(event.target.value);
	}

	return (
		<div className='relative w-full max-w-sm'>
			<div className='relative'>
				<Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
				<Input
					type='search'
					placeholder='Search posts...'
					value={searchTerm}
					onChange={handleInputChange}
					className='w-full rounded-md border border-input bg-transparent py-2 pl-10 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
				/>
			</div>
			{open && searchTerm.length >= 2 && (
				<div className='absolute top-full left-0 right-0 mt-2 bg-background border border-input rounded-md shadow-lg'></div>
			)}
		</div>
	);
}

export default SearchInput;
