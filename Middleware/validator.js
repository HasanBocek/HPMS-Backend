const { errorMessages, successMessages } = require("./messages");
const dateRegex = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validator = {
    isString: async (value, message) => {
        if (!value || typeof value !== "string")
            return message;

        return false;
    },
    isInteger: async (value, message) => {
        if ((!value || !Number.isInteger(value)) && value != 0)
            return message;

        return false;
    },
    isDate: async (value, message) => {
        if (!value || !dateRegex.test(value) || isNaN(new Date(value).getTime())) 
            return message;
        
        return false;
    },
    email: async (value) => {
        if (!value || !emailRegex.test(value))
            return errorMessages.validate.enterValidEmail;

        return false;
    },
    phone: async (value) => {
        if (!value || !phoneRegex.test(value))
            return errorMessages.validate.enterValidPhone;

        return false;
    },
    isBoolean: async (value, message) => {
        if (typeof value !== "boolean")
            return message;

        return false;
    }
}

module.exports = validator;