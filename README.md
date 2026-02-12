# Dev Starter Lab (Júnior 2 anos)

Pacote prático com **arquivos essenciais** e **3 projetos funcionais** para mostrar maturidade de dev júnior pleno-iniciante.

## O que tem aqui

- `apps/microcrm-api` → API REST simples (Node.js puro) para gerenciar leads.
- `apps/foco-pomodoro-web` → app web de foco com timer Pomodoro + tarefas.
- `apps/devtool-cli` → CLI em Python para planejar estudos e rotina semanal.
- `docs/roadmap-junior.md` → plano prático de evolução técnica/carreira.
- Arquivos essenciais: `.gitignore`, `.editorconfig`, `CONTRIBUTING.md`, templates de issue e script de bootstrap.

## Requisitos

- Node.js 18+
- Python 3.10+

## Como rodar

### 1) MicroCRM API

```bash
cd apps/microcrm-api
node server.js
```

API sobe em `http://localhost:3333`.

Endpoints principais:

- `GET /health`
- `GET /leads`
- `POST /leads`
- `PATCH /leads/:id/status`
- `DELETE /leads/:id`

Exemplo de criação:

```bash
curl -X POST http://localhost:3333/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana","email":"ana@email.com","source":"linkedin"}'
```

### 2) Foco Pomodoro Web

```bash
cd apps/foco-pomodoro-web
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

### 3) DevTool CLI

```bash
python3 apps/devtool-cli/dev_tool.py plan --hours 10 --goal "Backend"
python3 apps/devtool-cli/dev_tool.py standup --yesterday "API" --today "Testes" --blockers "Nenhum"
```

## Testes rápidos

```bash
python3 -m unittest -v tests/test_dev_tool.py
node --check apps/microcrm-api/server.js
```

## Próximos passos sugeridos

- Adicionar autenticação JWT na API.
- Persistir tarefas Pomodoro no backend.
- Publicar CLI no PyPI.
