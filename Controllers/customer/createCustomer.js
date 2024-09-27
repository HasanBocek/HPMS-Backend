const Customer = require("../../models/Customer");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const { name, tckn, address, email, gender, phone, nation, note } = req.body;
        const newCustomer = await Customer.create({
            name,
            tckn,
            address,
            email,
            gender,
            phone,
            nation,
            note: note || ""
        });

        return {
            statusCode: 200,
            status: "success",
            data: newCustomer,
            message: successMessages.customer.customerCreated,
            newData: newCustomer,
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
        validator.isString(req.body.tckn, errorMessages.global.enterTCKN),
        validator.isString(req.body.name, errorMessages.global.enterName),
        validator.isString(req.body.address, errorMessages.global.enterAddress),
        validator.email(req.body.email),
        validator.isString(req.body.gender, errorMessages.global.enterGender),
        validator.phone(req.body.phone),
        validator.isString(req.body.nation, errorMessages.global.enterNation),
    ]
}

const createCustomer = Template(operation, validatorFunctions, ["CREATE_CUSTOMER"], action = {
    actionType: "CREATE_CUSTOMER",
    resource: "CUSTOMER"
})

module.exports = createCustomer;