
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserManagementTable } from "./user-table";

export default function AdminTab() {
  return (
    <Card className="w-full bg-card/70 border-0 pixel-border mt-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold uppercase">Panel de Administrador</CardTitle>
        <CardDescription>Gestión de usuarios y configuración de la plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <UserManagementTable />
      </CardContent>
    </Card>
  );
}
