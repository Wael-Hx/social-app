import React, { useState } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined";
import { Link } from "react-router-dom";

const BottomNavBar = () => {
  const [value, setValue] = useState(0);
  const bottomNavStyles = {
    display: "flex",
    justifyContent: "space-evenly",
    height: "50px",
    width: "100%",
    padding: "0",
  };
  return (
    <BottomNavigation
      style={bottomNavStyles}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
    >
      <BottomNavigationAction
        component={Link}
        to="/"
        icon={<HomeOutlinedIcon />}
      />

      <BottomNavigationAction
        component={Link}
        to="add"
        icon={<AddPhotoAlternateOutlinedIcon />}
      />
    </BottomNavigation>
  );
};

export default BottomNavBar;
