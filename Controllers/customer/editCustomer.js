const Customer = require("../../models/Customer");
const customerValidator = require("./customerValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const { name, tckn, address, email, gender, phone, nation, note } = req.body;
        const oldCustomer = await Customer.findOne({ customId: req.params.id }).exec();

        const newCustomer = await Customer.findOneAndUpdate(
            {customId: req.params.id},
            { name, tckn, address, email, gender, phone, nation, note: note || "" },
            { new: true }
        );

        return {
            statusCode: 200,
            status: "success",
            data: newCustomer,
            message: successMessages.customer.customerEdited,
            newData: newCustomer,
            oldData: oldCustomer
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
        validator.isString(req.body.tckn, errorMessages.global.enterTCKN),
        validator.isString(req.body.name, errorMessages.global.enterName),
        validator.isString(req.body.address, errorMessages.global.enterAddress),
        validator.email(req.body.email),
        validator.isString(req.body.gender, errorMessages.global.enterGender),
        validator.phone(req.body.phone),
        validator.isString(req.body.nation, errorMessages.global.enterNation),
    ]
}

const editCustomer = Template(operation, validatorFunctions, ["EDIT_CUSTOMER"], action = {
    actionType: "EDIT_CUSTOMER",
    resource: "CUSTOMER"
})

module.exports = editCustomer;