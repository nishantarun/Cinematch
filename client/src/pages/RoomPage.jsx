import { useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomDetails, leaveRoom } from "../features/room/roomApi.js";
import {
  getSession,
  startSession,
  restartSession,
  submitSwipe,
} from "../features/session/sessionApi.js";
import useRoomStore from "../store/roomStore.js";
import userAuthStore from "../store/authStore.js";
import useSessionStore from "../store/sessionStore.js";
import { joinSocketRoom, leaveSocketRoom } from "../socket/socket.js";
import useRoomSocket from "../hooks/useRoomSocket.js";

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

  const currentMovie = session?.movieDeck?.find(
    (movie) =>
      !session.swipes?.some(
        (swipe) => swipe.userId === userId && swipe.movieId === movie.movieId,
      ),
  );

  const handleMemberJoined = useCallback(async () => {
    try {
      const response = await getRoomDetails(roomCode);
      setRoom(response.room);
    } catch (error) {
      console.error("Failed to refresh room details:", error.response?.data);
    }
  }, [roomCode, setRoom]);

  const handleMemberLeft = useCallback(async () => {
    try {
      const response = await getRoomDetails(roomCode);
      setRoom(response.room);
    } catch (error) {
      console.error("Failed to refresh room details:", error.response?.data);
    }
  }, [roomCode, setRoom]);

  const handleSessionStarted = useCallback(async () => {
    try {
      const response = await getSession(roomCode);
      setSession(response.session);
    } catch (error) {
      console.error("Failed to refresh session:", error.response?.data);
    }
  }, [roomCode, setSession]);

  const handleSessionRestarted = useCallback(async () => {
    try {
      const response = await getSession(roomCode);
      setSession(response.session);
    } catch (error) {
      console.error("Failed to refresh session:", error.response?.data);
    }
  }, [roomCode, setSession]);

  const handleMatchFound = useCallback(async () => {
    try {
      const response = await getSession(roomCode);
      setSession(response.session);
    } catch (error) {
      console.error("Failed to refresh session:", error.response?.data);
    }
  }, [roomCode, setSession]);

  const handleSessionCompleted = useCallback(async () => {
    try {
      const response = await getSession(roomCode);
      setSession(response.session);
    } catch (error) {
      console.error("Failed to refresh session:", error.response?.data);
    }
  }, [roomCode, setSession]);

  useRoomSocket({
    onMemberJoined: handleMemberJoined,
    onMemberLeft: handleMemberLeft,
    onSessionStarted: handleSessionStarted,
    onMatchFound: handleMatchFound,
    onSessionCompleted: handleSessionCompleted,
    onSessionRestarted: handleSessionRestarted,
  });

  const handleStartSession = async () => {
    try {
      await startSession(roomCode);

      const response = await getSession(roomCode);

      setSession(response.session);
    } catch (error) {
      console.error("Failed to start session: ", error.response?.data);
    }
  };

  const handleRestartSession = async () => {
    try {
      await restartSession(roomCode);

      const response = await getSession(roomCode);

      setSession(response.session);
    } catch (error) {
      console.error("Failed to restart session:", error.response?.data);
    }
  };

  const handleSwipe = async (liked) => {
    if (!currentMovie) {
      return;
    }

    try {
      await submitSwipe(roomCode, currentMovie.movieId, liked);

      const response = await getSession(roomCode);
      setSession(response.session);
    } catch (error) {
      console.error("Failed to submit swipe:", error.response?.data);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      leaveSocketRoom(roomCode);

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

        joinSocketRoom(roomCode);

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

      {isHost && session?.status === "waiting" && (
        <button type="button" onClick={handleStartSession}>
          Start Session
        </button>
      )}

      {/* {isHost && session?.status === "completed" && (
        <button type="button" onClick={handleRestartSession}>
          Restart Session
        </button>
      )} */}

      {!isHost && session?.status === "waiting" && (
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

      {session?.status === "active" && (
        <section>
          <h2>Current Movie</h2>

          {currentMovie ? (
            <>
              <h3>{currentMovie.title}</h3>
              <p>{currentMovie.overview}</p>

              <button type="button" onClick={() => handleSwipe(false)}>
                Dislike
              </button>

              <button type="button" onClick={() => handleSwipe(true)}>
                Like
              </button>
            </>
          ) : (
            <p>You have finished all movies.</p>
          )}
        </section>
      )}
    </main>
  );
};

export default RoomPage;
