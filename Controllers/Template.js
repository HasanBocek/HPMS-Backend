const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Action = require("../models/Action");
const { errorMessages } = require("../Middleware/messages");
let responseBody;
let code;

/*
response = { statusCode: 200, status: "success", data: employee, message: "İşlem başarılı" };
response = { statusCode: 400, status: "error", error: "Bir hata oluştu.", message: "İşlem başarısız" };
response = { statusCode: 500, status: "server error", error: "Bir sunucu hatası oluştu.", message: "Sunucu hatası" };
response = { statusCode: 500, status: "unknown", error: null, data:null, message: "Bilinmeyen hata" };
*/

const handleValidationErrors = async (validatorFunctions, req, res) => {
    try {
        const errors = await Promise.all(validatorFunctions(req, res));
        const errorsArray = errors.filter(Boolean);

        if (errorsArray.length > 0) {
            responseBody = {
                status: "error",
                message: errorMessages.global.validationError,
                error: errorsArray
            };
            code = 400;

            return "Validation error";
        }

        return null;
    } catch (error) {
        responseBody = {
            status: "server error",
            message: errorMessages.global.serverError,
            error: [error.message]
        };
        code = 500;
        return "Server error";
    }

};

const handleOperation = async (operation, req, res, employee) => {
    try {
        const response = await operation(req, res, employee);

        responseBody = {
            status: response.status || "unknown",
            message: response.message || errorMessages.template.unknownError,
            error: [response.error] || null,
            data: response.data || null
        };
        code = response.statusCode || 500;

        return {
            newData: response.newData,
            oldData: response.oldData
        };
    } catch (error) {
        responseBody = {
            status: "server error",
            message: errorMessages.global.serverError,
            error: [error.message]
        };
        code = 500

        return "Server error";
    }
};

const checkPermission = async (employee, perms) => {
    try {
        if (employee.permissions.includes("ADMINISTRATOR")) return null;
        if (perms && perms.length > 0) {
            const hasPermission = perms.every(perm => employee.permissions.includes(perm));
            if (!hasPermission) {
                responseBody = {
                    status: "error",
                    message: errorMessages.template.authorizationError,
                    error: [errorMessages.template.permissionError]
                }
                code = 401;
                return "Permission error";
            }
            return null
        }
        return null
    } catch (error) {
        responseBody = {
            status: "server error",
            message: errorMessages.global.serverError,
            error: [error.message]
        };
        code = 500;

        return "Server error";
    }
};

const fetchEmployee = async (req) => {
    try {
        const token = req.cookies.jwt || "";
        if (!token) {
            responseBody = {
                status: "error",
                message: errorMessages.template.authorizationError,
                error: [errorMessages.template.permissionError]
            };
            code = 401;
            return null;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            responseBody = {
                status: "error",
                message: errorMessages.template.authorizationError,
                error: [errorMessages.template.permissionError]
            };
            code = 401;

            return null;
        }

        const employee = await Employee.findById(decodedToken._id);
        if (!employee) {
            responseBody = {
                status: "error",
                message: errorMessages.template.authorizationError,
                error: [errorMessages.template.permissionError]
            };
            code = 401;

            return null;
        }

        return employee;
    } catch (error) {
        responseBody = {
            status: "error",
            message: errorMessages.template.authorizationError,
            error: [errorMessages.template.permissionError]
        };
        code = 401;

        return null;
    }
};

const Template = (operation, validatorFunctions, perms, action) => {
    return async (req, res) => {
        const employee = await fetchEmployee(req);

        if (!employee) {
            Action.create({
                employeeId: null,
                employee: {},
                actionType: action.actionType,
                resource: action.resource,
                time: new Date(),
                responseBody: responseBody || {},
                requestBody: req.body || {},
                result: "failed by authorization",
                failType: "authorization",
                url: req.originalUrl,
                headers: JSON.stringify(req.headers),
                ip: req.ip,
                error: {}
            });

            return res.status(code).json(responseBody);
        }

        const permissionCheck = await checkPermission(employee, perms);
        if (permissionCheck) {
            Action.create({
                employeeId: employee.customId,
                employee: employee,
                actionType: action.actionType,
                resource: action.resource,
                time: new Date(),
                responseBody: responseBody || {},
                requestBody: req.body || {},
                result: "failed by permission check",
                failType: "permission",
                url: req.originalUrl,
                headers: JSON.stringify(req.headers),
                ip: req.ip,
                error: {}
            });

            return res.status(code).json(responseBody);
        }

        const validationResult = await handleValidationErrors(validatorFunctions, req, res);
        if (validationResult) {
            Action.create({
                employeeId: employee.customId,
                employee: employee,
                actionType: action.actionType,
                resource: action.resource,
                time: new Date(),
                responseBody: responseBody || {},
                requestBody: req.body || {},
                result: "failed by validation",
                failType: "validation",
                url: req.originalUrl,
                headers: JSON.stringify(req.headers),
                ip: req.ip,
                error: {}
            });

            return res.status(code).json(responseBody);
        }

        handleOperation(operation, req, res)
            .then((response) => {
                Action.create({
                    employeeId: employee.customId,
                    employee: employee,
                    actionType: action.actionType,
                    resource: action.resource,
                    time: new Date(),
                    responseBody: responseBody || {},
                    requestBody: req.body || {},
                    result: "success",
                    failType: "success",
                    url: req.originalUrl,
                    headers: JSON.stringify(req.headers),
                    ip: req.ip,
                    error: {},
                    oldData: response.oldData,
                    newData: response.newData
                });

                return res.status(code).json(responseBody);
            })
            .catch((error) => {
                Action.create({
                    employeeId: employee.customId,
                    employee: employee,
                    actionType: action.actionType,
                    resource: action.resource,
                    time: new Date(),
                    responseBody: {
                        status: "server error",
                        message: errorMessages.global.serverError,
                        error: "."
                    },
                    requestBody: req.body || {},
                    result: "failed by server",
                    failType: "server",
                    url: req.originalUrl,
                    headers: JSON.stringify(req.headers),
                    ip: req.ip,
                    error: error
                });

                return res.status(500).json({
                    status: "server error",
                    message: errorMessages.global.serverError,
                    error: ["."]
                });
            });
    };
};

module.exports = Template;