# 🌍 GRAMAP - Global Grid Map System

**GRAMAP** é um sistema inovador de mapeamento global baseado em grades de metros quadrados. Permite localizar qualquer ponto no planeta através de um código alfanumérico único e registrar pontos comerciais com imagens.

---

## 📋 Visão Geral

### O que é GRAMAP?

GRAMAP (Global Reference And Mapping Advanced Platform) é uma alternativa aos sistemas de coordenadas tradicionais. Em vez de usar latitude/longitude, GRAMAP utiliza um código único para cada metro quadrado do planeta:

**Formato do Código:**
```
XXXXXX.YYYYYY.ZZZ.NNNNN
│      │      │   └─ ID numérico da letra (000.001 até 999.999)
│      │      └────── Sequência de letras (AAA até ZZZ)
│      └───────────── Multiplicador/Fator (0 a 999.999)
└──────────────────── Posição Leste-Oeste (0 a 999.999)
```

**Exemplos de códigos válidos:**
```
000001.000001.AAA.000001
000003.000001.BAD.000002
000010.000003.ABC.000100
```

### Capacidade

- **Cobertura:** 50+ trilhões de metros quadrados
- **Precisão:** 1 metro quadrado por célula
- **Alcance:** Planeta inteiro (círculo contínuo a partir do Meridiano de Greenwich + Equador)

---

## 🏗️ Arquitetura do Sistema

### Stack Tecnológico

**Backend:**
- Node.js + Express.js
- SQLite (banco de dados)
- JWT (autenticação)
- Multer (upload)

**Frontend:**
- HTML5 + CSS3
- Canvas API (mapa)
- JavaScript Vanilla (sem frameworks)

**Storage:**
- Sistema de arquivos local

---

## 🎯 Funcionalidades Principais

✅ **Autenticação**
- Criar conta (email + senha)
- Login/Logout
- Perfil de usuário
- Foto de perfil

✅ **Gerenciar Pontos Comerciais**
- Registrar 1 ponto por célula GRAMAP
- Adicionar até 5 imagens do negócio
- Descrição e detalhes do ponto
- Editar/deletar ponto próprio

✅ **Explorar Mapa**
- Visualizar mapa global em Canvas
- Zoom: 0.001x até 1.000x
- Buscar por código GRAMAP
- Ver pontos comerciais no mapa
- Clicar em ponto para ver detalhes

---

## 📊 Especificações Técnicas

### Formato do Código GRAMAP

| Componente | Tamanho | Range | Descrição |
|-----------|--------|-------|----------|
| Posição Leste-Oeste | 6 dígitos | 0 a 999.999 | Posição horizontal (Meridiano de Greenwich → Leste) |
| Multiplicador | 6 dígitos | 0 a 999.999 | Fator multiplicador para expandir capacidade |
| Sequência Alfabética | 3 letras | AAA a ZZZ | Posição vertical (Equador → Sul) |
| ID Numérico da Letra | 6 dígitos | 000.001 a 999.999 | Identificador único da letra |

### Limites do Sistema

| Parâmetro | Valor | Notas |
|-----------|-------|-------|
| Usuários | Ilimitado | Limitado apenas pelo servidor |
| Pontos por usuário | 1 por célula | Apenas 1 ponto comercial por m² |
| Imagens por ponto | 5 | Mais 1 foto de perfil |
| Tamanho máximo imagem | 5 MB | Por arquivo |
| Zoom mínimo | 0.001x | Ver planeta inteiro |
| Zoom máximo | 1.000x | Ver célula em detalhe |
| Capacidade total | 50+ trilhões | Células mapeáveis |

---

## 📁 Estrutura de Diretórios

```
gramap/
├── backend/
│   ├── server.js              # Entrada principal
│   ├── package.json           # Dependências
│   ├── .env.example           # Variáveis de ambiente (exemplo)
│   ├── config/
│   │   └── database.js        # Configuração SQLite
│   ├── routes/
│   │   ├── auth.js            # Rotas de autenticação
│   │   ├── users.js           # Rotas de usuários
│   │   ├── points.js          # Rotas de pontos comerciais
│   │   └── map.js             # Rotas do mapa
│   ├── middleware/
│   │   ├── auth.js            # Validação JWT
│   │   └── upload.js          # Configuração multer
│   ├── utils/
│   │   ├── gramapGenerator.js # Gerador de códigos GRAMAP
│   │   └── validators.js      # Validações
│   └── db/
│       ├── init.js            # Inicialização do banco
│       └── schema.sql         # Schema do banco
│
├── frontend/
│   ├── index.html             # Página principal
│   ├── css/
│   │   └── style.css          # Estilos
│   └── js/
│       ├── main.js            # Lógica principal
│       ├── map.js             # Renderização do mapa (Canvas)
│       ├── api.js             # Chamadas à API
│       ├── auth.js            # Lógica de autenticação
│       └── utils.js           # Funções auxiliares
│
├── .gitignore
├── .env.example
├── README.md
├── LICENSE
└── CONTRIBUTING.md
```

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js 18+ (LTS)
- npm ou yarn
- Git

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/smrjur-sys/gramap.git
   cd gramap
   ```

2. **Instale dependências do backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite .env com suas configurações
   ```

4. **Inicialize o banco de dados**
   ```bash
   npm run init-db
   ```

5. **Inicie o servidor**
   ```bash
   npm start
   ```

6. **Abra no navegador**
   ```
   http://localhost:3000
   ```

---

## 📊 Status do Projeto

### Fase 1: Preparação ✅
- [x] Criar repositório
- [x] Estruturar diretórios
- [x] Configurar package.json
- [x] Documentação inicial

### Fase 2: Backend 🔄
- [ ] Passo 5️⃣ Gerador GRAMAP
- [ ] Passo 6️⃣ Autenticação
- [ ] Passo 7️⃣ Gerenciamento de usuários
- [ ] Passo 8️⃣ Gerenciamento de pontos
- [ ] Passo 9️⃣ API do mapa
- [ ] Passo 🔟 Servidor Principal

### Fase 3: Frontend ⏳
- [ ] Passo 1️⃣1️⃣ HTML base
- [ ] Passo 1️⃣2️⃣ Estilização CSS
- [ ] Passo 1️⃣3️⃣ Autenticação (frontend)
- [ ] Passo 1️⃣4️⃣ Client API
- [ ] Passo 1️⃣5️⃣ Renderização do mapa
- [ ] Passo 1️⃣6️⃣ Funções auxiliares
- [ ] Passo 1️⃣7️⃣ Script Principal

### Fase 4: Deploy ⏳
- [ ] Passo 1️⃣8️⃣ Testes locais
- [ ] Passo 1️⃣9️⃣ Deploy em produção

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia [CONTRIBUTING.md](CONTRIBUTING.md) para entender nosso processo de desenvolvimento.

---

## 📞 Contato

- **Autor:** smrjur-sys
- **GitHub:** [@smrjur-sys](https://github.com/smrjur-sys)

---

## 🙏 Agradecimentos

Obrigado por usar GRAMAP! Sua contribuição ajuda a construir um mapa global inovador.

---

**Última atualização:** Junho 2026