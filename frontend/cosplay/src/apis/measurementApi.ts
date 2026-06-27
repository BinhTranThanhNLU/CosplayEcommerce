import axiosClient from "./axiosClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MeasurementDTO {
  id: number;
  profileName: string;
  height: number | null;
  weight: number | null;
  bust: number | null;
  waist: number | null;
  hips: number | null;
  shoulder: number | null;
  updatedAt: string;
}

export interface SaveMeasurementPayload {
  profileName: string;
  height?: number | null;
  weight?: number | null;
  bust?: number | null;
  waist?: number | null;
  hips?: number | null;
  shoulder?: number | null;
}

// ─── API calls ────────────────────────────────────────────────────────────────

// GET /api/measurements/my
export const getMyMeasurements = async (): Promise<MeasurementDTO[]> => {
  const res = await axiosClient.get<MeasurementDTO[]>("/measurements/my");
  return res.data;
};

// POST /api/measurements/my
export const createMeasurement = async (
  payload: SaveMeasurementPayload
): Promise<MeasurementDTO> => {
  const res = await axiosClient.post<MeasurementDTO>("/measurements/my", payload);
  return res.data;
};

// PUT /api/measurements/my/{id}
export const updateMeasurement = async (
  id: number,
  payload: SaveMeasurementPayload
): Promise<MeasurementDTO> => {
  const res = await axiosClient.put<MeasurementDTO>(`/measurements/my/${id}`, payload);
  return res.data;
};

// DELETE /api/measurements/my/{id}
export const deleteMeasurement = async (id: number): Promise<void> => {
  await axiosClient.delete(`/measurements/my/${id}`);
};
