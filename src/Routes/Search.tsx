import { PathMatch, useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetSearchResult, ISearch, getSearchMulti  } from "../api";
import { useQuery } from "react-query";
import { makeImagePath } from "./utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
    background-color: black;
    padding-bottom: 200px;
`;

const Loader = styled.div`
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
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${props => props.$bgPhoto});
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 30px;
    margin-bottom: 15px;
    margin-left: 30px;
`;

const Date = styled.h2`
    font-size: 18px;
    margin-left: 100px;
`;

const OiginTitle = styled.h2`
    font-size: 25px;
    margin-bottom: 10px;
    padding-left: 45px;
`;

const OverView = styled.p`
    padding-top: 20px;
    font-size: 15px;
    margin-left: 40px;
`;

const Box = styled.div`
    display: flex;
    margin-left:50px;
`;

const BoxTwo = styled(motion.div)`
    display: flex;
    height: 300px;
    width: 350px;
    border-radius: 10px;
    margin: 5px;
    background-color: #555555;
    border-style:solid;
    border-width:0.1px;
    border-color: black;
    flex-wrap: wrap;

`;

const LilBox = styled.div`
    margin-top: 300px;
    display: column;
    width: 480px;
    
`;
const BigBox = styled.div`
    margin-top: -200px;
    display: flex;
    flex-wrap: wrap;
    background-position: center center;
    padding: 30px;
`;

const Text = styled.p`
    height: 250px;
    margin-top:-160px;
    padding-left: 50px;
    font-size: 20px;
`;

const MainBox = styled.div`
    margin-left: 50px;
`

const BigPhoto = styled.div<{ $bgPhoto: string }>`
    color: ${props => props.theme.white.lighter}; 
    background-color: white;
    background-image: url(${props => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    height: 450px;
    width: 315px;
    margin: 10px;
    `;

const LilPhoto = styled.div<{ $bgPhoto: string }>`
    color: ${props => props.theme.white.lighter}; 
    background-color: white;
    background-image: url(${props => props.$bgPhoto});
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
    height: 250px;
    width: 150px;
    margin: 10px;
    `;

    const LilBoxtwo = styled.div`
        display: column ;
        width: 150px;
    
    `;

const LilTitle = styled.h2`
    font-size: 15px;
    margin-top: 10px;
`;

const LilType = styled.h2`
    font-size: 15px;
    margin-top: 8px;
`;

const LilOverView = styled.p`
    font-size: 10px;
    margin-top: 10px;
    word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 3 ;
        -webkit-box-orient: vertical;
`;

const OverLay = styled(motion.div)`
    position: fixed;
    top: 0;
    width:  100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity:0;
    ::-webkit-scrollbar {
    display: none;
    }
`;

const SmallBox = styled(motion.div)`
    position: absolute;
    width: 60vw;
    height: 60vh;
    background-color: darkgray;
    top: 320;
    left: 0;
    right: 0;
    margin: 0 auto;
`;


function Serch() {
    const [clickedInfo, setClickedInfo] = useState(null);
    console.log(clickedInfo);
    const [showMotionDiv, setShowMotionDiv] = useState(false);
    
    const location = useLocation();
    const keyword = new URLSearchParams(location.search).get("keyword");
    const page = 1;

    const { data, isLoading } = useQuery<IGetSearchResult>(
        ["getSearch", keyword, page], 
        () => keyword ? getSearchMulti(keyword, page) : Promise.resolve(),
        { enabled: !!keyword }
    );
    

    const onBoxClicked = (clickedKeywords:any) => {
        setClickedInfo(clickedKeywords);
        setShowMotionDiv(true);
    }

    const boxVariants = {
        normal: { scale: 1 },
        hover: { scale: 1.2, transition: { delay: 0.2 } }
    };

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading....</Loader>
            ) : (
                <>
                    {data && data.total_results === 0 ? (
                        <Banner $bgPhoto="">
                            <p>"{keyword}" 에 관련된 정보가 존재하지 않습니다.</p>
                        </Banner>
                    ) : (
                        <Banner $bgPhoto={makeImagePath(data?.results[0]?.backdrop_path || "")}>
                            <Box>
                                <BigPhoto $bgPhoto={makeImagePath(data?.results[0].poster_path || "")}/>
                                <LilBox>
                                    <Title>{data?.results[0]?.title || data?.results[0]?.name}</Title>
                                    <OiginTitle>{data?.results[0]?.original_title || data?.results[0]?.original_name}</OiginTitle>
                                    <Date>{data?.results[0].release_date || data?.results[0].first_air_date} / {data?.results[0].media_type && (
                                        <span>{data.results[0].media_type.charAt(0).toUpperCase() + data.results[0].media_type.slice(1)}</span>
                                    )}</Date>
                                    <OverView>{data?.results[0]?.overview}</OverView>
                                </LilBox>
                            </Box>
                        </Banner>
                    )}

                    <Text>
                        <span style={{ fontSize: '25px' }}> - " {keyword} "</span> 에 대한 검색 결과 입니다.
                    </Text>

                    <AnimatePresence>
                        <MainBox>
                            <BigBox>
                                {data && data.results.map((keywords, index) => (
                                    <BoxTwo key={index}
                                        whileHover="hover"
                                        initial="nomal"
                                        onClick={() => onBoxClicked(keywords)}
                                        variants={boxVariants}
                                    >
                                        <LilPhoto $bgPhoto={makeImagePath(keywords.poster_path || "")} />
                                        <LilBoxtwo>
                                            <LilTitle>{keywords.title || keywords.name}</LilTitle>
                                            <LilType>{keywords.media_type && (
                                                <span>{keywords.media_type.charAt(0).toUpperCase() + keywords.media_type.slice(1)}</span>
                                            )}</LilType>
                                            <LilOverView>{keywords.overview.length > 150 ? keywords.overview.substring(0, 150) + '...' : keywords.overview}</LilOverView>
                                        </LilBoxtwo>
                                    </BoxTwo>
                                ))}
                            </BigBox>
                        </MainBox>
                    </AnimatePresence>

                    <AnimatePresence>
                        
                            <>
                                    <SmallBox
                                        
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        
                                    </SmallBox>
                                
                            </>
                        
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Serch;