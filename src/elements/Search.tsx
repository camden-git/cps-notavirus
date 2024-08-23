import React from 'react';
import { useSearch } from './SearchContext';

function Search() {
    const { searchTerm, setSearchTerm } = useSearch();

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className='relative ml-2 w-full xl:ml-56'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <svg
                    viewBox='0 0 20 20'
                    fill='none'
                    aria-hidden='true'
                    className='h-5 w-5 stroke-current text-zinc-400'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25'
                    />
                </svg>
            </div>
            <input
                type='text'
                className='h-8 w-full items-center gap-2 rounded-full bg-white/5 pl-2 pr-3 indent-8 text-zinc-400 ring-1 ring-inset ring-white/10 transition hover:ring-white/20 sm:text-sm sm:leading-6 lg:flex focus:[&:not(:focus-visible)]:outline-none'
                placeholder='Find someone...'
                value={searchTerm}
                onChange={handleInputChange}
            />
        </div>
    );
}

export default Search;
