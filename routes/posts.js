const express = require('express');
const router = express.Router({ mergeParams: true });

const { createPost, getPost, deletePost, addLike, removeLike } = require('../handlers/post');

router.route('/').post(createPost);

router.route('/:post_id').get(getPost).delete(deletePost);

router.route('/:post_id/like').post(addLike);

router.route('/:post_id/unlike').post(removeLike);

module.exports = router;
