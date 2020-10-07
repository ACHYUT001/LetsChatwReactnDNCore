import { FORM_ERROR } from "final-form";
import React, { useContext } from "react";
import { Form as FinalForm, Field } from "react-final-form";
import { Button, Form, Header } from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import { IUserFormValues } from "../../app/models/user";
import { RootStoreContext } from "../../app/stores/rootStore";
import { combineValidators, isRequired } from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validate = combineValidators({
  displayName: isRequired("display name"),
  userName: isRequired("username"),
  email: isRequired("email"),
  password: isRequired("password"),
});

const RegisterForm = () => {
  const { register } = useContext(RootStoreContext).userStore;
  return (
    <FinalForm
      onSubmit={(values: IUserFormValues) =>
        register(values).catch((error) => ({
          [FORM_ERROR]: error,
        }))
      }
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error={true}>
          <Header as="h2" content="Register" />
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Display Name"
          />
          <Field
            name="userName"
            component={TextInput}
            placeholder=" Username"
          />
          <Field name="email" component={TextInput} placeholder="Email" />
          <Field
            name="password"
            component={TextInput}
            placeholder="Password"
            type="password"
          />

          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              //   text={JSON.stringify(submitError.data.errors)}

              //   text={"Invalid username or password"}
            />
          )}
          <br />
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content="Register"
            fluid={true}
            color="teal"
          />
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
  );
};

export default RegisterForm;
