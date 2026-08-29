import { useEffect } from "react";
import socket from "../socket/socket.js";
import { SOCKET_EVENTS } from "../socket/events.js";

const useRoomSocket = (onMemberJoined, onMemberLeft) => {
  useEffect(() => {
    const handleMemberJoined = (payload) => {
      onMemberJoined?.(payload);
    };

    const handleMemberLeft = (payload) => {
      onMemberLeft?.(payload);
    };

    socket.on(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
    socket.on(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);

    return () => {
      socket.off(SOCKET_EVENTS.MEMBER_JOINED, handleMemberJoined);
      socket.off(SOCKET_EVENTS.MEMBER_LEFT, handleMemberLeft);
    };
  }, [onMemberJoined, onMemberLeft]);
};

export default useRoomSocket;
