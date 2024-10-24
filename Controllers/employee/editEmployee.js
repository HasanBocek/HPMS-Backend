const Employee = require("../../models/Employee");
const validator = require("../../Middleware/Validator");
const employeeValidator = require("./employeeValidator");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const operation = async (req, res) => {
    try {
        const oldEmployee = await Employee.findOne({ customId: req.params.id });
        const { name, job, salary, jobStartDate, jobDescription, tckn, phone, email, address, note, dob, permissions } = req.body;

        const newEmployee = await Employee.findOneAndUpdate({ customId: req.params.id }, {
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
            permissions
        },
        { new: true });

        return {
            statusCode: 200,
            status: "success",
            data: newEmployee,
            message: successMessages.employee.employeeEdited,
            newData: newEmployee,
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
        validator.isString(req.body.tckn, errorMessages.global.enterTCKN),
        validator.isString(req.body.name, errorMessages.global.enterName),
        validator.isString(req.body.job, errorMessages.global.enterJob),
        validator.isInteger(req.body.salary, errorMessages.global.enterSalary),
        validator.isDate(req.body.jobStartDate, errorMessages.global.enterJobStartDate),
        validator.isString(req.body.jobDescription, errorMessages.global.enterJobDescription),
        employeeValidator.email(req.body.email, req.params.id),
        validator.phone(req.body.phone),
        validator.isString(req.body.address, errorMessages.global.enterAddress),
        validator.isDate(req.body.dob, errorMessages.global.enterDOB),
        employeeValidator.permissions(req.body.permissions)
    ]
}

const editEmployee = Template(operation, validatorFunctions, ["EDIT_EMPLOYEE"], action = {
    actionType: "EDIT_EMPLOYEE",
    resource: "EMPLOYEE"
})

module.exports = editEmployee;