import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';

import client from '../../services/client';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';

import { Container, Header, Content, Avatar } from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface ProfileFormData {
  name: string;
  email: string;
  current_password: string | null;
  password: string | null;
  confirmation: string | null;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { addToast } = useToast();
  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-Mail obrigatório')
          .email('Digite um e-mail válido'),
        current_password: Yup.string(),
        password: Yup.string().when('current_password', {
          is: val => !!val.length,
          then: Yup.string().min(8).required('Senha obrigatória'),
          otherwise: Yup.string(),
        }),
        confirmation: Yup.string()
          .when('current_password', {
            is: val => !!val.length,
            then: Yup.string().min(8).required('Senha obrigatória'),
            otherwise: Yup.string(),
          })
          .oneOf(
            [Yup.ref('password'), null],
            'A confirmação não coincide com a nova senha',
          ),
      });
      try {
        await schema.validate(data, { abortEarly: false });

        const { name, email, current_password, password, confirmation } = data;

        const formData = {
          name,
          email,
          ...(current_password && {
            current_password,
            password,
            confirmation,
          }),
        };

        client.put('/profile', formData).then(res => updateUser(res.data));

        history.push('/');

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description:
            'Ocorreu um erro ao fazer o cadastro, cheque as credenciais',
        });
      }
    },
    [addToast, updateUser, history],
  );

  const handleAvatarSubmit = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }

      const data = new FormData();

      data.append('avatar', e.target.files[0]);

      await client.patch('/users/avatar', data).then(res => {
        updateUser(res.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado',
        });
      });
    },
    [updateUser, addToast],
  );

  return (
    <Container>
      <Header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </Header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <Avatar>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera size={20} />
              <input type="file" id="avatar" onChange={handleAvatarSubmit} />
            </label>
          </Avatar>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-Mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="current_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />

          <Button type="submit">Salvar</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
