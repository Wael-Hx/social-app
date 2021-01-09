import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import "./navbar.css";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { currentUser, logout } from "../../actions/auth";
import Loading from "./Loading";
import BottomNavBar from "./BottomNavBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: "pointer",
  },
}));

const Navbar = ({
  history,
  logout,
  currentUser,
  userData: { authState, loading, user },
}) => {
  const linkStyles = {
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
    margin: 0,
  };
  const classes = useStyles();

  useEffect(() => {
    currentUser();
  }, [currentUser]);

  const [dropMenu, setDropMenu] = useState(false);
  const handleLogout = () => {
    logout(history);
  };

  return (
    <>
      <nav>
        <Link style={linkStyles} to="/">
          <h2 className="home">Instagram </h2>
        </Link>
        <div className="account">
          <Link to="/" style={linkStyles}>
            <HomeIcon />
          </Link>
          {loading ? (
            <Loading />
          ) : authState ? (
            <>
              <Avatar
                onClick={() => setDropMenu(!dropMenu)}
                alt={user?.username}
                src={user?.avatar}
                className={classes.small}
              />
              {dropMenu && (
                <div className="arrow_box">
                  <Link
                    to={{
                      pathname: `/${user?.uid}`,
                      state: { avatar: user?.avatar, username: user?.username },
                    }}
                    style={linkStyles}
                  >
                    <h2 className="sign-in" style={{ cursor: "pointer" }}>
                      <AccountCircleOutlinedIcon fontSize="inherit" /> profile
                    </h2>
                  </Link>
                  <h2 className="sign-in" style={{ cursor: "pointer" }}>
                    <SettingsOutlinedIcon fontSize="inherit" /> settings
                  </h2>
                  <h2
                    className="sign-in"
                    style={{
                      cursor: "pointer",
                      borderTop: "1px solid silver",
                      paddingTop: "5px",
                    }}
                    onClick={handleLogout}
                  >
                    <ExitToAppOutlinedIcon fontSize="inherit" /> Sign out
                  </h2>
                </div>
              )}
            </>
          ) : (
            <Link to="/auth" style={linkStyles}>
              <h2 className="sign-in">Sign in</h2>
            </Link>
          )}
        </div>
      </nav>
      {authState ? (
        <div className="bottom-nav">
          <BottomNavBar />
        </div>
      ) : null}
    </>
  );
};

Navbar.propTypes = {
  currentUser: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  userData: state.auth,
});
export default connect(mapStateToProps, { currentUser, logout })(
  withRouter(Navbar)
);
