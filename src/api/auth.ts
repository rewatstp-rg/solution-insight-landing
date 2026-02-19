

// export function login() {
//     const URL = endpoints.post.list;
  
//     const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
//     const memoizedValue = useMemo(
//       () => ({
//         posts: (data?.posts as IPostItem[]) || [],
//         postsLoading: isLoading,
//         postsError: error,
//         postsValidating: isValidating,
//         postsEmpty: !isLoading && !data?.posts.length,
//       }),
//       [data?.posts, error, isLoading, isValidating]
//     );
  
//     return memoizedValue;
//   }