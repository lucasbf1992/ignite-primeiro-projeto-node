FROM node:alpine

# faz da pasta 'app' o diretório atual de trabalho
WORKDIR /usr/app

# copia os arquivos 'package.json' e 'package-lock.json' (se disponível)
COPY package*.json ./

# instala dependências do projeto
RUN npm install

# copia arquivos e pastas para o diretório atual de trabalho (pasta 'app')
COPY . .

EXPOSE 3333
CMD 'npm run dev'