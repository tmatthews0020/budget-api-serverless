import * as uuid from "uuid";
import { getCognitoUserId } from "../auth";
import { Category } from "./category.interface";
import { CategoryRepository } from "./category.repository";
import { CategoryService } from "./category.service";

export class CategoryHandler {
  constructor(private readonly categoryService: CategoryService) {}

  async create(event: any) {
    const category = new Category({
      id: uuid.v1(),
      categoryName: event.body.categoryName,
      userId: getCognitoUserId(event),
    });

    return this.categoryService.create(category);
  }

  async list(event: any) {
    return this.categoryService.list(getCognitoUserId(event));
  }
}

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryHandler = new CategoryHandler(categoryService);

export const create = categoryHandler.create.bind(categoryHandler);
export const list = categoryHandler.list.bind(categoryHandler);
