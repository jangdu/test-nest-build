import { User } from 'src/entities/user.entity';
import { Store_Product } from 'src/entities/store_product.entity';
import { CommonEntity } from './common.entity';
export declare class Store extends CommonEntity {
    name: string;
    description: string;
    businessLicense: string;
    imgUrls: string;
    userId: number;
    address: string;
    lng: string;
    lat: number;
    user: User;
    productList: Store_Product[];
}
