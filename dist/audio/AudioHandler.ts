export function AudioHandler() {
/**Play SFX for errors, success, warnings */
    const errorSfx = new Audio("./error.mp3");
    const successSfx: HTMLAudioElement = new Audio("./success.mp3");
    const warningSfx: HTMLAudioElement = new Audio("./warning.mp3");
    
    function playError() {
        errorSfx.play().catch((err: Error) => {
        console.error(err);
        });
    }
    
    function playSuccess() {
        successSfx.play().catch((err) => {
        console.error(err);
        });
    }
    
    function playWarning() {
        warningSfx.play().catch((err) => {
        console.error(err);
        });
    }
    
    return {
        playError,
        playSuccess,
        playWarning,
    };
}