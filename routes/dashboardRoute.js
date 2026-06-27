const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const dashboardController = require('../controllers/dashboard');


router.get('/', ensureAuth, dashboardController.getDashboard);
router.get('/expenseForm', dashboardController.expenseForm)
router.get('/budgetForm', dashboardController.budgetForm)
router.get('/editExpenseForm/:id', ensureAuth, dashboardController.editExpenseForm)
router.get('/editBudgetForm/:id', ensureAuth, dashboardController.editBudgetForm)

router.post('/addNewExpense', dashboardController.addNewExpense)
router.post('/delete/:id', ensureAuth, dashboardController.deleteExpense)
router.post('/updateExpense/:id', ensureAuth, dashboardController.updateExpense)
router.post('/addNewBudget', dashboardController.addNewBudget)
router.post('/updateBudget/:id', ensureAuth, dashboardController.updateBudget)


module.exports = router;