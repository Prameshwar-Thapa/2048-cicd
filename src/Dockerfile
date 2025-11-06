# BEFORE:
# FROM nginx:alpine

# AFTER (no Docker Hub rate limit):
FROM public.ecr.aws/nginx/nginx:alpine

WORKDIR /usr/share/nginx/html
COPY . .
EXPOSE 80
