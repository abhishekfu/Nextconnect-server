const express = require('express');
const router = express.Router({ mergeParams: true });

const { createPost, getPostByUser, getPost, deletePost, addLike, removeLike } = require('../handlers/post');

router.route('/').post(createPost).get(getPostByUser);

router.route('/:post_id').get(getPost).delete(deletePost);

router.route('/:post_id/like').post(addLike);

router.route('/:post_id/unlike').post(removeLike);

module.exports = router;
