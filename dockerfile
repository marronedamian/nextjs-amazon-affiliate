# Etapa de build
FROM --platform=linux/amd64 node:20.11.1-bullseye AS builder

WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Copia el resto del código fuente
COPY . .

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  apt-get install -y fonts-noto-color-emoji && \
  rm -rf /var/lib/apt/lists/*

# Instala las dependencias de la aplicación
RUN npm install  

# Compila el código TypeScript
RUN npm run build

# Exponer el puerto para Next.js
EXPOSE 8084

# Ejecutar la aplicación
CMD ["npm", "run", "start"]