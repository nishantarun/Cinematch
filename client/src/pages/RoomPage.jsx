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
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

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
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-text">
        <p className="text-text-muted">Loading room...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">CineMatch</h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button variant="ghost" onClick={handleLeaveRoom} fullWidth={false}>
            Leave Room
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Room information */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-text-muted">
                Room
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight">
                {roomCode}
              </h2>
            </div>

            <div className="rounded-full border border-border bg-surface px-4 py-2 text-sm">
              Session:{" "}
              <span className="font-medium capitalize">{session?.status}</span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Members */}
          <Card>
            <h2 className="text-lg font-semibold">Members</h2>

            <ul className="mt-4 space-y-3">
              {room.members.map((member) => (
                <li key={member._id} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {member.username.charAt(0).toUpperCase()}
                  </span>

                  <span className="text-sm font-medium">
                    {member.username}
                    {member._id === room.host._id && (
                      <span className="ml-2 text-xs text-text-muted">Host</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Main session area */}
          <div className="min-w-0">
            {session?.status === "waiting" && (
              <Card>
                <div className="py-12 text-center">
                  <p className="text-sm font-medium uppercase tracking-wider text-primary">
                    Ready when you are
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    Waiting for the session
                  </h2>

                  {isHost ? (
                    <>
                      <p className="mx-auto mt-3 max-w-md text-text-muted">
                        Everyone is in the room. Start the session when you're
                        ready to begin matching movies.
                      </p>

                      <div className="mx-auto mt-6 max-w-xs">
                        <Button onClick={handleStartSession}>
                          Start Session
                        </Button>
                      </div>
                    </>
                  ) : (
                    <p className="mt-3 text-text-muted">
                      Waiting for the host to start...
                    </p>
                  )}
                </div>
              </Card>
            )}

            {session?.status === "active" && (
              <Card>
                {currentMovie ? (
                  <div>
                    <div className="mb-8">
                      <p className="text-sm font-medium uppercase tracking-wider text-primary">
                        Now showing
                      </p>

                      <h2 className="mt-2 text-3xl font-bold tracking-tight">
                        {currentMovie.title}
                      </h2>
                    </div>

                    <div className="rounded-xl border border-border bg-background p-5">
                      <p className="leading-7 text-text-muted">
                        {currentMovie.overview}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleSwipe(false)}
                      >
                        Dislike
                      </Button>

                      <Button onClick={() => handleSwipe(true)}>Like</Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center">
                    <p className="text-2xl font-semibold">You're done voting</p>

                    <p className="mt-2 text-text-muted">
                      You've finished all the movies. Waiting for the other
                      members...
                    </p>
                  </div>
                )}
              </Card>
            )}

            {session?.status === "completed" && (
              <Card>
                <div className="mb-8">
                  <p className="text-sm font-medium uppercase tracking-wider text-primary">
                    Session complete
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Your movie matches
                  </h2>

                  <p className="mt-2 text-text-muted">
                    Movies everyone in the room liked.
                  </p>
                </div>

                {session.matches?.length > 0 ? (
                  <div className="space-y-4">
                    {session.matches.map((movie) => (
                      <article
                        key={movie.movieId}
                        className="rounded-xl border border-border bg-background p-5"
                      >
                        <h3 className="text-xl font-semibold">{movie.title}</h3>

                        <p className="mt-2 leading-7 text-text-muted">
                          {movie.overview}
                        </p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-background p-8 text-center">
                    <p className="font-medium">No matches found.</p>

                    <p className="mt-1 text-sm text-text-muted">
                      Looks like everyone's movie taste was a little different
                      this time.
                    </p>
                  </div>
                )}

                {isHost && (
                  <div className="mt-8 max-w-xs">
                    <Button onClick={handleRestartSession}>
                      Restart Session
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomPage;
