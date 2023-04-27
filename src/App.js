
import axios from 'axios';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
function App() {

  const { off } = require('process');

  const collectionSymbol = "pixiudragon"

  const checkLength = `https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}`
  const baseUrl = `https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}/listings`;

  let offset = 0;
  let listing
  let loopCount = 0;
  let count = 0;
  let newData = [];
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [data, setData] = useState([]);

  const [auctionHouse, setAuctionHouse] = useState("");
  const [expiry, setExpiry] = useState("");
  const [pdaAddress, setPdaAddress] = useState("");
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerReferral, setsellerReferral] = useState("");
  const [tokenAddress, settokenAddress] = useState("");
  const [tokenMint, settokenMint] = useState("");
  const [tokensize, settokensize] = useState("");

  const handleShow = (item) => {

    // setCurrentItem(item.data)
    console.log(item);
    setAuctionHouse(item.auctionHouse)
    setExpiry(item.expiry)
    setPdaAddress(item.pdaAddress)
    setPrice(item.price)
    setSeller(item.seller)
    setsellerReferral(item.sellerReferral)
    settokenAddress(item.tokenAddress)
    settokenMint(item.tokenMint)
    settokensize(item.tokenSize)

    setShow(true)

  };

  const fetchData = () => {
    axios.get(checkLength)
      .then(res => {
        listing = res.data.listedCount
        Math.ceil(listing / 20);
        loopCount = Math.ceil(listing / 20);
      }).then(ress => {
        fetchdata2()
      })
  };
  const fetchdata2 = () => {


    axios.get(`${baseUrl}?offset=${offset}`)
      .then(response => {
        const items = response.data;
        items.forEach((item) => {
          setData(prev => [...prev, item]);
        });

        if (count != loopCount - 1) {
          count = count + 1;
          offset = count * 20 % listing;
          fetchdata2();
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const collection = () => {

    axios.get('https://api-mainnet.magiceden.dev/v2/collections/pixiudragon')
      .then(response => {
        const collectionListing = response.data;

        console.log("Collection: ", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const mintaddress = () => {
    const mintAddress = "ETs8teyaGvvgFbyDDzn15peW3P4rv4Zf5Z3xrkAvrcs1"
    axios.get(`https://api-mainnet.magiceden.dev/v2/tokens/${mintAddress}`)
      .then(response => {
        console.log("Minting Address", response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  const TokenListing = (address) => {
    // const mintAddress = "7CqTDzUimQjjTYqcb6uCHV5fbWHxsFeYCt28895zEoLg"
    axios.get(`https://api-mainnet.magiceden.dev/v2/tokens/${address}/listings`)
      .then(response => {
        console.log("Token Listing", response.data);
        if (response.data) {
          alert("Token Listed")
        }
        else {
          alert("token not listed")
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  useEffect(() => {
    console.log(data)
  }, [data])


  return (
    <div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Collection Listing Details </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column">

            <label>Auction House</label>
            <input type="text" value={auctionHouse} />
            <label>Expiry</label>
            <input type="text" value={expiry} />
            <lable>pda Address</lable>
            <input type="text" value={pdaAddress} />
            <lable>price</lable>
            <input type="number" value={price} />
            <lable>seller</lable>
            <input type="text" value={seller} />
            <lable>seller Referral</lable>
            <input type="text" value={sellerReferral} />
            <lable>token Address</lable>
            <input type="text" value={tokenAddress} />
            <lable>token Mint</lable>
            <input type="text" value={tokenMint} />
            <lable>token size</lable>
            <input type="number" value={tokensize} />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <button variant="secondary" onClick={handleClose}>
            Close
          </button>
          {/* <button variant="primary" onClick={() => updateLaptops()}>
            Save Changes
          </button> */}
        </Modal.Footer>
      </Modal>
      <div className="LaptopTableData">
        <div>

          <table >
            <thead>
              <tr>
                <th>No.</th>
                <th>token Mint</th>
                <th>Price</th>

              </tr>
            </thead>
            <tbody>
              {data.length > 0 ?
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{item.tokenMint}</td>
                    <td>{item.price}</td>

                    <td className="pimage">
                      {
                        item.extra == null ?
                          <div className="pNoimage">
                          </div> : <img src={item.extra.img} width={"100"} height={"100"} alt="My Image" placeholder="" />
                      }
                    </td>
                    <td>
                      <button onClick={() => { handleShow(item) }}>show details</button>
                      <button onClick={() => TokenListing(item.tokenMint)}>check listing</button>
                    </td>

                  </tr>
                ))
                : <></>
              }



            </tbody>
          </table>

        </div>
      </div>

      <button onClick={fetchData}>Collection listing </button>
      <button onClick={collection}>Collection </button>
      <button onClick={mintaddress}>Minting Address </button>
      <button onClick={TokenListing}>Token Mint Listings  </button>
    </div>
  );
}

export default App;
