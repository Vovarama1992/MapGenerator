class InvalidDataException extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidDataException';
    }
}

module.exports = InvalidDataException;