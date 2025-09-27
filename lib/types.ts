export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  category?: string;
  notes?: string;
  created_at?: string;
}

export interface ExportJob {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  file_url?: string;
  created_at: string;
  completed_at?: string;
}
