FROM nginx:bullseye

EXPOSE 443 

# Install openssl and create the ssl directory
RUN apt-get update -y && apt-get install -y openssl && mkdir -p /etc/nginx/ssl

# Generate the private key for the CA
RUN openssl genrsa -out /etc/nginx/ssl/myCA.key 2048

# Generate the CA certificate
RUN openssl req -x509 -new -nodes -key /etc/nginx/ssl/myCA.key -sha256 -days 1024 -out /etc/nginx/ssl/myCA.pem -subj "/CN=My Local CA"

# Generate the private key for the self-signed certificate
RUN openssl genrsa -out /etc/nginx/ssl/nginx-selfsigned.key 2048

# Generate the certificate signing request (CSR)
RUN openssl req -new -key /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx.csr -subj "/CN=${DOMAIN_NAME:-localhost}"

# Generate the self-signed certificate
RUN openssl x509 -req -in /etc/nginx/ssl/nginx.csr -CA /etc/nginx/ssl/myCA.pem -CAkey /etc/nginx/ssl/myCA.key -CAcreateserial -out /etc/nginx/ssl/nginx-selfsigned.crt -days 365 -sha256

# Generate Diffie-Hellman parameters
RUN openssl dhparam -out /etc/nginx/ssl/dhparam.pem 2048

# Set permissions for the SSL files
RUN chmod 600 /etc/nginx/ssl/*

# Copy the nginx configuration file
COPY conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]