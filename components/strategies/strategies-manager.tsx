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
  deleteStrategy,
  deleteTag,
} from "@/lib/api/strategies";
import { useClientAuthToken } from "@/lib/auth/client";
import type { Mistake, Strategy, Tag } from "@/types/strategy";

function sortByName<T extends { name: string }>(items: T[]) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

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
      setStrategies((current) => sortByName([...current, response.data]));
      toast.success("Strategy created.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create strategy.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteStrategy(strategyId: string) {
    setIsSaving(true);

    try {
      await deleteStrategy(getAuthToken, strategyId);
      setStrategies((current) =>
        current.filter((strategy) => strategy.id !== strategyId),
      );
      toast.success("Strategy deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete strategy.",
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
      setTags((current) => sortByName([...current, response.data]));
      toast.success("Entry criteria created.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create entry criteria.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTag(tagId: string) {
    setIsSaving(true);

    try {
      await deleteTag(getAuthToken, tagId);
      setTags((current) => current.filter((tag) => tag.id !== tagId));
      toast.success("Entry criteria deleted.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete entry criteria.",
      );
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
      setMistakes((current) => sortByName([...current, response.data]));
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
        err instanceof Error ? err.message : "Failed to delete mistake.",
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
        description="Manage strategies, entry criteria, and mistakes for your trade journal."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Strategies</CardTitle>
            <CardDescription>Name the strategies you trade.</CardDescription>
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
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
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
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => void handleDeleteStrategy(strategy.id)}
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
            <CardTitle>Entry criteria</CardTitle>
            <CardDescription>
              Define what must be true before you enter a trade.
            </CardDescription>
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
                Add entry criteria
              </Button>
            </form>
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
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
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
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
