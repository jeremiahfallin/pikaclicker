// Firebase (Google sign-in, cloud saves and gym leader parties) is loaded on
// demand rather than bundled into the first download, so the game renders
// before the SDK arrives. Every caller shares the one import; if it fails
// (say, the player is offline) the next call tries again.
let firebase;

export const loadFirebase = () =>
  (firebase ??= import("@/firebase").catch((error) => {
    firebase = undefined;
    throw error;
  }));
