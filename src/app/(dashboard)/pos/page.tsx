import { getCategories } from "@/actions/categories";
import { getMenuItems } from "@/actions/menu";
import { POSScreen } from "@/components/pos/pos-screen";

export default async function POSPage() {
  const [categories, menuItems] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  const availableItems = menuItems
    .filter((item) => item.available)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      imageUrl: item.imageUrl,
    }));

  return <POSScreen categories={categories} menuItems={availableItems} />;
}
