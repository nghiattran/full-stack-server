# full-stack-server
Server service for fullstack package

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



GET   auth/fb
GET   auth/gg
GET   auth/gh
GET   auth/local                 login
all
