import { useApiCall } from "@/Utils/api";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function News() {
  const [opened, setOpened] = useState(false);
  const [modalData] = useState("");
  const newsQuery = useApiCall(
    "news",
    "get",
    "https://newsdata.io/api/1/latest?apikey=pub_9eca01aef3494be0aff12bcf9127dbce&country=in&language=en&category=business"
    // "https://vtu.bitstreak.in/papers/subject/PHYSICS_CYCLE/2018/1"
    // "https://trade.bitstreak.in/news"
  );

  // pub_9eca01aef3494be0aff12bcf9127dbce

  if (newsQuery.isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 flex flex-col items-center">
         <div className="w-full max-w-4xl space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                   <Skeleton className="h-8 w-3/4 mb-2" />
                </CardHeader>
                <CardContent>
                   <Skeleton className="h-4 w-full mb-2" />
                   <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                   <Skeleton className="h-10 w-28 rounded-lg" />
                </CardFooter>
              </Card>
            ))}
         </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Article!</DialogTitle>
             <DialogDescription>
               Full content of the article.
             </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-muted-foreground">
              {modalData}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl space-y-6">
          {newsQuery.data &&
            newsQuery.data.articles.map((article: any, index: number) => (
              <Card key={index} className="w-full shadow-md transition-shadow hover:shadow-lg dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold leading-tight text-foreground">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base font-normal text-muted-foreground">
                    {article.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex gap-2">
                   <Button asChild className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read more
                        <svg
                          className="ml-2 -mr-1 w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            fillRule="evenodd" // Fixed fill-rule to fillRule
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd" // Fixed clip-rule to clipRule
                          ></path>
                        </svg>
                      </a>
                   </Button>
                   {/* preserved commented out functionality, updated to use shadcn Button/Dialog logic if needed */}
                   {/* 
                   <Button variant="outline" onClick={() => {setModalData(article.content || "");setOpened(true)}}>
                     Full article
                   </Button> 
                   */}
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}
