import API from '../api/axios';

export const rentGame = async (data) => {
  const response = await API.post('/rentals', data);

  return response.data;
};

export const checkoutRentals = async (data) => {
  const response = await API.post('/rentals/checkout', data);

  return response.data;
};

export const returnGame = async (rentalId) => {
  const response = await API.put(
    `/rentals/${rentalId}/return`
  );

  return response.data;
};

export const extendRental = async (rentalId, days) => {
  const response = await API.put(
    `/rentals/${rentalId}/extend`,
    { days }
  );

  return response.data;
};

export const reviewRental = async (rentalId, data) => {
  const response = await API.put(
    `/rentals/${rentalId}/review`,
    data
  );

  return response.data;
};

export const getRentalHistory = async () => {
  const response = await API.get('/rentals/history');

  return response.data;
};

export const getAllRentals = async () => {
  const response = await API.get('/rentals');

  return response.data;
};
