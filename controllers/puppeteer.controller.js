const puppeteer = require("puppeteer");

async function scraper() {
  try {
    const browser = await puppeteer.launch({ headless: true });

    const hotels = await extractHotels(
      browser,
      "https://www.booking.com/searchresults.es-ar.html?label=gen173nr-1DCAEoggI46AdIM1gEaAyIAQGYASy4ARfIAQzYAQPoAQGIAgGoAgM&lang=es-ar&sid=bc11c3e819d105b3c501d0c7a501c718&sb=1&src=index&src_elem=sb&error_url=https%3A%2F%2Fwww.booking.com%2Findex.es-ar.html%3Flabel%3Dgen173nr-1DCAEoggI46AdIM1gEaAyIAQGYASy4ARfIAQzYAQPoAQGIAgGoAgM%3Bsid%3Dbc11c3e819d105b3c501d0c7a501c718%3Bsb_price_type%3Dtotal%26%3B&ss=El+Bols%C3%B3n%2C+R%C3%ADo+Negro%2C+Argentina&is_ski_area=&checkin_year=&checkin_month=&checkout_year=&checkout_month=&no_rooms=1&group_adults=2&group_children=0&b_h4u_keep_filters=&from_sf=1&ss_raw=el+bols&ac_position=0&ac_langcode=es&ac_click_type=b&dest_id=-985282&dest_type=city&place_id_lat=-41.964452&place_id_lon=-71.532732&search_pageview_id=06d48fb6823e00e9&search_selected=true&search_pageview_id=06d48fb6823e00e9&ac_suggestion_list_length=5&ac_suggestion_theme_list_length=0"
    );

    await browser.close();
    return hotels;
  } catch (e) {
    console.log("error", e);
  }
}

const extractHotels = async (browser, url) => {
  const page = await browser.newPage();

  if (url == "") {
    return [];
  }
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector(".sr_item");
  await page.waitFor(2000);
  page.on("console", consoleObj => console.log(consoleObj.text()));

  console.log("Retrieving hotels data");

  const next_url = await page.evaluate(() => {
    if (document.querySelector("a.paging-next") != null) {
      return document.querySelector("a.paging-next").href;
    } else {
      return "";
    }
  });
  console.log("next url: ", next_url);

  const hotels = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".sr_item")).map(item => ({
      name:
        item.querySelector("span.sr-hotel__name") != null
          ? item.querySelector("span.sr-hotel__name").innerText.trim()
          : "",
      link:
        item.querySelector("a.hotel_name_link") != null
          ? item.querySelector("a.hotel_name_link").href
          : "",
      description:
        item.querySelector("div.hotel_desc") != null
          ? item.querySelector("div.hotel_desc").innerText.trim()
          : "",
      rating:
        item.querySelector("div.bui-review-score__badge") != null
          ? item.querySelector("div.bui-review-score__badge").innerText.trim()
          : ""
    }))
  );

  await page.close();

  return hotels.concat(await extractHotels(browser, next_url));
};

exports.get_booking = async (req, res, next) => {
  const scraperData = await scraper();
  console.log(scraperData);
  res.json(scraperData);
};
