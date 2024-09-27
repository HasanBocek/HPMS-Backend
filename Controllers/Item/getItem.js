const Room = require("../../models/Room");
const Employee = require("../../models/Employee");
const Customer = require("../../models/Customer");
const Reservation = require("../../models/Reservation");
const Action = require("../../models/Action");
const Template = require("../Template");
const { errorMessages, successMessages } = require("../../Middleware/messages");

const findByCustomId = async (customId) => {
    const models = [Employee, Customer, Reservation, Room, Action];
    let result = null;
    let resource = null;

    for (let modelEntity of models) {
        result = await modelEntity.findOne({ customId });
        if (result) {
            switch (modelEntity.modelName) {
                case "Employee":
                    resource = "EMPLOYEE";
                    break;
                case "Customer":
                    resource = "CUSTOMER";
                    break;
                case "Reservation":
                    resource = "RESERVATION";
                    break;
                case "Room":
                    resource = "ROOM";
                    break;
                case "Action":
                    resource = "ACTION";
                    break;
                default:
                    resource = null;
            }
            break;
        }
    }

    return [result, resource];
};

const operation = async (req, res, result, resource) => {
    try {
        
        return {
            statusCode: 200,
            status: "success",
            data: result,
            message: successMessages.item.itemSended,
            newData: null,
            oldData: null
        };
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
};

const validatorFunctions = (req, res, result, resource) => {
    validateResult = result ? false : errorMessages.item.itemNotFound
    return [validateResult];
};

const getItem = async (req, res) => {
    const [result, resource] = await findByCustomId(req.params.id);

    return Template(
        (req, res) => operation(req, res, result, resource),
        (req, res) => validatorFunctions(req, res, result, resource),
        ["VIEW_" + resource],
        {
            actionType: "VIEW_" + resource,
            resource,
        }
    )(req, res);
};

module.exports = getItem;
