export const REGEXP_VALIDATION = {
    URL: {
        REGEXP: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gm,
        TEXT_VALIDATION: 'Incorrect Url (Example Correct: 127.0.0.1)'
    },
    PORT: {
        REGEXP: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/gm,
        TEXT_VALIDATION: 'Incorrect Port (Example Correct: 1883)'
    },
    TOPIC_BY_PUBLISHER: {
        REGEXP: /[a-zA-Z0-9]/gm,
        TEXT_VALIDATION: 'Incorrect Topic by Publisher (Example Correct: test/1)'
    }
}