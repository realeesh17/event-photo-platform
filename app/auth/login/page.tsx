"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Get the role set by WhoAreYouSwitch (Host/Admin or Guest)
    const role = sessionStorage.getItem("role");
    console.log("Detected role:", role);

    if (role === "admin") {
      // Redirect admins to dashboard
      router.push("/admin");
    } else if (role === "guest") {
      // Guests should go to Event Code Entry (or user flow)
      router.push("/event"); // You can later make it /event/[eventCode]
    } else {
      // If role is not set (user bypassed first page)
      alert("Role not set! Please go back and select Host or Guest.");
      router.push("/");
    }
  };

  return (
    <StyledWrapper>
      <form className="form_main">
        <p className="heading">Login / Signup</p>

        {/* Email */}
        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
          </svg>
          <input
            type="email"
            className="inputField"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="inputContainer">
          <svg
            className="inputIcon"
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="#2e2e2e"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
          </svg>
          <input
            type="password"
            className="inputField"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button id="button" type="button" onClick={handleLogin}>
          Continue
        </button>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: #f0f9ff;

  .form_main {
    width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    position: relative;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.06);
  }

  .form_main::before {
    position: absolute;
    content: "";
    width: 300px;
    height: 300px;
    background-color: #bae6fd;
    transform: rotate(45deg);
    left: -180px;
    bottom: 30px;
    border-radius: 30px;
    z-index: 1;
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.08);
  }

  .heading {
    font-size: 2em;
    color: #2e2e2e;
    font-weight: 700;
    margin-bottom: 10px;
    z-index: 2;
  }

  .inputContainer {
    width: 100%;
    position: relative;
    margin: 10px 0;
    z-index: 2;
  }

  .inputIcon {
    position: absolute;
    left: 3px;
  }

  .inputField {
    width: 100%;
    height: 30px;
    padding-left: 30px;
    border: none;
    border-bottom: 2px solid #adadad;
    background: transparent;
    color: black;
    font-size: 0.8em;
    font-weight: 500;
  }

  .inputField:focus {
    outline: none;
    border-bottom: 2px solid #38bdf8;
  }

  #button {
    width: 100%;
    border: none;
    background-color: #38bdf8;
    color: white;
    height: 30px;
    font-size: 0.8em;
    font-weight: 500;
    margin-top: 10px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 2;
    transition: all 0.2s;
  }

  #button:hover {
    background-color: #0ea5e9;
  }
`;
