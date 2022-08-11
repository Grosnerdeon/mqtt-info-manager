import { IVerification } from "../interfaces/verification";

class Verification {
    verifyStringWithRegExp (regExp: RegExp, str: string, error: string): IVerification {
        return regExp.test(str) ? { error: null } : { error };
    }

    verifyForDuplicates (keysArray: any[], entityId: any, error: string): IVerification {
        return keysArray.includes(entityId) ? { error } : { error: null };
    }

    generateErrorMessage (error: string): IVerification {
        return { error };
    }
}

export default new Verification();