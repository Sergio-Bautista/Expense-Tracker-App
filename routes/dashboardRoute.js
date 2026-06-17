const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const dashboardController = require('../controllers/dashboard');


router.get('/', ensureAuth, dashboardController.getDashboard);
router.get('/expenseForm', dashboardController.expenseForm)
router.post('/addNewExpense', dashboardController.addNewExpense)
router.post('/delete/:id', ensureAuth, dashboardController.deleteExpense)
module.exports = router;