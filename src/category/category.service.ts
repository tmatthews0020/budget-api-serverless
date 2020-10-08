import { Category } from "./category.interface";
import { CategoryRepository } from "./category.repository";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(category: Category) {
    return this.categoryRepository.create(category);
  }

  async list(userId: string) {
    return this.categoryRepository.list(userId);
  }
}
