import { Table } from './elements/table';
import { FetchError, PayrollInfo, PayrollRecord, getPayroll, usePayrollPagination } from './api/shared';
import { useEffect, useState } from 'react';
import { Resources } from './elements/Resources';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function Index() {
    const [data, setData] = useState<PayrollInfo | FetchError | null>(null);
    const { payrollData, error, loading, currentPage, nextPage, prevPage } = usePayrollPagination();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getPayroll(1);
                if (result) {
                    setData(result);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1 className='text-white font-bold text-2xl leading-8 mb-2'>CPS Staff Payroll</h1>
            <p className='text-gray-400 text-base '>Blurb here</p>
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
                ) : payrollData && (
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
                                        ${record.annualSalary}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </>
    );
}

export default Index;
