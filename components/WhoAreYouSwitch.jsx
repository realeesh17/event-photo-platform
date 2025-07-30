"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

const WhoAreYouSwitch = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('host');

  useEffect(() => {
    // Redirect user after selection
    if (selected === 'host') {
      sessionStorage.setItem('role', 'admin');
      router.push('/auth/login'); // goes to login/signup page
    } else {
      sessionStorage.setItem('role', 'guest');
      router.push('/auth/login');
    }
  }, [selected, router]);

  return (
    <StyledWrapper>
      <div id="firstFilter" className="filter-switch">
        <input
          defaultChecked
          id="option1"
          name="options"
          type="radio"
          onChange={() => setSelected('host')}
        />
        <label className="option" htmlFor="option1">Host (Admin)</label>

        <input
          id="option2"
          name="options"
          type="radio"
          onChange={() => setSelected('guest')}
        />
        <label className="option" htmlFor="option2">User / Guest</label>

        <span className="background" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f1f5ff;

  .filter-switch {
    border: 2px solid #2563eb;
    border-radius: 30px;
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    width: 400px;
    overflow: hidden;
  }
  .filter-switch input {
    display: none;
  }
  .filter-switch label {
    flex: 1;
    text-align: center;
    cursor: pointer;
    border: none;
    border-radius: 30px;
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: all 0.5s;
    font-weight: 500;
    font-size: 18px;
  }
  .filter-switch .background {
    position: absolute;
    width: 49%;
    height: 38px;
    background-color: #2563eb;
    top: 4px;
    left: 4px;
    border-radius: 30px;
    transition: left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  #option2:checked ~ .background {
    left: 50%;
  }
  #option1:checked + label[for="option1"] {
    color: white;
    font-weight: bold;
  }
  #option2:checked + label[for="option2"] {
    color: white;
    font-weight: bold;
  }
  #option1:not(:checked) + label[for="option1"],
  #option2:not(:checked) + label[for="option2"] {
    color: #374151;
  }
`;

export default WhoAreYouSwitch;
