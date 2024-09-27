const Customer = require("../../models/Customer");
const customerValidator = require("./customerValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const customer = await Customer.findOne({ customId: req.params.id }).exec();

        return {
            statusCode: 200,
            status: "success",
            data: customer,
            message: successMessages.customer.customerSended,
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
    return [
        customerValidator.customer(req.params.id),
    ]
}

const getCustomer = Template(operation, validatorFunctions, ["GET_CUSTOMER"], action = {
    actionType: "GET_CUSTOMER",
    resource: "CUSTOMER"
})

module.exports = getCustomer;