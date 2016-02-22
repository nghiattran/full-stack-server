# full-stack-server
> Server service for fullstack package

[![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

API layout

POST  users                       signup

all

GET   users                       get all users

admin

GET   users/:id                   get a users

admin

PUT   users/:id                   admin manage users

admin

PUT   users/:id/activate           setting user info

all

PUT   users/:id/setting           setting user info

user

POST  users/reset                 request reset password

user

POST  users/reset/:id             reset user password

user

## Incomming

GET   auth/fb
GET   auth/gg
GET   auth/gh
GET   auth/local                 login
all

[travis-image]: https://travis-ci.org/nghiattran/full-stack-server.svg?branch=master
[travis-url]: https://travis-ci.org/nghiattran/full-stack-server
[daviddm-image]: https://david-dm.org/nghiattran/full-stack-server.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/nghiattran/full-stack-server
[coveralls-image]: https://coveralls.io/repos/nghiattran/full-stack-server/badge.svg
[coveralls-url]: https://coveralls.io/r/nghiattran/full-stack-server
