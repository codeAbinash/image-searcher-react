import { useRef, useState } from 'react';
import arrowBack from '../../assets/images/arrow-left.svg';
import '../../styles/home/home.scss';
import '../../styles/index.scss';


const options = {
    headers: {
        Authorization: '563492ad6f917000010000014ad64f712cf24a2a9e3133eaa89597d0'
    }
}
window.onpopstate = (e) => {
    // e.preventDefault()
    hideDownloadScreen()
    console.log("On Back")
}
export default function Home() {
    const allData = []
    const [data, updateData] = useState(allData);
    const [currentImageData, updateCurrentImageData] = useState({})
    const handelKeyPress = (e) => {
        if (e.charCode === 13) search(e, updateData, data);
    }
    const downloadScreen = useRef()
    const searchInputDOM = useRef()
    const detectEmptyInput = (e) => {
        if (e.target.value.length === 0)
            updateData([])
    }
    return (
        <div id="main">
            <div id="searchBar" onKeyPress={ handelKeyPress } onChange={ detectEmptyInput }>
                <input type="search" id="searchInput" placeholder='Search any image' ref={ searchInputDOM } autoFocus />
            </div>
            <div id="downloadScreen" ref={ downloadScreen }>
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

                </div>
            </div>
            <div id="searchResults">
                { makeData(data, updateCurrentImageData) }
            </div>
        </div>
    )
}

function makeData(photos, updateCurrentImageData) {
    // let key = 0
    if (photos.length == 0)
        return <div className="noResult">
            <p>Search Any Image</p>
        </div>
    else
        return (<>{ photos.map(photo => {
            // console.log(photo);
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
        }) }</>)
}

function SingleImage(props) {
    return (
        <div className="image" style={ { backgroundColor: `${props.bgColor}` } }
            onClick={ () => {
                console.log(props)
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
    // console.log(props)
    showDownloadScreen()
    showDownloadScreen()
}
export function search(e, updateData, data) {
    let searchText = e.target.value.trim()
    if (searchText.length == 0)
        return
    e.target.blur()
    const url = `https://api.pexels.com/v1/search?query=${searchText}&per_page=18`
    // if (localStorage.lastSearchedData) {
    //     updateData(JSON.parse(localStorage.lastSearchedData))
    // }
    // else
    fetch(url, options).then(data => data.json())
        .then(images => {
            console.log(images)
            let photos = images.photos
            console.log(photos)
            updateData(photos)
            localStorage.lastSearchedData = JSON.stringify(photos)
        })
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