export const AudioHandler = (() => {
  const errorSfx = new Audio("/audio/error.mp3");
  const successSfx = new Audio("/audio/success.mp3");
  const warningSfx = new Audio("/audio/warning.mp3");

  return {
    playError: () => errorSfx.play().catch(console.error),
    playSuccess: () => successSfx.play().catch(console.error),
    playWarning: () => warningSfx.play().catch(console.error),
  };
})();
