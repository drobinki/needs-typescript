import {HelloView} from "./helloView";
import {DynamoHelloViewRepository} from "../infrastructure/dynamoHelloViewRepository";

export interface HelloViewRepository {
    save(hello: HelloView): Promise<any>
    load(userId: String): Promise<HelloView>
    all(): Promise<HelloView[]>;
}

const dynamoHelloViewRepository = new DynamoHelloViewRepository()

export function helloViewRepository(): HelloViewRepository {
    return dynamoHelloViewRepository;
}

