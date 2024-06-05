import fetch from "node-fetch";
import HttpProxyAgent from "https-proxy-agent";
import FilesController from "../src/controllers/FilesController.js";
const proxies = FilesController.getInputs();
const threads = 200;

const proxieSessions = Math.trunc(proxies.length / threads);
(async () => {
  console.log("INICIANDO");
  for (let i = 0; i < proxieSessions; i++) {
    const promisses = [];
    FilesController.appendDivisor(i);
    console.log("Loop1", i);
    for (let j = 0; j < threads; j++) {
      //   console.log("Loop2", j);
      try {
        const currentIndex = i * threads + j;
        const currentProxie = proxies[currentIndex];
        const agent = new HttpProxyAgent.HttpsProxyAgent(
          currentProxie.getProxie().href
        );

        const req = new Promise((res) => {
          const startTime = new Date().getTime();
          const controller = new AbortController();

          fetch("http://httpbin.org/ip", { agent, signal: controller.signal })
            .then((data) => {
              const endTime = new Date().getTime();
              FilesController.appendOutput(agent.proxy, endTime - startTime);
            })
            .catch(() => {})
            .finally(() => res);

          setTimeout(() => {
            controller.abort(0);
            res();
          }, 5000);
        });

        promisses.push(req);
      } catch (error) {
        console.log("errin", error);
      }
    }

    await Promise.all(promisses);
  }
})();
