function Search() {
    return (
        <button
            type='button'
            className='ml-56 hidden h-8 w-full items-center gap-2 rounded-full pl-2 pr-3 text-sm ring-1 transition bg-white/5 text-zinc-400 ring-inset ring-white/10 hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none'
        >
            <svg viewBox='0 0 20 20' fill='none' aria-hidden='true' className='h-5 w-5 stroke-current'>
                <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25'
                />
            </svg>
            Find someone...
            <kbd className='ml-auto text-2xs text-zinc-500'>
                <kbd className='font-sans'>Ctrl </kbd>
                <kbd className='font-sans'>K</kbd>
            </kbd>
        </button>
    );
}

export default Search;
