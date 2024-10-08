import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';

interface PaginationProps {
    currentPage: number;
    maxPage: number;
    totalRecords: number;
    loadedRecords: number;
    fetchQueryTime: number;
    prevPage: () => void;
    nextPage: () => void;
    gotoPage: (page: number) => void;
}

function Pagination({
    currentPage,
    loadedRecords,
    totalRecords,
    maxPage,
    fetchQueryTime,
    prevPage,
    nextPage,
    gotoPage,
}: PaginationProps) {
    const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);

    useEffect(() => {
        const getPageNumbers = (): (number | string)[] => {
            const maxPageNumbers = 7;
            const numbers: (number | string)[] = [];

            if (maxPage <= maxPageNumbers) {
                for (let i = 1; i <= maxPage; i++) {
                    numbers.push(i);
                }
            } else {
                let startPage = Math.max(currentPage - 3, 1);
                const endPage = Math.min(startPage + maxPageNumbers - 1, maxPage);

                if (endPage - startPage < maxPageNumbers - 1) {
                    startPage = Math.max(endPage - maxPageNumbers + 1, 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                    numbers.push(i);
                }

                if (startPage > 1) {
                    numbers.unshift(1);
                    if (startPage > 2) {
                        numbers.splice(1, 0, '...');
                    }
                }

                if (endPage < maxPage) {
                    numbers.push(maxPage);
                    if (endPage < maxPage - 1) {
                        numbers.splice(numbers.length - 1, 0, '...');
                    }
                }
            }

            return numbers;
        };

        // Update pageNumbers state with the new values
        setPageNumbers(getPageNumbers());
    }, [maxPage, totalRecords, loadedRecords, currentPage]);

    return (
        <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
            <div>
                <p className='text-sm text-gray-300'>
                    Showing <span className='font-medium'>{(currentPage - 1) * loadedRecords + 1}</span> to{' '}
                    <span className='font-medium'>{Math.min(currentPage * loadedRecords, totalRecords)}</span> of{' '}
                    <span className='font-medium'>{totalRecords}</span> results (took {fetchQueryTime}s)
                </p>
            </div>
            <div>
                <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-zinc-800 focus:z-20 focus:outline-offset-0'
                    >
                        <span className='sr-only'>Previous</span>
                        <ChevronLeftIcon className='h-5 w-5' aria-hidden='true' />
                    </button>

                    {pageNumbers.map((page, index) =>
                        page === '...' ? (
                            <span
                                key={index}
                                className='relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-white/10 focus:outline-offset-0'
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => gotoPage(page as number)}
                                aria-current={currentPage === page ? 'page' : undefined}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    currentPage === page
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-zinc-800'
                                }`}
                            >
                                {page}
                            </button>
                        ),
                    )}

                    <button
                        onClick={nextPage}
                        disabled={currentPage === maxPage}
                        className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-white/10 hover:bg-gray-800 focus:z-20 focus:outline-offset-0'
                    >
                        <span className='sr-only'>Next</span>
                        <ChevronRightIcon className='h-5 w-5' aria-hidden='true' />
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default Pagination;
