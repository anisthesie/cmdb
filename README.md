# cMDB
![](https://github.com/anisthesie/cmdb/blob/master/cmdb_screenshot.png)

cMDB is a Blockchain based movie rating platform. You can:
* Explore movies. You can see their poster, title, and the plot
* Add a movie if not available
* Give a rating on a scale of 1 to 10
* See an average of all the ratings that a movie got
* See how many ratings the movie got
* Keep track of your ratings and modify them

cMDB is community driven. It means that any user can add a movie, or modify an existing one. The rating of a movie is the average rating of all the users.

## Live Demo
The website is hosted [here](https://anisthesie.github.io/cmdb/).

## Usage

### Requirements
1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the Google Chrome Store.
2. Create a wallet.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.

### Test
1. Create one or multiple accounts with the extension wallet.
2. Add movies.
3. Give them a rating
4. Check if the 'Your rating' section is right, change your rating and you'll see it change too.
5. Check if the average rating is right.


## Project Setup

### Install
```
npm install
```

### Start
```
npm run dev
```

### Build
```
npm run build
