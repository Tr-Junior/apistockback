const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.getByName = async (req, res, next) => {
    try {
        const data = await repository.checkUsernameExists(req.params.name);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.updatePassword = async (req, res, next) => {
    try {
        await repository.updatePassword(req.body.id, req.body);
        res.status(200).send({ message: 'Senha atualizada com sucesso!' });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
}

exports.post = async (req, res, next) => {
    try {
        await repository.create({
            name: req.body.name,
            password: md5(req.body.password + process.env.SALT_KEY),
            roles: req.body.roles,
        });

        res.status(201).send({
            message: 'Usuário cadastrado com sucesso.'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição'
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await repository.delete(req.params.id)
        res.status(200).send({
            message: 'Usuário removido!'
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Falha ao processar a requisição.' });
    }
}

exports.authenticate = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const hashedPassword = md5(password + process.env.SALT_KEY);

        let user;
        if (name === process.env.ADMIN_DEFAULT_USER && password === process.env.ADMIN_DEFAULT_PASS) {
     
            const expectedPassword = md5(process.env.ADMIN_DEFAULT_PASS + process.env.SALT_KEY);

            if (hashedPassword !== expectedPassword) {
                return res.status(401).send({ message: "Senha incorreta para admin." });
            }
            user = await repository.createDefaultAdmin();

            const token = await authService.generateToken({
                name,
                roles: ["admin"]
            });

            return res.status(200).send({
                token,
                user: {
                    name,
                    roles: ["admin"],
                    firstLogin: true 
                }
            });
        }

        user = await repository.authenticate({ name, password: hashedPassword });

        if (!user) {
            return res.status(404).send({ message: "Usuário ou senha inválidos" });
        }


        const token = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles
        });

        res.status(200).send({
            token,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles
            }
        });
    } catch (e) {
        res.status(500).send({ message: "Falha ao processar a requisição" });
    }
};




exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const user = await repository.getById(data._id);

        if (!user) {
            res.status(404).send({
                message: 'Usuário não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            _id: user._id,
            name: user.name,
            roles: user.roles
        });

        res.status(201).send({
            token: tokenData,
            user: {
                _id: user._id,
                name: user.name,
                roles: user.roles
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};

exports.validatePassword = async (req, res) => {
    try {
        const userId = req.body.userId;
        const inputPassword = req.body.password; 

        // Busca o usuário no banco pelo ID
        const user = await repository.getById(userId);

        if (!user) {
            return res.status(404).send({ message: 'Usuário não encontrado' });
        }

        const encryptedPassword = md5(inputPassword + process.env.SALT_KEY);

        if (user.password === encryptedPassword) {
            return res.status(200).send({ valid: true });
        } else {
            return res.status(401).send({ valid: false, message: 'Senha incorreta' });
        }
    } catch (e) {
        return res.status(500).send({ message: 'Erro ao processar a requisição' });
    }
};

exports.updateAdminCredentials = async (req, res) => {
    try {
        const { newName, newPassword } = req.body;

        const existingUser = await repository.checkUsernameExists(newName);
        if (existingUser) {
            return res.status(400).send({ message: "Nome de usuário já está em uso." });
        }

        const user = await repository.updateAdminCredentials(newName, newPassword);

        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado." });
        }

        res.status(201).send({ message: "Novo administrador criado com sucesso!" });
    } catch (e) {
        res.status(500).send({ message: "Falha ao criar o novo administrador." });
    }
};


