import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import SettingsIcon from "@material-ui/icons/Settings";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { deleteAccount } from "../../actions/auth";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 250,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
    paddingBottom: "3px",
  },
}));

const SettingsList = ({ deleteAccount, history }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleDeleteAction = () => {
    const redirected = true;
    if (
      window.confirm(
        "you must be recently authenticated to complete this action , if not, you will be asked to login again. Procees ?"
      )
    ) {
      deleteAccount(history, redirected);
    }
  };

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem component={Link} to="/add" button>
        <ListItemIcon>
          <AddPhotoAlternateIcon />
        </ListItemIcon>
        <ListItemText primary="Create a new post" />
      </ListItem>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemIcon>
              <NewReleasesIcon />
            </ListItemIcon>
            <ListItemText
              onClick={handleDeleteAction}
              primary="Delete Account"
            />
          </ListItem>
        </List>
      </Collapse>
    </List>
  );
};

export default connect(null, { deleteAccount })(withRouter(SettingsList));
