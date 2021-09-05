/*jshint: esnext true */


const fetchJSON = async (...fetchArgs) => {
    let response = await fetch(...fetchArgs);
    return response.json();
  };

const testTor = async () => {
  let wtfJSON = await fetchJSON("https://wtfismyip.com/json");
  console.log(wtfJSON);
  let onionooJSON = await fetchJSON(`https://onionoo.torproject.org/details?limit=1&search=${wtfJSON["YourFuckingIPAddress"]}`);
  console.log(onionooJSON);
  let resultJSON = {};
  resultJSON["IsTorExit"] = (onionooJSON.relays.length > 0);
  resultJSON["passed"] = resultJSON["IsTorExit"];
  return resultJSON;
};

const testDoH = async () => {
  let cloudflareDoHResponse = await fetchJSON("https://is-doh.help.every1dns.net/resolvertest");
  let cloudflareDoH = cloudflareDoHResponse === 1;
  let nextDoHResponse = await fetchJSON("https://test.nextdns.io/");
  let nextDoH = nextDoHResponse["status"] === "unconfigured";
  let passed = cloudflareDoH || nextDoH;
  return { cloudflareDoH, nextDoH, passed };
}

(async () => {
  let resultsJSON = {
    TorNetworkUse: await testTor(),
    DoHenabled: await testDoH()
  };
  console.log(resultsJSON);
  document.body.setAttribute("data-test-results", JSON.stringify(resultsJSON));
})();
