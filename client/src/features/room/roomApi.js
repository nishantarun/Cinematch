import api from "../../api/axios.js";

export const createRoom = async () => {
  const response = await api.post("/rooms");
  return response.data;
};

export const joinRoom = async (roomCode) => {
  const response = await api.post("/rooms/join", {
    roomCode,
  });
  return response.data;
};

export const getRoomDetails = async (roomCode) => {
  const response = await api.get(`/rooms/${roomCode}`);
  return response.data;
};

export const leaveRoom = async (roomCode) => {
  const response = await api.post(`/rooms/${roomCode}/leave`);
  return response.data;
};
