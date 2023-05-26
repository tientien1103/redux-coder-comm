import React from "react";
import { useDispatch } from "react-redux";
import {
  sendFriendRequest,
  acceptRequest,
  removeFriend,
  declineRequest,
  cancelRequest,
} from "./friendSlice";
import { Button, Stack } from "@mui/material";

function ActionButton({ currentUserId, targetUserId, friendship, sx }) {
  const dispatch = useDispatch();

  if (currentUserId === targetUserId) return null;

  const btnSendRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest(targetUserId))}
    >
      Send Request
    </Button>
  );

  if (!friendship) return btnSendRequest;

  const btnUnfriend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(removeFriend(targetUserId))}
    >
      Unfriend
    </Button>
  );
  const btnReSend = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      onClick={() => dispatch(sendFriendRequest(targetUserId))}
    >
      {friendship.from === currentUserId ? "Resend" : "Send"} Request
    </Button>
  );
  const btnCancelRequest = (
    <Button
      sx={{ fontSize: "0.6rem", ...sx }}
      size="small"
      variant="contained"
      color="error"
      onClick={() => dispatch(cancelRequest(targetUserId))}
    >
      Cancel Request
    </Button>
  );
  const btnGroup = (
    <Stack direction="row" spacing={1}>
      <Button
        sx={{ fontSize: "0.6rem", ...sx }}
        size="small"
        variant="contained"
        color="success"
        onClick={() => dispatch(acceptRequest(targetUserId))}
      >
        Accept
      </Button>
      <Button
        sx={{ fontSize: "0.6rem", ...sx }}
        size="small"
        variant="contained"
        color="error"
        onClick={() => dispatch(declineRequest(targetUserId))}
      >
        Decline
      </Button>
    </Stack>
  );

  if (friendship.status === "accepted") {
    return btnUnfriend;
  }

  if (friendship.status === "declined") {
    return btnReSend;
  }

  if (friendship.status === "pending") {
    const { from, to } = friendship;
    if (from === currentUserId && to === targetUserId) {
      return btnCancelRequest;
    } else if (from === targetUserId && to === currentUserId) {
      return btnGroup;
    }
  }
  return btnSendRequest;
}

export default ActionButton;
