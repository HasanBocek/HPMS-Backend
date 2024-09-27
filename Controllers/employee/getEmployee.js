const Employee = require("../../models/Employee");
const employeeValidator = require("./employeeValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const employee = await Employee.findOne({ customId: req.params.id }).exec();
        return {
            statusCode: 200,
            status: "success",
            data: employee,
            message: successMessages.employee.employeeSended,
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
        employeeValidator.employee(req.params.id),
    ]
}

const getEmployee = Template(operation, validatorFunctions, ["GET_EMPLOYEE"], action = { 
    actionType: "GET_EMPLOYEE",
    resource: "EMPLOYEE"
 })

module.exports = getEmployee;