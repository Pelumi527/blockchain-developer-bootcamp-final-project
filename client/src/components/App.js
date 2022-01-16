/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import Web3 from 'web3'

// Import Images + CSS
import logo from '../images/garvenlogo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'


// Import ABI + Config
import Kolo from '../abis/Kolo.json';
import CONFIG from '../config.json';
import { Row, Col, Alert, Modal,Spinner } from 'react-bootstrap';
import {MDBAnimation} from 'mdbreact';




function App() {
	const [web3, setWeb3] = useState(null)
	const [openEmoji, setOpenEmoji] = useState(null)
	const [nftContract, setNftContract] = useState(null);
	

	const [account, setAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)


	
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	
	const [status, setstatus] = useState(false);
	const [smShow, setSmShow] = useState(false);
	const [smShow2, setSmShow2] = useState(false);
	const [smShow3, setSmShow3] = useState(false);
	const [koloDuration, setKoloDuration] = useState("0")
  	const [koloID, setKoloID] = useState("");
	


	  const handleOnKoloDurationChange = (event) => {
		const { value } = event.target;
		console.log(value)
		setKoloDuration(value);
	  };

	  const handleOnKoloID= (event) => {
		const { value } = event.target;
		console.log(value)
		setKoloID(value);
	  };


	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		 if (web3) {

			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)

			if(networkId !== 4) {
				setMessage("Contract not deployed to current network, please change to the ethereum network in MetaMask")
			}
			
			try {
			
				const THEONFT = new web3.eth.Contract(Kolo.abi, "0x7e2383a4d115417dEaD83fFf9044845Ad688ee70")
				setNftContract(THEONFT)				

			} catch (error) {
				setIsError(true)
			}
		 }
	}


	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !account) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)
		
			const accounts = await web3.eth.getAccounts()
			if (accounts.length > 0) {
				setAccount(accounts[0])

				
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				
				setMessage(null)
			});

			window.ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			});

			
		}

	}
	

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
			
		}
	}

	const createKolo = async () => {
		if (nftContract){
			try {
				setSmShow(true)
				const create = await nftContract.methods.createKolo(koloDuration).send({from:account, value: web3.utils.toWei("0.001", "ether")})
				setSmShow(false)
				nftContract.events.KoloCreated({
					filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
					fromBlock: 0
				}, function(error, event){ console.log(event); })
				.on('data', function(event){
					setMessage(event.returnValues._koloId); // same results as the optional callback above
				})
				.on('changed', function(event){
					// remove event from local database
				})
				.on('error', console.error);
			} catch (error) {
				
			}
			
		}
	}

	
	

	const depositToKolo = async () => {
		if (nftContract){
			const deposit = await nftContract.methods.depositToKolo(koloID).send({from:account, value:web3.utils.toWei("0.001", "ether")})
		}
	}

	const withdrawFromKolo = async () => {
		if(nftContract){
			try {
				console.log(koloID)
				await nftContract.methods.withdraw(koloID).send({from: account})
			} catch (error) {
				console.log(error)
			}
		}
	}

	const viewMyKolo = async () => {
		if(nftContract){
			const Kolo = await nftContract.methods.viewKolo(koloID).call()
			console.log(Kolo)

		}
	}
	
	useEffect(() => {
		loadBlockchainData()
		//console.log("you")
	},[loadBlockchainData]);

	useEffect(() => {
		loadWeb3();
		console.log("mee")
		
	}, [account]);

	

	return (
		<div>
			<div className='header-top'>
				<div className="split-content header-left">
					<a href="https://garvenlabs.xyz/" className="brand-logo w-nav-brand">
						<div className="div-block-2"><img src={logo} alt="astrogems logo" className="header-logo laptop mobile"/></div>
					</a>
				</div>
			</div>
			<div className="container-header home-header">
				<div className="split-content header-left tablet">
					<a href="https://garvenlabs.xyz/" className="brand-logo w-nav-brand">
						<div className="div-block-2"><img src={logo} alt="astrogems logo" className="header-logo"/></div>
					</a>
				</div>
        		
        		<div className="div-block-4">
					{account ? (
						<a
							href={`https://etherscan.io/address/${account}`}
							target="_blank"
							rel="noopener noreferrer"
							className="button nav-button btn-sm mx-4">
							{account.slice(0, 5) + '...' + account.slice(38, 42)}
						</a>
					) : (
					<button onClick={web3Handler} className="header-btn"> Connect MetaMask</button>
					)}
        		</div>
      		</div>
			<main>
			 <Modal
				size="sm"
				show={smShow}
				onHide={() => setSmShow(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
					Creating your Kolo
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal>
			{/*<Modal
				size="sm"
				show={smShow2}
				onHide={() => setSmShow2(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
						
				<Spinner animation="border" role="status">
  					<span className="visually-hidden"></span>
				</Spinner>
				Minting....
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal>
			<Modal
				size="sm"
				show={smShow3}
				onHide={() => setSmShow3(false)}
				aria-labelledby="example-modal-sizes-title-sm"
			>
				<Modal.Header closeButton>
				<Modal.Title id="example-modal-sizes-title-sm">
						<p className='text-success'>Minting succesful</p>
				</Modal.Title>
				</Modal.Header>
				<Modal.Body>...</Modal.Body>
			</Modal> */}
				<Row className='mint-div'>
					<MDBAnimation  reveal type="fadeInRight" duration="3s">
					<Col md={12} lg={12} sm={12}>
						<div className='mg-top-48px'>
							<div className="w-form">
								<form id="wf-form-Mint-Quantity" name="wf-form-Mint-Quantity" data-name="Mint Quantity" method="get">
									<input type="number" placeholder="1" onChange={handleOnKoloDurationChange}></input>
								</form>
								<p>Time to withdraw from Kolo in unixtimestamp</p>
							</div>
							
							<div>
								{account ? <button onClick={createKolo} className="mint-button"><span>{`CreateKolo`}</span></button>:<button onClick={web3Handler} className="header-btn"> Connect MetaMask</button>}
								{message ? <p>{`Your KoloId is ${message}`}</p>:<p></p>}
							</div>
						</div>
					</Col>
					</MDBAnimation>
					<Row className="my-2 text-center">
					{isError ? (
						<p>{message}</p>
					) : (
						<div>

							{CONFIG.NETWORKS[currentNetwork] && (
								<p>Current Network: {CONFIG.NETWORKS[currentNetwork].name}</p>
							)}
						</div>
					)}
				</Row>
				</Row>
				<div>
					<div className="w-form">
						<form id="wf-form-Mint-Quantity" name="wf-form-Mint-Quantity" data-name="Mint Quantity" method="get">
							<input type="number" placeholder="1" onChange={handleOnKoloID}></input>
						</form>
						<p>Input the Kolo ID</p>
					</div>
					<button
						onClick={depositToKolo}>Deposit</button>
					<button
						onClick={withdrawFromKolo}
						>withdraw</button>
					<button
						onClick={viewMyKolo}
						>View Your Kolo</button>
				</div>
				<footer className='footer'>
				<div className="container-default">
        
        <div className="footer-bottom"></div>
      </div>
	  </footer>
			</main>
		</div>
	)
}

export default App;