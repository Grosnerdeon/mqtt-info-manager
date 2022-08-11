class ValidationService {
    checkByRegexp (regexp: RegExp, value: string): boolean | undefined {
        return regexp.test(value);
    }
    defineIsJson = (str: string) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

export default new ValidationService()