import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getComments } from "./commentSlice";
import { COMMENTS_PER_POST } from "../../app/config";
import { Pagination, Stack, Typography } from "@mui/material";
import LoadingScreen from "../../components/LoadingScreen";
import CommentCard from "./CommentCard";

function CommentList({ postId }) {
  const dispatch = useDispatch();
  const {
    isLoading,
    commentsById,
    commentsByPost,
    totalComments,
    currentPage,
  } = useSelector(
    (state) => ({
      commentsById: state.comment.commentsById,
      commentsByPost: state.comment.commentsByPost[postId],
      totalComments: state.comment.totalCommentsByPost[postId],
      currentPage: state.comment.currentPageByPost[postId] || 1,
      isLoading: state.comment.isLoading,
    }),
    shallowEqual
  );

  const totalPages = Math.ceil(totalComments / COMMENTS_PER_POST);

  useEffect(() => {
    if (postId) dispatch(getComments({ postId }));
  }, [dispatch, postId]);

  let renderComments;

  if (commentsByPost) {
    const comments = commentsByPost.map((commentId) => commentsById[commentId]);
    renderComments = (
      <Stack spacing={1.5}>
        {comments.map((comment, i) => (
          <CommentCard key={`${comment.id} + ${i}`} comment={comment} />
        ))}
      </Stack>
    );
  } else if (isLoading) {
    <LoadingScreen />;
  }
  return (
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle" sx={{ color: "text.secondary" }}>
          {totalComments > 1
            ? `${totalComments} comments`
            : totalComments === 1
            ? `${totalComments} comment`
            : "No comment"}
        </Typography>
        {totalComments > COMMENTS_PER_POST && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => dispatch(getComments({ postId, page }))}
          />
        )}
      </Stack>
      {renderComments}
    </Stack>
  );
}

export default CommentList;
