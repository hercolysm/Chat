DROP DATABASE chat;
CREATE DATABASE chat;

USE chat;

CREATE TABLE usuarios (
	id_usuario INT AUTO_INCREMENT,
	nome VARCHAR(100),
	login VARCHAR(30),
	senha CHAR(32),
	habilitado BOOLEAN NOT NULL DEFAULT 1,
	PRIMARY KEY (id_usuario)
);

CREATE TABLE salas (
	id_sala INT AUTO_INCREMENT,
	nome VARCHAR(50),
	PRIMARY KEY (id_sala)
);

CREATE TABLE mensagens (
	id_mensagem INT AUTO_INCREMENT,
	id_sala INT NOT NULL,
	id_usuario INT NOT NULL,
	texto TEXT,
	data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id_mensagem),
	FOREIGN KEY (id_sala) REFERENCES salas (id_sala) ON UPDATE CASCADE ON DELETE NO ACTION,
	FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON UPDATE CASCADE ON DELETE NO ACTION
);

CREATE TABLE usuarios_online (
	id_usuario INT NOT NULL,
	id_sala INT NOT NULL,
	data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	data_saida DATETIME NULL DEFAULT NULL,
	FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_sala) REFERENCES salas (id_sala) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO usuarios (id_usuario, nome, login, senha, habilitado) VALUES (1, 'Hercolys', 'hercolys', MD5('1234'), 1);
INSERT INTO salas (id_sala, nome) VALUES (1, 'Sala 1');
INSERT INTO salas (id_sala, nome) VALUES (2, 'Sala 2');
