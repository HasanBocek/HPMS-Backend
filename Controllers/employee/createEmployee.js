const Employee = require("../../models/Employee");
const employeeValidator = require("./employeeValidator");
const validator = require("../../Middleware/Validator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const { name, job, salary, jobStartDate, jobDescription, tckn, phone, email, address, note, dob, password, permissions } = req.body;
        const newEmployee = await Employee.create({
            name,
            job,
            salary,
            jobStartDate,
            jobDescription,
            contact: {
                tckn,
                phone,
                email,
                address,
            },
            note: note || "",
            dob,
            password,
            permissions
        });

        return {
            statusCode: 200,
            status: "success",
            data: newEmployee,
            message: successMessages.employee.employeeCreated,
            newData: newEmployee,
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
        validator.isString(req.body.job, errorMessages.global.enterJob),
        validator.isInteger(req.body.salary, errorMessages.global.enterSalary),
        validator.isDate(req.body.jobStartDate, errorMessages.global.enterJobStartDate),
        validator.isString(req.body.jobDescription, errorMessages.global.enterJobDescription),
        employeeValidator.email(req.body.email),
        validator.phone(req.body.phone),
        validator.isString(req.body.address, errorMessages.global.enterAddress),
        validator.isDate(req.body.dob, errorMessages.global.enterDOB),
        employeeValidator.password(req.body.password),
        employeeValidator.permissions(req.body.permissions)
    ]
}

const createEmployee = Template(operation, validatorFunctions, ["CREATE_EMPLOYEE"], action = {
    actionType: "CREATE_EMPLOYEE",
    resource: "EMPLOYEE"
})

module.exports = createEmployee;