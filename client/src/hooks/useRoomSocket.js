import { useEffect } from "react";
import socket from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/events.js";

const useRoomSocket = ({
  onMemberJoined,
  onMemberLeft,
  onSessionStarted,
  onSessionRestarted,
  onMatchFound,
  onSessionCompleted,
}) => {
  useEffect(() => {
    const handleMemberJoined = (payload) => {
      onMemberJoined?.(payload);
    };

    const handleMemberLeft = (payload) => {
      onMemberLeft?.(payload);
    };

    const handleSessionStarted = () => {
      onSessionStarted?.();
    };

    const handleSessionRestarted = () => {
      onSessionRestarted?.();
    };

    const handleMatchFound = (payload) => {
      onMatchFound?.(payload);
    };

    const handleSessionCompleted = () => {
      onSessionCompleted?.();
    };

    socket.on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
    socket.on(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);
    socket.on(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
    socket.on(SOCKET_EVENTS.SESSION_RESTARTED, handleSessionRestarted);
    socket.on(SOCKET_EVENTS.MATCH_FOUND, handleMatchFound);
    socket.on(SOCKET_EVENTS.SESSION_COMPLETED, handleSessionCompleted);

    return () => {
      socket.off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
      socket.off(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);
      socket.off(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
      socket.off(SOCKET_EVENTS.SESSION_RESTARTED, handleSessionRestarted);
      socket.off(SOCKET_EVENTS.MATCH_FOUND, handleMatchFound);
      socket.off(SOCKET_EVENTS.SESSION_COMPLETED, handleSessionCompleted);
    };
  }, [
    onMemberJoined,
    onMemberLeft,
    onSessionStarted,
    onSessionRestarted,
    onMatchFound,
    onSessionCompleted,
  ]);
};

export default useRoomSocket;
