import React from "react";
import { Avatar, Box, Card, Typography, Link } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import ActionButton from "./ActionButton";

function UserCard({ profile }) {
  const { user } = useAuth();
  const currentUserId = user._id;
  const { _id: targetUserId, name, email, avatarUrl, friendship } = profile;
  const actionButton = (
    <ActionButton
      targetUserId={targetUserId}
      currentUserId={currentUserId}
      friendship={friendship}
    />
  );
  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 3 }}>
      <Avatar alt={name} src={avatarUrl} sx={{ width: 48, height: 48 }} />
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Link
          variant="subtitle"
          sx={{ fontWeight: 600 }}
          component={RouterLink}
          to={`/user/${targetUserId}`}
        >
          {name}
        </Link>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EmailIcon />
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {email}
          </Typography>
        </Box>
      </Box>
      {actionButton}
    </Card>
  );
}

export default UserCard;
