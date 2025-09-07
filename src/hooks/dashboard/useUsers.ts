import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiPrivate } from "../../config/axiosPrivate"; // ← change

/* ───────────────────────── Types ───────────────────────── */

export interface MemberDTO {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  dateAdded: string;
  role: string;
  domain: string;
  tenant?: string; // backend sends either domain or tenant; keep both for compatibility
}

/* ─────────────────────── CRUD fetchers ─────────────────────── */

const fetchMembers = async (options?: { tenant?: string }): Promise<MemberDTO[]> => {
  const api = await getApiPrivate();
  const { data } = await api.get<{ members: MemberDTO[] }>("/settings/users", {
    params: options?.tenant ? { tenant: options.tenant } : undefined,
  });
  return data.members;
};

const deleteMember = async (id: string): Promise<void> => {
  const api = await getApiPrivate();
  await api.delete(`/settings/users/${id}`);
};

const createMember = async (input: {
  name: string;
  email: string;
  password: string;
  role: string;
  domain?: string;
}): Promise<MemberDTO> => {
  const api = await getApiPrivate();
  try {
    const { data } = await api.post<unknown, { data: MemberDTO }>("/settings/users", input);
    return data as unknown as MemberDTO;
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to create member";
    throw new Error(message);
  }
};

const updateMember = async (input: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  domain?: string;
}): Promise<MemberDTO> => {
  const api = await getApiPrivate();
  try {
    const { data } = await api.put<unknown, { data: MemberDTO }>(
      `/settings/users/${input.id}`,
      input,
    );
    return data as unknown as MemberDTO;
  } catch (err: any) {
    const message = err?.response?.data?.error || err?.message || "Failed to update member";
    throw new Error(message);
  }
};

/* ───────────────────── React-Query hooks ───────────────────── */

export function useMembers(options?: { tenant?: string }) {
  return useQuery<MemberDTO[], Error>({
    queryKey: ["members", options?.tenant ?? "current"],
    queryFn: () => fetchMembers(options),
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation<MemberDTO, Error, Parameters<typeof createMember>[0]>({
    mutationFn: createMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation<MemberDTO, Error, Parameters<typeof updateMember>[0]>({
    mutationFn: updateMember,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });
}

export async function checkEmailAvailable(email: string): Promise<boolean> {
  const api = await getApiPrivate();
  const { data } = await api.get<{ available: boolean }>("/settings/users/check", {
    params: { email },
  });
  return data.available;
}
