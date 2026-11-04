import axios from 'axios';
import { useCallback, useState } from 'react';
import type { BikeModel, CreateBikeModel, UpdateBikeModel } from '../models/BikeModel';

interface BikesPageResponse {
  totalCount: number;
  bikes: BikeModel[];
}

export const useBikesProvider = () => {
  const [bikes, setBikes] = useState<BikeModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = useCallback(
    (nextPage = page, nextLimit = pageSize) => {
      setIsLoading(true);
      return axios
        .get<BikesPageResponse>('http://localhost:3000/bikes', {
          params: { page: nextPage, limit: nextLimit },
        })
        .then(result => {
          setBikes(result.data.bikes);
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

  const deleteBike = (id: string) =>
    axios.delete(`http://localhost:3000/bikes/${id}`).then(() => {
      setBikes(prev => prev.filter(bike => bike.id !== id));
      setTotalCount(prev => Math.max(prev - 1, 0));
    });

  const createBike = (input: CreateBikeModel) =>
    axios.post<BikeModel>('http://localhost:3000/bikes', input).then(result => {
      setBikes(prev =>
        [...prev, result.data].sort(
          (a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model),
        ),
      );
      setTotalCount(prev => prev + 1);
      return result.data;
    });

  const updateBike = (id: string, input: UpdateBikeModel) =>
    axios.patch<BikeModel>(`http://localhost:3000/bikes/${id}`, input).then(result => {
      setBikes(prev =>
        prev
          .map(bike => (bike.id === id ? result.data : bike))
          .sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model)),
      );
      return result.data;
    });

  return { bikes, totalCount, page, pageSize, isLoading, load, deleteBike, createBike, updateBike };
};
