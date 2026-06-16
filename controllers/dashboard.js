const Expense = require('../models/Expense')
const Budget = require('../models/Budget')
const User = require('../models/User'); // Path to your User model

module.exports = {
    getDashboard: async (req, res) =>{

        console.log(req.user);
        try{
            const userId = req.user._id;

            const expenses = await Expense.find({ userId }).sort({ date:-1 })

            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            const currentMonthExpenses = expenses.filter(e =>{
                const expenseMonth = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
                return expenseMonth === currentMonth
            });

            const categoryTotals = {};
            currentMonthExpenses.forEach(expense => {
              categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            });


            const totalSpent = currentMonthExpenses.reduce((sum, acc) => sum + acc.amount, 0);

            const budgets = await Budget.find({ userId, month: currentMonth });

            res.render('dashboard.ejs', {
                expenses: currentMonthExpenses,
                totalSpent, 
                categoryTotals, 
                budgets, 
                currentMonth
            });
        }catch(err){
            console.error(err);
            res.status(500).send(err.message)
        }

    },
    expenseForm: (req, res) =>{
        res.render('expenseForm.ejs')
    }, 
    addNewExpense: async(req, res)=>{
        try{
            const { description, amount, category, date } = req.body;
            const expense = new Expense({
                userId: req.user._id, 
                description,
                amount, 
                category, 
                date: date || new Date()
                });
            await expense.save();
                res.redirect('/dashboard');
        }catch(err){
            res.status(500).send(err.message);
            }
        }
}