import server from '@shared/infra/http/App';

const { log } = console;

server.listen(3333, () => log(`Server started at http://localhost:3333 🚀`));
