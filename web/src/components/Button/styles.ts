import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ButtonProps {
  isLoading?: number;
}

export const Container = styled.button<ButtonProps>`
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

  ${props =>
    props.isLoading &&
    css`
      background: ${shade(0.2, '#ff9000')};
    `}

  &:hover {
    background: ${shade(0.2, '#ff9000')};
  }
`;
