import { Store } from 'src/entities/store.entity';
import { Store_Product } from 'src/entities/store_product.entity';
declare const CreateStoreDTO_base: import("@nestjs/common").Type<Pick<Store, "name" | "description" | "userId" | "address" | "businessLicense" | "imgUrls" | "lng" | "lat">>;
export declare class CreateStoreDTO extends CreateStoreDTO_base {
}
declare const AddProductDTO_base: import("@nestjs/common").Type<Pick<Store_Product, "productId" | "storeId" | "storeStock">>;
export declare class AddProductDTO extends AddProductDTO_base {
}
export {};
