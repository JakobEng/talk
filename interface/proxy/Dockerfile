FROM nginx:1-alpine

ADD static /static

RUN rm /etc/nginx/conf.d/*

ADD proxy.conf /etc/nginx/conf.d/
