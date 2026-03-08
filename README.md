# Centro Pokémon - Sistema de Gerenciamento

Sistema completo para gerenciamento de Pokémons de um Centro Pokémon, com autenticação de usuários e CRUD completo.

## Tecnologias

**Backend:**
- NestJS + TypeScript
- PostgreSQL + TypeORM
- JWT (JSON Web Tokens) para autenticação
- class-validator para validação de dados
- Jest para testes

**Frontend:**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- React Hook Form + Zod para validação
- Axios para requisições HTTP
- React Hot Toast para notificações
- Testing Library + Jest para testes

## Funcionalidades

- **Autenticação:** Login e registro de treinadores com JWT
- **Pokédex Global:** Lista compartilhada de Pokémons entre todos os usuários
- **CRUD Protegido:** Apenas o criador pode editar ou excluir seus Pokémons
- **Busca:** Filtro por nome, tipo ou número da Pokédex
- **Imagens:** Integração com sprites da PokéAPI

## Campos do Pokémon

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | string | Nome do Pokémon (ex: Pikachu) |
| Tipos | string[] | 1 ou 2 tipos (ex: Elétrico, Fogo) |
| Nível | number | 1 a 100 |
| HP | number | Pontos de vida |
| Número Pokédex | number | ID oficial único |

## Como rodar

### Com Docker (recomendado)

```bash
docker-compose up -d
```

Acesse:
- Frontend: http://localhost:3000
- API: http://localhost:3001/api

### Manualmente

**1. PostgreSQL**
```bash
# Certifique-se que o PostgreSQL está rodando e crie o banco:
createdb pokemon_center
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env   # edite as variáveis
npm run start:dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | /api/auth/register | Cadastrar treinador | Não |
| POST | /api/auth/login | Login | Não |
| GET | /api/pokemons | Listar todos | Sim |
| GET | /api/pokemons/:id | Buscar por ID | Sim |
| POST | /api/pokemons | Criar Pokémon | Sim |
| PATCH | /api/pokemons/:id | Atualizar (só criador) | Sim |
| DELETE | /api/pokemons/:id | Excluir (só criador) | Sim |

## Testes

**Backend:**
```bash
cd backend
npm test           # testes unitários
npm run test:cov   # com cobertura
```

**Frontend:**
```bash
cd frontend
npm test           # testes unitários
npm run test:cov   # com cobertura
```

## Estrutura do Projeto

```
SIM-INT/
├── backend/
│   ├── src/
│   │   ├── auth/             # Módulo de autenticação (JWT)
│   │   │   ├── dto/          # LoginDto, RegisterDto
│   │   │   ├── guards/       # JwtAuthGuard
│   │   │   └── strategies/   # JwtStrategy
│   │   ├── users/            # Módulo de usuários
│   │   │   ├── dto/
│   │   │   └── entities/     # User entity
│   │   └── pokemons/         # Módulo de Pokémons
│   │       ├── dto/          # CreatePokemonDto, UpdatePokemonDto
│   │       └── entities/     # Pokemon entity
│   └── test/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── login/        # Página de login
│       │   ├── register/     # Página de registro
│       │   └── pokedex/      # Pokédex principal
│       ├── components/       # Componentes reutilizáveis
│       ├── context/          # AuthContext
│       ├── services/         # Serviços de API
│       └── types/            # Tipos TypeScript
└── docker-compose.yml
```
