const model  = require('../db/models/initModels');


class СlassesController {
    async getAllClasess(req, res) {
        try {
           // req.ability.throwUnlessCan('manage', 'all');
            const repos = await model.users.findAll();
            return res.status(200).end(JSON.stringify(repos, null, 4));
        } catch (err) {
            res.status(403).send('[ERROR] 403: You dont have permissions to view all repos, or your token has expired.');
        }
    }


    async getOneClass(req, res) {
        try {
            // req.ability.throwUnlessCan(
            //     'read',
            //     await Users.findByPk(req.params.id)
            // );
            const classes = await Users.findOne({
                where: {
                    id: req.params.id
                },
            });

            if (classes) {
                return res.status(200).end(JSON.stringify(classes, null, 4));
            } else {
                return res.status(404).send('[ERROR] 404: Repo is not found.');
            }
        } catch (err) {
            console.log(err);
            res.status(403).send('[ERROR] 403: You dont have permissions to view this repo, or your token has expired.');
        }
    }


    async createClass(req, res) {
        try {
           // req.ability.throwUnlessCan('create', 'Repos');
           // console.log('body: ', req.body);
            const repoExists = await Users.findOne({
                where: {
                    name: req.body.name,
                    authorId: req.payload.id
                }
            });
            if (repoExists)
                return res.status(409).send('[ERROR] 409: Repo with such name already exists.');
            const repo = await Users.create({
                name: req.body.name,
                authorId: req.payload.id,
            });
            return res.status(201).end(JSON.stringify(repo, null, 4));
        } catch (err) {
            console.log(err);
            res.status(403).send('[ERROR] 403: You dont have permissions to create repo, or your token has expired.');
        }
    }


    async updateClass(req, res) {
        try {
            req.ability.throwUnlessCan(
                'update',
                await Users.findByPk(req.params.id)
            );
            const repo = await Users.findOne({
                where: { id: req.params.id, }
            });
            const repoWithSameName = await Repos.findOne({
                where: { name: req.body.name }
            });

            if (repoWithSameName && repoWithSameName.id != req.params.id)
                return res.status(409).send('[ERROR] 409: You already have a repo with such name.');
            if (repo) {
                await Repos.update(
                    { name: req.body.name, },
                    {
                        where: { id: req.params.id, }
                    }
                );

                const repoUpdated = await Users.findOne(
                    { where: { id: +req.params.id } });
                console.log(repoUpdated);
                console.log(+req.params.id);
                return res.status(200).end(JSON.stringify(repoUpdated, null, 4));
            } else
                res.status(404).send('[ERROR] 404: Repo is not found.');
        } catch (err) {
            console.log(err);
            res.status(403).send('[ERROR] 403: You dont have permissions to update this repo, or your token has expired.');
        }
    }


    async deleteClass(req, res) {
        try {
           // req.ability.throwUnlessCan('manage', 'all');
            const repo = await Users.findOne({
                where: {
                    id: req.params.id,
                },
            });
            if (repo) {
                await Users.destroy({
                    where: {
                        id: req.params.id,
                    },
                });
                return res.status(200).end(JSON.stringify(repo, null, 4));
            } else res.status(404).send('[ERROR] 404: There is no repo with such id.');
        } catch (err) {
            console.log(err);
            res.status(403).send('[ERROR] 403: You dont have permissions to delete this repo, or your token has expired.');
        }
    }
}


module.exports = new СlassesController();