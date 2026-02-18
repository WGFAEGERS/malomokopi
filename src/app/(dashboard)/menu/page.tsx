import { getCategories } from "@/actions/categories";
import { getMenuItems } from "@/actions/menu";
import { MenuManagement } from "@/components/menu/menu-management";

export default async function MenuPage() {
  const [categories, menuItems] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Menu Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage your MalomoKopi menu categories and items.
        </p>
      </div>
      <MenuManagement
        categories={categories}
        menuItems={menuItems as any}
      />
    </div>
  );
}
