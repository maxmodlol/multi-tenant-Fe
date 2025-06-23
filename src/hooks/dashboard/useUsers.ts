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
  tenant?: string;
}

/* ─────────────────────── CRUD fetchers ─────────────────────── */

const fetchMembers = async (): Promise<MemberDTO[]> => {
  const api = await getApiPrivate();
  const { data } = await api.get<{ members: MemberDTO[] }>("/settings/users");
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
  const member = await api.post<typeof input, MemberDTO>("/settings/users", input);
  return member;
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
  const member = await api.put<typeof input, MemberDTO>(`/settings/users/${input.id}`, input);
  return member;
};

/* ───────────────────── React-Query hooks ───────────────────── */

export function useMembers() {
  return useQuery<MemberDTO[], Error>({
    queryKey: ["members"],
    queryFn: fetchMembers,
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
