import axios from "axios";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    // const key = '0000543554354335400'
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
      // console.log(this.result, "00000000");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
}
