import { FirebaseError } from "firebase/app";
import React, { useState } from "react";
import {useUser} from "../../providers/UserProvider"

function Authentication() {
let {
    signInWithPassword,
    resetPassword,
    createUserWithEmailAndPassword,
    signInWithGoogle
} = useUser();
let [forgotPasswordMode, setForgotPasswordMode] = useState(false);
let [createUserMode, setCreateUserMode] = useState(false);
let [email, setEmail] = useState("");
let [password, setPassword] = useState("");
let [passwordConfirm, setPasswordConfirm] = useState('')
let [success, setSuccess] = useState(false);
let [error, setError] = useState("");

let handleSignInWithPassword = async (
    e: React.FormEvent<HTMLFormElement>
) => {
    if (email !== "" && password !=="") {
        try {
            await signInWithPassword(email, password);
            setError("");
            setSuccess(true);
        } catch (e) {
            let error = e as FirebaseError;
            setError(error.message);
            setSuccess(false);
        }      
    } else {
        setError("Please Fill In All Fields")
    }
}

let createUserWithPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    if (email !== '' && password !== '' && password === passwordConfirm) {
        try {
            await createUserWithEmailAndPassword(email, password);
            setError('');
            setSuccess(true);
        } catch (e) {
            let error = e as FirebaseError;
            setError(error.message);
            setSuccess(false);
        }
    } else {
        setError ('Please Fill In All Fields.');
    }
}

    return (
        <article className="app-main-article">
            <div className="authentication">
                {forgotPasswordMode ? 
                    <>
                    <h1>Forgot Password </h1>
                    <p> Please enter your email address and we will send you a link to reset your password</p>
                    <form 
                    onSubmit={(e) =>{
                    e.preventDefault();
                    setForgotPasswordMode(false);}
                    }>
                    
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    />

                    <button
                    type="button"
                    onClick={async () => {
                        try {
                            await resetPassword(email);
                            setError("");
                            setForgotPasswordMode(false);
                        } catch (e) {
                            let error = e as FirebaseError;
                            setError(error.message);
                        }
                    }}
                    >
                        Send
                        </button>
                        <a
                        href="#"
                        onClick={() => setForgotPasswordMode(false)}
                        className="authentication-forgot"
                        >
                            Go Back
                        </a>
                    </form>
                    </>
                 : 
                    <>
                    <form
                    className="authentication-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (createUserMode) {
                            createUserWithPassword(e);
                        }else {
                        handleSignInWithPassword(e);
                    }}}
                    >
                    <input
                    className="authentication-form-input"
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                    className="authentication-form-input"
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                    className="google-button"
                    onClick={signInWithGoogle}
                    >
                    Sign In With Google
                    </button>

                    {createUserMode && <input
                        className="authenication-form-input"
                        type={password}
                        value={passwordConfirm}
                        placeholder="Confirm Password"
                        onChange={(e) => setPasswordConfirm(e.target.value)}/>    
                }
                    {createUserMode ? <div>
                        <button type="submit" className="button-main">Create Button</button>
                        <button type="button" onClick={() => setCreateUserMode(false)}>Sign In</button>
                    </div>
                    : <div>
                        <button type="submit" className="button-main">Sign In</button>
                        <button type="button" onClick={() => setCreateUserMode(true)}>Create User</button>
                        </div>}
                        <a href="#" onClick={() => setForgotPasswordMode(true)} className="authentication-forgot">Forgot Password</a>
                    {success && (
                        <span className="authentication-success">{success}</span>
                    )}
                    {error.length > 0 && (
                        <span className="authentication-error">{error}</span>
                    )}
                    </form>
                    </>
                }
            </div>
        </article>
    );

}

export default Authentication;