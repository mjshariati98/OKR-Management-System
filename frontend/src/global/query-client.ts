import axios from "axios";
import { QueryClient } from "react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey }) => {
                const [path, params] = queryKey;
                if (typeof path !== 'string')
                    throw new Error('Bad Usage of DefaultQueryFn');
                const { data } = await axios.get(path, { data: params });
                return data;
            },
        },
    },
})