const Employee = require("../../models/Employee");
const customIdRegex = /^[0-9A-Z]{4}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { errorMessages } = require("../../Middleware/messages");

const employeeValidator = {
    employee: async (employeeID) => {
        if (!employeeID || !customIdRegex.test(employeeID) || !await Employee.findOne({ customId: employeeID }))
            return errorMessages.employee.selectValidEmployee;

        return false;
    },
    password: async (password) => {
        if (!password || password.length < 8)
            return errorMessages.employee.enterValidPassword;

        return false;
    },
    permissions: async (permissions) => {
        if (!permissions || !Array.isArray(permissions) || permissions.length < 1)
            return errorMessages.employee.enterValidPermissions;

        return false;
    },
    email: async (email, customId) => {
        if (!email || !emailRegex.test(email))
            return errorMessages.validate.enterValidEmail;

        const employee = await Employee.findOne({ customId }).exec()
        if (customId && employee.contact.email == email) {
            return false;
        }

        if (await Employee.findOne({ "contact.email": email }))
            return errorMessages.employee.enterUniqueEmail;

        return false;
    }
};

module.exports = employeeValidator;