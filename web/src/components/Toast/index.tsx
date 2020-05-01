import React from 'react';
import { useTransition } from 'react-spring';

import Message from './Message';

import { ToastMessage } from '../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  messages: ToastMessage[];
}

const Toast: React.FC<ToastProps> = ({ messages }) => {
  const messagesWithTransition = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-120%', opacity: 0 },
      enter: { right: '0%', opacity: 1 },
      leave: { right: '-120%', opacity: 0 },
    },
  );

  return (
    <Container>
      {messagesWithTransition.map(({ item, key, props }) => (
        <Message key={key} transitionStyle={props} message={item} />
      ))}
    </Container>
  );
};

export default Toast;
