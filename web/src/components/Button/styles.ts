import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
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
`;
