import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../features/room/roomApi.js";
import useRoomStore from "../store/roomStore.js";
import userAuthStore from "../store/authStore.js";

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
    <main>
      <h1>CineMatch</h1>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <section>
        <h2>Create a room</h2>
        <button type="button" onClick={handleCreateRoom}>
          Create Room
        </button>
      </section>

      <section>
        <h2>Join a room</h2>

        <form onSubmit={handleJoinSubmit}>
          <label htmlFor="roomCode">Room Code</label>
          <input
            type="text"
            id="roomCode"
            name="roomCode"
            value={roomCode}
            onChange={handleRoomCodeChange}
            maxLength={6}
          />
          <button type="submit">Join Room</button>
        </form>
      </section>
    </main>
  );
};

export default HomePage;
