import React, { useRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';

import { useToast } from '../../hooks/toast';

import client from '../../services/client';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, AnimatedContainer, Content, Background } from './styles';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-Mail obrigatório')
          .email('Digite um e-mail válido'),
      });

      try {
        await schema.validate(data, { abortEarly: false });

        setLoading(true);

        await client.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description: `Enviamos uma mensagem no seu email ${data.email} para a confirmação de senha`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao recuperar a senha, cheque as credenciais',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <Container>
      <Content>
        <AnimatedContainer>
          <img src={logo} alt="GoBarber logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-Mail" />

            <Button type="submit" isLoading={loading}>
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimatedContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
