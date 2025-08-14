"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const chooseRole = (role) => {
    setSelectedRole(role);
    setTimeout(() => {
      if (role === "guest") router.push("/user/signup"); // User goes to signup
      if (role === "admin") router.push("/admin/login"); // Admin goes to login
    }, 300);
  };

  const GuestIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 3.58-8 8h16c0-4.42-3.58-8-8-8Z" />
    </svg>
  );

  const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z" />
    </svg>
  );

  return (
    <StyledWrapper>
      <div className="container">
        <h1 className="title">Who are you?</h1>
        
        <div className="role-selection">
          {/* USER */}
          <div
            className={`checkbox-tile ${selectedRole === "guest" ? "selected" : ""}`}
            onClick={() => chooseRole("guest")}
          >
            <span className="checkbox-icon">
              <GuestIcon />
            </span>
            <span className="checkbox-label">User</span>
          </div>

          {/* ADMIN */}
          <div
            className={`checkbox-tile ${selectedRole === "admin" ? "selected" : ""}`}
            onClick={() => chooseRole("admin")}
          >
            <span className="checkbox-icon">
              <AdminIcon />
            </span>
            <span className="checkbox-label">Admin</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%);
  padding: 2rem;

  .container {
    text-align: center;
    max-width: 800px;
    width: 100%;
  }

  .title {
    font-size: 2.5rem;
    color: #1a56db;
    margin-bottom: 3rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .role-selection {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .checkbox-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 12rem;
    min-height: 12rem;
    border-radius: 1rem;
    border: 2px solid #b8d4ff;
    background-color: #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    padding: 1.5rem;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      border-color: #3b82f6;
    }

    &.selected {
      border-color: #1d4ed8;
      background-color: #eff6ff;
      box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
    }
  }

  .checkbox-icon {
    color: #3b82f6;
    margin-bottom: 1.5rem;
    svg {
      width: 4rem;
      height: 4rem;
    }
  }

  .checkbox-label {
    color: #1e3a8a;
    font-size: 1.25rem;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .role-selection {
      flex-direction: column;
    }
    .title {
      font-size: 2rem;
    }
  }
`;
