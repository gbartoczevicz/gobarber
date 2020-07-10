import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...rest }) => {
  return (
    <Container
      type="button"
      isLoading={Number(isLoading)}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? 'Carregando ...' : children}
    </Container>
  );
};

export default Button;
