import { useEffect } from "react";
import socket from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/events.js";

const useRoomSocket = (
  onMemberJoined,
  onMemberLeft,
  onSessionStarted,
  onSessionRestarted,
) => {
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

    socket.on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
    socket.on(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);
    socket.on(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
    socket.on(SOCKET_EVENTS.SESSION_RESTARTED, handleSessionRestarted);

    return () => {
      socket.off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
      socket.off(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);
      socket.off(SOCKET_EVENTS.SESSION_STARTED, handleSessionStarted);
      socket.off(SOCKET_EVENTS.SESSION_RESTARTED, handleSessionRestarted);
    };
  }, [onMemberJoined, onMemberLeft, onSessionStarted, onSessionRestarted]);
};

export default useRoomSocket;
