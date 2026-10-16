# Imagen oficial ligera de Nginx basada en Alpine Linux
FROM nginx:alpine

# Copiar los archivos estáticos de la aplicación al directorio web de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto 80 para acceso HTTP
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]