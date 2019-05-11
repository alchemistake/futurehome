## Frontend Stage
FROM node:9.10
MAINTAINER Begum Ozcan

COPY ./frontend/package.json ./frontend/package.json
WORKDIR ./frontend
RUN npm install

COPY ./frontend ./
RUN npm run build --prod

## Backend Stage
FROM alpine:3.8
MAINTAINER Begum Ozcan

# Install dependencies
RUN apk update && apk add nginx uwsgi-python3 supervisor

COPY ./requirements.txt /requirements.txt
RUN pip3 install -r /requirements.txt

# Setup directory structure
COPY ./admin_panel_api ./admin_panel_api
COPY ./futurehome_twitter_crawler ./futurehome_twitter_crawler
COPY ./manage.py ./manage.py

COPY ./deployment/nginx-base.conf /etc/nginx/nginx.conf
COPY ./deployment/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./deployment/uwsgi-base.ini /etc/uwsgi/uwsgi.ini
COPY ./deployment/supervisord.ini /etc/supervisor.d/supervisord.ini
COPY ./deployment/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

COPY ./deployment/uwsgi.ini ./futurehome_twitter_crawler
COPY ./deployment/settings.py ./futurehome_twitter_crawler/settings.py

COPY --from=0 ./frontend/dist /frontend

ENV PYTHONUNBUFFERED 1
ENV UWSGI_CHEAPER 2
ENV UWSGI_PROCESSES 16
ENV UWSGI_INI /futurehome_twitter_crawler/uwsgi.ini

ENTRYPOINT ["./entrypoint.sh"]
CMD ["/usr/bin/supervisord"]