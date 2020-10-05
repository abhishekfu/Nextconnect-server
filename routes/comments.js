const express = require('express');
const router = express.Router({ mergeParams: true });

const { getComment, createComment, deleteComment } = require('../handlers/comment');

router.route('/').post(createComment);

router.route('/:comment_id').get(getComment).delete(deleteComment);

module.exports = router;
