import { Chip } from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TimerIcon from "@mui/icons-material/Timer";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

function FriendStatus({ currentUserId, targetUserId, friendship, sx }) {
  if (currentUserId === targetUserId) return null;
  if (!friendship) return null;
  if (friendship.status === "accepted") {
    return (
      <Chip
        sx={{ ...sx }}
        icon={<CheckCircleOutlineIcon />}
        label="Friend"
        color="success"
      />
    );
  }
  if (friendship.status === "declined") {
    return (
      <Chip
        sx={{ ...sx }}
        icon={<DoNotDisturbAltIcon />}
        label="Declined"
        color="success"
      />
    );
  }
  if (friendship.status === "pending") {
    const { from, to } = friendship;
    if (from === currentUserId && to === targetUserId) {
      return (
        <Chip
          sx={{ ...sx }}
          icon={<MarkEmailReadIcon />}
          label="Request Send"
          color="success"
        />
      );
    } else if (from === targetUserId && to === currentUserId) {
      return (
        <Chip
          sx={{ ...sx }}
          icon={<TimerIcon />}
          label="Waiting for response"
          color="success"
        />
      );
    }
  }
}

export default FriendStatus;
