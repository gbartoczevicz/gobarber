import styled from 'styled-components';
import { shade } from 'polished';

import backgroundImg from '../../assets/sign-in-background.png';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 700px;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      color: #f4ede8;
    }

    input {
      background: #232129;
      border-radius: 8px;
      border: #232119 solid 2px;
      padding: 16px;
      width: 100%;
      color: #f4ede8;

      &::placeholder {
        color: #666360;
      }

      & + input {
        margin-top: 8px;
      }
    }

    button {
      background: #ff9000;
      height: 58px;
      border-radius: 8px;
      border: 0;
      padding: 0 16px;
      width: 100%;
      color: #312e38;
      font-weight: 500;
      margin-top: 18px;
      transition: background-color 0.4s;

      &:hover {
        background: ${shade(0.2, '#ff9000')};
      }
    }

    a {
      color: #f4ede8;
      text-decoration: none;
      display: block;
      margin-top: 36px;
    }
  }

  > a {
    display: flex;
    align-items: center;
    color: #ff9000;
    text-decoration: none;
    display: block;
    margin-top: 36px;

    svg {
      margin-right: 16px;
    }
  }

  @media (max-width: 375px) {
    form {
      max-width: 290px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${backgroundImg}) center no-repeat;
  background-size: cover;
`;
