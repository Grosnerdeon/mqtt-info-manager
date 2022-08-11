export const circularJSON = require('circular-json');

export const generateId = (
    length: number = 10, 
    maximumValueFromCharacterASC: number = 36,
    initialSelectionValue: number = 2
    ): string => {
        return Math.random()
                    .toString(maximumValueFromCharacterASC)
                    .substr(initialSelectionValue, length);
}

export const defineIsJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}