# criar novo usuário
CREATE USER 'chat'@'192.168.1.103' IDENTIFIED BY 'chat123@';

# dar permissões ao usuário
GRANT SELECT,INSERT,UPDATE,DELETE on chat.* TO 'chat'@'192.168.1.103' IDENTIFIED BY 'chat123@';
flush privileges;
