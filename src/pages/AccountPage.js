import React, { useState } from "react";
import AccountGeneral from "../features/user/AccountGeneral";
import AccountSocialLink from "../features/user/AccountSocialLink";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShareIcon from "@mui/icons-material/Share";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { capitalCase } from "change-case";

function AccountPage() {
  const [currentTab, setCurrentTab] = useState("general");

  const ACCOUNT_TABS = [
    {
      value: "general",
      icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
      component: <AccountGeneral />,
    },
    {
      value: "social_links",
      icon: <ShareIcon sx={{ fontSize: 30 }} />,
      component: <AccountSocialLink />,
    },
  ];
  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Account Setting
      </Typography>
      <Tabs
        value={currentTab}
        scrollbutton="auto"
        variant="scrollable"
        allowscrollbuttonmobile="true"
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ACCOUNT_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            value={tab.value}
            icon={tab.icon}
            label={capitalCase(tab.value)} // capitalCase: bỏ dấu gạch ngang trong Add_friend, xử lí string
          />
        ))}
      </Tabs>
      <Box sx={{ mb: 5 }} />
      {ACCOUNT_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}

export default AccountPage;
