import { Table } from '../../elements/table';
import { PayrollRecord, usePayrollPagination } from '../../api/shared';
import { Resources } from '../../elements/Resources';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { formatMoney } from '../../lib/formatters';
import Pagination from './Pagnation';
import Title from '../../elements/Title';

function Index() {
    const { payrollData, error, loading, currentPage, nextPage, prevPage, gotoPage } = usePayrollPagination();

    return (
        <>
            <Title
                title='CPS Staff Payroll'
                description='This website is still in beta; the majority of features are still unfinished'
            />
            <Resources />
            <div>
                {loading ? (
                    <p>Loading payroll...</p>
                ) : error ? (
                    <>
                        <div className='flex mx-auto justify-center'>
                            <ExclamationTriangleIcon className='text-red-500 h-7 w-7 mr-3' />
                            <p className='my-auto text-red-400 font-300'>Failed to get payroll data</p>
                        </div>
                        <p className='m-auto justify-center text-gray-400 font-light ml-3 text-center'>{error.error}</p>
                    </>
                ) : (
                    payrollData && (
                        <>
                            <Table>
                                <thead>
                                    <th scope='col'>Name</th>
                                    <th scope='col'>Department</th>
                                    <th scope='col'>Annual Income</th>
                                </thead>
                                <tbody>
                                    {payrollData.payrollRecords.map((record: PayrollRecord) => (
                                        <tr key={record.id}>
                                            <td
                                                className={
                                                    'truncate text-sm font-medium leading-6 py-4 pl-4 pr-8 sm:pl-6 lg:pl-8'
                                                }
                                            >
                                                {record.name}
                                            </td>
                                            <td
                                                className={
                                                    'truncate text-sm font-medium leading-6 py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-gray-300'
                                                }
                                            >
                                                {record.job_title}
                                            </td>
                                            <td
                                                className={
                                                    'truncate text-sm font-medium leading-6 py-4 pl-4 pr-8 sm:pl-6 lg:pl-8 text-gray-300'
                                                }
                                            >
                                                ${formatMoney(record.annualSalary)}
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
                                    prevPage={prevPage}
                                    nextPage={nextPage}
                                    gotoPage={gotoPage}
                                />
                            </div>
                        </>
                    )
                )}
            </div>
        </>
    );
}

export default Index;
