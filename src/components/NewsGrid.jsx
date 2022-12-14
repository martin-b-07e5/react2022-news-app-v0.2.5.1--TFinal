import styles from "./NewsGrid.module.css";
import { useEffect, useState } from "react";
// import axios from "axios";
import { Empty } from "./Empty";
import { Spinner } from "./Spinner";
import NewCard from "./NewCard";
import InfiniteScroll from "react-infinite-scroll-component";
import GetDataAPI from "../services/GetDataAPI";

// rf snippet
/* componente para hacer la grilla.
https://developers.themoviedb.org/3/getting-started/authentication
💡💡💡💡💡destructuramos al ponerle el parametro {search},
 que es el argumento que viene desde LandingPage */
export function NewsGrid({ search }) {
  // us snippet
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore] = useState(true); // p/infinite scroll

  /* const URL = `https://newsapi.org/v2/everything?`;
  const PAGESIZE = 10;
  const LANGUAGE = "es";
  const API_KEY = "af04d9e1481a41818db19c18914598ad"; //acidb1 */

  useEffect(() => {
    if (search && search.length > 0) {
      setIsLoading(true); // para el spinner
    }
    if (search && search.length >= 3) {
      const getArticles = async () => {
        const response = await GetDataAPI(search, page); // ahora utilizo este response » muevo cod comentado 👆👇 a GetDataAPI
        /* const response = await axios.get(
          URL,
          {
            params: {
              q: search,
              page: page, // page: 1,
              pageSize: PAGESIZE,
              language: LANGUAGE,
              apiKey: API_KEY,
            },
          }
        ); */

        setTotalResults(response.data.totalResults);
        setArticles((prevPage) => prevPage.concat(response.data.articles)); // ahora funciona InfiniteScroll
        setIsLoading(false); // cdo se terminó de cargar articles(para el spinner)
      };
      getArticles();
    }
  }, [search, page]);

  if (!isLoading && articles.length === 0) {
    return <Empty />;
  }

  console.log("articles.length: " + articles.length);
  console.log("articles: " + articles);
  console.log("page: " + page);
  console.log("hasMore: " + hasMore);

  return (
    <InfiniteScroll
      dataLength={articles.length}
      hasMore={hasMore}
      // 👇siempre que actualizamos el estado, a partir de un estado anterior »
      // » usar una función. (no usar "page" en este caso)
      // Porque la actualización se hace de forma asíncrona » puede dar errores.
      next={() => setPage((prevPage) => prevPage + 1)} // le pasamos una función
      loader={<Spinner />}
    >
      <div id="gral">
        <div id="totalNews">
          <p className={styles.totalNews}>
            Está viendo {articles.length} noticias de {totalResults} resultados.
          </p>
        </div>
        <div data-testid="newsGrid" id="newsGrid" className={styles.newsGrid}>
          {articles.map((article, index) => {
            return (
              <NewCard
                key={index}
                article={article}
                articleLength={articles.length}
                totalResults={totalResults}
                title={article.title}
                description={article.description}
                publishedAt={article.publishedAt}
                source={article.source.name}
                url={article.url}
                urlToImage={article.urlToImage}
              />
            );
          })}
        </div>
      </div>
    </InfiniteScroll>
  );
}
