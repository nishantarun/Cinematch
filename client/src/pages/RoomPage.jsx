import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoomDetails } from "../features/room/roomApi.js";
import { getSession, startSession } from "../features/session/sessionApi.js";
import useRoomStore from "../store/roomStore.js";
import userAuthStore from "../store/authStore.js";
import useSessionStore from "../store/sessionStore.js";

const RoomPage = () => {
  const { roomCode } = useParams();

  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);

  const userId = userAuthStore((state) => state.userId);
  const isHost = room?.host?._id === userId;

  const session = useSessionStore((state) => state.session);
  const setSession = useSessionStore((state) => state.setSession);

  const handleStartSession = async () => {
    try {
      await startSession(roomCode);

      const response = await getSession(roomCode);

      setSession(response.session);
    } catch (error) {
      console.error("Failed to start session: ", error.response?.data);
    }
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await getRoomDetails(roomCode);
        setRoom(response.room);

        const sessionResponse = await getSession(roomCode);
        setSession(sessionResponse.session);
      } catch (error) {
        console.error("Failed to fetch room details: ", error.response?.data);
      }
    };
    fetchRoomDetails();
  }, [roomCode, setRoom, setSession]);

  if (!room) {
    return <p>Loading Room...</p>;
  }

  return (
    <main>
      <h1>Room</h1>
      <p>Room code: {roomCode}</p>
      <p>Session status: {session?.status}</p>
      {isHost ? (
        <button type="button" onClick={handleStartSession}>
          Start Session
        </button>
      ) : (
        <p>Waiting for host to start...</p>
      )}

      <h2>Members</h2>
      <ul>
        {room.members.map((member) => {
          return <li key={member._id}>{member.username}</li>;
        })}
      </ul>
    </main>
  );
};

export default RoomPage;
