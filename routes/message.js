const express = require('express');
const router = express.Router();
const {fetchAllMessages, createMessage} = require('../controllers/messageControllers');

router.route('/').post(createMessage);
router.route('/:chatId').get(fetchAllMessages);


module.exports = router;