import React, { useState } from "react";
import useAuth from "../hooks/useAuth";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScheduleSendIcon from "@mui/icons-material/ScheduleSend";

import Profile from "../features/user/Profile";
import FriendList from "../features/friend/FriendList";
import FriendRequests from "../features/friend/FriendRequests";
import AddFriend from "../features/friend/AddFriend";

import { Box, Card, Container, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import ProfileCover from "../features/user/ProfileCover";
import { styled } from "@mui/material/styles";
import SentRequest from "../features/friend/SentRequest";

const TabWrapperStyle = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  zIndex: 0,
  width: "100%",
  display: "flex",
  backgroundColor: "#fff",
  [theme.breakpoints.up("sm")]: {
    justifyContent: "center",
  },
  [theme.breakpoints.up("md")]: {
    justifyContent: "flex-end",
    paddingRight: theme.spacing(3),
  },
}));

function HomePage() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("profile");

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const PROFILE_TABS = [
    {
      value: "profile",
      icon: <AccountBoxIcon sx={{ fontSize: 24 }} />,
      component: <Profile profile={user} />,
    },
    {
      value: "friends",
      icon: <PeopleAltIcon sx={{ fontSize: 24 }} />,
      component: <FriendList />,
    },
    {
      value: "requests",
      icon: <ContactMailIcon sx={{ fontSize: 24 }} />,
      component: <FriendRequests />,
    },
    {
      value: "add_friend",
      icon: <PersonAddIcon sx={{ fontSize: 24 }} />,
      component: <AddFriend />,
    },
    {
      value: "sent_requests",
      icon: <ScheduleSendIcon sx={{ fontSize: 24 }} />,
      component: <SentRequest />,
    },
  ];

  return (
    <Container>
      <Card sx={{ mb: 3, height: 280, position: "relative" }}>
        <ProfileCover profile={user} />
        <TabWrapperStyle>
          <Tabs
            value={currentTab}
            scrollbutton="auto"
            variant="scrollable"
            allowscrollbuttonmobile="true"
            onChange={(e, value) => handleChangeTab(value)}
          >
            {PROFILE_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={capitalCase(tab.value)} // capitalCase: bỏ dấu gạch ngang trong Add_friend, xử lí string
              />
            ))}
          </Tabs>
        </TabWrapperStyle>
      </Card>
      {PROFILE_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}

export default HomePage;
