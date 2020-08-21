import mongoose = require('mongoose');

const populationMapper = {
    members: 'members',
    sender: 'sender'
}
export class RepositoryBase<T extends mongoose.Document> {
    private _model: mongoose.Model<mongoose.Document>;

    constructor(schemaModel: mongoose.Model<mongoose.Document>) {
        this._model = schemaModel;
    }

    async create(item: T) {
        return await this._model.create(item);
    }

    async retrieve(condition: { [key: string]: any }, projection: { [key: string]: any } = {}, option: { [key: string]: any } = {}) {
        return await this._model.find(condition, projection, option).exec();
    }

    findOne(condition: { [key: string]: any }, projection: { [key: string]: any }, option: { [key: string]: any }, callback: (error: any, result: any) => void) {
        this._model.findOne(condition, projection, option || {}, callback)
    }

    async update(condition: { [key: string]: any }, item: T, option: { [key: string]: any }) {
        return await this._model.updateMany(condition, { $set: item }, option || {});
    }

    async updateWithoutSet(condition: { [key: string]: any }, item: { [key: string]: any }, option: { [key: string]: any }) {
        return await this._model.update(condition, item, option).exec();
    }


    async updateOne(condition: { [key: string]: any }, item: T, option: { [key: string]: any } = {}) {
        return await this._model.findOneAndUpdate(condition, { $set: item }, option).exec();
    }

    async delete(condition: { [key: string]: any }) {
        return await this._model.remove(condition);
    }

    async findOneAndRemove(condition: { [key: string]: any }, option: { [key: string]: any }) {
        return await this._model.findOneAndRemove(condition, option);
    }

    async count(condition: { [key: string]: any }, option: { [key: string]: any }) {
        return await this._model.countDocuments(condition || {})
    }

    async queryWithPopulation(condition: { [key: string]: any }, projection: { [key: string]: any } = {}, option: { [key: string]: any } = {}, population: string[] = []) {
        let query = this._model.find(condition, projection, option);
        population.forEach(element => {
            query = query.populate(populationMapper[element])
        });
        return await query.exec();
    }


    async aggregate(pipeline: any[] = []) {
        let query = this._model.aggregate(pipeline);
        return await query.exec();
    }

}