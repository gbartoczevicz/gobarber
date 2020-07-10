import React, { useEffect } from 'react';
import { FiAlertCircle, FiCheck, FiInfo, FiX } from 'react-icons/fi';

import { Container } from './styles';
import { useToast, ToastMessage } from '../../../hooks/toast';

interface MessageProps {
  message: ToastMessage;
  transitionStyle: object;
}

const icons = {
  info: <FiInfo size={20} />,
  success: <FiCheck size={20} />,
  error: <FiAlertCircle size={20} />,
};

const Message: React.FC<MessageProps> = ({ message, transitionStyle }) => {
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(message.id), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      discriminated={Number(!!message.description)}
      style={transitionStyle}
    >
      {icons[message.type || 'info']}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiX size={18} />
      </button>
    </Container>
  );
};

export default Message;
