import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../features/room/roomApi.js";
import useRoomStore from "../store/roomStore.js";
import userAuthStore from "../store/authStore.js";

import ThemeToggle from "../components/ThemeToggle.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");

  const handleRoomCodeChange = (event) => {
    setRoomCode(event.target.value);
  };

  const navigate = useNavigate();

  const logout = userAuthStore((state) => state.logout);

  const setRoom = useRoomStore((state) => state.setRoom);

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom();

      setRoom(response.room);
      navigate(`/room/${response.room.roomCode}`);
    } catch (error) {
      console.error("Failed to create room: ", error.response?.data);
    }
  };

  const handleJoinSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await joinRoom(roomCode);

      setRoom(response.room);
      navigate(`/room/${response.room.roomCode}`);
    } catch (error) {
      console.error("Failed to join room: ", error.response?.data);
    }
  };

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-background text-text">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">CineMatch</h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Button variant="ghost" onClick={handleLogout} fullWidth={false}>
            Logout
          </Button>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Find something everyone wants to watch
          </p>

          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Movie night,
            <br />
            without the arguing.
          </h2>

          <p className="mt-5 text-lg text-text-muted">
            Create a room, invite your friends, and swipe through movies
            together. CineMatch finds the movies everyone likes.
          </p>
        </div>

        <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
          <Card>
            <h3 className="text-xl font-semibold">Create a room</h3>

            <p className="mt-2 text-sm text-text-muted">
              Start a new movie session and invite your friends.
            </p>

            <Button onClick={handleCreateRoom}>Create Room</Button>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold">Join a room</h3>

            <p className="mt-2 text-sm text-text-muted">
              Already have a room code? Join your friends.
            </p>

            <form
              onSubmit={handleJoinSubmit}
              className="mt-6 flex flex-col gap-3"
            >
              <label htmlFor="roomCode" className="text-sm font-medium">
                Room Code
              </label>

              <Input
                id="roomCode"
                name="roomCode"
                value={roomCode}
                onChange={handleRoomCodeChange}
                maxLength={6}
                placeholder="Enter 6-character code"
              />

              <Button type="submit" variant="secondary">
                Join Room
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
