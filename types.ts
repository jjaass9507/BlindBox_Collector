
export interface Series {
  id: string;
  name: string;
  coverImage: string;
  totalRegular?: number; // Total number of regular items in the series
  totalSecret?: number;  // Total number of secret items in the series
}

export type ItemStatusType = 'displayed' | 'stored' | 'not_owned';

export const ITEM_STATUS_LABELS: Record<ItemStatusType, string> = {
  displayed: '展示中',
  stored: '收納中',
  not_owned: '未擁有',
};

export interface CollectionItem {
  id: string;
  name: string;
  seriesId: string; // References Series.id
  description: string;
  imageUrl: string; // Base64 or URL
  dateAcquired: string;
  price?: number;
  notes?: string;
  status?: ItemStatusType;
  tags?: string[];
}

export type SortOption = 'date_desc' | 'date_asc' | 'price_desc' | 'price_asc';

export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  SECRET = 'Secret',
  SUPER_SECRET = 'Super Secret',
}

export interface IdentifyResponse {
  name: string;
  series: string;
  rarity: Rarity;
  description: string;
  confidence: number;
}
