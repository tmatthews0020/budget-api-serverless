export class Category {
  constructor(category: Category) {
    this.categoryName = category.categoryName;
    this.userId = category.userId;
    this.id = category.id;
  }
  id: string;
  categoryName: string;
  userId: string;
}
