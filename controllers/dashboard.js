const Expense = require('../models/Expense')
const Budget = require('../models/Budget')
const User = require('../models/User'); // Path to your User model

module.exports = {
    getDashboard: async (req, res) =>{

        console.log(req.user);
        try{
            const userId = req.user._id;
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            const expenses = await Expense.find({ userId }).sort({ date:-1 })
            // const budgets = await Budget.find({ userId })
            const budgets = await Budget.find({
                userId, 
                month: currentMonth
            })
            const currentMonthExpenses = expenses.filter(e =>{
                const expenseMonth = `${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, '0')}`;
                return expenseMonth === currentMonth
            });

            const categoryTotals = {};
            currentMonthExpenses.forEach(expense => {
              categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
            });

            
            const totalSpent = currentMonthExpenses.reduce((sum, acc) => sum + acc.amount, 0);
            // const totalBudget= budgets.reduce((sum, acc) => sum + acc.limit, 0);
            
            if(budgets){
               const budgetCategory = {};
               budgets.forEach(b => {
                budgetCategory[b.category] = (budgetCategory[b.category] || 0 ) + b.limit
               })

                const budgetMap = {};

                for (const b of budgets) {
                    budgetMap[b.category] = (budgetMap[b.category] || 0) + b.limit;
                }

                const budgetCategoryTotals = {};

                for (const category in budgetMap) {
                    const spent = categoryTotals[category] || 0;
                    const limit = budgetMap[category];

                    budgetCategoryTotals[category] = limit - spent;
                }

                console.log(budgetCategoryTotals);


               
            //    const budgetCategoryTotals = {}

            //     for (const category in budgetCategory) {
            //         const spent = budgetCategory[category];
                
            //         const limit = budgets
            //             .filter(budget => budget.category === category)
            //             .reduce((sum, budget) => sum + budget.limit, 0);
                
            //         const remaining = limit - spent;
            //         budgetCategoryTotals[category] = remaining

            //         // console.log("Category:", category);
            //         // console.log("Spent:", spent);
            //         // console.log("Limit:", limit);
            //         // console.log("Remaining:", remaining);
            //         console.log(categoryTotals);
            //         console.log(budgetCategory);
                return res.render('dashboard.ejs', {
                    expenses: currentMonthExpenses,
                    totalSpent, 
                    categoryTotals, 
                    budgets, 
                    budgetCategoryTotals,
                    // totalBudget,
                    currentMonth,
                    // budgetMoneyLeft
                });

            }else{
                return res.render('dashboard.ejs', {
                    expenses: currentMonthExpenses,
                    totalSpent,
                    categoryTotals,
                    budget: null,
                    totalBudget: 0,
                    budgetMoneyLeft: 0,
                    currentMonth
                });

            }


        }catch(err){
            console.error(err);
            res.status(500).send(err.message)
        }

    },
    expenseForm: (req, res) =>{
        res.render('expenseForm.ejs')
    }, 
    editExpenseForm: async (req, res) =>{
        const id = req.params.id
        const expense = await Expense.findById(id)

        if(!expense){
            return res.status(404).send("Expense not found!")
        }

        res.render('editExpenseForm.ejs', {expense})
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
    },
    deleteExpense: async (req, res)=>{
        try{
            if(!req.user){
                return res.redirect('/login')
            }
            const id = req.params.id
            const expense = Expense.findById(id)

            if(!expense){
                return res.status(404).send("Expense not found")
            }

            await Expense.findByIdAndDelete(id);
            return res.redirect('/dashboard')

        }catch(err){
            res.status(500).send(err.message)
            console.log(err);
            res.redirect('/dashboard')
        }
    }, 
    updateExpense: async (req, res) =>{
        try{
            if(!req.user){
                return res.redirect('/login')
            }
            const id = req.params.id;
            const expense = await Expense.findById(id)
            
            if(!expense){
                return res.status(404).send("Expense not found")
            }

            const { description, amount, category, date } = req.body;

            await Expense.findByIdAndUpdate(id, {
                description, 
                amount, 
                category, 
                date: date || new Date()
            });
            res.redirect('/dashboard')

        }catch(err){
            res.status(500).send(err.message)
            res.redirect('/dashboard')
        }
    }, 
    editBudgetForm: async (req, res) =>{
        const id = req.params.id
        const budget = await Budget.findById(id)

        if(!budget){
            return res.status(404).send("Budget not found!")
        }

        res.render('editBudgetForm.ejs', {budget})
    },
    addNewBudget: async(req, res)=>{
        try{
            const { limit, category, month } = req.body;
            const budget = new Budget({
                userId: req.user._id,
                limit, 
                category, 
                month, 
            });
            await budget.save();
            res.redirect('/dashboard');
        }catch(err){
            res.status(500).send(err.message)
        }

    },
    budgetForm: (req, res) =>{
        res.render('budgetForm.ejs')
    }, 
    updateBudget: async (req, res) =>{
        try{
            if(!req.user){
                return res.redirect('/login');
            }
            const id = req.params.id;
            const budget = await Budget.findById(id);

            if(!budget){
                return res.status(404).send("Budget not found")
            }

            const { limit, category, month} = req.body;

            await Budget.findByIdAndUpdate(id, {
                limit, 
                category, 
                month
            });
            res.redirect('/dashboard')

        }catch(err){
            res.status(500).send(err.message);
            res.redirect('/dashboard')
        }
    }, 
    
}