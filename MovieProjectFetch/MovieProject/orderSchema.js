const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    StoreID: {
        type: Number,
        required: true
    },
    SalesPersonID: {
        type: Number,
        required: true
    },
    CdID: {
        type: Number,
        required: true
    },
    PricePaid: {
        type: Number,
        required: true
    },
    Date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("OrderCollection", OrderSchema);