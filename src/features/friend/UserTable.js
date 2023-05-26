import React from "react";
import {
  Table,
  TableHead,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Link,
  TableContainer,
  Box,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FriendStatus from "./FriendStatus";
import ActionButton from "./ActionButton";

function UserTable({ users }) {
  const { user } = useAuth();
  const currentUserId = user._id;

  const getActionAndStatus = (targetUser) => {
    const props = {
      currentUserId: currentUserId,
      targetUserId: targetUser._id,
      friendship: targetUser.friendship,
    };
    return {
      status: <FriendStatus {...props} />,
      action: <ActionButton {...props} />,
    };
  };

  return (
    // tự động có thành scroll ngang nếu màn hình thu nhỏ, để ng đọc kéo ngang đọc nội dung
    <Box sx={{ overflowX: "auto" }}>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { xs: "20%", sm: "25%" } }}>
                Name
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Email
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Job title
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Status
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, i) => {
              const { status, action } = getActionAndStatus(user);
              return (
                <TableRow key={`${user._id} +${i}`} hover>
                  <TableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar
                      alt={user.name}
                      src={user.avatarUrl}
                      sx={{ mr: 2 }}
                    />
                    <Link
                      variant="subtitle"
                      sx={{ fontWeight: 600 }}
                      component={RouterLink}
                      to={`/user/${user._id}`}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.jobTitle}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    {status}
                  </TableCell>
                  <TableCell align="left">{action}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserTable;
