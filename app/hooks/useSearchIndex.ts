import { db } from "@/lib/firebase";
import { SearchIndex } from "@/types/Products";
import { collection, getDocs } from "firebase/firestore";
import { useDripratsQuery } from "./useTanstackQuery";

const fetchSearchIndex = async () => {
  const searchIndexRef = collection(db, "SearchIndex");
  const querySnapshot = await getDocs(searchIndexRef);
  return querySnapshot.docs.map((doc) => doc.data()) as SearchIndex[];
};

export const useSearchIndex = () => {
  const { data, isLoading } = useDripratsQuery<SearchIndex[]>({
    queryKey: ["SearchIndex"],
    queryFn: fetchSearchIndex,
  });
  return { data, isLoading } as { data: SearchIndex[]; isLoading: boolean };
};
