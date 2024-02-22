
import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { motion,AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "./useWidowDimensions";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";



const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
`;

const Loder = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.$bgPhoto });
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
`;

const OverView = styled.p`
    font-size: 28px;
    width: 50%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 100%;
    `;

const Box = styled(motion.div)<{$bgPhoto:string}>`
    background-color: white;
    background-image: url(${props => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    color :pink;
    font-size:64px;
    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 15px;
    }
`;

const boxVariants = {
    normal: {
        scale:1,
    },
    hover: {
        scale:1.3,
        y: -50,
        transition: {
            delay:0.1,
            type:"tween",
        },
    },
};

const infoVariants = {
    hover: {
        opacity:1,
        transition: {
            delay:0.1,
            type:"tween",
        },
    }
}

const BigMovie = styled(motion.div)`
    position: absolute;
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
    border-radius: 15px;
    overflow: hidden;
`;

const OverLay = styled(motion.div)`
    position: fixed;
    top: 0;
    width:  100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity:0;
`;

const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position: center center;
    height: 600px;
`;


const BigTitle = styled.h3`
    color: ${props => props.theme.white.lighter};
    font-size: 41px;
    position:  relative;
    top:-85px;
    padding: 20px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position:  relative;
    top:-85px;
    color: ${props => props.theme.white.lighter};
    
`;

const Bigrelease_date = styled.p`
    padding: 20px;  
    position:  relative;
    top:-85px;
    color: ${props => props.theme.white.lighter};
`;

const Bigpopularity = styled.p`
    padding-left: 20px;
    padding-bottom: 20px;  
    position:  relative;
    top:-85px;
    color: ${props => props.theme.white.lighter};
`

const offset = 6;

function Home() {
    const history = useNavigate()
    const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
    const { scrollY } = useScroll ();
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["movies", "nowPlaying"],
        getMovies
    );
    const [index, setIndex] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const incraseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1;
            const maxIndex = Math.floor(totalMovies / offset) - 1;
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const onBoxClicked = (movieId:number) => {
        history(`/movies/${movieId}`)
    };
    const onOverLayClicked = () => history(`/`)  
    
    const clickedMovie = 
    bigMovieMatch?.params.movieId && 
    data?.results.find((movie) => movie.id+"" === bigMovieMatch.params.movieId);
    console.log(clickedMovie)
    
    const width = useWindowDimensions();
    
    
    return <Wrapper>
            {isLoading ? (<Loder>Loding....</Loder>
            ) : (
                <>
                <Banner onClick={incraseIndex} 
                $bgPhoto = {makeImagePath(data?.results[0].backdrop_path || "")}
                >
                    <Title>{data?.results[0].title}</Title>
                    <OverView>{data?.results[0].overview}</OverView>
                </Banner>
                <Slider>
                    <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                        <Row 
                        initial={{ x: width + 10 }}
                        animate={{ x: 0 }}
                        exit={{ x: -width - 10 }}
                        transition={{type:"tween", duration: 2}}
                        key={index}
                        >
                            {data?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((movie) => (
                        <Box
                        layoutId={movie.id + ""}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(movie.id)}
                        transition={{type:"tween",}}
                        $bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                        >
                        <img></img>
                        <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                        </Info>

                        </Box>
                    ))}
                        </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                {bigMovieMatch ? (
                    <>
                        <OverLay 
                        onClick={onOverLayClicked}
                        exit={{opacity:0}}
                        animate={{opacity:2}}
                        />
                        <BigMovie
                        style={{ top : scrollY.get()+100}} 
                        layoutId={bigMovieMatch.params.movieId}>
                        
                        {clickedMovie && 
                        <>
                        <BigCover 
                        style={{backgroundImage:`linear-gradient(to top, black,transparent),
                        url( ${makeImagePath (clickedMovie.backdrop_path,"w500") 
                        })`}}/>
                        <BigTitle>{clickedMovie.title}</BigTitle>
                        <Bigrelease_date> date: {clickedMovie.release_date}</Bigrelease_date>
                        <Bigpopularity> ⭐: {clickedMovie.popularity}</Bigpopularity>
                        <BigOverview>{clickedMovie.overview}</BigOverview>
                        </>}

                        </BigMovie>
                    </>  
                    ): null}
                </AnimatePresence>
                </>
            )}
            </Wrapper>;
    
}

export default Home;