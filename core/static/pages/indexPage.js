import { routeList } from "../../../base/keys/routes.js";

export function IndexPage(req, res) {
  try {
    // Generate a new route list with the required information
    const updatedRouteList = routeList.map(
      ({ name, path, method, authorization, query }) => ({
        name,
        path,
        method: method.toUpperCase(),
        authorization,
        queries: query,
      })
    );

    res.status(200).send({
      status: 200,
      message: "OK",
      method: req.method,
      path: req.baseUrl + req.path,
      timestamp: new Date().getTime(),
      content: {
        heading: "Welcome to oxydien's backend",
        message:
          "Explore oxydien's backend. If you encounter any bugs, please report them!",
        beta: "Please note that this API is not yet optimized for high traffic. It's in the process of transitioning to Rust. Thank you for your understanding.",
        github: "https://github.com/oxydien/oxydien-dev-b",
        routes: updatedRouteList,
      },
    });
  } catch (e) {
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
      error: "Index page could'nt load: ",
      e,
    });
  }
}
