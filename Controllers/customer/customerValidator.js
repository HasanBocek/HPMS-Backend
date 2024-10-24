const Customer = require("../../models/Customer");
const customIdRegex = /^[0-9A-Z]{4}$/
const { errorMessages } = require("../../Middleware/messages");

const customerValidator = {
    customer: async (customerID) => {
        if (!customerID || !customIdRegex.test(customerID) || !await Customer.findOne({ customId: customerID }))
            return errorMessages.customer.selectValidCustomer;
        return false;
    }
};

module.exports = customerValidator;