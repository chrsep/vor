FROM postgres:11-alpine

ADD pg_hba.conf /pg_hba.conf
ADD postgresql.conf /postgresql.conf
COPY start.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod 777 /usr/local/bin/docker-entrypoint.sh
COPY ./ssl /ssl
RUN chown postgres:postgres -R /ssl
RUN chmod 600  /ssl/localhost.crt
RUN chmod 600  /ssl/localhost.key
