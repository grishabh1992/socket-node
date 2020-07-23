import mongoose = require('mongoose');
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

    update(condition: { [key: string]: any }, item: T, option: { [key: string]: any }, callback: (error: any, result: any) => void) {
        this._model.updateMany(condition, { $set: item }, option || {}, callback);
    }

    async updateWithoutSet(condition: { [key: string]: any }, item: { [key: string]: any }, option: { [key: string]: any }) {
        return await this._model.update(condition, item, option).exec();
    }


    async updateOne(condition: { [key: string]: any }, item: T, option: { [key: string]: any }) {
        return await this._model.findOneAndUpdate(condition, { $set: item }, option || {});
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

    async queryWithPopulation(condition: { [key: string]: any }, projection: { [key: string]: any } = {}, option: { [key: string]: any } = {}, population: { [key: string]: any } = {}) {
        const query = this._model.find(condition, projection, option);
        if (population.members) {
            query.populate('members')
        }
        return await query.exec();
    }

}