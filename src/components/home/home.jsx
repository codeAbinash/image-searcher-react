import { useImperativeHandle, useState } from 'react';
import '../../styles/home/home.scss';
import '../../styles/index.scss';
// import { SearchBar } from './SearchBar'
// import SearchResults from './searchResult/SearchResult'

// export function SearchResults() {
//     return (
//         <h2>Search Results</h2>
//     )
// }

// export function SearchBar() {
//     const handelKeyPress = (e) => { if (e.charCode === 13) search(e.target.value); }
//     return (

//     )
// }

const options = {
    headers: {
        Authorization: '563492ad6f917000010000014ad64f712cf24a2a9e3133eaa89597d0'
    }
}

export default function Home() {
    const allData = []
    const [data, updateData] = useState(allData);

    const handelKeyPress = (e) => {
        if (e.charCode === 13) search(e.target.value, updateData, data);
    }

    const detectEmptyInput = (e) => {
        if (e.target.value.length === 0)
            updateData([])
    }

    return (
        <div id="main">
            <div id="searchBar" onKeyPress={ handelKeyPress } onChange={ detectEmptyInput }>
                <input type="search" id="searchInput" placeholder='Search any image' />
            </div>
            <div id="searchResults">
                { makeData(data) }
            </div>
        </div>
    )
}


function SingleImage(props) {
    return (
        <div className="image" style={ { backgroundColor: `${props.bgColor}` } }>
            <img src={ props.src } alt={ props.alt } />
        </div>
    )
}
function makeData(photos) {
    let key = 0
    if (photos.length == 0)
        return <p>Search Any Image</p>
    else
        return (<>{ photos.map(photo => {
            console.log(photo);
            return <SingleImage src={ photo.src.medium || "" }
                key={ photo.id } bgColor={ photo.avg_color }
                alt={ photo.alt }
            />
        }) }</>)
}


export function search(searchText, updateData, data) {
    searchText = searchText.trim()
    if (searchText.length == 0)
        return

    const url = `https://api.pexels.com/v1/search?query=${searchText}&per_page=18`
    if (localStorage.lastSearchedData) {
        updateData(JSON.parse(localStorage.lastSearchedData))
    }
    else
        fetch(url, options).then(data => data.json())
            .then(images => {
                let photos = images.photos
                console.log(photos)
                updateData(photos)
                localStorage.lastSearchedData = JSON.stringify(photos)
            })
}