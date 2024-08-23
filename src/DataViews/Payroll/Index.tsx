import { Table } from '../../elements/table';
import { PayrollRecord, usePayrollPagination } from '../../api/shared';
import { Resources } from '../../elements/Resources';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatMoney } from '../../lib/formatters';
import Pagination from './Pagnation';
import Title from '../../elements/Title';
import { useSearch } from '../../elements/SearchContext';
import { useEffect } from 'react';
import debounce from 'debounce';

function Index() {
    const { payrollData, error, loading, currentPage, nextPage, prevPage, gotoPage, setNameSearch } =
        usePayrollPagination();
    const { searchTerm } = useSearch();

    const debounceSetNameSearch = debounce((searchTerm: string) => {
        setNameSearch(searchTerm);
    }, 250);

    useEffect(() => {
        debounceSetNameSearch(searchTerm);

        return () => {
            debounceSetNameSearch.clear();
        };
    }, [searchTerm, debounceSetNameSearch]);
    return (
        <>
            <Title
                title='CPS Staff Payroll'
                description='This website is still in beta; the majority of features are still unfinished'
            />
            <Resources />
            <div>
                {loading ? (
                    <div className='mx-auto flex justify-center'>
                        <svg
                            className='mr-3 h-6 w-6 animate-spin text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                        <p className='my-auto font-light text-gray-400'>Loading payroll</p>
                    </div>
                ) : error ? (
                    <>
                        <div className='mx-auto flex justify-center'>
                            <ExclamationTriangleIcon className='mr-3 h-6 w-6 text-red-500' />
                            <p className='font-300 my-auto text-red-400'>Failed to get payroll data</p>
                        </div>
                        <p className='m-auto ml-3 justify-center text-center font-light text-gray-400'>{error.error}</p>
                    </>
                ) : payrollData && payrollData.payrollRecords.length > 0 ? (
                    <>
                        <Table>
                            <thead className='whitespace-nowrap'>
                                <th scope='col' className='w-1/6'>
                                    Name
                                </th>
                                <th scope='col' className='w-1/3'>
                                    Department
                                </th>
                                <th scope='col'>Job</th>
                                <th scope='col'>Annual Income</th>
                                <th scope='col'>Last Seen At</th>
                            </thead>
                            <tbody>
                                {payrollData.payrollRecords.map((record: PayrollRecord) => (
                                    <tr key={record.id}>
                                        <td>{record.name}</td>
                                        <td>{record.department_name}</td>
                                        <td>{record.job_title}</td>
                                        <td>${formatMoney(record.annualSalary)}</td>
                                        <td
                                            className={
                                                payrollData.latest_dataframe !== record.last_seen_date
                                                    ? '!text-rose-400'
                                                    : ''
                                            }
                                        >
                                            {record.last_seen_date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className='flex items-center justify-between border-t border-white/5 px-4 py-3 sm:px-6'>
                            {/* TODO: this is terrible, fix it */}
                            <Pagination
                                currentPage={currentPage}
                                maxPage={payrollData.max_page}
                                loadedRecords={payrollData.payrollRecords.length}
                                totalRecords={payrollData.total_records}
                                fetchQueryTime={payrollData.fetch_query_time}
                                prevPage={prevPage}
                                nextPage={nextPage}
                                gotoPage={gotoPage}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <p className='m-auto ml-3 justify-center text-center font-light text-gray-400'>No results :(</p>
                    </>
                )}
            </div>
        </>
    );
}

export default Index;
