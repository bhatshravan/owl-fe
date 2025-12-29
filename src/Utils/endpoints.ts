export const ENDPOINTS = {
  LOGIN: "https://owlbe.bitstreak.in/api/v1/auth/login",
  REGISTER: "https://owlbe.bitstreak.in/api/v1/auth/register",
  PROFILE: "https://owlbe.bitstreak.in/api/v1/user/profile",
  UPDATE_PROFILE: "https://owlbe.bitstreak.in/api/v1/user/update-profile",
  INSTRUMENTS: "https://owlbe.bitstreak.in/api/v1/instruments",
  INSTRUMENTS_BY_ID: (id: string) =>
    `https://owlbe.bitstreak.in/api/v1/instruments/${id}`,
  INSTRUMENTS_BY_TYPE: (type: string) =>
    `https://owlbe.bitstreak.in/api/v1/instruments/type/${type}`,
  POSITIONS: "https://owlbe.bitstreak.in/api/v1/kite/positions",
};
