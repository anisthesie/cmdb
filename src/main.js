import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import cmdbAbi from "../contract/cmdb.abi.json"

const cmdbContractAddr = "0x478B4e23CCbce00775B5c9c73A0653eced5828c7"

let kit
let contract
let movies = []

const connectCeloWallet = async function () {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.")
    try {
      await window.celo.enable()
      notificationOff()

      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(cmdbAbi, cmdbContractAddr)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

const getBalance = async function () {
  const goldToken = await kit.contracts.getGoldToken()
  const celoBalance = await goldToken.balanceOf(kit.defaultAccount)
  document.querySelector("#balance").textContent = celoBalance.shiftedBy(-18).toFixed(4)
}

const getMovies = async function() {
  notification("⌛ Loading movies...")

  movies.length = 0
  const _moviesLenght = await contract.methods.getMoviesLength().call()
  for (let i = 0; i < _moviesLenght; i++) {
  	let _title = await contract.methods.getMovieTitle(i).call()

      let p = await contract.methods.readMovie(_title).call()
      let _movie = {
      	index: i,
        image: p[0],
        plot: p[1],
        ratings: p[2],
        avgRating: 'N/A',
        title: _title,
        userRating: 'N/A'
      }
    if (_movie.ratings.length != 0){
    	let avg = 0;
    	for(let i = 0; i < _movie.ratings.length;i++){
    		avg += parseInt(_movie.ratings[i])
    	}
    	avg /= _movie.ratings.length
    	_movie.avgRating = avg.toFixed(1)
    }
    let ur = await contract.methods.getUserRating(_title, kit.defaultAccount).call()
    if(ur != 0) 
    	_movie.userRating = ur
    movies.push(_movie)
  }
  renderMovies()
  notificationOff()
}

function renderMovies() {
  document.getElementById("cmdbpage").innerHTML = ""
  movies.forEach((_movie) => {
    const newDiv = document.createElement("div")
    newDiv.className = "col-md-4"
    newDiv.innerHTML = movieTemplate(_movie)
    document.getElementById("cmdbpage").appendChild(newDiv)
  })
}

function movieTemplate(_movie) {
  return `
    <div class="card mb-4">
      <img class="card-img-top" src="${_movie.image}" alt="...">
      <div class="position-absolute top-0 end-0 bg-warning mt-4 px-2 py-1 rounded-start">
        Average Rating: ${_movie.avgRating}
      </div>
      <div class="card-body text-left p-4 position-relative">
        <h2 class="card-title fs-4 fw-bold mt-2">${_movie.title}</h2>
        <p class="card-text mb-4">
          ${_movie.plot}             
        </p>
      <div class="mt-4 fw-bold">
        ${_movie.ratings.length} Rating(s)
      </div>
      <div class="bg-warning mt-4 px-2 py-1 rounded-start fw-bold">
        Your rating: ${_movie.userRating}
      </div>

      <div class="mb-4" style="margin-top: 1em">
        <button name="01${_movie.title}" id="sendRatingBtn" style="background-color: #C91414;color: white">1</button>
        <button name="02${_movie.title}" id="sendRatingBtn" style="background-color: #FF0D0D;color: white">2</button>
        <button name="03${_movie.title}" id="sendRatingBtn" style="background-color: #FF4E11;color: white">3</button>
        <button name="04${_movie.title}" id="sendRatingBtn" style="background-color: #FF7E01;color: white">4</button>
        <button name="05${_movie.title}" id="sendRatingBtn" style="background-color: #FFDF00;color: white">5</button>
        <button name="06${_movie.title}" id="sendRatingBtn" style="background-color: #ACB334;color: white">6</button>
        <button name="07${_movie.title}" id="sendRatingBtn" style="background-color: #69B34C;color: white">7</button>
        <button name="08${_movie.title}" id="sendRatingBtn" style="background-color: #3C913B;color: white">8</button>
        <button name="09${_movie.title}" id="sendRatingBtn" style="background-color: #187125;color: white">9</button>
        <button name="10${_movie.title}" id="sendRatingBtn" style="background-color: #008100;color: white">10</button>
      </div>

      </div>
    </div>
  `
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  await getMovies()
  notificationOff()
});

document
  .querySelector("#newMovieBtn")
  .addEventListener("click", async (e) => {
    const params = [
      document.getElementById("newMovieName").value,
      document.getElementById("newImgUrl").value,
      document.getElementById("newMoviePlot").value
    ]
    notification(`⌛ Adding "${params[0]}"...`)
    try {
      const result = await contract.methods
        .addMovie(...params)
        .send({ from: kit.defaultAccount })
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You successfully added "${params[0]}".`)
    getMovies()
  })

document
  .querySelector("#sendRatingBtn")
   document.querySelector("#cmdbpage").addEventListener("click", async (e) => {
    if (e.target.id.includes("sendRatingBtn")) {
      let _rating = parseInt(e.target.name.substring(0,2))
      let _title = e.target.name.substring(2)
    notification(`⌛ Sending a rating of ${_rating}...`)
    try {
      const result = await contract.methods.addRating(_title, _rating).send({from: kit.defaultAccount})
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 Rating added on ${_title}!`)
    getMovies()
  }})