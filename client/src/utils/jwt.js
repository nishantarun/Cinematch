export const getUserIdFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decodePayload = JSON.parse(atob(payload));

    return decodePayload.userId;
  } catch {
    return null;
  }
};
