
import { useQuery } from "react-query";
import { IGetTvResult, getTvs, getPopulars, getTodaysTvs, getTopRated, getYoutubeList } from "../api";
import styled from "styled-components";
import { makeImagePath } from "./utils";
import { motion,AnimatePresence } from "framer-motion";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import { BsStarFill, BsStarHalf } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import "swiper/components/navigation/navigation.min.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { YouTubeProps } from "react-youtube";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import * as S from "../CSS/LilBoxCss";
import * as o from "../CSS/BigBoxCss";
import * as t from "../CSS/MainCss";


const Popularity = styled.h2`
    font-size: 15px;
    margin-bottom: 40px;
    margin-left: 125px;
`


const StyledSwiper = styled(SwiperSlide)`

`;

const Box = styled(motion.div)<{$bgPhoto:string}>`
    background-color: white;
    background-image: url(${props => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    transform: translate(-50%, -50%);
    height: auto;
    color :white;
    font-size:24px;
    height: 250px;
    
`;

const boxVariants = {
    normal: {
        scale:1,
    },
    hover: {
        scale:1.05,
        y: 0,
        transition: {
            delay:0.1,
            type:"tween",
        },
    },
};



const Info = styled(motion.div)`
    background-color: ${(props) => props.theme.black.mediumdark};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 15px;
    }
`;

const infoVariants = {
    hover: {
        opacity:1.05,
        transition: {
            delay:0.1,
            type:"tween",
        },
    }
}


const renderStars = (rating:number, color = "#f1f169") => {  //별점 출력 함수
    const integerPart = Math.floor(rating / 2); // 평점을 2로 나눈 정수 부분을 계산
    const hasHalfStar = rating % 2 !== 0; // 반 별표가 있는지 확인

    const filledStars = Array(integerPart).fill(2); // 평점에 해당하는 별표 배열 생성
    const emptyStars = Array(Math.max(0, 4 - integerPart)).fill(2); // 남은 빈 별표 배열 생성

    return (
        <>
            {filledStars.map((_, i) => (
                <BsStarFill key={i} size="13" color={color} />
            ))}
            {hasHalfStar && <BsStarHalf key="half" size="13" color={color} />}
            {emptyStars.map((_, i) => (
                <BsStarFill key={i + integerPart} size="13" color="#E3E3E3" />
            ))}
        </>
    );
};

function Tv() {
    const history = useNavigate()
    const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:tvid");
    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        event.target.pauseVideo();
    }
    const { data, isLoading } = useQuery<IGetTvResult>(
        ["tv", "onTheAir"],
        getTvs
    );

    const { data: Populars } = useQuery<IGetTvResult>(
        ["getPopulars"],
        getPopulars
    );

    const { data: TodaysTvs } = useQuery<IGetTvResult>(
        ["getTodaysTvs"],
        getTodaysTvs
    );

    const { data: TopRated } = useQuery<IGetTvResult>(
        ["getTopRated"],
        getTopRated
    );
        
    const onBoxClicked = (tvid:number) => {
        history(`/tv/${tvid}`)
    };
    const onOverLayClicked = () => history(`/tv`)  

    const opts: YouTubeProps['opts'] = {
        height: '540',
        width: '620',
        playerVars: {
        autoplay: 1,
        rel: 0, //관련 동영상 표시하지 않음 (근데 별로 쓸모 없는듯..)
        modestbranding: 1, // 컨트롤 바에 youtube 로고를 표시하지 않음
        },
    };


    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    useEffect(() => {
        const fetchVideo = async () => {
            if (bigTvMatch && bigTvMatch.params.tvid) { 
                try {
                    const youtubeData = await getYoutubeList("tv", bigTvMatch.params.tvid); 
                    setSelectedVideo(youtubeData.results[0]); // 검색된 첫번째 사용
                } catch (error) {
                    console.error("데이터가 없는뎁쇼?: ", error);
                }
            } else {
                setSelectedVideo(null);
            }
        };
    
        fetchVideo();
    }, [bigTvMatch]);


    
    const clickedtv =      //클릭한 div에 해당값 들어있는지 확인
    bigTvMatch?.params.tvid &&
    ( 
        data?.results.find((tv) => tv.id+"" === bigTvMatch.params.tvid) ||
        Populars?.results.find((tv) => tv.id+"" === bigTvMatch.params.tvid) ||
        TodaysTvs?.results.find((tv) => tv.id+"" === bigTvMatch.params.tvid) ||
        TopRated?.results.find((tv) => tv.id+"" === bigTvMatch.params.tvid) 
    );
    console.log(clickedtv);

    SwiperCore.use([Navigation,Pagination, Autoplay]);
    
        return <t.Wrapper>
        {isLoading ? (<t.Loader>Loding....</t.Loader>
        ) : (
            <>
            <t.Banner  
            $bgPhoto = {makeImagePath(data?.results[0].backdrop_path || "")}
            >
                <o.Title>{data?.results[0].name}</o.Title>
                <o.LilTitle>{data?.results[0].original_name}</o.LilTitle>
                <Popularity>좋아요👍:{data?.results[0].popularity}</Popularity>
                <o.Date>첫 방영일: {data?.results[0].first_air_date}</o.Date>
                <o.OverView>{data?.results[0].overview}</o.OverView>
            </t.Banner>
            
                
                <StyledSwiper>
                <o.FrontTitle>On the Air</o.FrontTitle>
                <Swiper 
                    slidesPerView={5}
                    navigation={true}
                    spaceBetween= {10} 
                    >
                    {data?.results.map((tv) => (
                        <SwiperSlide 
                        key={tv.id}> 
                        <Box
                            layoutId={tv.id + ""}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            $bgPhoto={makeImagePath(tv.backdrop_path)}
                        >
                            <img  /> 
                            <Info variants={infoVariants}>
                            <h4 style={{fontSize:"26px",padding:"10px"}}>{tv.name}</h4>
                            </Info>
                        </Box>
                        </SwiperSlide>
                    ))}
                    </Swiper>
                </StyledSwiper>
                
                <StyledSwiper>
                <o.FrontTitle style={{margin:"20px", fontSize:"25px"}}>Top 10</o.FrontTitle>
                <Swiper slidesPerView={5} navigation={true} spaceBetween= {10} >
                    {Populars?.results.map((tv) =>{
                    if (data?.results.some((dataTv)=> dataTv.id === tv.id)) return null;
                    return (
                        <SwiperSlide 
                        key={tv.id}> 
                        <Box
                            layoutId={tv.id + ""}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            $bgPhoto={makeImagePath(tv.backdrop_path)}
                        >
                            <img /> 
                            <Info variants={infoVariants}>
                            <h4 style={{fontSize:"26px",padding:"10px"}}>{tv.name}</h4>
                            </Info>
                        </Box>
                        </SwiperSlide>
                    );
                    })}
                    </Swiper>
                    </StyledSwiper>

                    <StyledSwiper>
                <o.FrontTitle style={{margin:"20px", fontSize:"25px"}}>죽기전에 봐야할 Tv 프로그램</o.FrontTitle>
                <Swiper slidesPerView={5} navigation={true} spaceBetween= {10} >
                    {TopRated?.results.map((tv) =>{
                    if (data?.results.some((dataTv)=> dataTv.id === tv.id)) return null;
                    return (
                        <SwiperSlide 
                        key={tv.id}> 
                        <Box
                            layoutId={tv.id + ""}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVariants}
                            onClick={() => onBoxClicked(tv.id)}
                            transition={{ type: "tween" }}
                            $bgPhoto={makeImagePath(tv.backdrop_path)}
                        >
                            <img /> 
                            <Info variants={infoVariants}>
                            <h4 style={{fontSize:"26px",padding:"10px"}}>{tv.name}</h4>
                            </Info>
                        </Box>
                        </SwiperSlide>
                    );
                    })}
                    </Swiper>
                    </StyledSwiper>
                    
                <AnimatePresence>
                {bigTvMatch ? (
                    <>
                        <S.OverLay 
                        onClick={onOverLayClicked}
                        exit={{opacity:0}}
                        animate={{opacity:2}}
                        />
                        <S.BigType 
                        style={{position: "fixed"}} 
                        layoutId={bigTvMatch.params.movieId}>
                        
                            {clickedtv && 
                            <>
                            <S.BigMain>
                            <S.BigCover 
                            style={{backgroundImage:`linear-gradient(to top, black,transparent ),
                            url( ${makeImagePath (clickedtv.backdrop_path) 
                            })`}}/>
                                <S.BigSearch>
                                    <S.Bigposter 
                                    style={{backgroundImage :`url(${makeImagePath(clickedtv.poster_path)})`}}/>
                                    <S.BigTitle>{clickedtv.name}</S.BigTitle>
                                    <S.Bigrelease_date>  첫 방영일 :{clickedtv.first_air_date}</S.Bigrelease_date>
                                    <S.Bigpopularity> {clickedtv ? renderStars(clickedtv.vote_average) : null} / {(clickedtv.vote_average).toFixed(1)} </S.Bigpopularity>                        
                                    <S.BigOverview>{clickedtv.overview}</S.BigOverview>
                                        <S.Frame>
                                            {selectedVideo && selectedVideo.key ? (
                                                    <ReactPlayer 
                                                        className="react-player" 
                                                        url={`https://www.youtube.com/watch?v=${selectedVideo.key}`}
                                                        width="80%" 
                                                        height="80%" 
                                                        playing={true} 
                                                        loop={true} />
                                                ) : (
                                                    <S.Dhk>😅예고편/미리보기가 없어요😅</S.Dhk>
                                                )}
                                        </S.Frame>
                                </S.BigSearch>
                            </S.BigMain>
                                    </>}
                        
                        
                        
                        </S.BigType>
                        
                    </>  
                    ): null}
                </AnimatePresence> 
                </>
            )} 
            </t.Wrapper>;
    
}

export default Tv;