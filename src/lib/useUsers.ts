// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetApi, PostApi, DeleteApi, PutApi } from "@explore/config/axios";
import type { AxiosRequestConfig } from "axios";

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

async function fetchMembers(): Promise<MemberDTO[]> {
  const data = await GetApi<{ members: MemberDTO[] }>("/api/settings/users");
  return data.members;
}

async function deleteMember(id: string): Promise<void> {
  await DeleteApi<void>(`/api/settings/users/${id}`);
}

async function createMember(input: {
  name: string;
  email: string;
  password: string;
  role: string;
  domain?: string;
}): Promise<MemberDTO> {
  return PostApi<typeof input, MemberDTO>("/api/settings/users", input, undefined, {
    withCredentials: true,
  } as AxiosRequestConfig);
}

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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation<MemberDTO, Error, Parameters<typeof createMember>[0]>({
    mutationFn: createMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
async function updateMember(input: {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  domain?: string;
}): Promise<MemberDTO> {
  return PutApi<typeof input, MemberDTO>(`/api/settings/users/${input.id}`, input, undefined, {
    withCredentials: true,
  } as AxiosRequestConfig);
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation<MemberDTO, Error, Parameters<typeof updateMember>[0]>({
    mutationFn: updateMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
