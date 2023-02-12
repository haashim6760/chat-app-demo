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
  let [email, setEmail] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [passwordConfirm, setPasswordConfirm] = useState("");
  let { auth } = useFirebase();
  let [error, setError] = useState("");
  let [toggleSignInForm, setToggleSignInForm] = useState(true);
  let [toggleCreateUserForm, setToggleCreateUserForm] = useState(false);
  let [toggleForgotPasswordForm, setToggleForgotPasswordForm] = useState(false);
  let { firestore } = useFirebase();

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
        {toggleSignInForm ? (
          <>
            <form className="authentication-form" onSubmit={handleUserSignIn}>
              <input
                className="authentication-form-input"
                type="email"
                value={email}
                placeholder="Email"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />

              <input
                className="authentication-form-input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(event.target.value)
                }
              />

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
        ) : toggleCreateUserForm ? (
          <form className="create-user-form" onSubmit={handleCreateUser}>
            <input
              className="create-user-form-input"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
            />

            <input
              className="create-user-form-input"
              value={username}
              placeholder="Username"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(event.target.value)
              }
            />

            <input
              className="create-user-form-input"
              type="password"
              value={password}
              placeholder="Password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
            />

            <input
              className="create-user-form-input"
              type="password"
              value={passwordConfirm}
              placeholder="Confirm Password"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirm(event.target.value)
              }
            />

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
        ) : toggleForgotPasswordForm ? (
          <form className="forgot-password-form">
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
        ) : (
          <div></div>
        )}
      </div>
    </article>
  );
}

export default Authentication;
