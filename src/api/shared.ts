import { useState, useEffect, useCallback } from 'react';

export const getAPI = (endpoint: string, offset: number) => `http://127.0.0.1:5000/api/${endpoint}?page=${offset}`;

interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
}

// function to make requests to the backend
const requestBackend = async <T>(url: string, page: number, options: RequestOptions = {}): Promise<T> => {
    const response = await fetch(getAPI(url, page), options);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json() as Promise<T>;
};

export type PayrollRecord = {
    id: number;
    name: string;
    job_title: string;
    annualSalary: number;
};

export type PayrollInfo = {
    max_page: number;
    payrollRecords: PayrollRecord[];
};

export type FetchError = {
    error: string;
    canRetry: boolean;
};

export const getPayroll = async (page: number) => {
    try {
        const payroll = await requestBackend<PayrollInfo>('payroll', page, { method: 'GET' });
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
  
    const fetchPayroll = useCallback(async (page: number) => {
      setLoading(true);
      setError(null);
  
      const result = await getPayroll(page);
  
      if ('error' in result) {
        setError(result);
      } else {
        setPayrollData(result);
      }
  
      setLoading(false);
    }, []);
  
    useEffect(() => {
      fetchPayroll(currentPage);
    }, [currentPage, fetchPayroll]);
  
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
  
    return { payrollData, error, loading, currentPage, nextPage, prevPage };
  };