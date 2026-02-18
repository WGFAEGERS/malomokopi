import { getCategories } from "@/actions/categories";
import { getMenuItems } from "@/actions/menu";
import { CustomerOrderScreen } from "@/components/customer/customer-order-screen";

export default async function CustomerOrderPage() {
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
            category: item.category?.name ?? "",
        }));

    return <CustomerOrderScreen categories={categories} menuItems={availableItems} />;
}
