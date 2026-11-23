import type {
  ModelListItem,
  getModelBySlug,
  getFilterOptions,
} from "@/lib/services/models";

export type { ModelListItem };

export type ModelDetailData = NonNullable<
  Awaited<ReturnType<typeof getModelBySlug>>
>;

export type FilterOptions = Awaited<ReturnType<typeof getFilterOptions>>;

export type ListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListResponse = { data: ModelListItem[]; meta: ListMeta };