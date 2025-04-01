import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATBASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATBASE_ID!;
const COLLCETION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLCETION_ID!;

const client = new Client()
 .setEndpoint('https://cloud.appwrite.io/v1')
 .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

 const database = new Databases(client)
 

 export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATBASE_ID, COLLCETION_ID, [
        Query.equal('searchTerm', query)
    ])

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0]
      await database.updateDocument(
        DATBASE_ID,
        COLLCETION_ID,
        existingMovie.$id,
        {
            count: existingMovie.count + 1,
        }
      );
    } else {
        await database.createDocument(DATBASE_ID, COLLCETION_ID, ID.unique(), {
            searchTerm: query,
            movie_id: movie.id,
            title: movie.title,
            count: 1,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }) 
    }
 } catch (error) {
   console.error('更新搜索计数错误', error)
   throw error;
 }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATBASE_ID, COLLCETION_ID, [
          Query.limit(5),
          Query.orderDesc("count"),
        ]);
    
        return result.documents as unknown as TrendingMovie[];
      } catch (error) {
        console.error(error);
        return undefined;
      }
}


