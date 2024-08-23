import { useState, useEffect, useCallback } from 'react';

export const getAPI = (endpoint: string, offset: number, otherArgs?: string) =>
    `${import.meta.env.VITE_API_URL}/${endpoint}?page=${offset}${otherArgs}`;

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

// function to make requests to the backend
const requestBackend = async <T>(
    url: string,
    page: number,
    options: RequestOptions = {},
    otherArgs?: string,
): Promise<T> => {
    const response = await fetch(getAPI(url, page, otherArgs), options);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
};

export type PayrollRecord = {
    id: number;
    name: string;
    job_title: string;
    department_name: string;
    annualSalary: number;
    last_seen_date: string;
};

export type PayrollInfo = {
    max_page: number;
    total_records: number;
    payrollRecords: PayrollRecord[];
    latest_dataframe: string;
    name_query: string;
    fetch_query_time: number;
};

export type FetchError = {
    error: string;
    canRetry: boolean;
};

export const getPayroll = async (page: number, searchTerm?: string): Promise<PayrollInfo | FetchError> => {
    try {
        const extraArgs = searchTerm ? `&name=${searchTerm}` : '';
        const payroll = await requestBackend<PayrollInfo>('payroll', page, { method: 'GET' }, extraArgs);
        return payroll;
    } catch (error) {
        return { error: (error as Error).toString(), canRetry: false } as FetchError;
    }
};

export const usePayrollPagination = (initialPage: number = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [payrollData, setPayrollData] = useState<PayrollInfo | null>(null);
    const [error, setError] = useState<FetchError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const fetchPayroll = useCallback(
        async (page: number, search: string) => {
            setLoading(true);
            setError(null);

            const result = await getPayroll(page, search);

            if ('error' in result) {
                setError(result);
            } else {
                if (result.name_query === searchTerm) {
                    //console.debug(`saved response for ${result.name_query} as current search is ${searchTerm}`);
                    setPayrollData(result);
                } else {
                    //console.debug(`threw out response for ${result.name_query} as current search is ${searchTerm}`);
                }
            }

            setLoading(false);
        },
        [searchTerm],
    );

    useEffect(() => {
        fetchPayroll(currentPage, searchTerm);
    }, [currentPage, searchTerm, fetchPayroll]);

    const setNameSearch = (term: string) => {
        // TODO: fix this lol it shouldnt be doing this
        if (searchTerm !== term) {
            setSearchTerm(term);
            setCurrentPage(1);
        }
    };

    const nextPage = () => {
        if (payrollData && currentPage < payrollData.max_page) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const gotoPage = (toPage: number) => {
        if (payrollData && toPage <= payrollData.max_page) {
            setCurrentPage(toPage);
        }
    };

    return { payrollData, error, loading, currentPage, nextPage, prevPage, gotoPage, setNameSearch };
};
