'use client';    //
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from "@/lib/showToast";

const useMediaMutation = (queryKey, endpoint) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, deleteType }) => {
      const isPermanent = deleteType === 'PD';

      const { data: response } = await axios({
        method: isPermanent ? 'DELETE' : 'PUT',
        url: endpoint,
        data: { ids, deleteType }
      });

      if (!response.success) throw new Error(response.message);

      return response;
    },

    onSuccess: (response) => {
      showToast('success', response.message || "Action successful");

      // Refresh media list
      queryClient.invalidateQueries({ queryKey });
    },

    onError: (error) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      showToast('error', msg);
    }
  });
};

export default useMediaMutation;