import { useRef, useState } from 'react';
import arrowBack from '../../assets/images/arrow-left.svg';
import searchIcon from '../../assets/images/magnifying-glass-solid.svg'
import '../../styles/home/home.scss';
import '../../styles/index.scss';


const options = {
    headers: {
        Authorization: '563492ad6f917000010000014ad64f712cf24a2a9e3133eaa89597d0'
    }
}
window.onpopstate = (e) => {
    hideDownloadScreen()
}
export default function Home() {
    const allData = []
    const [data, updateData] = useState(allData);
    const [currentImageData, updateCurrentImageData] = useState({})
    const [nextPageLink, updateNextPageLink] = useState(false)
    const [loadingState, updateLoadingState] = useState(false)
    const [loadingNextPageState, updateLoadingNextPageState] = useState(false)

    const handelKeyPress = (e) => {
        if (e.charCode === 13) search(e, updateData, updateNextPageLink);
    }
    const downloadScreen = useRef()
    const searchInputDOM = useRef()
    const detectEmptyInput = (e) => {
        if (e.target.value.length === 0) {
            updateData([])
            updateNextPageLink(false)
        }
    }
    return (
        <div id="main">
            <div className='headerContainer'>
                <h1 className='heading'>Search Images</h1>
                <span className='powered-by-heading'>Powered by Pexels</span>
                <div id="searchBar" onKeyPress={ handelKeyPress } onChange={ detectEmptyInput }>
                    <input type="search" id="searchInput" placeholder='Search any Image or Photograph' ref={ searchInputDOM } autoFocus />
                </div>
            </div>
            <div id="downloadScreen" ref={ downloadScreen }>
                <div className="container">

                    <div className="header">
                        <div className="left" onClick={ hideDownloadScreen }><img src={ arrowBack } alt="arrow_back" /></div>
                        <div className="center"><p>Download Image</p></div>
                        <div className="right"></div>
                    </div>
                    <div className="content">
                        <div className="imagePreview">
                            <img src={ currentImageData.src } alt={ currentImageData.title } />
                        </div>
                        <h3 className='imageTitle'>{ currentImageData.title }</h3>
                        <a className="by" href={ currentImageData.photographer_url } target="_blank">By { currentImageData.photographer }</a>
                        <h4 className='downloadOptions text-center'>Download Options</h4>
                        <div className="downloadButtons">
                            {/* <p>{ currentImageData.medium }</p> */ }
                            <a href={ currentImageData.original } target="_blank">original</a>
                            <a href={ currentImageData.large2x } target="_blank">large2x</a>
                            <a href={ currentImageData.large } target="_blank">large</a>
                            <a href={ currentImageData.medium } target="_blank">medium</a>
                            <a href={ currentImageData.small } target="_blank">small</a>
                            <a href={ currentImageData.portrait } target="_blank">portrait</a>
                            <a href={ currentImageData.landscape } target="_blank">landscape</a>
                            <a href={ currentImageData.tiny } target="_blank">tiny</a>
                        </div>
                        <End />
                    </div>
                </div>
            </div>
            <div id="searchResults">
                <div className="images">
                    { makeData(data, updateCurrentImageData) }
                </div>
                { makeLoadPageLink(data, nextPageLink, updateData, updateNextPageLink) }
            </div>
            <FloatingButton />
            <End />
        </div>
    )
    function makeLoadPageLink(oldData, nextPageLink, updateData, updateNextPageLink) {
        if (loadingNextPageState)
            return (
                <div id="loadMore">
                    <p className='text-center loading'>Loading more...</p>
                </div>
            )
        else
            if (!nextPageLink)
                return
            else if (!loadingState)
                return (
                    <div id='loadMore'>
                        <button onClick={ () => {
                            loadNextPage(oldData, nextPageLink, updateData, updateNextPageLink)
                            updateLoadingNextPageState(true)
                        } }>Load more</button>
                    </div>
                )
    }
    function loadNextPage(oldData, nextPageLink, updateData, updateNextPageLink) {
        fetch(nextPageLink, options).then(data => data.json())
            .then(images => {
                let photos = images.photos
                const combine = [...oldData, ...photos]
                if (images.next_page)
                    updateNextPageLink(images.next_page)
                else
                    updateNextPageLink(false)
                updateData(combine)
                // updateLoadingState(false)
                updateLoadingNextPageState(false)
                // localStorage.lastSearchedData = JSON.stringify(photos)
            })
    }




    function makeData(photos) {
        // let key = 0
        if (loadingState)
            return <div className="noResult">
                <p>Loading...</p>
            </div>
        if (photos.length == 0)
            return <div className="noResult">
                <img src="images/illustrations/undraw_house_searching_re_stk8.svg" className='noSearch-img' />
                <p>Search any Image or Photograph</p>
            </div>
        else
            return (<>{ photos.map(photo => {
                return (
                    <SingleImage src={ photo.src.medium || "" }
                        key={ photo.id } bgColor={ photo.avg_color }
                        alt={ photo.alt } title={ photo.alt }
                        updater={ updateCurrentImageData }
                        photographer={ photo.photographer }
                        photographer_url={ photo.photographer_url }
                        // Image Links
                        medium={ photo.src.medium }
                        original={ photo.src.original }
                        large2x={ photo.src.large2x }
                        large={ photo.src.large }
                        small={ photo.src.small }
                        portrait={ photo.src.portrait }
                        landscape={ photo.src.landscape }
                        tiny={ photo.src.tiny }
                    />
                )
            }) }
            </>)
    }
    function search(e, updateData, updateNextPageLink) {
        let searchText = e.target.value.trim()
        if (searchText.length == 0)
            return
        updateLoadingState(true)
        e.target.blur()
        const url = `https://api.pexels.com/v1/search?query=${searchText}&per_page=18`
        // if (localStorage.lastSearchedData) {
        //     updateData(JSON.parse(localStorage.lastSearchedData))
        // }
        // else
        fetch(url, options).then(data => data.json())
            .then(images => {
                let photos = images.photos
                if (images.next_page)
                    updateNextPageLink(images.next_page)
                else
                    updateNextPageLink(false)
                updateData(photos)
                updateLoadingState(false)
            })
    }

    function FloatingButton() {
        return (
            <div id="floatingButton" onClick={ () => { searchInputDOM.current.focus() } }>
                <img src={ searchIcon } alt="Search" />
            </div>
        )
    }
    function End() {
        return (
            <div className="endDiv">
                <p className='text-center'>Made with 💖 by <a href="https://github.com/codeAbinash/image-searcher-react">Abinash</a></p>
            </div>
        )
    }
}

function SingleImage(props) {
    return (
        <div className="image" style={ { backgroundColor: `${props.bgColor}` } }
            onClick={ () => {
                singleImageClicked(
                    {
                        src: props.src,
                        title: props.title,
                        // Images
                        original: props.original,
                        large2x: props.large2x,
                        large: props.large,
                        medium: props.medium,
                        small: props.small,
                        portrait: props.portrait,
                        landscape: props.landscape,
                        tiny: props.tiny,
                        // Photographer Details
                        photographer: props.photographer,
                        photographer_url: props.photographer_url,
                    },
                    props.updater)
            } }>
            <img src={ props.src } alt={ props.alt } />
        </div>
    )
}
function singleImageClicked(props, updater) {
    updater(props)
    showDownloadScreen()
    showDownloadScreen()
}


function showDownloadScreen() {
    downloadScreen.style.left = 0
    document.body.style.overflow = 'hidden'
    window.location.hash = 'download'
}
function hideDownloadScreen() {
    downloadScreen.style.left = '100%'
    document.body.style.overflow = 'auto'
}
