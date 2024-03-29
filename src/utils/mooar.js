export async function getPriceFromMooar(contractAddress, traitType) {
  const data = await postData("https://market2.mooar.com/graphql", {
    query:
      "query queryCollectionItems($filter: CollectionItemsFilterInput!) {\n  filterCollectionNfts(filter: $filter) {\n    items {\n      ...PreviewAsset\n    }\n    page\n    pageSize\n    total\n  }\n}\n\nfragment PreviewAsset on PreviewNft {\n  name\n  tokenId\n  decimals\n  contractAddress\n  chain\n  listingPrice {\n    ...TokenAmount\n  }\n}\n\nfragment TokenAmount on TokenAmount {\n  token\n  amount\n  usd\n}",
    variables: {
      filter: {
        filter: {
          traitType: traitType,
        },
        contractAddress: contractAddress,
        sort: "Price low to high",
        pageSize: 1,
        page: 1,
      },
    },
    operationName: "queryCollectionItems",
  });
  return (
    data.data.filterCollectionNfts.items[0].listingPrice.amount / 100000000
  );
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
