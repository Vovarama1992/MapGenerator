class FileAccessException extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileAccessException';
    }
}

module.exports = FileAccessException;