import styled, { css } from 'styled-components/native';
import Feather from 'react-native-vector-icons/Feather';

interface ContainerProps {
  isFocused: boolean;
}

interface IconProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  border-width: 2px;
  border-color: #232129;

  ${props =>
    props.isFocused &&
    css`
      border-color: #ff9000;
    `};
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #ffffff;
  font-family: 'RobotoSlab-Regular';
  font-size: 16px;
`;

export const Icon = styled(Feather)<IconProps>`
  margin-right: 16px;
  color: #666360;

  ${({ isFocused, isFilled }) =>
    (isFocused || isFilled) &&
    css`
      color: #ff9000;
    `}
`;
