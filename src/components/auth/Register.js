import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/auth";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loading from "../navigation/Loading";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));
const linkStyles = {
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
};

const Register = ({ history, registerUser, authState }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  let { code, message } = authState.errors;
  const { email, username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const submitUser = (e) => {
    e.preventDefault();
    registerUser(history, email, username, password);
  };

  if (authState.loading) {
    return <Loading />;
  } else if (authState.authState) {
    return <Redirect to="/" />;
  }
  return (
    <section className="signin">
      <form
        onSubmit={(e) => submitUser(e)}
        className={classes.root}
        noValidate
        autoComplete="off"
      >
        <TextField
          error={code.includes("username")}
          helperText={code.includes("username") ? message : null}
          value={username}
          name="username"
          onChange={(e) => onChange(e)}
          label="Username"
          type="text"
          variant="outlined"
          fullWidth
          required
          autoComplete="off"
        />
        <TextField
          error={code.includes("email")}
          helperText={code.includes("email") ? message : null}
          value={email}
          name="email"
          onChange={(e) => onChange(e)}
          label="email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          value={password}
          error={code.includes("password")}
          helperText={code.includes("password") ? message : null}
          name="password"
          onChange={(e) => onChange(e)}
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          autoComplete="off"
          required
        />
        <div className="register-links">
          <Button
            type="submit"
            onSubmit={(e) => submitUser(e)}
            variant="contained"
            className="signin-btn"
            color="primary"
          >
            Register
          </Button>
          Or
          <Link to="/auth" style={linkStyles}>
            <h3>Sign In</h3>
          </Link>
        </div>
      </form>
    </section>
  );
};
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
