const Employee = require("../../models/Employee");
const employeeValidator = require("./employeeValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const oldEmployee = await Employee.findOne({ customId: req.params.id });
        
        await Employee.findOneAndDelete({ customId: req.params.id });

        return {
            statusCode: 200,
            status: "success",
            data: null,
            message: successMessages.employee.employeeDeleted,
            newData: null,
            oldData: oldEmployee
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
        employeeValidator.employee(req.params.id),
    ]
}

const deleteEmployee = Template(operation, validatorFunctions, ["DELETE_EMPLOYEE"], action = {
    actionType: "DELETE_EMPLOYEE",
    resource: "EMPLOYEE"
})

module.exports = deleteEmployee;