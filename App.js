import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import {useState, useEffect} from 'react';

const CLIENT_ID = "1b0181c63c6942de99fa1d5e631579d9";
const CLIENT_S = "03a09877391b427c8e6e80c1677b3f27";
function App() {
  const [searchInput, setSearchInput] = useState(""); // similar to a variable
  const[accessToken, setAccessToken] = useState("");
  const[albums, setAlbums] = useState([]);
  
  // using the Spotify API Access Token
  useEffect(() => {
    var obj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + "&client_secret=" + CLIENT_S
    }
    fetch('https://accounts.spotify.com/api/token', obj)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  }, [])

  // Search function
  async function search() {
    console.log("Search for " + searchInput); 

    // getting request using search to get the Artist ID
    var searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
      .then(response => response.json())
      .then(data => { return data.artists.items[0].id }) // grabbing first (most relevant) artist ID from array after search

    // getting request with Artist ID, get all the albums from said artist
    var returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setAlbums(data.items);
    })

    // display these albums to the user
  }
 console.log(albums);

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg">
          <FormControl
          placeholder="Search for Artist"
          type="input"
          onKeyPress={event => {
            if (event.key == "Enter") {
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={search}> 
          Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className="mx-3 row row-cols-3">
          {albums.map( (album, i) => {
            return(
              <Card>
                <Card.Img src={album.images[0].url} />
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
            )
          })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
