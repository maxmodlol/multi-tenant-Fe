// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createHttpHelpers } from "../../config/helpers";
import { apiPrivate } from "../../config/axiosPrivate";

const {
  GetApi: GetPriv,
  PostApi: PostPriv,
  DeleteApi: DeletePriv,
  PutApi: PutPriv,
} = createHttpHelpers(apiPrivate);

/* ─────────────────────────── Types ─────────────────────────── */

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
  const data = await GetPriv<{ members: MemberDTO[] }>("/api/settings/users");
  return data.members;
};

const deleteMember = async (id: string): Promise<void> => {
  await DeletePriv<void>(`/api/settings/users/${id}`);
};

const createMember = async (input: {
  name: string;
  email: string;
  password: string;
  role: string;
  domain?: string;
}): Promise<MemberDTO> => PostPriv<typeof input, MemberDTO>("/api/settings/users", input);

const updateMember = async (input: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  domain?: string;
}): Promise<MemberDTO> =>
  PutPriv<typeof input, MemberDTO>(`/api/settings/users/${input.id}`, input);

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
