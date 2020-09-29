import React, { useState, useEffect, useReducer, forwardRef, createRef } from "react";
import { Grid } from "semantic-ui-react";

import { Image } from "./image";
import { Search, SearchType } from "./search";
import { ConfigMenu } from "./menu";
import { Chart } from "./chart";
import { getAlbum, getGame, getMovie, getSeries } from "./fetcher";
import { onResults } from "./results";
import { ConfigContext, configReducer, ConfigInitialState } from "./config";

export const Home: React.FC = () => {
  const [resultsImgs, setResultsImgs] = useState<Image[]>([]);
  // TODO: move to the component / confg?
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState(SearchType.Music);
  const [state, dispatch] = useReducer(configReducer, ConfigInitialState);

  const tableRef = createRef<HTMLTableElement>();
  // @ts-ignore
  const MyMenu = forwardRef((_, ref) => <ConfigMenu tableRef={ref} />);
  // @ts-ignore
  const MyChart = forwardRef((_, ref) => <Chart tableRef={ref} />);

  useEffect(() => {
    const download = async () => {
      if (search === "") {
        return;
      }

      switch (searchType) {
        case SearchType.Games:
          let albums = await getGame(search);
          setResultsImgs(albums);
          break;

        case SearchType.Movies:
          let movies = await getMovie(search);
          setResultsImgs(movies);
          break;

        case SearchType.Series:
          let series = await getSeries(search);
          setResultsImgs(series);
          break;

        default:
          let games = await getAlbum(search);
          setResultsImgs(games);
          break;
      }
    };

    download();
  }, [search, setResultsImgs, searchType]);

  return (
    <div className="home">
      <Grid>
        <Grid.Column className="search" width={2}>
          <Grid.Row>
            <Search setSearchType={setSearchType} setSearch={setSearch} />
          </Grid.Row>
          <Grid.Row padded>{onResults(search, resultsImgs)}</Grid.Row>
        </Grid.Column>
        <ConfigContext.Provider value={{ state, dispatch }}>
          <Grid.Column width={12}>
            <MyChart ref={tableRef} />
          </Grid.Column>
          <Grid.Column width={1}>
            <MyMenu ref={tableRef} />
          </Grid.Column>
        </ConfigContext.Provider>
      </Grid>
    </div>
  );
};
