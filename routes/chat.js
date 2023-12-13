const express = require('express');
const {accessChat, fetchChat, createGroupChat, renameGroup, addUser,removeFromGroup} = require('../controllers/chatControllers');
const router = express.Router();

router.post('/', accessChat);
router.post('/fetch-chat', fetchChat);
router.post('/group', createGroupChat);
router.put('/rename', renameGroup);
router.put('/remove-user', removeFromGroup);
router.put('/add-user', addUser);


module.exports = router