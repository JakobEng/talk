FROM golang:1

RUN apt-get install git
RUN go get github.com/githubnemo/CompileDaemon
RUN go install github.com/githubnemo/CompileDaemon

RUN mkdir -p /go/src/app
WORKDIR /go/src/app


ADD . /go/src/app
RUN go get
