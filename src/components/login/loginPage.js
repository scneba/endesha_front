import React, { useState, useContext } from "react";
import { useLocation, Redirect } from "react-router-dom";
import { Row, Form } from "react-bootstrap";
import { getFormProps, FormField } from "../generics/forms";
import { RegisterButton } from "../generics/buttons";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as authApi from "../../services/auth";
import { showErrors } from "../generics/alerts";
import { FormErrors } from "../generics/forms";
import { UserContext } from "./userContext";
const queryString = require("query-string");

export default function LoginPage({ setUser }) {
  const { register, handleSubmit } = useForm();
  const { t } = useTranslation(["login"]);
  const [disable, setDisable] = useState(false);
  const email = getFormProps("email", t("email"), "email");
  const password = getFormProps("password", t("password"), "password");
  const [errors, setErrors] = useState([]);
  const user = useContext(UserContext);

  const location = useLocation();
  let query = queryString.parse(location.search);
  //if user if logged in, redirect
  if (user) {
    return <Redirect to={query.redirect ? query.redirect : "/"}></Redirect>;
  }
  
  const onSubmit = async (data) => {
    setDisable(true);
    setErrors([]);
    try {
      let user = await authApi.login(data);
      setUser(user.data.data);
      return <Redirect to={query.redirect ? query.redirect : "/"}></Redirect>;
    } catch (err) {
      console.log(err);
      showErrors(err, setErrors);
    }
    setDisable(false);
  };
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="m-4">
        <Row>
          <FormErrors errors={errors}></FormErrors>
          <FormField register={register} {...email}></FormField>
          <FormField register={register} {...password}></FormField>
          <RegisterButton
            disabled={disable}
            label={t("shared:register")}
          ></RegisterButton>
        </Row>
      </Form>
    </div>
  );
}
