# Novas Features

## Recuperação de senha

***RF***

- O usuário deve recuperar sua senha informando o seu e-mail
- O usuário deve receber um e-mail de recuperação de senha
- O usuário deve poder resetar sua senha

***RNF***

- Utilizar Mailtrap para teste em ambiente de desenvolvimento
- Utilizar o Amazon SES para envios em produção
- O envio de e-mails deve acontecer em segundo plano (background job)

***RN***

- O link enviado por e-mail para recuperação de senha, deve expirar em 2 horas
- O usuário precisa confirmar a nova senha para a recuperação
- As notificações devem ser enviadas em tempo-real com Socket.IO

## Atualização de perfil

***RF***

- O usuário deve poder atualizar seu nome, e-mail e senha

***RNF***

- N/A

***RN***

- O usuário não pode alterar seu e-mail para um já existente
- Para atualizar a senha ele deve informar a sua antiga
- Para atualizar a senha ele deve confirmar a nova senha

## Painel do prestador de serviços

***RF***

- O usuário deve poder listar seus agendamentos de um dia específico
- O usuário deve receber uma notificação sempre que tiver um agendamento
- O usuário deve poder visualizar as notificações não lidas

***RNF***

- A listagem de agendamentos no dia deve ser armazenada em cache
- As notificações devem ser armazenadas no MongoDB

***RN***

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar

## Painel do cliente (agendamento de serviços)

***RF***

- O usuário deve poder listar todos os prestadores de serviço cadastrados
- O usuário deve poder listar os dias de um mes com, pelo menos, uma vaga disponível, de um prestador de serviços específico
- O usuário deve poder listar horários disponíveis em um dia específico do prestador\
- O usuário deve poder realizar um novo agendamento com um agendador

***RNF***

- A listagem de prestadores deve ser armazenada em cache

***RN***

- Cada agendamento deve durar 1h exatamente
- Os agendamentos devem estar disponíveis entre 8h às 18h (Primeiro às 8h, último às 17h)
- O usuário não pode agendar em um usuário já ocupado
- O usuário não pode agendar em um horário que já passou
- O usuário não pode agendar serviços consigo mesmo
