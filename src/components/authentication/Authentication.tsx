import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useFirebase } from "../../providers/FirebaseProvider";
import { useUser } from "../../providers/UserProvider";
import "./Authentication.css";

function Authentication() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [passwordConfirm, setPasswordConfirm] = useState("");
  let { auth } = useFirebase();
  let [error, setError] = useState("");
  let [toggleCreateUserForm, setToggleCreateUserForm] = useState(false);

  const handleUserSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      try {
        signInWithEmailAndPassword(auth!, email, password)
          .then((data) => {
            setError("");
          })
          .catch((e) => {
            let error = e as FirebaseError;
            setError(error.message);
          });
      } catch (e) {}
    } else {
      setError("Please Fill In All Fields.");
    }
  };

  const handleCreateUser = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email !== "" && password !== "" && passwordConfirm !== "") {
      if (password === passwordConfirm) {
        try {
          createUserWithEmailAndPassword(auth!, email, password).then(
            (data) => {
              setError("");
              signInWithEmailAndPassword(auth!, email, password);
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
        {toggleCreateUserForm === false ? (
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
              className="create-user-button"
              onClick={async () => {
                try {
                  setToggleCreateUserForm(true);
                } catch (e) {
                  let error = e as FirebaseError;
                  setError(error.message);
                }
              }}
            >
              Don't Have An Account? <br /> Register Now
            </button>
          </form>
        ) : (
          <div>
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
                className="create-user-button"
                onClick={async () => {
                  try {
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
          </div>
        )}{" "}
      </div>
    </article>
  );
}

export default Authentication;
