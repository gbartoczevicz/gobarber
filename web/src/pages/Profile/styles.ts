import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
  flex-direction: column;
`;

export const Header = styled.header`
  height: 144px;
  background: #28262e;
  display: flex;
  align-items: center;

  div {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;

    svg {
      width: 28px;
      height: 28px;
      color: #999591;
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: -176px auto 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      font-size: 20px;
      text-align: left;
      color: #f4ede8;
    }

    a {
      color: #f4ede8;
      text-decoration: none;
      display: block;
      margin-top: 36px;
    }

    input[name='current_password'] {
      margin-top: 24px;
    }
  }

  @media (max-width: 375px) {
    form {
      max-width: 290px;
    }
  }
`;

export const Avatar = styled.div`
  position: relative;
  margin: 0 auto 32px;
  width: fit-content;

  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }

  label {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ff9000;
    cursor: pointer;
    border: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    transition: background-color 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }

    svg {
      color: #312e28;
    }

    input {
      display: none;
    }
  }
`;
