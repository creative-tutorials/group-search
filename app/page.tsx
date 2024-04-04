"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, UserRound, UsersRound, Lock, Group } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type GroupData = {
  name: string;
  location: string;
  type: string;
  member_count: number;
  privacy: string;
};

export default function Home() {
  const [searchInput, setSearchInput] = useState<string>("");
  const queryClient = useQueryClient();

  const getAllGroups = async (value: string) => {
    try {
      const response = await axios.get(`/api/get-town?townName=${value}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => await getAllGroups(searchInput),
  });

  const handleSubmit = async (value: string) => {
    try {
      const response = await axios.get(`/api/get-town?townName=${value}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: async () => handleSubmit(searchInput),

    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: () => {
      toast.error("Something went wrong", {
        description: "404 - No data found",
        action: {
          label: "Dismiss",
          onClick: () => toast.dismiss(),
        },
      });
    },
  });

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <main className="md:p-12 lg:p-12 p-4 flex flex-col gap-10">
      <section className="flex items-center justify-center text-center flex-col gap-3">
        <hgroup>
          <h1 className="text-2xl font-semibold">
            Search Groups based on Town Name:
          </h1>
        </hgroup>
        <div
          id="input-wrapper"
          className="w-full max-w-md flex items-center gap-3"
        >
          <Input
            type="text"
            placeholder="ex: Franklin, Massachusetts"
            className="w-full border border-zinc-800 bg-[#050505] placeholder:text-zinc-500 p-6"
            value={searchInput}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                mutation.mutate();
              }
            }}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            className="bg-[#cd9bfa] text-[#2f0654] hover:bg-[#b789e0]"
            onClick={() => {
              mutation.mutate();
            }}
          >
            Submit
          </Button>
        </div>
      </section>
      {isLoading && <p>Loading...</p>}
      {!isLoading && !error && (
        <section className="w-full flex flex-col gap-5">
          <hgroup>
            <h2 className="text-2xl font-semibold">Groups</h2>
          </hgroup>
          <div className="flex items-center justify-center flex-wrap gap-4 w-full">
            {data.map((item: GroupData) => (
              <div
                key={item.name}
                className="p-4 bg-zinc-900 shadow-sm border border-zinc-800 rounded-md w-full max-w-md flex flex-col gap-3"
              >
                <hgroup>
                  <p className="flex items-center gap-3">
                    <UserRound className="w-5 h-5" /> {item.name}
                  </p>
                </hgroup>
                <hgroup className="flex flex-wrap items-center gap-3 justify-between">
                  <p className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" /> {item.location}
                  </p>
                  <p className="flex items-center gap-3">
                    <Group className="w-5 h-5" /> {item.type}
                  </p>
                </hgroup>
                <hgroup className="flex items-center gap-3 justify-between">
                  <p className="flex items-center gap-3">
                    <UsersRound className="w-5 h-5" /> {item.member_count}
                  </p>
                  <p className="flex items-center gap-3">
                    <Lock className="w-5 h-5" /> {item.privacy}
                  </p>
                </hgroup>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
