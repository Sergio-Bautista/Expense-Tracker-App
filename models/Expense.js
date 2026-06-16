const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        require: true
    }, 
    description:{
        type: String, 
        require: true
    }, 
    amount: {
        type: Number, 
        require: true
    }, 
    category: {
        type: String,
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
        default: 'Other'
    }, 
    date:{
        type:Date, 
        default: Date.now
    }, 
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Expense", expenseSchema)