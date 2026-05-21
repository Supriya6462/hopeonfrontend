import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminQueryKeys, getAdminUserList } from "@/features/admin/api";
import {
  AdminPageSkeleton,
  EmptyState,
  FilterCard,
  PageHeader,
  Pagination,
  RefreshButton,
  StatusBadge,
} from "@/features/admin/components";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ShieldCheck, Users } from "lucide-react";

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      role: role === "all" ? undefined : role,
    }),
    [page, search, role],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => getAdminUserList(params),
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  if (isLoading)
    return <AdminPageSkeleton statCount={0} listCount={5} variant="list" />;

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Users"
          title="User Management"
          description="Search and monitor platform users and role states."
          action={
            <RefreshButton
              disabled={isFetching}
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
              }
            />
          }
        />

        <FilterCard>
          <form
            className="grid gap-3 md:grid-cols-[1fr_200px_auto]"
            onSubmit={onSearch}
          >
            <div>
              <Label
                htmlFor="admin-user-search"
                className="text-xs font-medium text-muted-foreground"
              >
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-user-search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 h-9"
                  placeholder="Name or email"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-muted-foreground">
                Role
              </Label>
              <Select
                value={role}
                onValueChange={(value) => {
                  setRole(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit" size="sm">
                Apply
              </Button>
            </div>
          </form>
        </FilterCard>

        <div className="space-y-2">
          {items.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search or role filters."
            />
          ) : (
            items.map((item) => (
              <Card key={item._id} className="surface-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {item.name}
                        </p>
                        <StatusBadge status={item.role} />
                        {item.isOrganizerApproved ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                            <ShieldCheck className="h-3 w-3" />
                            Approved
                          </span>
                        ) : null}
                        {item.isOrganizerRevoked ? (
                          <StatusBadge status="revoked" />
                        ) : null}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {item.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      Joined {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          isFetching={isFetching}
          onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
          onNext={() => setPage((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}
