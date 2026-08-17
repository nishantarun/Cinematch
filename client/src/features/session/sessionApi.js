import api from "../../api/axios";

export const startSession = async (roomCode) => {
  const response = await api.post(`/rooms/${roomCode}/start`);

  return response.data;
};

export const getSession = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}/session`);

  return response.data;
};

export const submitSwipe = async (roomCode, movieId, liked) => {
  const response = await api.post(`/rooms/${roomCode}/swipe`, {
    movieId,
    liked,
  });

  return response.data;
};

export const restartSession = async (roomCode) => {
  const response = await api.post(`/rooms/${roomCode}/restart`);

  return response.data;
};
