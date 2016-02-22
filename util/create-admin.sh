// Create admin user in mongo
mongo test --eval 'db.users.insert({"username":"admin","role": "admin","email"  :"admin@email.com","password":"jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg="});'