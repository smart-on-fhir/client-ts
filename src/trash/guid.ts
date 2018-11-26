const EMPTY = "00000000-0000-0000-0000-000000000000";

function _padLeft(paddingString, width, replacementChar) {
    return paddingString.length >= width ?
        paddingString :
        _padLeft(replacementChar + paddingString, width, replacementChar || " ");
}

function _s4(num) {
    const hexadecimalResult = num.toString(16);
    return _padLeft(hexadecimalResult, 4, "0");
}

function _cryptoGuid() {
    const buffer = new window.Uint16Array(8);
    window.crypto.getRandomValues(buffer);
    return [
        _s4(buffer[0]) + _s4(buffer[1]),
        _s4(buffer[2]),
        _s4(buffer[3]),
        _s4(buffer[4]),
        _s4(buffer[5]) + _s4(buffer[6]) + _s4(buffer[7])
    ].join("-");
}

function _guid() {
    let currentDateMilliseconds = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, currentChar => {
        const randomChar = (currentDateMilliseconds + Math.random() * 16) % 16 | 0;
        currentDateMilliseconds = Math.floor(currentDateMilliseconds / 16);
        return (currentChar == "x" ? randomChar : (randomChar & 0x7 | 0x8)).toString(16);
    });
}

function create() {
    const hasCrypto = typeof (window.crypto) != "undefined",
    hasRandomValues = hasCrypto && typeof (window.crypto.getRandomValues) != "undefined";
    return (hasCrypto && hasRandomValues) ? _cryptoGuid() : _guid();
}

export default {
  newGuid: create,
  empty: EMPTY
};
