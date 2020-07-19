import React, { useCallback, useRef } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  Header,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title,
} from './styles';
import client from '../../services/client';

interface SignUpFormData {
  name: string;
  email: string;
  current_password: string | null;
  password: string | null;
  confirmation: string | null;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const currentPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { user } = useAuth();

  const handleSignUp = useCallback(async (data: SignUpFormData) => {
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
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer o cadastro, cheque as credenciais',
      );
    }
  }, []);

  const handleAvatarSubmit = useCallback(() => {
    console.log('e');
  }, []);

  const navigateToDashboard = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Header>
              <BackButton onPress={navigateToDashboard}>
                <Icon name="chevron-left" size={28} color="#999591" />
              </BackButton>
              <UserAvatarButton onPress={handleAvatarSubmit}>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>
            </Header>

            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                name="email"
                ref={emailInputRef}
                icon="mail"
                placeholder="E-email"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => currentPasswordInputRef.current?.focus()}
              />

              <Input
                name="current_password"
                ref={currentPasswordInputRef}
                icon="lock"
                placeholder="Senha atual"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                containerStyle={{ marginTop: 24 }}
              />
              <Input
                name="password"
                ref={passwordInputRef}
                icon="lock"
                placeholder="Nova senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />
              <Input
                name="confirmation"
                ref={confirmPasswordInputRef}
                icon="lock"
                placeholder="Confirmar senha"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Salvar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
