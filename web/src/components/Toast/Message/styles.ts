import styled, { css } from 'styled-components';
import { animated } from 'react-spring';

interface ToastProps {
  type?: 'info' | 'success' | 'error';
  discriminated: number;
}

const messageTypeVariation = {
  info: css`
    background: #3e3b47;
    color: #f4ede8;
  `,
  success: css`
    background: #e6fffa;
    color: #2e656a;
  `,
  error: css`
    background: #fddede;
    color: #c53030;
  `,
};

export const Container = styled(animated.div)<ToastProps>`
  width: 360px;
  position: relative;
  padding: 16px 30px 16px 16px;
  display: flex;
  border-radius: 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);

  & + div {
    margin-top: 12px;
  }

  ${props => messageTypeVariation[props.type || 'info']}

  > svg {
    margin: 4px 12px 0 0;
  }

  div {
    flex: 1;

    p {
      margin-top: 4px;
      font-size: 14px;
      opacity: 0.8;
      line-height: 20px;
    }
  }

  button {
    position: absolute;
    right: 18px;
    top: 18px;
    opacity: 0.6;
    background: transparent;
    color: inherit;
    border: 0;
  }

  ${props =>
    !props.discriminated &&
    css`
      align-items: center;

      svg {
        margin-top: 0;
      }
    `}
`;
