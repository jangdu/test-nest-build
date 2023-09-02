import { Store } from 'src/entities/store.entity';
import { DataSource, Repository } from 'typeorm';
import StockDTO from './DTO/stock.DTO';
export declare class StoresRepository extends Repository<Store> {
    private datasource;
    constructor(datasource: DataSource);
    findStoreById(id: number): Promise<Store>;
    findStoreByStock(body: Array<StockDTO>): Promise<any>;
    createStore(obj: object): Promise<import("typeorm").InsertResult>;
}
