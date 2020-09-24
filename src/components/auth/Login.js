import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, withRouter, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
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
const Login = ({ history, login, authState }) => {
  const classes = useStyles();
  let { code, message } = authState.errors;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitUser = (e) => {
    e.preventDefault();
    login(history, email, password);
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
          error={code.includes("email") ? true : false}
          helperText={code.includes("email") ? message : false}
          onChange={(e) => onChange(e)}
          name="email"
          value={email}
          label="email"
          type="email"
          variant="outlined"
          fullWidth
          autoComplete="off"
        />
        <TextField
          error={code.includes("password") ? true : false}
          helperText={code.includes("password") ? message : false}
          value={password}
          name="password"
          onChange={(e) => onChange(e)}
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          autoComplete="off"
        />
        <div className="register-links">
          <Button
            type="submit"
            onSubmit={(e) => submitUser(e)}
            variant="contained"
            className="signin-btn"
            color="primary"
          >
            Sign in
          </Button>
          Or
          <Link to="/register" style={linkStyles}>
            <h3>create an account</h3>
          </Link>
        </div>
      </form>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  authState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  authState: state.auth,
});
export default connect(mapStateToProps, { login })(withRouter(Login));
