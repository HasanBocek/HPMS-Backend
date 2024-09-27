const Customer = require("../../models/Customer");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const customer = await Customer.find({}).exec();

        return {
            statusCode: 200,
            status: "success",
            data: customer,
            message: successMessages.customer.allCustomersSended,
            newData: null,
            oldData: null
        }
    } catch (err) {
        return {
            statusCode: 500,
            status: "server error",
            error: err.message,
            message: errorMessages.global.serverError,
            newData: null,
            oldData: null
        };
    }
}

const validatorFunctions = (req, res) => {
    return []
}

const getAllCustomers = Template(operation, validatorFunctions, ["GET_ALL_CUSTOMERS"], action = {
    actionType: "GET_ALL_CUSTOMERS",
    resource: "CUSTOMER"
})

module.exports = getAllCustomers;