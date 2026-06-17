const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const dashboardController = require('../controllers/dashboard');
const { route } = require('./indexRoute');


router.get('/', ensureAuth, dashboardController.getDashboard);
router.get('/expenseForm', dashboardController.expenseForm)
router.post('/addNewExpense', dashboardController.addNewExpense)
router.post('/delete/:id', ensureAuth, dashboardController.deleteExpense)
module.exports = router;