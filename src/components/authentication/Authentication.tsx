import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import "./Authentication.css";

function Authentication() {
  let { resetPassword } = useUser();
  let [email, setEmail] = useState<string>("");
  let [username, setUsername] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [passwordConfirm, setPasswordConfirm] = useState<string>("");
  let { auth } = useFirebase();
  let [error, setError] = useState<string>("");
  let [toggleSignInForm, setToggleSignInForm] = useState<boolean>(true);
  let [toggleCreateUserForm, setToggleCreateUserForm] =
    useState<boolean>(false);
  let [toggleForgotPasswordForm, setToggleForgotPasswordForm] =
    useState<boolean>(false);
  let { firestore } = useFirebase();

  //This function handles the sign in form.
  //If the email and password are not empty, attempt to log in the user.
  //If there is an error when signing in with firebase (e.g. the user does not exist),
  //the error will be displayed to the user.
  const handleUserSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth!, email, password)
        .then(() => {
          setError("");
        })
        .catch((e) => {
          let error = e as FirebaseError;
          setError(error.message);
        });
    } else {
      setError("Please Fill In All Fields.");
    }
  };

  //This function handles the create user form.
  //If the email, password, password confirm and username fields are not empty
  //, it will then check if the password and password confirm fields are not empty,
  //if this is the case, then it will attempt to create the user with the specified email,
  //password and the auth object. If there is an error when creating the user with firebase,
  //the error will be displayed to the user. Upon creation of the user in authentication,
  //then a user document is created named after the new users uid. The user document contains
  //the new users email, username, the role(set to standard by default),
  // and ban status(set to false by default). Finally, the user is signed in
  const handleCreateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (
      email !== "" &&
      password !== "" &&
      passwordConfirm !== "" &&
      username !== ""
    ) {
      if (password === passwordConfirm) {
        try {
          createUserWithEmailAndPassword(auth!, email, password).then(
            (data) => {
              setDoc(doc(firestore!, "users", `${data.user.uid}`), {
                email: email,
                username: username,
                role: "Standard",
                is_banned: false,
              });
              setError("");
              signInWithEmailAndPassword(auth!, email, password)
                .then(() => {
                  setError("");
                })
                .catch((e) => {
                  let error = e as FirebaseError;
                  setError(error.message);
                });
            }
          );
        } catch (e) {
          let error = e as FirebaseError;
          setError(error.message);
        }
      } else {
        setError("Please Ensure That Both Of Your Passwords Are The Same");
      }
    } else {
      setError("Please Fill In All Fields");
    }
  };

  return (
    <article className="app-main-article">
      <div className="authentication">
        {/* If the toggleSignInForm variable is true, it will display the sign in form */}
        {toggleSignInForm ? (
          <>
            {/* The handleUserSignIn function is called when the form is submitted */}
            <form className="authentication-form" onSubmit={handleUserSignIn}>
              {/* The value of the email field is set to the value of the email variable */}
              <input
                className="authentication-form-input"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />
              {/* The value of the password field is set to the value of the password variable */}
              <input
                className="authentication-form-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
              />

              {/* If the forgot password button is clicked, then the toggleSignInForm variable
               will be set to false, while the toggleForgotPasswordForm is set to true. 
              As a result the sign in form will be replaced by the forgot password form. */}

              <a
                type="button"
                className="button-forgot"
                onClick={async () => {
                  try {
                    setToggleForgotPasswordForm(true);
                    setToggleSignInForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Forgot Password?
              </a>

              <div className="space-between-input"></div>

              <button className="button-main" type="submit">
                Sign In
              </button>

              {error ? (
                <div className="error">
                  <br />
                  {error}
                </div>
              ) : (
                <div></div>
              )}

              {/* If the register button is clicked, then the toggleSignInForm variable
               will be set to false, while the toggleCreateUserForm is set to true. 
              As a result the sign in form will be replaced by the create user form. */}

              <button
                type="button"
                className="button-main"
                onClick={async () => {
                  try {
                    setToggleCreateUserForm(true);
                    setToggleSignInForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Register Now
              </button>
            </form>
          </>
        ) : // Else if the toggleCreateUserForm variable is true, it will display the create user form
        toggleCreateUserForm ? (
          <>
            {/* The handleCreateUser function is called when the form is submitted */}
            <form className="create-user-form" onSubmit={handleCreateUser}>
              {/* The value of the email field is set to the value of the email variable */}

              <input
                className="create-user-form-input"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />
              {/* The value of the username field is set to the value of the username variable */}

              <input
                className="create-user-form-input"
                value={username}
                placeholder="Username"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(event.target.value)
                }
              />

              {/* The value of the password field is set to the value of the password variable */}

              <input
                className="create-user-form-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
              />

              {/* The value of the confirm password field is set to the value of the confirmPassword variable */}

              <input
                className="create-user-form-input"
                type="password"
                value={passwordConfirm}
                placeholder="Confirm Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPasswordConfirm(event.target.value)
                }
              />

              {/* If the forgot password button is clicked, then the toggleCreateUserForm variable
               will be set to false, while the toggleForgotPasswordForm is set to true. 
              As a result the create user form will be replaced by the forgot password form. */}
              <a
                type="button"
                className="button-forgot"
                onClick={async () => {
                  try {
                    setToggleForgotPasswordForm(true);
                    setToggleCreateUserForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Forgot Password?
              </a>

              <div className="space-between-input"></div>

              <button className="button-main" type="submit">
                Create User
              </button>

              {error ? (
                <div className="error">
                  <br />
                  {error}
                </div>
              ) : (
                <div></div>
              )}

              {/* If the sign in button is clicked, then the toggleSignInForm variable
               will be set to true, while the toggleCreateUserForm is set to false. 
              As a result the create user form will be replaced by the sign in form. */}
              <button
                type="button"
                className="button-main"
                onClick={async () => {
                  try {
                    setToggleSignInForm(true);
                    setToggleCreateUserForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Back To Sign In Form
              </button>
            </form>
          </>
        ) : //Else if the toggleForgotPasswordForm variable is true, the forgot password form will be displayed
        toggleForgotPasswordForm ? (
          <>
            <form className="forgot-password-form">
              {/* The value of the email field is set to the value of the email variable */}

              <input
                className="forgot-password-form-input"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />

              <div className="space-between-input"></div>
              {/* Once this button is clicked, if the provided email exists in authentication, a change password link is set to the email address.
              The toggleForgotPasswordForm variable is set to false, and the toggleSignInForm is set to true, and the error message is set to empty.
              This means that any errors will be cleared and the user will be redirected back to the login form.
              */}
              <button
                type="button"
                className="forgot-button-main"
                onClick={async () => {
                  try {
                    await resetPassword(email);
                    setError("");
                    setToggleForgotPasswordForm(false);
                    setToggleSignInForm(true);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Send
              </button>

              {error ? (
                <div className="error">
                  <br />
                  {error}
                </div>
              ) : (
                <div></div>
              )}

              {/* If the return to sign in button is clicked, then the toggleSignInForm variable
               will be set to true, while the toggleForgotPasswordForm is set to false. 
              As a result the forgot password form will be replaced by the sign in form. */}

              <button
                type="button"
                className="forgot-button"
                onClick={async () => {
                  try {
                    setToggleSignInForm(true);
                    setToggleForgotPasswordForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Back To Sign In Form
              </button>

              {/* If the return to create user button is clicked, then the toggleForgotPasswordForm variable
               will be set to false, while the toggleCreateUserForm is set to true. 
              As a result the forgot password will be replaced by the create user form. */}

              <button
                type="button"
                className="forgot-button"
                onClick={async () => {
                  try {
                    setToggleCreateUserForm(true);
                    setToggleForgotPasswordForm(false);
                  } catch (e) {
                    let error = e as FirebaseError;
                    setError(error.message);
                  }
                }}
              >
                Back To Create User Form
              </button>
            </form>
          </>
        ) : (
          <div></div>
        )}
      </div>
    </article>
  );
}

export default Authentication;
