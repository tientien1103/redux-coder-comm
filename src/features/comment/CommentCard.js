import React, { useState } from "react";
import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { fDate } from "../../utils/formatTime";
import CommentReaction from "./CommentReaction";
import { useDispatch } from "react-redux";
import { deleteComment } from "./commentSlice";
import CommentDeleteConfirm from "./CommentDeleteConfirm";

function CommentCard({ comment }) {
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const handleDeleteConfirmOpen = () => setOpenDeleteConfirm(true);
  const handleDeleteConfirmClose = () => setOpenDeleteConfirm(false);
  const dispatch = useDispatch();

  const handleDeleteComment = (id) => {
    dispatch(deleteComment(id));
    handleDeleteConfirmClose();
  };
  return (
    <Stack direction="row" spacing={2}>
      <Avatar alt={comment.author?.name} src={comment.author?.avatarUrl} />
      <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: "background.neutral" }}>
        <Stack
          direction="row"
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          sx={{ mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {comment.author?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            {fDate(comment.createdAt)}
          </Typography>
          <Button
            variant="text"
            color="error"
            onClick={handleDeleteConfirmOpen}
          >
            Delete
          </Button>
          <CommentDeleteConfirm
            handleDeleteConfirmClose={handleDeleteConfirmClose}
            openDeleteConfirm={openDeleteConfirm}
            handleDeleteComment={handleDeleteComment}
            comment={comment}
          />
        </Stack>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {comment.content}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <CommentReaction comment={comment} />
        </Box>
      </Paper>
    </Stack>
  );
}

export default CommentCard;
