const Customer = require("../../models/Customer");
const customerValidator = require("./customerValidator");
const Reservation = require("../../models/Reservation");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const customer = await Customer.findOne({ customId: req.params.id }).exec();
        if (customer.reservations.length > 0) {
            customer.reservations.forEach(async reservationId => {
                await Reservation.findOneAndUpdate(
                    { customId: reservationId },
                    { $pull: { customers: req.params.id } }
                );
            })
        }

        await Customer.findOneAndDelete({ customId: req.params.id });

        return {
            statusCode: 200,
            status: "success",
            data: null,
            message: successMessages.customer.customerDeleted,
            newData: null,
            oldData: customer
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
        customerValidator.customer(req.params.id)
    ]
}

const deleteCustomer = Template(operation, validatorFunctions, ["DELETE_CUSTOMER"], action = {
    actionType: "DELETE_CUSTOMER",
    resource: "CUSTOMER"
})

module.exports = deleteCustomer;