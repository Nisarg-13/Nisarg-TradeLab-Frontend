"use client";

import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createMistake,
  createStrategy,
  createTag,
  deleteMistake,
  deleteTag,
  updateStrategy,
} from "@/lib/api/strategies";
import { useClientAuthToken } from "@/lib/auth/client";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

export function StrategiesManager({
  initialStrategies,
  initialTags,
  initialMistakes,
}: {
  initialStrategies: Strategy[];
  initialTags: Tag[];
  initialMistakes: Mistake[];
}) {
  const getAuthToken = useClientAuthToken();
  const [strategies, setStrategies] = useState(initialStrategies);
  const [tags, setTags] = useState(initialTags);
  const [mistakes, setMistakes] = useState(initialMistakes);
  const [isSaving, setIsSaving] = useState(false);

  async function handleCreateStrategy(formData: FormData) {
    setIsSaving(true);

    try {
      const response = await createStrategy(getAuthToken, {
        name: String(formData.get("strategyName") ?? ""),
        description:
          String(formData.get("strategyDescription") ?? "") || undefined,
      });
      setStrategies((current) =>
        [...current, response.data].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      toast.success("Strategy created.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create strategy.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleStrategy(strategy: Strategy) {
    setIsSaving(true);

    try {
      const response = await updateStrategy(getAuthToken, strategy.id, {
        isActive: !strategy.isActive,
      });
      setStrategies((current) =>
        current.map((item) => (item.id === strategy.id ? response.data : item)),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update strategy.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateTag(formData: FormData) {
    setIsSaving(true);

    try {
      const response = await createTag(getAuthToken, {
        name: String(formData.get("tagName") ?? ""),
      });
      setTags((current) =>
        [...current, response.data].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      toast.success("Tag created.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create tag.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTag(tagId: string) {
    setIsSaving(true);

    try {
      await deleteTag(getAuthToken, tagId);
      setTags((current) => current.filter((tag) => tag.id !== tagId));
      toast.success("Tag deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete tag.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreateMistake(formData: FormData) {
    setIsSaving(true);

    try {
      const response = await createMistake(getAuthToken, {
        name: String(formData.get("mistakeName") ?? ""),
      });
      setMistakes((current) =>
        [...current, response.data].sort((left, right) =>
          left.name.localeCompare(right.name),
        ),
      );
      toast.success("Mistake created.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create mistake.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteMistake(mistakeId: string) {
    setIsSaving(true);

    try {
      await deleteMistake(getAuthToken, mistakeId);
      setMistakes((current) =>
        current.filter((mistake) => mistake.id !== mistakeId),
      );
      toast.success("Mistake deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create mistake.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Journal"
        title="Strategies"
        description="Manage strategies, tags, and mistakes for your trade journal."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Strategies</CardTitle>
            <CardDescription>Organize setups for your trades.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreateStrategy(new FormData(event.currentTarget));
                event.currentTarget.reset();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="strategyName">Name</Label>
                <Input id="strategyName" name="strategyName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strategyDescription">Description</Label>
                <Textarea id="strategyDescription" name="strategyDescription" />
              </div>
              <Button type="submit" disabled={isSaving}>
                Add strategy
              </Button>
            </form>
            <div className="space-y-2">
              {strategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{strategy.name}</p>
                    {strategy.description ? (
                      <p className="text-muted-foreground text-sm">
                        {strategy.description}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={strategy.isActive ? "default" : "outline"}
                    disabled={isSaving}
                    onClick={() => void handleToggleStrategy(strategy)}
                  >
                    {strategy.isActive ? "Active" : "Inactive"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Label trades with quick tags.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreateTag(new FormData(event.currentTarget));
                event.currentTarget.reset();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="tagName">Name</Label>
                <Input id="tagName" name="tagName" required />
              </div>
              <Button type="submit" disabled={isSaving}>
                Add tag
              </Button>
            </form>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="font-medium">{tag.name}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => void handleDeleteTag(tag.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mistakes</CardTitle>
            <CardDescription>Track recurring trade mistakes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void handleCreateMistake(new FormData(event.currentTarget));
                event.currentTarget.reset();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="mistakeName">Name</Label>
                <Input id="mistakeName" name="mistakeName" required />
              </div>
              <Button type="submit" disabled={isSaving}>
                Add mistake
              </Button>
            </form>
            <div className="space-y-2">
              {mistakes.map((mistake) => (
                <div
                  key={mistake.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <p className="font-medium">{mistake.name}</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => void handleDeleteMistake(mistake.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
