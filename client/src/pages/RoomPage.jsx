import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails, leaveRoom } from "../features/room/roomApi.js";
import { getSession, startSession } from "../features/session/sessionApi.js";
import useRoomStore from "../store/roomStore.js";
import userAuthStore from "../store/authStore.js";
import useSessionStore from "../store/sessionStore.js";

const RoomPage = () => {
  const navigate = useNavigate();
  const clearRoom = useRoomStore((state) => state.clearRoom);
  const clearSession = useSessionStore((state) => state.clearSession);

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

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(roomCode);

      clearRoom();
      clearSession();

      navigate("/home");
    } catch (error) {
      console.error("Failed to leave room:", error.message?.data);
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

        clearRoom();
        clearSession();
        navigate("/home");
      }
    };
    fetchRoomDetails();
  }, [roomCode, setRoom, setSession, clearRoom, clearSession, navigate]);

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
      <button type="button" onClick={handleLeaveRoom}>
        Leave Room
      </button>
    </main>
  );
};

export default RoomPage;
