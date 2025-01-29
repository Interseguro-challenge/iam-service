# Usa una imagen base oficial de Node.js
FROM node:19.0.1

# Establece el directorio de trabajo en el contenedor
WORKDIR /app/iam-service

# Copia el archivo package.json y package-lock.json
COPY package.json .

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Compila el proyecto TypeScript
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["node", "dist/app.js"]