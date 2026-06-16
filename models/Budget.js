const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }, 
    category:{
        type: String, 
        enum: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other'],
        required: true
    }, 
    limit:{
        type: Number, 
        required: true
    }, 
    month:{
        type: String, // Format "2026-01" for january 2026
        required: true
    }, 
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Budget", budgetSchema)