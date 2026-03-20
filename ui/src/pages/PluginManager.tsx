import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Puzzle, Plus, ExternalLink, Github } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";
import { useBreadcrumbs } from "@/context/BreadcrumbContext";
import { Link } from "@/lib/router";
import { pluginsApi } from "@/api/plugins";
import { queryKeys } from "@/lib/queryKeys";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * PluginManager page component.
 *
 * Lists all installed plugins for the current company with their status,
 * description, and quick actions. This is the main entry point for plugin
 * management in the instance settings.
 *
 * Navigation:
 * - /instance/settings/plugins → lists all plugins
 * - Clicking on a plugin navigates to /:companyPrefix/plugin/:pluginId/settings
 *
 * @see PluginSettings — detailed plugin settings page
 * @see doc/plugins/PLUGIN_SPEC.md — plugin architecture specification
 */
export function PluginManager() {
  const { selectedCompany, selectedCompanyId } = useCompany();
  const { setBreadcrumbs } = useBreadcrumbs();

  const { data: plugins, isLoading } = useQuery({
    queryKey: queryKeys.plugins.all,
    queryFn: () => pluginsApi.list(),
    enabled: !!selectedCompanyId,
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "Settings", href: "/instance/settings/heartbeats" },
      { label: "Plugins", href: "/instance/settings/plugins" },
    ]);
  }, [selectedCompany, setBreadcrumbs]);

  if (isLoading) {
    return <div className="p-4 text-sm text-muted-foreground">Loading plugins...</div>;
  }

  if (!plugins || plugins.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold mb-2">Plugins</h1>
        <p className="text-sm text-muted-foreground mb-6">
          No plugins installed yet. Plugins extend Paperclip with additional
          capabilities like custom integrations, specialized workflows, and
          third-party service connections.
        </p>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Install Plugin (Coming Soon)
        </Button>
      </div>
    );
  }

  const companyPrefix = selectedCompany?.id || "c";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Plugins</h1>
        <Button disabled>
          <Plus className="h-4 w-4 mr-2" />
          Install Plugin
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plugins.map((plugin) => {
          const statusVariant: "default" | "destructive" | "secondary" =
            plugin.status === "ready"
              ? "default"
              : plugin.status === "error"
                ? "destructive"
                : "secondary";

          return (
            <Card key={plugin.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Puzzle className="h-4 w-4 text-muted-foreground" />
                      {plugin.manifestJson?.displayName || plugin.packageName}
                    </CardTitle>
                    {plugin.manifestJson?.description && (
                      <CardDescription className="mt-1 text-sm">
                        {plugin.manifestJson.description}
                      </CardDescription>
                    )}
                  </div>
          <Badge variant={statusVariant} className="shrink-0">
            {plugin.status}
          </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  {plugin.categories.length > 0 ? (
                    plugin.categories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No categories</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-3 pb-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  v{plugin.manifestJson.version || plugin.version}
                  {plugin.manifestJson.author && ` • ${plugin.manifestJson.author}`}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/${companyPrefix}/plugin/${plugin.id}/settings`}>
                    Settings
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
