const Employee = require("../../models/Employee");
const employeeValidator = require("./employeeValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const employees = await Employee.find({}).exec();
        return {
            statusCode: 200,
            status: "success",
            data: employees,
            message: successMessages.employee.allEmployeesSended,
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

const getAllEmployees = Template(operation, validatorFunctions, ["GET_ALL_EMPLOYEES"], action = {
    actionType: "GET_ALL_EMPLOYEES",
    resource: "EMPLOYEE"
})

module.exports = getAllEmployees;