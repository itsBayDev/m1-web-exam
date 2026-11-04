import axios from 'axios';
import { useCallback, useState } from 'react';
import type { CreateCustomerModel, CustomerModel } from '../models/CustomerModel';

interface CustomersPageResponse {
  totalCount: number;
  customers: CustomerModel[];
}

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = useCallback(
    (nextPage = page, nextLimit = pageSize) => {
      setIsLoading(true);
      return axios
        .get<CustomersPageResponse>('http://localhost:3000/customers', {
          params: {
            page: nextPage,
            limit: nextLimit,
          },
        })
        .then(result => {
          setCustomers(result.data.customers);
          setTotalCount(result.data.totalCount);
          setPage(nextPage);
          setPageSize(nextLimit);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [page, pageSize],
  );

  const deleteCustomer = (id: string) => {
    return axios.delete(`http://localhost:3000/customers/${id}`).then(() => {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      setTotalCount(prev => Math.max(prev - 1, 0));
    });
  };

  const createCustomer = (input: CreateCustomerModel) =>
    axios.post<CustomerModel>('http://localhost:3000/customers', input).then(result => {
      setCustomers(prev =>
        [...prev, result.data].sort(
          (a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
        ),
      );
      setTotalCount(prev => prev + 1);
    });

  return {
    customers,
    totalCount,
    page,
    pageSize,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
