import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function PostDeleteConfirm({
  handleDeleteConfirmClose,
  openDeleteConfirm,
  handleDeletePost,
}) {
  return (
    <Modal
      open={openDeleteConfirm}
      onClose={handleDeleteConfirmClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" noWrap>
          Are you sure you want to delete this ?
        </Typography>
        <Button onClick={handleDeletePost}>Yes</Button>
        <Button onClick={handleDeleteConfirmClose}>No</Button>
      </Box>
    </Modal>
  );
}

export default PostDeleteConfirm;
